var express = require("express");
var router = express.Router();

// for now this is planned to cover the locations for logged in users

/* GET home page. */
router.get("/", function (req, res, next) {
  // render the "index" view, with the given parameters
  res.render("account", { title: "Account Home Page" });
});

module.exports = router;
