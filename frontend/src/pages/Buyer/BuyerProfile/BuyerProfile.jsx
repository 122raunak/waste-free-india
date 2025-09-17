import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function BuyerProfile() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/buyer/profile/edit");
  };

  const [formData, setFormData] = useState({
    FullName: { FirstName: "", LastName: "" },
    email: "",
    ContactNo: "",
    Address: "",
    profileImg: "/Profile/profile.png",
    BusinessName: "",
    WasteCategories: [],
    ServiceArea: "",
    VerificationDocs: [],
    BankDetails: {
      accountNumber: "",
      ifsc: "",
      upiId: "",
    },
  });

  useEffect(() => {
    const fetchLoggedInUserData = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/buyer/auth/check`,
          { withCredentials: true }
        );

        const user = res.data.buyer;
        console.log("User fetched:", user);

        // Convert buffer to base64 if profileImg exists
        let profileImgBase64 = "/Profile/profile.png";
        if (user.profileImg && user.profileImg.data) {
          const binary = new Uint8Array(user.profileImg.data);
          const base64String = btoa(
            binary.reduce((acc, byte) => acc + String.fromCharCode(byte), "")
          );
          profileImgBase64 = `data:image/jpeg;base64,${base64String}`;
        }

        setFormData({
          FullName: {
            FirstName: user.FullName?.FirstName || "",
            LastName: user.FullName?.LastName || "",
          },
          email: user.email || "NA",
          ContactNo: user.ContactNo || "NA",
          BusinessName: user.BusinessName || "NA",
          ServiceArea: user.ServiceArea || "NA",
          Address: user.Address || "NA",
          WasteCategories: user.WasteCategories || [],
          VerificationDocs: user.VerificationDocs || [],
          profileImg: profileImgBase64,
          BankDetails: user.BankDetails || {
            accountNumber: "",
            ifsc: "",
            upiId: "",
          },
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchLoggedInUserData();
  }, []);

  const userData = {
    name:
      `${formData.FullName.FirstName} ${formData.FullName.LastName}`.trim() ||
      "NA",
    email: formData.email,
    contact: formData.ContactNo,
    address: formData.Address,
    profileImg: formData.profileImg,
    BusinessName: formData.BusinessName,
    WasteCategories: formData.WasteCategories,
    ServiceArea: formData.ServiceArea,
    VerificationDocs: formData.VerificationDocs,
    BankDetails: formData.BankDetails,
  };

  return (
    <div className="relative z-[90] h-full mt-[60px] py-10 px-4 flex flex-col items-center w-full mb-10">
      {/* Profile Section */}
      <div className="flex flex-col items-center gap-6 mb-8">
        <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-gray-300 flex items-center justify-center bg-gray-100 shadow-md">
          <img
            src={userData.profileImg}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <button
          onClick={handleClick}
          className="px-10 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-2xl shadow-md transition-all duration-300 transform hover:scale-105"
        >
          Edit
        </button>
      </div>

      {/* Buyer Info */}
      <div className="flex flex-col gap-8 w-full overflow-y-auto max-h-[520px]">
        {/* Basic Info */}
        <div className="w-full max-w-md bg-white shadow-md rounded-xl p-6 space-y-4">
          <div className="flex justify-between items-center gap-4">
            <p className="text-gray-800">
              <span className="font-semibold">Name:</span> {userData.name}
            </p>
            <p className="text-gray-800">
              <span className="font-semibold">Contact:</span>{" "}
              {userData.contact || "Not provided"}
            </p>
          </div>
          <p className="text-gray-800">
            <span className="font-semibold">Email:</span> {userData.email}
          </p>
          <div>
            <span className="font-semibold text-gray-800">Business Name:</span>
            <p className="mt-1 bg-gray-50 p-3 rounded-md text-gray-700 shadow-sm">
              {userData.BusinessName || "Not provided"}
            </p>
          </div>
          <div>
            <span className="font-semibold text-gray-800">Address:</span>
            <p className="mt-1 bg-gray-50 p-3 rounded-md text-gray-700 shadow-sm">
              {userData.address || "Not provided"}
            </p>
          </div>
        </div>

        {/* Waste & Service Info */}
        <div className="w-full max-w-md bg-white shadow-md rounded-xl p-6 space-y-4">
          <div>
            <span className="font-semibold text-gray-800">
              Waste Categories:
            </span>
            <ul className="mt-2 list-disc list-inside text-gray-700">
              {userData.WasteCategories?.length > 0 ? (
                userData.WasteCategories.map((cat, i) => <li key={i}>{cat}</li>)
              ) : (
                <p className="text-gray-500">No categories specified</p>
              )}
            </ul>
          </div>
          <div>
            <span className="font-semibold text-gray-800">Service Area:</span>
            <p className="mt-1 bg-gray-50 p-3 rounded-md text-gray-700 shadow-sm">
              {userData.ServiceArea || "Not provided"}
            </p>
          </div>
        </div>

        {/* Bank Details */}
        <div className="w-full max-w-md bg-white shadow-md rounded-xl p-6 space-y-4">
          <span className="font-semibold text-gray-800">Bank Details:</span>
          <p className="text-gray-700">
            <span className="font-medium">Account No:</span>{" "}
            {userData.BankDetails?.accountNumber || "Not provided"}
          </p>
          <p className="text-gray-700">
            <span className="font-medium">IFSC:</span>{" "}
            {userData.BankDetails?.ifsc || "Not provided"}
          </p>
          <p className="text-gray-700">
            <span className="font-medium">UPI ID:</span>{" "}
            {userData.BankDetails?.upiId || "Not provided"}
          </p>
        </div>

        {/* Verification Docs */}
        <div className="w-full max-w-md bg-white shadow-md rounded-xl p-6 space-y-4">
          <span className="font-semibold text-gray-800">
            Verification Docs:
          </span>
          <ul className="mt-2 list-disc list-inside text-gray-700">
            {userData.VerificationDocs?.length > 0 ? (
              userData.VerificationDocs.map((doc, i) => <li key={i}>{doc}</li>)
            ) : (
              <p className="text-gray-500">No documents uploaded</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default BuyerProfile;
