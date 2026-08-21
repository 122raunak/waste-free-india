require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
const passport = require("passport");
const mongoose = require("mongoose");
const cors = require("cors");

const UserModel = require("./models/UserModel");
const BuyerModel = require("./models/BuyerModel");

const app = express();

// ── MongoDB connection ─────────────────────────────────────────
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// ── CORS — allow localhost in dev, Vercel URL in production ───
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL, // set this to your Vercel URL in Render env vars
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (Postman, mobile apps)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ── Session ───────────────────────────────────────────────────
app.use(
  expressSession({
    secret: process.env.secretKey,
    resave: false,
    saveUninitialized: false,
    cookie: {
      // secure: true requires HTTPS — works on Render/Vercel, not on localhost
      secure: process.env.NODE_ENV === "production",
      // sameSite: "none" is required for cross-domain cookies (Vercel → Render)
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      httpOnly: true,
    },
  })
);

// ── Passport ──────────────────────────────────────────────────
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    let user = await UserModel.findById(id);
    if (!user) user = await BuyerModel.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// ── Body parsing ──────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ── Routes ────────────────────────────────────────────────────
const authRouter = require("./routes/UserAuth/authRoute");
const userRouter = require("./routes/User/user");
const buyerRouter = require("./routes/Buyer/buyer");
const buyerAuthRouter = require("./routes/UserAuth/BuyerAuthRouter");
const mapRouter = require("./routes/mapRouter/mapRouter");
const chatbotRouter = require("./routes/chatBot/chatbot");
const ScrapRouter = require("./routes/ScrapRouter/scrapCreate");

app.use("/user/auth", authRouter);
app.use("/user", userRouter);
app.use("/buyer/auth", buyerAuthRouter);
app.use("/buyer", buyerRouter);
app.use("/map", mapRouter);
app.use("/chatbot", chatbotRouter);
app.use("/Scrap", ScrapRouter);

// ── Health check ──────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", env: process.env.NODE_ENV });
});

// ── Start ─────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});