const express = require("express");
const {
  getScrap,
  getMyListings,
  updateStatus,
  deleteListing,
} = require("../../controllers/ScrapController/ScrapController");
const upload = require("../../Uploads/multer-config");
const {
  isLoggedInUser,
  isLoggedInCaptain,
} = require("../../middlewares/isLoggedIn");
const WasteProductModel = require("../../models/WasteProductModel");

const router = express.Router();

// ─── SELLER ROUTES ────────────────────────────────────────────────

// Create a new waste listing (seller only)
router.post("/create", upload.single("images"), isLoggedInUser, getScrap);

// Get seller's own listings with buyer info
router.get("/my-listings", isLoggedInUser, getMyListings);

// Update status of seller's own waste item
router.patch("/:id/status", isLoggedInUser, updateStatus);

// Delete seller's own listing
router.delete("/:id", isLoggedInUser, deleteListing);

// ─── BUYER ROUTES ─────────────────────────────────────────────────

// Get all pending waste listings for buyers to browse
router.get("/show", isLoggedInCaptain, async (req, res) => {
  try {
    // Only show pending items (not already assigned/collected)
    const wasteItems = await WasteProductModel.find({ status: "pending" })
      .populate("seller", "FullName ContactNo Address email")
      .sort({ createdAt: -1 });

    const formatted = wasteItems.map((item) => {
      let imageBase64 = null;
      if (item.images && item.images.length > 0) {
        imageBase64 = `data:image/jpeg;base64,${item.images[0].toString("base64")}`;
      }
      return {
        _id: item._id,
        title: item.title,
        category: item.category,
        description: item.description,
        quantity: item.quantity,
        weight: item.weight,
        estimatedPrice: item.estimatedPrice,
        status: item.status,
        createdAt: item.createdAt,
        image: imageBase64,
        seller: item.seller,
      };
    });

    res.status(200).json({ wasteItems: formatted });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get single waste item detail (for description + confirm page)
router.get("/show/:id", isLoggedInCaptain, async (req, res) => {
  try {
    const { id } = req.params;
    const wasteItem = await WasteProductModel.findById(id)
      .populate("seller", "FullName ContactNo Address email")
      .populate("assignedBuyer", "FullName ContactNo Address BusinessName email profileImg");

    if (!wasteItem) {
      return res.status(404).json({ message: "Waste item not found" });
    }

    let imageBase64 = null;
    if (wasteItem.images && wasteItem.images.length > 0) {
      imageBase64 = `data:image/jpeg;base64,${wasteItem.images[0].toString("base64")}`;
    }

    let buyerProfileImg = null;
    if (wasteItem.assignedBuyer?.profileImg) {
      const binary = new Uint8Array(wasteItem.assignedBuyer.profileImg);
      const base64String = Buffer.from(binary).toString("base64");
      buyerProfileImg = `data:image/jpeg;base64,${base64String}`;
    }

    res.status(200).json({
      wasteItem: {
        _id: wasteItem._id,
        title: wasteItem.title,
        category: wasteItem.category,
        description: wasteItem.description,
        quantity: wasteItem.quantity,
        weight: wasteItem.weight,
        estimatedPrice: wasteItem.estimatedPrice,
        status: wasteItem.status,
        image: imageBase64,
        seller: wasteItem.seller,
        assignedBuyer: wasteItem.assignedBuyer
          ? {
              _id: wasteItem.assignedBuyer._id,
              FullName: wasteItem.assignedBuyer.FullName,
              ContactNo: wasteItem.assignedBuyer.ContactNo,
              Address: wasteItem.assignedBuyer.Address,
              BusinessName: wasteItem.assignedBuyer.BusinessName,
              email: wasteItem.assignedBuyer.email,
              profileImg: buyerProfileImg,
            }
          : null,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Buyer confirms/accepts a waste listing
router.post("/show/:id/confirm", isLoggedInCaptain, async (req, res) => {
  try {
    const { id } = req.params;
    const buyer = req.user;

    // Check if already assigned
    const existing = await WasteProductModel.findById(id);
    if (!existing) {
      return res.status(404).json({ message: "Waste item not found" });
    }
    if (existing.status !== "pending") {
      return res.status(400).json({ message: "This item has already been taken" });
    }

    const wasteItem = await WasteProductModel.findByIdAndUpdate(
      id,
      {
        $set: {
          assignedBuyer: buyer._id,
          status: "assigned",
        },
      },
      { new: true }
    );

    res.status(200).json({ message: "Buyer assigned to waste product", wasteItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get confirmed waste + assigned buyer info (seller's Found page)
router.get("/show/:id/confirm/found", isLoggedInCaptain, async (req, res) => {
  try {
    const { id } = req.params;

    const wasteItem = await WasteProductModel.findById(id)
      .populate("assignedBuyer", "FullName ContactNo Address BusinessName email profileImg")
      .populate("seller", "FullName ContactNo Address email");

    if (!wasteItem) {
      return res.status(404).json({ message: "Waste item not found" });
    }

    let buyerProfileImg = null;
    if (wasteItem.assignedBuyer?.profileImg) {
      buyerProfileImg = `data:image/jpeg;base64,${wasteItem.assignedBuyer.profileImg.toString("base64")}`;
    }

    res.status(200).json({
      wasteItem: {
        _id: wasteItem._id,
        title: wasteItem.title,
        category: wasteItem.category,
        quantity: wasteItem.quantity,
        weight: wasteItem.weight,
        estimatedPrice: wasteItem.estimatedPrice,
        status: wasteItem.status,
        seller: wasteItem.seller,
        assignedBuyer: wasteItem.assignedBuyer
          ? {
              _id: wasteItem.assignedBuyer._id,
              FullName: wasteItem.assignedBuyer.FullName,
              ContactNo: wasteItem.assignedBuyer.ContactNo,
              Address: wasteItem.assignedBuyer.Address,
              BusinessName: wasteItem.assignedBuyer.BusinessName,
              email: wasteItem.assignedBuyer.email,
              profileImg: buyerProfileImg,
            }
          : null,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get buyer's accepted listings (buyer's own collection)
router.get("/my-accepted", isLoggedInCaptain, async (req, res) => {
  try {
    const items = await WasteProductModel.find({ assignedBuyer: req.user._id })
      .populate("seller", "FullName ContactNo Address email")
      .sort({ updatedAt: -1 });

    const formatted = items.map((item) => {
      let imageBase64 = null;
      if (item.images && item.images.length > 0) {
        imageBase64 = `data:image/jpeg;base64,${item.images[0].toString("base64")}`;
      }
      return {
        _id: item._id,
        title: item.title,
        category: item.category,
        quantity: item.quantity,
        weight: item.weight,
        estimatedPrice: item.estimatedPrice,
        status: item.status,
        image: imageBase64,
        seller: item.seller,
      };
    });

    res.status(200).json({ items: formatted });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;