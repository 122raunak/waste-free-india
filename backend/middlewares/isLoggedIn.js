// middlewares/isLoggedIn.js
// NOTE: This file was previously split/duplicated as isLoggedIn.js and IsloggedIn.js
// Use ONLY this file everywhere — update all imports to point here

function isLoggedInUser(req, res, next) {
  if (req.isAuthenticated() && req.user && req.user.role !== "Buyer") {
    return next();
  }
  return res.status(401).json({ message: "Not authenticated as user" });
}

function isLoggedInCaptain(req, res, next) {
  if (req.isAuthenticated() && req.user && req.user.role === "Buyer") {
    return next();
  }
  return res.status(401).json({ message: "Not authenticated as buyer" });
}

// Generic auth check — works for both user and buyer
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated() && req.user) {
    return next();
  }
  return res.status(401).json({ message: "Not authenticated" });
}

module.exports = { isLoggedInUser, isLoggedInCaptain, isAuthenticated };