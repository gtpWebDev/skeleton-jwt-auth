// short form, applying try {} catch(err)
const asyncHandler = require("express-async-handler");

const Dogami = require("../models/dogamiModel");

const dogamiInfo = require("../constants/dogamiInfo");

// display dogami page
exports.dogami_all = asyncHandler(async (req, res, next) => {
  // collect all dogami
  const allDogami = await Dogami.find({}).exec();
  res.render("dogami_all", {
    title: "Dogami List Page",
    dogamiArray: allDogami,
  });
});

// display dogami page
exports.dogami_detail = asyncHandler(async (req, res, next) => {
  const dogami = await Dogami.findOne({ dogami_id: req.params.id }).exec();
  console.log("dogami", dogami);
  res.render("dogami_detail", {
    title: "Dogami Detail Page",
    dogami: dogami,
    session: req.session,
  });
});
