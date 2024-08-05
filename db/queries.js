const pool = require("./pool");
const bcrypt = require("bcrypt");

exports.getPostCount = async () => {
  const { rows } = await pool.query("SELECT COUNT(*) AS postCount FROM posts");
  return rows[0].postCount;
};

exports.getPostList = async (permission, offset, postsPerPage) => {
  const qStr =
    permission === "member" || permission === "admin"
      ? `SELECT posts.id, posts.title, posts.content, posts.created_at, users.username 
    FROM posts JOIN users on posts.authorId = users.id`
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
      `INSERT INTO users (username, email, password) VALUES ($1, $2, $3)`,
      [user.username, user.email, user.password]
    );
    result.user = rows[0];
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
