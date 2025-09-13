const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");

const buyerSchema = mongoose.Schema({
  FullName: {
    FirstName: { type: String, required: true },
    LastName: { type: String },
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },

  profileImg: {
    type: Buffer,
  },
  ContactNo: {
    type: String,
  },
  Address: {
    type: String,
  },

  BusinessName: {
    type: String,
  },
  WasteCategories: {
    type: [String],
  },
  ServiceArea: {
    type: String,
  },
  VerificationDocs: {
    type: [String],
  },
  BankDetails: {
    accountNumber: { type: String },
    ifsc: { type: String },
    upiId: { type: String },
  },

  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
  collectedWaste: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "wasteProduct",
    },
  ],

  socketId: {
    type: String,
  },
});

buyerSchema.plugin(plm, { usernameField: "email" });

module.exports = mongoose.model("buyer", buyerSchema);
