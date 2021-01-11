const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const passport = require("passport");
const cors = require("cors");

require("dotenv").config();
// connect database
require("./configs/database");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");

const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Initialize passport middleware
app.use(passport.initialize());
const jwtStrategy = require("../Server/configs/strategies/jwtStrategy");
passport.use(jwtStrategy);

// ROUTING
const authenticate = require("./middlewares/authenticate");

app.use("/", indexRouter);
app.use("/api/users", authenticate, usersRouter);
app.use("/api/auth", authRouter);
// app.use("/test", testRouter);

module.exports = app;
