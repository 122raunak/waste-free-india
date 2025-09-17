import React, { useState, useRef, useEffect } from "react";
import profile from "../../../../public/Profile/profile.png";
import InputField from "../../../components/Fields/InputField.jsx";
import Button from "../../../components/Fields/Button.jsx";
import Navbar from "../../../Components/Navbar/Navbar.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import imageCompression from "browser-image-compression";
import LocationSearchpanel from "../../..//components/SearchPanal/LocationSearchpanel";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

function EditBuyer() {
  const [AddressSeggestion, setAddressSeggestion] = useState([]);
  const [ImgData, setImgData] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    FullName: {
      FirstName: "",
      LastName: "",
    },
    email: "",
    ContactNo: "",
    BusinessName: "",
    Address: "",
    WasteCategories: [],
    ServiceArea: "",
    BankDetails: {
      accountNumber: "",
      ifsc: "",
      upiId: "",
    },
    VerificationDocs: [],
    profileImg: "",
  });

  const [profileImage, setProfileImage] = useState(profile);
  const fileInputRef = useRef(null);
  const panelRef = useRef(null);
  const closeRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "FullName.FirstName" || name === "FullName.LastName") {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        FullName: {
          ...prev.FullName,
          [field]: value,
        },
      }));
    } else if (name.startsWith("BankDetails.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        BankDetails: {
          ...prev.BankDetails,
          [field]: value,
        },
      }));
    } else if (name === "WasteCategories") {
      setFormData((prev) => ({
        ...prev,
        WasteCategories: checked
          ? [...(prev.WasteCategories || []), value]
          : prev.WasteCategories.filter((cat) => cat !== value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      VerificationDocs: files,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();

      formDataToSend.append("FullName[FirstName]", formData.FullName.FirstName);
      formDataToSend.append("FullName[LastName]", formData.FullName.LastName);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("ContactNo", formData.ContactNo);
      formDataToSend.append("BusinessName", formData.BusinessName);
      formDataToSend.append("Address", formData.Address);
      formDataToSend.append("ServiceArea", formData.ServiceArea);

      formDataToSend.append(
        "BankDetails[accountNumber]",
        formData.BankDetails.accountNumber
      );
      formDataToSend.append("BankDetails[ifsc]", formData.BankDetails.ifsc);
      formDataToSend.append("BankDetails[upiId]", formData.BankDetails.upiId);

      formData.WasteCategories.forEach((cat) => {
        formDataToSend.append("WasteCategories[]", cat);
      });

      formData.VerificationDocs.forEach((doc) => {
        formDataToSend.append("VerificationDocs", doc);
      });

      if (formData.profileImgFile) {
        formDataToSend.append("profileImg", formData.profileImgFile);
      }

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/buyer/profile/edit`,
        formDataToSend,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("Updated successfully:", res.data);
      if (res.status == 200) {
        navigate("/buyer/profile");
      }
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const compressed = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 800,
      });
      const imageUrl = URL.createObjectURL(compressed);
      setProfileImage(imageUrl);
      setImgData(compressed);
    }
  };

  useEffect(() => {
    const LoggedInuserData = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/buyer/auth/check`,
          {
            withCredentials: true,
          }
        );

        const buyer = res.data.buyer;
        let profileImgBase64 = "/Profile/profile.png";
        if (buyer.profileImg && buyer.profileImg.data) {
          const binary = new Uint8Array(buyer.profileImg.data);
          const base64String = btoa(
            binary.reduce((acc, byte) => acc + String.fromCharCode(byte), "")
          );
          profileImgBase64 = `data:image/jpeg;base64,${base64String}`;
        }

        setFormData({
          FullName: {
            FirstName: buyer.FullName.FirstName,
            LastName: buyer.FullName.LastName,
          },
          email: buyer.email,
          ContactNo: buyer.ContactNo,
          BusinessName: buyer.BusinessName || "",
          Address: buyer.Address,
          WasteCategories: buyer.WasteCategories || [],
          ServiceArea: buyer.ServiceArea || "",
          BankDetails: buyer.BankDetails || {
            accountNumber: "",
            ifsc: "",
            upiId: "",
          },
          VerificationDocs: [],
          profileImg: profileImgBase64,
        });

        if (buyer.profileImg) {
          setProfileImage(profileImgBase64);
        }
      } catch (error) {
        console.error(error);
      }
    };
    LoggedInuserData();
  }, []);

  useGSAP(() => {
    if (panelOpen) {
      gsap.to(panelRef.current, {
        height: "43%",
        padding: 24,
      });
      gsap.to(closeRef.current, {
        opacity: 1,
      });
    } else {
      gsap.to(panelRef.current, {
        height: "0%",
        padding: 0,
      });
      gsap.to(closeRef.current, {
        opacity: 0,
      });
    }
  }, [panelOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target) &&
        e.target.name !== "Address"
      ) {
        setPanelOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handlAddresspChange = async (e) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/map/get-suggestion`,
        {
          params: { query: formData.Address },
          withCredentials: true,
        }
      );
      console.log(res.data.predictions);

      setAddressSeggestion(res.data.predictions);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full max-h-[800px] flex flex-col items-center px-6 py-10 mt-20">
      {/* Profile Picture */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-green-500 shadow-md">
          <img
            src={profileImage}
            alt="profile"
            className="w-full h-full object-cover"
          />
        </div>

        <p
          className="text-blue-600 text-sm mt-2 cursor-pointer hover:underline"
          onClick={handleImageClick}
        >
          Edit picture
        </p>
      </div>

      {/* Title */}
      <h2 className="font-semibold text-lg mb-4 w-full text-left text-gray-800">
        Edit Your Details
      </h2>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-full gap-4 max-h-[600px] mb-10 overflow-y-auto"
      >
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
        />

        {/* Name */}
        <div className="flex gap-2">
          <InputField
            type="text"
            placeholder="First Name"
            name="FullName.FirstName"
            value={formData.FullName?.FirstName || ""}
            onChange={handleChange}
            className="bg-white border border-gray-300 rounded-lg px-3 py-2 shadow-sm"
          />
          <InputField
            type="text"
            placeholder="Last Name"
            name="FullName.LastName"
            value={formData.FullName?.LastName || ""}
            onChange={handleChange}
            className="bg-white border border-gray-300 rounded-lg px-3 py-2 shadow-sm"
          />
        </div>

        {/* Email (read-only) */}
        <InputField
          type="email"
          placeholder="Email"
          name="email"
          value={formData.email}
          disabled
          className="bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 shadow-sm cursor-not-allowed"
        />

        {/* Contact */}
        <InputField
          type="tel"
          placeholder="Contact Number"
          name="ContactNo"
          value={formData.ContactNo}
          onChange={handleChange}
          className="bg-white border border-gray-300 rounded-lg px-3 py-2 shadow-sm"
          pattern="[0-9]*"
          inputMode="numeric"
        />

        {/* Business Name */}
        <InputField
          type="text"
          placeholder="Business Name"
          name="BusinessName"
          value={formData.BusinessName}
          onChange={handleChange}
          className="bg-white border border-gray-300 rounded-lg px-3 py-2 shadow-sm"
        />

        {/* Address */}
        <textarea
          name="Address"
          placeholder="Address"
          value={formData.Address}
          onChange={(e) => {
            handleChange(e);
            handlAddresspChange();
          }}
          rows="3"
          className="w-full min-h-20 bg-white border border-gray-300 rounded-lg px-3 py-2 text-base text-gray-700 shadow-sm resize-none"
          onClick={() => setPanelOpen(true)}
        />

        {/* Waste Categories */}
        <div>
          <p className="font-semibold text-gray-700 mb-2">Waste Categories</p>
          <div className="flex flex-wrap gap-2">
            {["Paper", "Plastic", "Metal", "E-waste"].map((cat) => (
              <label
                key={cat}
                className="flex items-center gap-2 px-3 py-1 border rounded-lg cursor-pointer bg-gray-50"
              >
                <input
                  type="checkbox"
                  name="WasteCategories"
                  value={cat}
                  checked={formData.WasteCategories?.includes(cat)}
                  onChange={handleChange}
                />
                {cat}
              </label>
            ))}
          </div>
        </div>

        {/* Service Area */}
        <InputField
          type="text"
          placeholder="Service Area"
          name="ServiceArea"
          value={formData.ServiceArea}
          onChange={handleChange}
          className="bg-white border border-gray-300 rounded-lg px-3 py-2 shadow-sm"
        />

        {/* Bank Details */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm space-y-3">
          <p className="font-semibold text-gray-700">Bank Details</p>
          <InputField
            type="text"
            placeholder="Account Number"
            name="BankDetails.accountNumber"
            value={formData.BankDetails?.accountNumber || ""}
            onChange={handleChange}
            className="bg-white border border-gray-300 rounded-lg px-3 py-2 shadow-sm"
          />
          <InputField
            type="text"
            placeholder="IFSC Code"
            name="BankDetails.ifsc"
            value={formData.BankDetails?.ifsc || ""}
            onChange={handleChange}
            className="bg-white border border-gray-300 rounded-lg px-3 py-2 shadow-sm"
          />
          <InputField
            type="text"
            placeholder="UPI ID"
            name="BankDetails.upiId"
            value={formData.BankDetails?.upiId || ""}
            onChange={handleChange}
            className="bg-white border border-gray-300 rounded-lg px-3 py-2 shadow-sm"
          />
        </div>

        {/* Verification Docs */}
        <div>
          <p className="font-semibold text-gray-700 mb-2">
            Verification Documents
          </p>
          {/* <input
            type="file"
            multiple
            accept="image/*,.pdf"
            name="VerificationDocs"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-600"
          /> */}
        </div>

        <Button
          text="Update Details"
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 rounded-full shadow-md transition"
        />
      </form>

      <div>
        <div
          ref={panelRef}
          className="bg-white w-full absolute top-40 left-0 z-444 h-0 overflow-hidden shadow-lg rounded-t-2xl"
        >
          <LocationSearchpanel
            AddressSeggestion={AddressSeggestion}
            setFormData={setFormData}
            setPanelOpen={setPanelOpen}
          />
        </div>
      </div>
    </div>
  );
}

export default EditBuyer;
