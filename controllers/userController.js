const passport = require("../utils/passportConfig");

exports.login_get = async (req, res, next) => {
  if (req.user) return res.redirect("/");
  res.render("login");
};

exports.login_post = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    console.log(user);
    if (!user) {
      return res.render("login", { failureMsg: "Invalid credentials" });
    } else {
      req.login(user, (err) => {
        if (err) return next(err);
        return res.redirect("/clubhouse");
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
