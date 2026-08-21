const mongoose = require("mongoose");

const wasteProductSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, enum: ["Paper", "Plastic", "Metal", "E-waste"], required: true },
    description: { type: String },
    quantity: { type: Number },
    unit: { type: String, enum: ["kg", "liters", "pieces"], default: "kg" },
    weight: { type: String },
    estimatedPrice: { type: Number, default: 0 },
    images: { type: [Buffer] },
    location: {
      coordinates: { lat: { type: Number }, lng: { type: Number } },
      address: { type: String },
    },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    assignedBuyer: { type: mongoose.Schema.Types.ObjectId, ref: "buyer" },
    status: {
      type: String,
      enum: ["pending", "assigned", "collected", "completed", "cancelled"],
      default: "pending",
    },
    finalPrice: { type: Number, default: null },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("wasteProduct", wasteProductSchema);