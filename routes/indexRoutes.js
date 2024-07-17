var express = require("express");

const index_controller = require("../controllers/indexController");
const isAuth = require("../lib/authMiddleware").isAuth;
const isAdmin = require("../lib/authMiddleware").isAdmin;

// creates and a modular, mountable route handler

var router = express.Router();

/* GET home page. */
router.get("/", index_controller.index);

/* GET register page - get the template for registering. */
router.get("/register", index_controller.register_get);

/* POST register page - user attempts to register. */
router.post("/register", index_controller.register_post);

/* GET login page - get the template for logging in. */
router.get("/login", index_controller.login_get);

/* POST login page - user attempts to login. */
router.post("/login", index_controller.login_post);

// POST logout page - user attempts to logout
router.get("/logout", index_controller.logout_get);

// temp login success
// passport recommends against logout with get, prefers post and put
router.get("/login-success", (req, res, next) => {
  res.send(
    '<p>You successfully logged in.</p>\
    <p><a href="/protected-route">Go to protected route</a></p>\
    <p><a href="/admin-route">Go to admin-protected route</a></p>\
    <p><a href="/logout">logout</a></p>'
  );
});

// temp login failure
router.get("/login-failure", (req, res, next) => {
  res.send("You entered the wrong password.");
});

// temp login success
// passport recommends against logout with get, prefers post and put
router.get("/naughtystep", (req, res, next) => {
  res.send("<p>You tried to go somewhere that you should not, naughty!.</p>");
});

/**
 * Lookup how to authenticate users on routes with Local Strategy
 * Google Search: "How to use Express Passport Local Strategy"
 */

router.get("/protected-route", isAuth, (req, res, next) => {
  // This is how you check if a user is authenticated and protect a route.  You could turn this into a custom middleware to make it less redundant
  res.send("you made it to the route, using the created isAuth middleware");
});

router.get("/admin-route", isAdmin, (req, res, next) => {
  // This is how you check if a user is authenticated and protect a route.  You could turn this into a custom middleware to make it less redundant
  res.send(
    "you made it to the route AS ADMIN, using the created isAuth middleware"
  );
});

module.exports = router;
