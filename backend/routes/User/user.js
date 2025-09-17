const express = require("express");
const UserModel = require("../../models/UserModel");
const { isLoggedInUser } = require("../../middlewares/isLoggedIn");
const upload = require("../../Uploads/multer-config");
const router = express.Router();

router.get("/profile/edit", isLoggedInUser, async (req, res) => {
  const user = req.user;
  res.status(200).json({ user });
});

router.post(
  "/profile/edit",
  upload.single("profileImg"),
  isLoggedInUser,
  async (req, res) => {
    try {
      // Extract text fields from formData
      const { FirstName, LastName, ContactNo, Address } = req.body;

      // Build update object
      const updateData = {
        FullName: { FirstName, LastName },
        ContactNo,
        Address,
      };

      // If file uploaded, store as Buffer
      if (req.file) {
        updateData.profileImg = req.file.buffer;
      }

      // Update user in MongoDB
      const user = await UserModel.findOneAndUpdate(
        { email: req.user.email },
        { $set: updateData },
        { new: true, runValidators: true }
      );

      // Convert image buffer to base64 for frontend display
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
