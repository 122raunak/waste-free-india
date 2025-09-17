import React, { useState, useRef, useEffect, use } from "react";
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
// reduce th esize of img

function EditUser() {
  const [AddressSeggestion, setAddressSeggestion] = useState([]);
  const [ImgData, setImgData] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    FullName: {
      FirstName: "",
      LastName: "",
    },
    ContactNo: "",
    Address: "",
    profileImg: "",
  });

  const [profileImage, setProfileImage] = useState(profile);
  const fileInputRef = useRef(null);
  const panelRef = useRef(null);
  const closeRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "FirstName" || name === "LastName") {
      setFormData((prev) => ({
        ...prev,
        FullName: {
          ...prev.FullName,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("profileImg", ImgData);
    formDataToSend.append("FirstName", formData.FullName.FirstName);
    formDataToSend.append("LastName", formData.FullName.LastName);
    formDataToSend.append("ContactNo", formData.ContactNo);
    formDataToSend.append("Address", formData.Address);

    try {
      navigate("/user/profile");

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/user/profile/edit`,
        formDataToSend,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

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
          `${import.meta.env.VITE_BACKEND_URL}/user/auth/check`,
          {
            withCredentials: true,
          }
        );
        const user = {
          FullName: {
            FirstName: res.data.user.FullName.FirstName,
            LastName: res.data.user.FullName.LastName,
          },
          ContactNo: res.data.user.ContactNo,
          Address: res.data.user.Address,
          profileImg: res.data.user.profileImg,
        };

        setFormData(user);
      } catch (error) {}
    };
    LoggedInuserData();
  }, []);

  useGSAP(() => {
    if (panelOpen) {
      gsap.to(panelRef.current, {
        height: "65%",
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
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
        />
        <div className=" flex gap-2">
          <InputField
            type="text"
            placeholder="First Name"
            name="FirstName"
            value={formData.FullName.FirstName}
            onChange={handleChange}
            className="bg-white border border-gray-300 rounded-lg px-3 py-2 shadow-sm"
          />
          <InputField
            type="text"
            placeholder="Laste Name"
            value={formData.FullName.LastName}
            name="LastName"
            onChange={handleChange}
            className="bg-white border border-gray-300 rounded-lg px-3 py-2 shadow-sm"
          />
        </div>

        <InputField
          type="number"
          placeholder="Contact"
          name="ContactNo"
          value={formData.ContactNo}
          onChange={handleChange}
          className="bg-white/80 border border-gray-300 rounded-lg px-3 py-2 shadow-sm"
          pattern="[0-9]*"
          inputMode="numeric"
        />

        <textarea
          name="Address"
          placeholder="Address"
          value={formData.Address}
          onChange={(e) => {
            handleChange(e);
            handlAddresspChange();
          }}
          rows="3"
          className="w-full bg-white/80 border border-gray-300 rounded-lg px-3 py-2 text-base text-gray-700 shadow-sm resize-none"
          onClick={() => {
            setPanelOpen(true);
          }}
        />

        <Button
          text="Update Details"
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 rounded-full shadow-md transition"
        />
      </form>
      {/* <Navbar /> */}
      <div>
        <div
          ref={panelRef}
          className="bg-white w-full absolute -top-5 left-0 z-444 h-0 overflow-hidden shadow-lg rounded-t-2xl"
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

export default EditUser;
