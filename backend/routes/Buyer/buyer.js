const express = require("express");
const passport = require("passport");
const router = express.Router();

const localStrategy = require("passport-local");
const BuyerModel = require("../../models/BuyerModel");
const { getRegister, getLogin, getLogout } = require("../../controllers/AuthController/BuyerAuthControler");
const { isLoggedInCaptain } = require("../../middlewares/isLoggedIn");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
  "buyer-local",
  new localStrategy({ usernameField: "email" }, BuyerModel.authenticate())
);

passport.use(
  "google-buyer",
  new GoogleStrategy(
    {
      clientID: process.env.Google_Client_ID,
      clientSecret: process.env.Google_Client_Secret,
      // ✅ Uses env var — works both locally and in production
      callbackURL: `${process.env.BACKEND_URL}/buyer/auth/google/callback`,
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        let user = await BuyerModel.findOne({ googleId: profile.id });
        if (!user) {
          const names = profile.displayName.split(" ");
          user = await BuyerModel.create({
            googleId: profile.id,
            FullName: { FirstName: names[0], LastName: names.slice(1).join(" ") },
            email: profile.emails[0].value,
          });
        }
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

router.get("/auth/google", passport.authenticate("google-buyer", { scope: ["profile", "email"] }));

router.get(
  "/auth/google/callback",
  passport.authenticate("google-buyer", {
    failureRedirect: `${process.env.FRONTEND_URL}/buyer/login`,
  }),
  (req, res) => {
    res.redirect(`${process.env.FRONTEND_URL}/buyer/listofwaste`);
  }
);

router.get("/auth/google/switch", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.redirect(`${process.env.FRONTEND_URL}/buyer/login`);
    });
  });
});

router.post("/register", getRegister);
router.post("/login", getLogin);
router.get("/logout", getLogout);
router.get("/check", isLoggedInCaptain, (req, res) => {
  res.status(200).json({ buyer: req.user });
});

module.exports = router;