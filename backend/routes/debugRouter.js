// backend/routes/debugRouter.js
// TEMPORARY — delete before deploying to production

const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const axios = require("axios");

// ── Test email with full response logging ──────────────────────
// GET http://localhost:3000/debug/test-email?to=raunak1435@gmail.com
router.get("/test-email", async (req, res) => {
  const to = req.query.to;
  if (!to) return res.status(400).json({ error: "Pass ?to=your@email.com" });

  // Log exactly what credentials are being used
  console.log("EMAIL_USER:", process.env.EMAIL_USER);
  console.log("EMAIL_PASS length:", process.env.EMAIL_PASS?.length, "(should be 16)");
  console.log("Sending to:", to);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    // Step 1: verify connection first
    await transporter.verify();
    console.log("✅ SMTP connection verified");

    // Step 2: send a PLAIN TEXT email (simpler, less likely to go to spam)
    const info = await transporter.sendMail({
      from: `"WasteFreeIndia" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: "Test Email from WasteFreeIndia",
      text: "This is a test email from WasteFreeIndia. If you received this, email is working correctly!",
      html: "<p>This is a <b>test email</b> from WasteFreeIndia. If you received this, email is working!</p>",
    });

    console.log("✅ Email sent! Message ID:", info.messageId);
    console.log("Response:", info.response);

    res.json({
      success: true,
      messageId: info.messageId,
      response: info.response,
      to: to,
      from: process.env.EMAIL_USER,
      note: "Check your SPAM folder if not in inbox",
    });
  } catch (err) {
    console.error("❌ Email failed:", err.message);
    console.error("Full error:", err);

    res.status(500).json({
      success: false,
      error: err.message,
      code: err.code,
      // Common error codes:
      // EAUTH = wrong email/password
      // ECONNECTION = can't reach Gmail
      // 535 = App Password wrong
      fix: err.code === "EAUTH" || err.message.includes("535")
        ? "Wrong App Password. Generate a new one at myaccount.google.com/apppasswords"
        : err.message.includes("534")
        ? "2-Step Verification not enabled on Gmail account"
        : "Check backend terminal for full error details",
    });
  }
});

// ── Test maps ────────────────────────────────────────────────
// GET http://localhost:3000/debug/test-maps?q=Mumbai
router.get("/test-maps", async (req, res) => {
  const q = req.query.q || "Mumbai";
  const apiKey = process.env.GOOGLE_MAP_API;

  if (!apiKey) return res.status(500).json({ error: "GOOGLE_MAP_API not set in .env" });

  try {
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/place/autocomplete/json",
      { params: { input: q, key: apiKey, components: "country:in", language: "en" } }
    );
    const { status, error_message, predictions } = response.data;
    res.json({ status, error_message, count: predictions?.length, first: predictions?.[0]?.description });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Check env vars are loaded ─────────────────────────────────
// GET http://localhost:3000/debug/check-env
router.get("/check-env", (req, res) => {
  res.json({
    EMAIL_USER: process.env.EMAIL_USER || "NOT SET",
    EMAIL_PASS_LENGTH: process.env.EMAIL_PASS?.length || 0,
    EMAIL_PASS_SET: !!process.env.EMAIL_PASS,
    GOOGLE_MAP_API_SET: !!process.env.GOOGLE_MAP_API,
    FRONTEND_URL: process.env.FRONTEND_URL || "NOT SET",
    NODE_ENV: process.env.NODE_ENV || "NOT SET",
  });
});

module.exports = router;