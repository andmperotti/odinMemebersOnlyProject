const { Router } = require("express");
const indexRouter = Router();
const indexController = require("../controllers/indexController");

indexRouter.get("/", indexController.getIndex);

indexRouter.get("/sign-up", indexController.getSignUp);
indexRouter.post("/sign-up", indexController.postSignup);

indexRouter.get("/login", indexController.getLogin);
indexRouter.post("login", indexController.postLogin);

module.exports = { indexRouter };
