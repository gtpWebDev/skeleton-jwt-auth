// note can get creative here, could create multiple levels of
// access, etc.

module.exports.isAuth = (req, res, next) => {
  // isAuthenticated property is exposed by password on password.authenticate
  // very simply, checks whether req.session.password.user has a user
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).json({ msg: "You ain't authorized to view this resource" });
    // res.redirect("/naughtystep");
  }
};

module.exports.isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.admin) {
    next();
  } else {
    res.status(401).json({
      msg: "You ain't authorized to view this resource because you are not an admin",
    });
    // res.redirect("/naughtystep");
  }
};
