// note can get creative here, could create multiple levels of
// access, etc.

module.exports.isAdmin = (req, res, next) => {
  if (req.user.admin) {
    next();
  } else {
    res.status(401).json({ msg: "You ain't authorized to view this resource" });
  }
};
