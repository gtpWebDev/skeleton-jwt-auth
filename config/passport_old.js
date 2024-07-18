const passport = require("passport");
// passport-local is the username/password strategy
const LocalStrategy = require("passport-local").Strategy;
const Account = require("../models/userModel");

// note, passport documentation is recognised as being poor
// best location is: https://www.passportjs.org/tutorials/password/
// this series explains it all very well: https://www.youtube.com/watch?v=xMEOT9J0IvI&list=PLYQSCk-qyTW2ewJ05f_GKHtTIzjynDgjK&index=5

// To start to look at JWT, need to look at lessons 7 and 8
// https://www.youtube.com/watch?v=ipQrwfKTH_4&list=PLYQSCk-qyTW2ewJ05f_GKHtTIzjynDgjK&index=7

const validatePassword = require("../lib/passwordUtils").validatePassword;

// passport strategy expects fields called "username" and "password"
// use of custom fields allows you to name these fields any way you like
// unnecessary if using "username" and "password"
const customFields = {
  usernameField: "username",
  passwordField: "password",
};

// receive username and password (which is the "local" strategy )
// returns a callback function which must be either:
// callback(null, user) - credential is valid for user - authentication succeeded
// callback(null, false) - credential is not valid - authentication failed
// callback(err) - something went wrong (e.g. db not available)
const verifyCallback = (username, password, callback) => {
  Account.findOne({ username: username })
    .then((account) => {
      if (!account) {
        return callback(null, false); // no error, but also no username - reject
      }

      const isValid = validatePassword(password, account.hash, account.salt);

      if (isValid) {
        return callback(null, account); // no error, return the account - accept
      } else {
        return callback(null, false); // no error, return false - reject
      }
    })
    .catch((err) => {
      callback(err); // return an error, passport will handle
    });
};

const strategy = new LocalStrategy(customFields, verifyCallback);

// register the strategy in the app
passport.use(strategy);

// explanation of serializa and deserialize
//https://github.com/jwalton/passport-api-docs

// serializeUser is called with passport.authenticate()
// it effectively adds the id to the session
// by creating a req.session.passport.user property
passport.serializeUser((account, done) => {
  console.log("SERIALIZING!");
  done(null, account.id);
});

// deserializeUser is called on every request of req.user() behind the scenes
// grabs the user object from the db using the stored req.session.passport.user
passport.deserializeUser((accountId, done) => {
  console.log("DESERIALIZING!");
  Account.findById(accountId)
    .then((account) => {
      done(null, account);
    })
    .catch((err) => done(err));
});
