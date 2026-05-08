const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const connection = require("../db/database");
const dbQueries = require("../db/queries");
const bcrypt = require("bcrypt");

const verifyCallback = async (username, password, done) => {
  let hashedUserPassword = await dbQueries.getUserPasswordHash(username);
  //if the user doesn't exist then return false via done()
  if (hashedUserPassword === false) {
    return done(null, false);
  }

  await dbQueries
    .findUser(username)
    .then(async (user) => {
      if (!user) {
        return done(null, false);
      }

      const isValid = await bcrypt.compare(password, hashedUserPassword);
      if (isValid) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    })
    .catch((err) => {
      done(err);
    });
};

const strategy = new LocalStrategy(verifyCallback);

passport.use(strategy);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((userId, done) => {
  dbQueries
    .findUserById(userId)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => done(err));
});
