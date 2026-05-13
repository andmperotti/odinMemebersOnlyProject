const express = require("express");
const ejs = require("ejs");
const path = require("path");
const { indexRouter } = require("./routes/index");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const pgPool = require("./db/pool");

//set up app
const app = express();
//set up views and view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
//set up for pulling data from forms and body; "parsing http responses"
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//tell the app to use sessions, if the table doesn't exist create it, otherwise use the COOKIE_SECRET as the hasher, don't resave sessions when nothing is modified, cookies last for 30 days, don't save sessions that are not tied to an account... but still i would think the session table would be created no matter what saveUninitialized's value is set to (it used to be true and still session table was not created)
app.use(
  session({
    store: new (require("connect-pg-simple")(session))({
      pool: pgPool,
      //this uses the already created pool that our project is using
      createTableIfMissing: true,
      //this initially creates the 'session' table in the database if it doesn't exist yet
      // Insert connect-pg-simple options here
    }),
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    //for many reasons we'll set this to false, if you need a reminder just read it's description here https://www.npmjs.com/package/express-session
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }, // 30 days
    // Insert express-session options here
  }),
);

//import passport setup?
require("./config/passport");
//link sessions to passport strategy
app.use(passport.session());

//use external router for routes, used after other middleware but before error handler if you have one
app.use("/", indexRouter);

app.listen(process.env.PORT || 3000);
