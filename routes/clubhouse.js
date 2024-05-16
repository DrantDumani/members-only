const express = require("express");
const postController = require("../controllers/postController");
const router = express.Router();

router.get("/", postController.post_list);

// router.get("/sign-up", "signUpGET");

// router.post("/sign-up", "signUpPOST");

// router.get("/log-in", "loginGET");

// router.post("/log-in", "loginPOST");

// router.get("/logout", "logout");

// router.get("/newMember", "memberForm");

// router.post("/newMember", "validateMember");

// router.get("/newMessage", "newMessageGET");

// router.post("/newMessage", "newMessagePOST");

// router.get("/delete", "deleteMsgGET");

// router.post("/delete", "deleteMsgPOST");

// router.get("/newAdmin", "grantAdmitGET");

// router.post("/newAdmin", "grantAdminPOST");

module.exports = router;
