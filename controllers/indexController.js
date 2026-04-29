const bcrypt = require("bcrypt");
const dbQueries = require("../db/queries");
const { body, validationResult, matchedData } = require("express-validator");

exports.getIndex = (req, res, next) => {
  res.render("index");
};

exports.getSignUp = (req, res, next) => {
  res.render("signup");
};

//validate user registration entry
const validateUser = [
  body("firstName")
    .trim()
    .isLength({ min: 1 })
    .withMessage("First name needs to have a minimum length of 1 character")
    .isAlpha()
    .withMessage("First name can only contain alphabetic characters"),
  body("lastName")
    .trim()
    .isAlpha()
    .withMessage("Last name can only contain alphabetic characters")
    .isLength({ min: 1 })
    .withMessage("Last name needs to have a minimum length of 1 character"),
  body("username").trim().isAlphanumeric().notEmpty("Username cannot be empty"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be atl east 6 characters long"),
  body("confirmPassword")
    .isLength({ min: 6 })
    .withMessage("Password must be atl east 6 characters long"),
];

exports.postSignup = [
  validateUser,
  async (req, res, next) => {
    //if there are problems with a users input during registration, navigate them to a page that tells them how their input was bad
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .render("errorPage", { title: "Create user", errors: errors.array() });
    }
    //hash password
    //use db query to save user
    //redirect them to the login page
    try {
      const { firstName, lastName, username } = matchedData(req);
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      await dbQueries.saveUser(firstName, lastName, username, hashedPassword);
      res.redirect("/login");
    } catch (error) {
      console.error(error);
      next(error);
    }
    //later add a check if username is available/ if this user is not already made, if so then reject their request and alert them
  },
];

exports.getLogin = (req, res, next) => {
  res.render("login");
};

exports.postLogin = (req, res, next) => {
  //some kind of validation of credentials

  //reroute them to homepage or user homepage/etc
  res.render("index");
};
