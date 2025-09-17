const express = require("express");
const { isLoggedInCaptain } = require("../../middlewares/isLoggedIn");
const upload = require("../../Uploads/multer-config");
const BuyerModel = require("../../models/BuyerModel");
const router = express.Router();

router.post(
  "/profile/edit",
  upload.single("profileImg"),
  isLoggedInCaptain,
  async (req, res) => {
    try {
      const {
        FullName,
        ContactNo,
        Address,
        BusinessName,
        ServiceArea,
        WasteCategories,
        BankDetails,
      } = req.body;

      const updateData = {
        FullName: {
          FirstName: FullName.FirstName,
          LastName: FullName.LastName,
        },
        ContactNo,
        Address,
        BusinessName,
        ServiceArea,
        BankDetails: {
          accountNumber: BankDetails.accountNumber,
          ifsc: BankDetails.ifsc,
          upiId: BankDetails.upiId,
        },
      };

      if (WasteCategories) {
        updateData.WasteCategories = Array.isArray(WasteCategories)
          ? WasteCategories
          : WasteCategories.split(",").map((cat) => cat.trim());
      }

      if (req.file) {
        updateData.profileImg = req.file.buffer;
      }

      const user = await BuyerModel.findOneAndUpdate(
        { email: req.user.email },
        { $set: updateData },
        { new: true, runValidators: true }
      );

      let profileImgBase64 = null;
      if (user.profileImg) {
        profileImgBase64 = `data:image/jpeg;base64,${user.profileImg.toString(
          "base64"
        )}`;
      }

      res.status(200).json({
        message: "User data updated",
        user: {
          FullName: user.FullName,
          ContactNo: user.ContactNo,
          Address: user.Address,
          BusinessName: user.BusinessName,
          ServiceArea: user.ServiceArea,
          WasteCategories: user.WasteCategories,
          BankDetails: user.BankDetails,
          profileImg: profileImgBase64,
          email: user.email,
        },
      });
    } catch (err) {
      console.error("Error updating user:", err);
      res.status(500).json({ error: "Failed to update profile" });
    }
  }
);

module.exports = router;
