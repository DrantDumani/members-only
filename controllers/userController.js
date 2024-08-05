const passport = require("../utils/passportConfig");
const { body, validationResult } = require("express-validator");
const queries = require("../db/queries");
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
    const result = {};
    let mapErrors = errors.mapped();
    try {
      const user = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
      };

      if (errors.isEmpty()) {
        const data = await queries.createUser(user);
        user.id = data.userObj.id;
        mapErrors.email = result.errors?.email ? result.errors.email : null;
        mapErrors.username = result.errors?.username
          ? result.errors.username
          : null;
      }
      if (!errors.isEmpty() || mapErrors.username || mapErrors.email) {
        res.render("signup", {
          title: "Sign Up",
          errors: mapErrors,
          email: req.body.email,
          username: req.body.username,
        });
      } else {
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
  if (
    !req.user ||
    req.user.permissions === "member" ||
    req.user.permissions === "admin"
  ) {
    return res.redirect("/");
  } else {
    res.render("roleForm", {
      title: "Member Form",
      pwHint: true,
    });
  }
};

exports.become_member_post = async (req, res, next) => {
  if (
    !req.user ||
    req.user.permissions === "member" ||
    req.user.permissions === "admin"
  ) {
    return res.redirect("/");
  } else {
    const match = req.body.password === process.env.MEMBERPW;
    if (!req.body.password || !match) {
      res.render("roleForm", {
        title: "Member Form",
        error: "Incorrect password",
        pwHint: true,
      });
    } else {
      try {
        await queries.updateUser(req.user.id, "member");
        res.redirect("/");
      } catch (err) {
        return next(err);
      }
    }
  }
};

exports.become_admin_get = (req, res, next) => {
  if (!req.user || req.user.permissions === "admin") {
    return res.redirect("/");
  }
  res.render("roleForm", {
    title: "Admin Form",
  });
};

exports.become_admin_post = async (req, res, next) => {
  if (!req.user || req.user.permissions === "admin") {
    return res.redirect("/");
  }
  const match = req.body.password === process.env.ADMINPW;
  if (!req.body.password || !match) {
    res.render("roleForm", {
      title: "Admin Form",
      error: "Incorrect Password",
    });
  } else {
    try {
      await queries.updateUser(req.user.id, "admin");
      res.redirect("/");
    } catch (err) {
      return next(err);
    }
  }
};
