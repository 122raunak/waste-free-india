const express = require("express");
const {
  getScrap,
} = require("../../controllers/ScrapController/ScrapController");
const upload = require("../../Uploads/multer-config");
const { isLoggedInUser } = require("../../middlewares/IsloggedIn");

const router = express.Router();

router.post("/create", upload.single("image"), isLoggedInUser, getScrap);

module.exports = router;
