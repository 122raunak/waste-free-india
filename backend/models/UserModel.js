const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/WasteManagementSystem");

const userSchema = mongoose.Schema({
  FullName: {
    FirstName: {
      type: String,
      required: true,
    },
    LastName: {
      type: String,
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  profileImg: {
    type: Buffer,
    required: false,
  },
  Address: {
    type: String,
    required: false,
  },
  ContactNo: {
    type: String,
    required: false,
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
  BankDetails: {
    accountNumber: { type: String },
    ifsc: { type: String },
    upiId: { type: String },
  },
  location: {
    coordinates: {
      lat: {
        type: Number,
      },
      lng: {
        type: Number,
      },
    },
    address: {
      type: String,
    },
  },
  wastes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "wasteProduct",
    },
  ],

  scoketId: {
    type: String,
  },
});

userSchema.plugin(plm, { usernameField: "email" });

module.exports = mongoose.model("user", userSchema);
