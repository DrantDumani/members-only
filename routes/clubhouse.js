const express = require("express");
const postController = require("../controllers/postController");
const userController = require("../controllers/userController");
const router = express.Router();

router.get("/", postController.post_list);

router.get("/signup", userController.signUp_get);

router.post("/signup", userController.signUp_post);

router.get("/login", userController.login_get);

router.post("/login", userController.login_post);

router.get("/logout", userController.logout);

router.get("/newMember", userController.become_member_get);

router.post("/newMember", userController.become_member_post);

router.get("/newMessage", postController.new_post_get);

router.post("/newMessage", postController.new_post_post);

router.get("/delete/:postId", postController.delete_post_get);

router.post("/delete/:postId", postController.delete_post_post);

router.get("/newAdmin", userController.become_admin_get);

router.post("/newAdmin", userController.become_admin_post);

module.exports = router;
