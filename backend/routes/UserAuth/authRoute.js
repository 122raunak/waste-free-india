const express = require("express");
const passport = require("passport");
const router = express.Router();

const localStrategy = require("passport-local");
const UserModel = require("../../models/UserModel");
const {
  getRegister,
  getLogin,
  getLogout,
} = require("../../controllers/AuthController/AuthControl");
const { isLoggedInUser } = require("../../middlewares/isLoggedIn");

passport.use(
  "user-local",
  new localStrategy({ usernameField: "email" }, UserModel.authenticate())
);

const GoogleStrategy = require("passport-google-oauth20").Strategy;

//  Google strategy
passport.use(
  "google-user",
  new GoogleStrategy(
    {
      clientID: process.env.Google_Client_ID,
      clientSecret: process.env.Google_Client_Secret,
      callbackURL: "http://localhost:3000/user/auth/google/callback",
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        let user = await UserModel.findOne({ googleId: profile.id });

        if (!user) {
          const names = profile.displayName.split(" ");
          const firstName = names[0];
          const lastName = names.slice(1).join(" ");
          user = await UserModel.create({
            googleId: profile.id,
            FullName: {
              FirstName: firstName,
              LastName: lastName,
            },
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

// --- Google Auth routes ---
router.get(
  "/google",
  passport.authenticate("google-user", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google-user", {
    failureRedirect: `${process.env.FRONTEND_URL}/user/login`,
  }),
  function (req, res) {
    res.redirect(`${process.env.FRONTEND_URL}/user/home`);
  }
);

router.get("/google/switch", (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);
    req.session.destroy(() => {
      res.redirect(`${process.env.FRONTEND_URL}/user/login`);
    });
  });
});

router.get(
  "/google/select",
  passport.authenticate("google-user", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

// --- Local Auth routes ---
router.post("/register", getRegister);
router.post("/login", getLogin);

router.get("/check", isLoggedInUser, (req, res) => {
  res.status(200).json({ user: req.user });
});

router.get("/logout", getLogout);

module.exports = router;
