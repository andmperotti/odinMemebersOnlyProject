const express = require("express");
// const passport = require("passport");
// const session = require("express-session");
const ejs = require("ejs");
const path = require("path");
// const LocalStrategy = require("passport-local").Strategy;
var bcrypt = require("bcrypt");
// const connection = require("./db/database");
const { indexRouter } = require("./routes/index");

//set up app
const app = express();
//set up views and view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
//set up for pulling data from forms and body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//
// app.use(
//   session({
//     store: new (require("connect-pg-simple")(session))({
//       // Insert connect-pg-simple options here
//       createTableIfMissing: true,
//     }),
//     secret: process.env.COOKIE_SECRET,
//     resave: false,
//     cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }, // 30 days
//     // Insert express-session options here
//   }),
// );

// app.use(passport.session());

app.use("/", indexRouter);

app.listen(process.env.PORT || 3000);
