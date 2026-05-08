const { Router } = require("express");
const indexRouter = Router();
const indexController = require("../controllers/indexController");
const passport = require("passport");

indexRouter.get("/", indexController.getIndex);

indexRouter.get("/signup", indexController.getSignUp);
indexRouter.post("/signup", indexController.postSignup);

indexRouter.get("/login", indexController.getLogin);
indexRouter.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/login" }),
  indexController.postLogin,
);

indexRouter.get("/passcode", indexController.getPasscode);
indexRouter.post("/passcode", indexController.postPasscode);

indexRouter.get("/logout", indexController.getLogOut);

indexRouter.get("/createMessage", indexController.getCreateMessage);
indexRouter.post("/createMessage", indexController.postCreateMessage);

module.exports = { indexRouter };
