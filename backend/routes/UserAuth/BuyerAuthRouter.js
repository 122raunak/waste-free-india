const express = require("express");
const passport = require("passport");
const router = express.Router();

const localStrategy = require("passport-local");
const BuyerModel = require("../../models/BuyerModel");
const {
  getRegister,
  getLogin,
  getLogout,
} = require("../../controllers/AuthController/BuyerAuthControler");

passport.use(
  "buyer-local",
  new localStrategy({ usernameField: "email" }, BuyerModel.authenticate())
);
const GoogleStrategy = require("passport-google-oauth20").Strategy;

//  google regsitration
passport.use(
  "google-buyer",
  new GoogleStrategy(
    {
      clientID: process.env.Google_Client_ID,
      clientSecret: process.env.Google_Client_Secret,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        let user = await BuyerModel.findOne({ googleId: profile.id });

        if (!user) {
          user = await BuyerModel.create({
            googleId: profile.id,
            name: profile.displayName,
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

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    // prompt: "select_account",
  })
);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  function (req, res) {
    res.redirect("http://localhost:5173/dashboard");
    // routes bad me change krne hai
  }
);

router.get("/auth/google/switch", (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);
    req.session.destroy(() => {
      // res.redirect("/auth/google/select");
      res.redirect("http://localhost:5173/login");
    });
  });
});

router.get(
  "/auth/google/select",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

// local registration

router.post("/register", getRegister);
router.post("/login", getLogin);

router.get("/logout", getLogout);

module.exports = router;
