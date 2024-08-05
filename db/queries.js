const pool = require("./pool");
const bcrypt = require("bcrypt");

exports.getPostCount = async () => {
  const { rows } = await pool.query("SELECT COUNT(*) AS postCount FROM posts");
  return rows[0].postcount;
};

exports.getPostList = async (permission, offset, postsPerPage) => {
  const qStr =
    permission === "member" || permission === "admin"
      ? `SELECT posts.id, posts.title, posts.content, posts.created_at, users.username 
    FROM posts JOIN users on posts.authorId = users.id `
      : "SELECT id, title, content FROM posts ";
  const filterStr = "ORDER BY created_at DESC LIMIT $1 OFFSET $2";
  const fullStr = qStr + filterStr;
  const { rows } = await pool.query(fullStr, [postsPerPage, offset]);
  return rows;
};

exports.createUser = async (user) => {
  user.password = await bcrypt.hash(user.password, 10);
  const result = {};
  try {
    const { rows } = await pool.query(
      `INSERT INTO users (username, email, password) VALUES ($1, $2, $3) 
      RETURNING id`,
      [user.username, user.email, user.password]
    );
    result.userObj = rows[0];
  } catch (err) {
    if (err.constraint === "no_dupe_names") {
      result.errors.username = { msg: "That username is already in use." };
    } else if (err.constraint === "no_dupe_names") {
      result.errors.email = { msg: "That email is already in use" };
    }
  } finally {
    return result;
  }
};

exports.getUserByColumnField = async (column, value) => {
  let queryStr = "";
  if (column === "id") {
    queryStr += "SELECT * FROM users WHERE id = $1";
  } else if (column === "email") {
    queryStr += `SELECT * FROM users WHERE email = $1`;
  }
  const { rows } = await pool.query(queryStr, [value]);
  return rows[0];
};

exports.updateUser = async (userId, newStatus) => {
  await pool.query(`UPDATE users SET permissions = $2 WHERE id = $1`, [
    userId,
    newStatus,
  ]);
};

exports.createPost = async (title, content, userId) => {
  await pool.query(
    `INSERT INTO posts (title, content, authorId) VALUES ($1, $2, $3)`,
    [title, content, userId]
  );
};

exports.getPostById = async (postId) => {
  const { rows } = await pool.query(
    `SELECT posts.id, posts.title, posts.content, posts.created_at, users.username FROM posts
    JOIN users ON posts.authorId = users.id 
    WHERE posts.id = $1`,
    [postId]
  );
  return rows[0];
};

exports.deletePost = async (postId) => {
  await pool.query("DELETE FROM posts WHERE id = $1", [postId]);
};
