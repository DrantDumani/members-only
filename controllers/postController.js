const Post = require("../models/post");
const User = require("../models/user");

exports.post_list = async (req, res, next) => {
  try {
    const posts = await Post.find()
      .populate({ path: "author", select: "username" })
      .sort({ timestamp: -1 })
      .exec();
    res.render("index", {
      title: "Clubhouse",
      posts: posts,
    });
  } catch (err) {
    return next(err);
  }
};
