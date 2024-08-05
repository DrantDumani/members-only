const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");
const bcrypt = require("bcrypt");
const queries = require("../db/queries");

const verify = async (email, password, done) => {
  try {
    // const user = await User.findOne({ email: email }).exec();
    const user = await queries.getUserByColumnField("email", email);
    if (!user) {
      return done(null, false, { message: "It didn't work" });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return done(null, false, { message: "It didn't work" });
    }
    return done(null, user);
  } catch (err) {
    return done(err, false);
  }
};

const strategy = new LocalStrategy({ usernameField: "email" }, verify);

passport.use(strategy);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await queries.getUserByColumnField("id", id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
