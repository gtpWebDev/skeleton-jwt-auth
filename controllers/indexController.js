const passport = require("passport");
const Account = require("../models/accountModel");

const validatePassword = require("../lib/passwordUtils").validatePassword;
const generatePassword = require("../lib/passwordUtils").generatePassword;

// short form, applying try {} catch(err)
const asyncHandler = require("express-async-handler");

// Display home page
exports.index = asyncHandler(async (req, res, next) => {
  // render the "index" view, with the given parameters
  res.render("index", { title: "Home Page" });
});

// display register page
exports.register_get = asyncHandler(async (req, res, next) => {
  //res.render("register", { title: "Register Page" });
  const form =
    '<h1>Register Page</h1><form method="post" action="register">\
                  Enter Username:<br><input type="text" name="username">\
                  <br>Enter Password:<br><input type="password" name="password">\
                  <br><br><input type="submit" value="Submit"></form>';

  res.send(form);
});

// user attempts to register
exports.register_post = asyncHandler(async (req, res, next) => {
  // get the salt and passwordHash from the password
  const saltAndHash = generatePassword(req.body.password);
  const salt = saltAndHash.salt;
  const passwordHash = saltAndHash.passwordHash;

  const newAccount = new Account({
    username: req.body.username,
    hash: passwordHash,
    salt: salt,
    admin: false,
  });

  // add the account to the database
  newAccount.save().then((account) => {
    console.log(account);
  });

  res.redirect("/login");
});

// display login page
exports.login_get = asyncHandler(async (req, res, next) => {
  // res.render("login", { title: "Login Page" });
  const form =
    '<h1>Login Page</h1><form method="POST" action="/login">\
  Enter Username:<br><input type="text" name="username">\
  <br>Enter Password:<br><input type="password" name="password">\
  <br><br><input type="submit" value="Submit"></form>';

  res.send(form);
});

// user attempts to login
exports.login_post = [
  // passport middleware intercepts and authenticates
  // .authenticate checks the strategy and applies the verifyCallback function
  // behind the scenes, calls the serializeUser function in config/passport, which attackes the authenticated user to the session
  passport.authenticate("local", {
    failureRedirect: "/login-failure",
    // successRedirect: "/login-success",
  }),
  // if failureRedirect and successRedirect are used above, this next middleware function would not be called
  (req, res, next) => {
    // authenticate returns req.user, note this is independent of the database model here which is account
    console.log("Successful login, req.user: ", req.user);
    res.redirect("/login-success");
  },
];

exports.logout_get = asyncHandler(async (req, res, next) => {
  // logout() is a function exposed by passport
  // it removes req.session.passport.user - the userid for the session
  // and it removes req.user - the user details from where they are stored (db in ths case)
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});
