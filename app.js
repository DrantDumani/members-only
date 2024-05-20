const createError = require("http-errors");
const express = require("express");
const session = require("express-session");
const path = require("path");
const logger = require("morgan");
require("dotenv").config();
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const compression = require("compression");
const helmet = require("helmet");

const indexRouter = require("./routes/index");
const clubhouseRouter = require("./routes/clubhouse");
const passport = require("./utils/passportConfig");
const localUser = require("./utils/localUser");
const RateLimit = require("express-rate-limit");

const limiter = RateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
});

mongoose.set("strictQuery", "false");
const mongoDB = process.env.MONGO_DB_URI;

const client = mongoose
  .connect(mongoDB)
  .then((m) => m.connection.getClient())
  .catch((err) => console.log(err));

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());

const sessionConfig = {
  secret: process.env.SECRET,
  store: MongoStore.create({ clientPromise: client }),
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 1000 * 3600 },
};

if (app.get("env") === "production") {
  app.set("trust proxy", 1);
  sessionConfig.cookie.secure = true;
}

app.use(session(sessionConfig));
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(helmet());

app.use(localUser);
app.use(compression());
app.use("/", indexRouter);
app.use("/clubhouse", clubhouseRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
