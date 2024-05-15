const express = require("express");
const router = require("router");

router.get("/", "homepage");

router.get("/sign-up", "signUpGET");

router.post("/sign-up", "signUpPOST");

router.get("/log-in", "loginGET");

router.post("/log-in", "loginPOST");

router.get("/logout", "logout");

router.get("/newMember", "memberForm");

router.post("/newMember", "validateMember");

router.get("/newMessage", "newMessageGET");

router.post("/newMessage", "newMessagePOST");

router.get("/delete", "deleteMsgGET");

router.post("/delete", "deleteMsgPOST");

router.get("/newAdmin", "grantAdmitGET");

router.post("/newAdmin", "grantAdminPOST");
