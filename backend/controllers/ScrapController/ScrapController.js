const validator = require("validator");

const scrapModel = require("../../models/WasteProductModel");

const getScrap = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { title, category, description, quantity, estimatedPrice } = req.body;

    if (!title || !category || !description || !quantity || !estimatedPrice) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const scrap = await scrapModel.create({
      title,
      category,
      description,
      quantity,
      estimatedPrice,
      seller: req.user._id,
      // images: req.file.buffer,
    });

    return res
      .status(201)
      .json({ message: "Scrap created successfully", scrap });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

module.exports = { getScrap };

module.exports = { getScrap };
