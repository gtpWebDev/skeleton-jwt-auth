const passport = require("passport");
const User = require("../models/userModel");
const authMiddleware = require("../lib/authMiddleware");

const passwordUtils = require("../lib/passwordUtils");

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
    '<h1>Register Page</h1><form method="post" action="/user/register">\
                  Enter Username:<br><input type="text" name="username">\
                  <br>Enter Password:<br><input type="password" name="password">\
                  <br><br><input type="submit" value="Submit"></form>';

  res.send(form);
});

// user attempts to register
exports.register_post = asyncHandler(async (req, res, next) => {
  // apply the local strategy to generate a salt and password hash from the password
  const saltAndHash = passwordUtils.generatePassword(req.body.password);
  const salt = saltAndHash.salt;
  const passwordHash = saltAndHash.passwordHash;

  const newUser = new User({
    username: req.body.username,
    hash: passwordHash,
    salt: salt,
    admin: false,
  });

  // add the new user to the database
  newUser.save().then((user) => {
    // issue a JWT and return it
    const jwt = passwordUtils.issueJWT(user);

    // console.log("token", jwt.token);

    res.status(200).json({
      success: true,
      user: user,
      token: jwt.token,
      expiresIn: jwt.expires,
    });
  });
});

// user requests login page
exports.login_get = asyncHandler(async (req, res, next) => {
  const form =
    '<h1>Login Page</h1><form method="POST" action="/user/login">\
  Enter Username:<br><input type="text" name="username">\
  <br>Enter Password:<br><input type="password" name="password">\
  <br><br><input type="submit" value="Submit"></form>';
  res.send(form);
});

// user attempts to login
exports.login_post = asyncHandler(
  // if failureRedirect and successRedirect are used above, this next middleware function would not be called

  async (req, res, next) => {
    User.findOne({ username: req.body.username })
      .then((user) => {
        if (!user) {
          console.log("Could not find user:");
          return res
            .status(401)
            .json({ success: false, msg: "could not find user" });
        }

        // Function defined at bottom of app.js
        const isValid = passwordUtils.validatePassword(
          req.body.password,
          user.hash,
          user.salt
        );

        if (isValid) {
          const jwt = passwordUtils.issueJWT(user);
          res.status(200).json({
            success: true,
            user: user,
            token: jwt.token,
            expiresIn: jwt.expires,
          });
        } else {
          res
            .status(401)
            .json({ success: false, msg: "you entered the wrong password" });
        }
      })
      .catch((err) => {
        next(err);
      });
  }
);

exports.protected_get = [
  // passport middleware applies verifyCallback
  passport.authenticate("jwt", { session: false }),
  asyncHandler((req, res, next) => {
    res.status(200).json({
      success: true,
      msg: "You are successfully authorized to this route!",
    });
  }),
];

exports.admin_get = [
  // passport middleware applies verifyCallback
  passport.authenticate("jwt", { session: false }),
  authMiddleware.isAdmin,
  asyncHandler((req, res, next) => {
    res.status(200).json({
      success: true,
      msg: "You are successfully authorized to this admin route!",
    });
  }),
];

exports.logout_get = asyncHandler(async (req, res, next) => {
  // logout() is a function exposed by passport
  // it removes req.session.passport.user - the userid for the session
  // and it removes req.user - the user details from where they are stored (db in ths case)
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/user/login");
  });
});
