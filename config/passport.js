const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const connection = require("../db/database");
const dbQueries = require("../db/queries");
const bcrypt = require("bcrypt");

const verifyCallback = async (username, password, done) => {
  let hashedPassword = await dbQueries.getUserPasswordHash(username);
  await dbQueries
    .findUser(username)
    .then((user) => {
      if (!user) {
        return done(null, false);
      }
      const isValid = bcrypt.compare(password, hashedPassword);

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
