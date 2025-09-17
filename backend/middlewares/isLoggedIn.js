function isLoggedInUser(req, res, next) {
  if (req.isAuthenticated() && req.user) {
    return next();
  }
  res.redirect(`${process.env.FRONTEND_URL}/user/home`);
}

function isLoggedInCaptain(req, res, next) {
  if (req.isAuthenticated() && req.user && req.user.role === "Buyer") {
    return next();
  }
  return res.status(401).json({ message: "Not authenticated" });
}

module.exports = { isLoggedInUser, isLoggedInCaptain };
