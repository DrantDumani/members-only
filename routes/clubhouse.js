const express = require("express");
const postController = require("../controllers/postController");
const userController = require("../controllers/userController");
const router = express.Router();

router.get("/", postController.post_list);

// router.get("/sign-up", "signUpGET");

// router.post("/sign-up", "signUpPOST");

router.get("/login", userController.login_get);

router.post("/login", userController.login_post);

router.get("/logout", userController.logout);

// router.get("/newMember", "memberForm");

// router.post("/newMember", "validateMember");

// router.get("/newMessage", "newMessageGET");

// router.post("/newMessage", "newMessagePOST");

// router.get("/delete", "deleteMsgGET");

// router.post("/delete", "deleteMsgPOST");

// router.get("/newAdmin", "grantAdmitGET");

// router.post("/newAdmin", "grantAdminPOST");

module.exports = router;
