const express = require("express");
const {
  getScrap, getMyListings, updateStatus, deleteListing,
} = require("../../controllers/ScrapController/ScrapController");
const upload = require("../../Uploads/multer-config");
const { isLoggedInUser, isLoggedInCaptain } = require("../../middlewares/isLoggedIn");
const WasteProductModel = require("../../models/WasteProductModel");
const { sendBuyerAssignedEmail, sendStatusUpdateEmail } = require("../../services/emailService");

const router = express.Router();

// ── SELLER ROUTES ──────────────────────────────────────────

router.post("/create", upload.single("images"), isLoggedInUser, getScrap);
router.get("/my-listings", isLoggedInUser, getMyListings);
router.delete("/:id", isLoggedInUser, deleteListing);

// Status update — triggers email to buyer
router.patch("/:id/status", isLoggedInUser, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowed = ["pending", "assigned", "collected", "completed", "cancelled"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const waste = await WasteProductModel.findOne({ _id: id, seller: req.user._id })
      .populate("assignedBuyer", "FullName email ContactNo BusinessName")
      .populate("seller", "FullName email");

    if (!waste) return res.status(404).json({ message: "Waste item not found or not yours" });

    waste.status = status;
    await waste.save();

    // Send email to buyer if status changed to collected/completed/cancelled
    if (waste.assignedBuyer?.email && ["collected", "completed", "cancelled"].includes(status)) {
      sendStatusUpdateEmail({
        buyerEmail: waste.assignedBuyer.email,
        buyerName: `${waste.assignedBuyer.FullName?.FirstName || ""} ${waste.assignedBuyer.FullName?.LastName || ""}`.trim(),
        sellerName: `${req.user.FullName?.FirstName || ""} ${req.user.FullName?.LastName || ""}`.trim(),
        wasteTitle: waste.title,
        newStatus: status,
      }).catch(err => console.error("Email failed (non-blocking):", err.message));
    }

    return res.status(200).json({ message: "Status updated", status: waste.status });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ── BUYER ROUTES ───────────────────────────────────────────

router.get("/show", isLoggedInCaptain, async (req, res) => {
  try {
    const wasteItems = await WasteProductModel.find({ status: "pending" })
      .populate("seller", "FullName ContactNo Address email")
      .sort({ createdAt: -1 });

    const formatted = wasteItems.map((item) => {
      let imageBase64 = null;
      if (item.images?.length > 0) {
        imageBase64 = `data:image/jpeg;base64,${item.images[0].toString("base64")}`;
      }
      return {
        _id: item._id, title: item.title, category: item.category,
        description: item.description, quantity: item.quantity,
        weight: item.weight, estimatedPrice: item.estimatedPrice,
        status: item.status, createdAt: item.createdAt,
        image: imageBase64, seller: item.seller,
      };
    });

    res.status(200).json({ wasteItems: formatted });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/show/:id", isLoggedInCaptain, async (req, res) => {
  try {
    const wasteItem = await WasteProductModel.findById(req.params.id)
      .populate("seller", "FullName ContactNo Address email")
      .populate("assignedBuyer", "FullName ContactNo Address BusinessName email profileImg");

    if (!wasteItem) return res.status(404).json({ message: "Waste item not found" });

    let imageBase64 = null;
    if (wasteItem.images?.length > 0) {
      imageBase64 = `data:image/jpeg;base64,${wasteItem.images[0].toString("base64")}`;
    }

    let buyerProfileImg = null;
    if (wasteItem.assignedBuyer?.profileImg) {
      buyerProfileImg = `data:image/jpeg;base64,${Buffer.from(wasteItem.assignedBuyer.profileImg).toString("base64")}`;
    }

    res.status(200).json({
      wasteItem: {
        _id: wasteItem._id, title: wasteItem.title, category: wasteItem.category,
        description: wasteItem.description, quantity: wasteItem.quantity,
        weight: wasteItem.weight, estimatedPrice: wasteItem.estimatedPrice,
        status: wasteItem.status, image: imageBase64,
        seller: wasteItem.seller,
        assignedBuyer: wasteItem.assignedBuyer ? {
          _id: wasteItem.assignedBuyer._id,
          FullName: wasteItem.assignedBuyer.FullName,
          ContactNo: wasteItem.assignedBuyer.ContactNo,
          Address: wasteItem.assignedBuyer.Address,
          BusinessName: wasteItem.assignedBuyer.BusinessName,
          email: wasteItem.assignedBuyer.email,
          profileImg: buyerProfileImg,
        } : null,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Buyer confirms — triggers email to seller
router.post("/show/:id/confirm", isLoggedInCaptain, async (req, res) => {
  try {
    const { id } = req.params;
    const buyer = req.user;

    const existing = await WasteProductModel.findById(id)
      .populate("seller", "FullName email ContactNo");

    if (!existing) return res.status(404).json({ message: "Waste item not found" });
    if (existing.status !== "pending") {
      return res.status(400).json({ message: "This item has already been taken" });
    }

    existing.assignedBuyer = buyer._id;
    existing.status = "assigned";
    await existing.save();

    // Send email to seller (non-blocking — don't fail if email fails)
    if (existing.seller?.email) {
      sendBuyerAssignedEmail({
        sellerEmail: existing.seller.email,
        sellerName: `${existing.seller.FullName?.FirstName || ""} ${existing.seller.FullName?.LastName || ""}`.trim(),
        buyerName: `${buyer.FullName?.FirstName || ""} ${buyer.FullName?.LastName || ""}`.trim(),
        buyerContact: buyer.ContactNo,
        buyerBusiness: buyer.BusinessName,
        wasteTitle: existing.title,
        wasteCategory: existing.category,
        estimatedPrice: existing.estimatedPrice,
      }).catch(err => console.error("Email failed (non-blocking):", err.message));
    }

    res.status(200).json({ message: "Buyer assigned to waste product" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/show/:id/confirm/found", isLoggedInCaptain, async (req, res) => {
  try {
    const wasteItem = await WasteProductModel.findById(req.params.id)
      .populate("assignedBuyer", "FullName ContactNo Address BusinessName email profileImg")
      .populate("seller", "FullName ContactNo Address email");

    if (!wasteItem) return res.status(404).json({ message: "Waste item not found" });

    let buyerProfileImg = null;
    if (wasteItem.assignedBuyer?.profileImg) {
      buyerProfileImg = `data:image/jpeg;base64,${wasteItem.assignedBuyer.profileImg.toString("base64")}`;
    }

    res.status(200).json({
      wasteItem: {
        _id: wasteItem._id, title: wasteItem.title, category: wasteItem.category,
        quantity: wasteItem.quantity, weight: wasteItem.weight,
        estimatedPrice: wasteItem.estimatedPrice, status: wasteItem.status,
        seller: wasteItem.seller,
        assignedBuyer: wasteItem.assignedBuyer ? {
          _id: wasteItem.assignedBuyer._id,
          FullName: wasteItem.assignedBuyer.FullName,
          ContactNo: wasteItem.assignedBuyer.ContactNo,
          Address: wasteItem.assignedBuyer.Address,
          BusinessName: wasteItem.assignedBuyer.BusinessName,
          email: wasteItem.assignedBuyer.email,
          profileImg: buyerProfileImg,
        } : null,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/my-accepted", isLoggedInCaptain, async (req, res) => {
  try {
    const items = await WasteProductModel.find({ assignedBuyer: req.user._id })
      .populate("seller", "FullName ContactNo Address email")
      .sort({ updatedAt: -1 });

    const formatted = items.map((item) => {
      let imageBase64 = null;
      if (item.images?.length > 0) {
        imageBase64 = `data:image/jpeg;base64,${item.images[0].toString("base64")}`;
      }
      return {
        _id: item._id, title: item.title, category: item.category,
        quantity: item.quantity, weight: item.weight,
        estimatedPrice: item.estimatedPrice, status: item.status,
        image: imageBase64, seller: item.seller,
      };
    });

    res.status(200).json({ items: formatted });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// REPLACE the existing /:id/complete route in scrapCreate.js with this

router.post("/:id/complete", isLoggedInCaptain, async (req, res) => {
  try {
    const { id } = req.params;
    const { finalPrice } = req.body;

    if (!finalPrice || isNaN(finalPrice) || Number(finalPrice) <= 0) {
      return res.status(400).json({ message: "Please enter a valid price greater than 0" });
    }

    const waste = await WasteProductModel.findOne({
      _id: id,
      assignedBuyer: req.user._id,
    })
      .populate("seller", "FullName email ContactNo")
      .populate("assignedBuyer", "FullName email ContactNo BusinessName");

    if (!waste) {
      return res.status(404).json({ message: "Waste item not found or not assigned to you" });
    }
    if (waste.status !== "assigned") {
      return res.status(400).json({ message: `Cannot complete — current status is "${waste.status}"` });
    }

    waste.status = "completed";
    waste.finalPrice = Number(finalPrice);
    waste.completedAt = new Date();
    await waste.save();

    const {
      sendTransactionCompleteEmail,
      sendBuyerReceiptEmail,
    } = require("../../services/emailService");

    const buyerName = `${req.user.FullName?.FirstName || ""} ${req.user.FullName?.LastName || ""}`.trim();
    const sellerName = `${waste.seller?.FullName?.FirstName || ""} ${waste.seller?.FullName?.LastName || ""}`.trim();

    // Email to SELLER — receipt with final price
    if (waste.seller?.email) {
      sendTransactionCompleteEmail({
        sellerEmail: waste.seller.email,
        sellerName,
        buyerName,
        buyerBusiness: req.user.BusinessName,
        wasteTitle: waste.title,
        wasteCategory: waste.category,
        estimatedPrice: waste.estimatedPrice,
        finalPrice: waste.finalPrice,
        completedAt: waste.completedAt,
      }).catch(err => console.error("Seller complete email failed:", err.message));
    }

    // Email to BUYER — their own purchase receipt
    if (req.user.email) {
      sendBuyerReceiptEmail({
        buyerEmail: req.user.email,
        buyerName,
        sellerName,
        sellerContact: waste.seller?.ContactNo,
        wasteTitle: waste.title,
        wasteCategory: waste.category,
        finalPrice: waste.finalPrice,
        completedAt: waste.completedAt,
      }).catch(err => console.error("Buyer receipt email failed:", err.message));
    }

    return res.status(200).json({
      message: "Transaction completed",
      finalPrice: waste.finalPrice,
      status: waste.status,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;