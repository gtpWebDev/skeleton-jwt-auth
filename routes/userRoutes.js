var express = require("express");
var router = express.Router();

const user_controller = require("../controllers/userController");

// creates and a modular, mountable route handler

/* GET home page. */
router.get("/", user_controller.index);

/* GET a very simple test message */
router.get("/test", user_controller.test_get);

/* GET register page - get the template for registering. */
router.get("/register", user_controller.register_get);

/* POST register page - user attempts to register. */
router.post("/register", user_controller.register_post);

/* GET login page - get the template for logging in. */
router.get("/login", user_controller.login_get);

/* POST login page - user attempts to login. */
router.post("/login", user_controller.login_post);

/* GET protected page to test authorization works */
router.get("/protected", user_controller.protected_get);

/* GET protected page to test authorization works */
router.get("/admin", user_controller.admin_get);

// GET user dashboard
router.get("/dashboard", user_controller.dashboard_get);

// POST logout page - user attempts to logout
// router.get("/logout", user_controller.logout_get);

// temp login success
// passport recommends against logout with get, prefers post and put
// router.get("/login-success", (req, res, next) => {
//   res.send(
//     '<p>You successfully logged in.</p>\
//     <p><a href="/protected-route">Go to protected route</a></p>\
//     <p><a href="/admin-route">Go to admin-protected route</a></p>\
//     <p><a href="/logout">logout</a></p>'
//   );
// });

// // temp login failure
// router.get("/login-failure", (req, res, next) => {
//   res.send("You entered the wrong password.");
// });

module.exports = router;
