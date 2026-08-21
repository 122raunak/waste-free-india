const scrapModel = require("../../models/WasteProductModel");
const UserModel = require("../../models/UserModel");

// POST /Scrap/create — seller creates a waste listing
const getScrap = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { title, category, description, quantity, estimatedPrice, weight } =
      req.body;

    if (!title || !category || !description || !estimatedPrice) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const scrap = await scrapModel.create({
      title,
      category,
      description,
      quantity,
      estimatedPrice,
      weight,
      seller: req.user._id,
      images: [req.file.buffer],
      status: "pending",
    });

    // Push waste ID into user's wastes array
    await UserModel.findByIdAndUpdate(req.user._id, {
      $push: { wastes: scrap._id },
    });

    return res.status(201).json({
      message: "Scrap created successfully",
      scrap: { id: scrap._id },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

// GET /Scrap/my-listings — seller sees their own waste + who accepted
const getMyListings = async (req, res) => {
  try {
    const listings = await scrapModel
      .find({ seller: req.user._id })
      .populate("assignedBuyer", "FullName ContactNo Address BusinessName email profileImg")
      .sort({ createdAt: -1 });

    // Convert images to base64
    const formatted = listings.map((item) => {
      let imageBase64 = null;
      if (item.images && item.images.length > 0) {
        imageBase64 = `data:image/jpeg;base64,${item.images[0].toString("base64")}`;
      }

      let buyerProfileImg = null;
      if (item.assignedBuyer?.profileImg) {
        buyerProfileImg = `data:image/jpeg;base64,${item.assignedBuyer.profileImg.toString("base64")}`;
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
        finalPrice: item.finalPrice,
        assignedBuyer: item.assignedBuyer
          ? {
              _id: item.assignedBuyer._id,
              FullName: item.assignedBuyer.FullName,
              ContactNo: item.assignedBuyer.ContactNo,
              Address: item.assignedBuyer.Address,
              BusinessName: item.assignedBuyer.BusinessName,
              email: item.assignedBuyer.email,
              profileImg: buyerProfileImg,
            }
          : null,
      };
    });

    return res.status(200).json({ listings: formatted });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// PATCH /Scrap/:id/status — seller updates status of their waste
const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["pending", "assigned", "collected", "completed", "cancelled"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const waste = await scrapModel.findOne({ _id: id, seller: req.user._id });
    if (!waste) {
      return res.status(404).json({ message: "Waste item not found or not yours" });
    }

    waste.status = status;
    await waste.save();

    return res.status(200).json({ message: "Status updated", status: waste.status });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// DELETE /Scrap/:id — seller deletes their listing
const deleteListing = async (req, res) => {
  try {
    const { id } = req.params;

    const waste = await scrapModel.findOneAndDelete({ _id: id, seller: req.user._id });
    if (!waste) {
      return res.status(404).json({ message: "Listing not found or not yours" });
    }

    await UserModel.findByIdAndUpdate(req.user._id, {
      $pull: { wastes: waste._id },
    });

    return res.status(200).json({ message: "Listing deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getScrap, getMyListings, updateStatus, deleteListing };