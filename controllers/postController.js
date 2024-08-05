const { body, validationResult } = require("express-validator");
const queries = require("../db/queries");
const humanDate = require("../utils/handleDate");

exports.post_list = async (req, res, next) => {
  try {
    const permissions = req?.user?.permissions;
    const page = Number(req.query.page) || 1;
    const postsPerPage = 10;

    const [posts, postCount] = await Promise.all([
      queries.getPostList(permissions, (page - 1) * postsPerPage, postsPerPage),
      queries.getPostCount(),
    ]);

    res.render("index", {
      title: "Clubhouse",
      posts: posts,
      count: postCount / postsPerPage,
      currentPage: page,
      humanDate,
    });
  } catch (err) {
    return next(err);
  }
};

exports.new_post_get = (req, res, next) => {
  if (!req.user) return res.redirect("/clubhouse/login");
  res.render("newPost", { title: "New Message" });
};

exports.new_post_post = [
  body("title", "Title must be 3 characters or more")
    .trim()
    .isLength({ min: 3 })
    .isLength({ max: 100 })
    .withMessage("Title cannot be longer than 100 characters"),
  body("content", "Message cannot be empty")
    .trim()
    .isLength({ min: 1 })
    .isLength({ max: 1000 })
    .withMessage("Message cannot exceed 1000 characters"),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!req.user) return res.redirect("/clubhouse/login");
    else if (!errors.isEmpty()) {
      const mapErrors = errors.mapped();

      return res.render("newPost", {
        title: "New Message",
        postTitle: req.body.title,
        content: req.body.content,
        errors: mapErrors,
      });
    } else {
      try {
        await queries.createPost(req.body.title, req.body.content, req.user.id);
        res.redirect("/");
      } catch (err) {
        return next(err);
      }
    }
  },
];

exports.delete_post_get = async (req, res, next) => {
  if (!req.user?.permissions === "admin") return res.redirect("/");
  try {
    const post = await queries.getPostById(req.params.postId);
    if (!post) return res.redirect("/");
    res.render("deletePost", {
      title: "Delete Post",
      post: post,
      humanDate,
    });
  } catch (err) {
    return next(err);
  }
};

exports.delete_post_post = async (req, res, next) => {
  if (!req.user?.permissions === "admin") return res.redirect("/");
  try {
    await queries.deletePost(req.body.id);
    res.redirect("/");
  } catch (err) {
    return next(err);
  }
};
