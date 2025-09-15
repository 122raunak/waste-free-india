import React, { useState, useRef } from "react";
import profile from "../../../../public/Profile/profile.png";
import InputField from "../../../components/Fields/InputField.jsx";
import Button from "../../../components/Fields/Button.jsx";
import Navbar from "../../../Components/Navbar/Navbar.jsx";

function EditUser() {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    address: "",
  });

  const [profileImage, setProfileImage] = useState(profile);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated details:", formData);
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  return (
    <div className="w-full flex flex-col items-center px-6 py-10">
      {/* Profile Picture */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-green-500 shadow-md">
          <img
            src={profileImage}
            alt="profile"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Hidden file input */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
        />

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
      <form onSubmit={handleSubmit} className="flex flex-col w-full gap-4">
        <InputField
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="bg-white/80 border border-gray-300 rounded-lg px-3 py-2 shadow-sm"
        />

        <InputField
          type="number"
          placeholder="Contact"
          value={formData.contact}
          onChange={(e) =>
            setFormData({ ...formData, contact: e.target.value })
          }
          className="bg-white/80 border border-gray-300 rounded-lg px-3 py-2 shadow-sm"
        />

        <textarea
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          rows="3"
          className="w-full bg-white/80 border border-gray-300 rounded-lg px-3 py-2 text-base text-gray-700 shadow-sm resize-none"
        />

        <Button
          text="Update Details"
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 rounded-full shadow-md transition"
        />
      </form>
      <Navbar/>
    </div>
  );
}

export default EditUser;

