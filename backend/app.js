require("dotenv").config();
let express = require("express");
let cookieParser = require("cookie-parser");
const expressSession = require("express-session");
const passport = require("passport");
const UserModel = require("./models/UserModel");
const BuyerModel = require("./models/BuyerModel");

const cors = require("cors");

let app = express();

const authRouter = require("./routes/UserAuth/authRoute");
const buyerAuthRouter = require("./routes/UserAuth/BuyerAuthRouter");
const mapRouter = require("./routes/mapRouter/mapRouter");
const chatbotRouter = require("./routes/chatBot/chatbot");
const ScrapRouter = require("./routes/ScrapRouter/scrapCreate");
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(
  expressSession({
    secret: process.env.secretKey,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    let user = await UserModel.findById(id);
    if (!user) {
      user = await BuyerModel.findById(id);
    }
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/user/auth", authRouter);
app.use("/buyer/auth", buyerAuthRouter);
app.use("/map", mapRouter);
app.use("/chatbot", chatbotRouter);
app.use("/Scrap", ScrapRouter);

app.listen(3000, () => {
  console.log(` server is running on port: http://localhost:3000`);
});
