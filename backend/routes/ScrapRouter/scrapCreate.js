const express = require("express");
const {
  getScrap,
} = require("../../controllers/ScrapController/ScrapController");
const upload = require("../../Uploads/multer-config");
const {
  isLoggedInUser,
  isLoggedInCaptain,
} = require("../../middlewares/IsloggedIn");
const WasteProductModel = require("../../models/WasteProductModel");

const router = express.Router();

router.post("/create", upload.single("images"), isLoggedInUser, getScrap);

router.get("/show", isLoggedInCaptain, async (req, res) => {
  const wasteItems = await WasteProductModel.find();
  res.status(201).json({ wasteItems });
});
router.get("/show/:id", isLoggedInCaptain, async (req, res) => {
  try {
    const { id } = req.params;
    const wasteItem = await WasteProductModel.findById(id).populate("seller");
    if (!wasteItem) {
      return res.status(404).json({ message: "Waste item not found" });
    }
    res.status(200).json({ wasteItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
router.post("/show/:id/confirm", isLoggedInCaptain, async (req, res) => {
  try {
    const { id } = req.params;
    const buyer = req.user;

    // Replace 'seller' with the actual field you want to populate
    const wasteItem = await WasteProductModel.findOneAndUpdate(
      { _id: id },
      {
        $set: { assignedBuyer: buyer },
      },
      { new: true }
    );

    if (!wasteItem) {
      return res.status(404).json({ message: "Waste item not found" });
    }

    res.status(200).json({ message: "buyer added to waste product" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/show/:id/confirm/found", isLoggedInCaptain, async (req, res) => {
  try {
    const { id } = req.params;
    const buyer = req.user;

    // Replace 'seller' with the actual field you want to populate
    const wasteItem = await WasteProductModel.findById(id)
      .populate("assignedBuyer")
      .populate("seller");

    if (!wasteItem) {
      return res.status(404).json({ message: "Waste item not found" });
    }

    res.status(200).json({ wasteItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
