function isLoggedInUser(req, res, next) {
  if (req.isAuthenticated() && req.user) {
    return next();
  }
  res.redirect(`${process.env.FRONTEND_URL}/user/home`);
}

function isLoggedInCaptain(req, res, next) {
  if (req.isAuthenticated() && req.buyer) {
    return next();
  }
  res.redirect(`${process.env.FRONTEND_URL}/home`);
}

module.exports = { isLoggedInUser, isLoggedInCaptain };
