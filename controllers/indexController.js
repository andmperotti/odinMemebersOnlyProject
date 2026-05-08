const bcrypt = require("bcrypt");
const dbQueries = require("../db/queries");
const { body, validationResult, matchedData } = require("express-validator");

exports.getIndex = (req, res, next) => {
  res.render("index", { user: req.user });
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
  body("username")
    .trim()
    .isAlphanumeric()
    .notEmpty("Username cannot be empty")
    //custom validator to check whether a username is already in use
    .custom(async (value) => {
      const userFound = await dbQueries.findUser(value);
      if (userFound) {
        throw new Error("Username already taken");
      }
    }),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be atl east 6 characters long"),
  body("confirmPassword")
    .isLength({ min: 6 })
    .withMessage("Password must be atl east 6 characters long")
    //custom password matching validator for password and confirmPassword fields
    .custom(async (value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password field inputs don't match!");
      }
    }),
];

exports.postSignup = [
  validateUser,
  async (req, res, next) => {
    //if there are problems with a users input during registration, navigate them to a page that tells them how their input was bad
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("errorPage", {
        title: "creating user",
        errors: errors.array(),
      });
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
    //later add a check if username is available/ if this user is not already made, if so then reject their request and alert them -- we'll use a custom validator now to do this
  },
];

exports.getLogin = (req, res, next) => {
  res.render("login");
};

exports.postLogin = (req, res, next) => {
  //reroute them to homepage or user homepage/etc
  res.render("index", { user: req.user });
};

exports.getPasscode = (req, res, next) => {
  res.render("passcode");
};

exports.postPasscode = (req, res, next) => {
  if (req.body.passcodeEntry === "28") {
    dbQueries.setMember(req.body.username);
    res.send("Account's membership status upgraded");
  } else {
    res.send("Wrong passcode");
  }
};

exports.getLogOut = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};

exports.getCreateMessage = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.render("createMessage", { user: req.user });
  } else {
    res.send(
      "You are not authenticated, and therefore not allowed to create messages.",
    );
  }
};

exports.postCreateMessage = (req, res, next) => {
  if (req.isAuthenticated()) {
    //save users message to db
    dbQueries.createMessage(req.user.id, req.body.title, req.body.message);
    //navigate them to the homepage
    res.render("index", { user: req.user });
  } else {
    res.send("You're not authenticated");
  }
};
