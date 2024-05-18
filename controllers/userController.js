const passport = require("../utils/passportConfig");
const User = require("../models/user");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
require("dotenv").config();

exports.signUp_get = (req, res, next) => {
  if (req.user) return res.redirect("/");
  res.render("signup", { title: "Sign Up" });
};

exports.signUp_post = [
  body("username", "Username cannot be empty")
    .trim()
    .isLength({ min: 1 })
    .isLength({ max: 40 })
    .withMessage("Username cannot be over 40 characters"),
  body("email", "Please enter a valid email address")
    .trim()
    .isLength({ min: 1 })
    .isEmail(),
  body("password", "Password must be at least 5 characters")
    .trim()
    .isLength({ min: 5 }),
  body("confirmPass", "Passwords must match").custom((value, { req }) => {
    return value === req.body.password;
  }),

  async (req, res, next) => {
    const errors = validationResult(req);
    const mapErrors = errors.mapped();
    try {
      const [dupeName, dupeEmail] = await Promise.all([
        User.findOne({ username: req.body.username }, "name").exec(),
        User.findOne({ email: req.body.email }, "email").exec(),
      ]);
      if (dupeName) {
        mapErrors.username = { msg: "That username is already in use." };
      }
      if (dupeEmail) mapErrors.email = { msg: "That email is already in use" };

      if (!errors.isEmpty() || mapErrors.username || mapErrors.email) {
        res.render("signup", {
          title: "Sign Up",
          errors: mapErrors,
          email: req.body.email,
          username: req.body.username,
        });
      } else {
        const hashPass = await bcrypt.hash(req.body.password, 10);
        const user = new User({
          username: req.body.username,
          email: req.body.email,
          password: hashPass,
        });
        await user.save();
        req.login(user, (err) => {
          if (err) return next(err);
          return res.redirect("/");
        });
      }
    } catch (err) {
      return next(err);
    }
  },
];

exports.login_get = async (req, res, next) => {
  if (req.user) return res.redirect("/");
  res.render("login", { title: "Log In" });
};

exports.login_post = (req, res, next) => {
  passport.authenticate("local", (err, user) => {
    if (err) return next(err);
    if (!user) {
      return res.render("login", {
        title: "Log In",
        failureMsg: "Invalid credentials",
      });
    } else {
      req.login(user, (err) => {
        if (err) return next(err);
        return res.redirect("/");
      });
    }
  })(req, res, next);
};

exports.logout = (req, res, next) => {
  req.logOut((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
};

exports.become_member_get = (req, res, next) => {
  if (!req.user || (req.user && (req.user.isMember || req.user.isAdmin))) {
    return res.redirect("/");
  } else {
    res.render("memberForm", {
      title: "Member form",
    });
  }
};

exports.become_member_post = async (req, res, next) => {
  if (!req.user || (req.user && (req.user.isMember || req.user.isAdmin))) {
    return res.redirect("/");
  } else {
    const match = req.body.password === process.env.MEMBERPW;
    if (!req.body.password || !match) {
      res.render("memberForm", {
        title: "Member form",
        error: "Incorrect password",
      });
    } else {
      const newMember = new User(req.user);
      newMember.isMember = true;
      try {
        await User.findByIdAndUpdate(req.user.id, newMember);
        res.redirect("/");
      } catch (err) {
        return next(err);
      }
    }
  }
};
