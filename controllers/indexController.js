const bcrypt = require("bcrypt");
const dbQueries = require("../db/queries");

exports.getIndex = (req, res, next) => {
  res.render("index");
};

exports.getSignUp = (req, res, next) => {
  res.render("signup");
};

exports.postSignup = async (req, res, next) => {
  //hash password
  //use db query to save user
  //redirect them to the login page
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    await dbQueries.saveUser(
      req.body.firstName,
      req.body.lastName,
      req.body.username,
      hashedPassword,
    );
    res.redirect("/login");
  } catch (error) {
    console.error(error);
    next(error);
  }
  //later add a check if username is available/ if this user is not already made, if so then reject their request and alert them
};

exports.getLogin = (req, res, next) => {
  res.render("login");
};

exports.postLogin = (req, res, next) => {
  //some kind of validation of credentials


  //reroute them to homepage or user homepage/etc
  res.render("index");
};
