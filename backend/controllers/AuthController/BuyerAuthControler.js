const express = require("express");
const router = express.Router();

const BuyerModel = require("../../models/BuyerModel");
const passport = require("passport");
const validator = require("validator");

getRegister = async (req, res) => {
  try {
    const { FullName, email, password } = req.body;

    if (!FullName?.FirstName || !email || !password) {
      return res.status(200).json({ message: "All fields are required" });
    }
    if (!validator.isEmail(email || "")) {
      return res.status(200).json({ message: "Email not vaild" });
    }
    if (!validator.isLength(password || "", { min: 6 })) {
      return res
        .status(200)
        .json({ message: "Password must be at least 6 characters long" });
    }

    const newUser = new BuyerModel({ FullName, email });

    await BuyerModel.register(newUser, password);

    return res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    if (err.name === "UserExistsError") {
      return res
        .status(400)
        .json({ message: "A user with this email is already registered" });
    }
    return res.status(500).json({ message: err.message });
  }
};

getLogin = (req, res, next) => {
  passport.authenticate("buyer-local", (err, user, info) => {
    if (err) return res.status(500).json({ message: err.message });
    if (!user)
      return res
        .status(200)
        .json({ message: info.message || "Invalid credentials" });

    req.login(user, (err) => {
      if (err) return res.status(500).json({ message: err.message });

      return res.status(200).json({
        message: "Login successful",
        user: {
          id: user._id,
          email: user.email,
          FullName: user.FullName,
        },
      });
    });
  })(req, res, next);
};

getLogout = (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: "Logout error" });

    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.status(200).json({ message: "Logged out successfully" });
    });
  });
};
module.exports = { getRegister, getLogin, getLogout };
