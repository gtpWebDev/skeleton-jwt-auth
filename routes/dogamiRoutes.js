const express = require("express");
const router = express.Router();
const dogamiController = require("../controllers/dogamiController");

/* GET main dogami page. */
router.get("/", dogamiController.dogami_all);

router.get("/:id", dogamiController.dogami_detail);

module.exports = router;
