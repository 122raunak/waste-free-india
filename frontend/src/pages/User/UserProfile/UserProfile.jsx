import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/Navbar/Navbar";
import Button from "../../../components/Button/Button";
import axios from "axios";
import HamberMenu from "./HamberMenu";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

function UserProfile() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/user/profile/edit");
  };

  const [formData, setFormData] = useState({
    FullName: { FirstName: "", LastName: "" },
    email: "",
    contact: "",
    address: "",
    profileImg: "/Profile/profile.png",
  });

  useEffect(() => {
    const fetchLoggedInUserData = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/user/auth/check`,
          { withCredentials: true }
        );

        const user = res.data.user;

        // Convert buffer to base64 string if profileImg exists
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
          contact: user.ContactNo || "NA",
          address: user.Address || "NA",
          profileImg: profileImgBase64,
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
    contact: formData.contact,
    address: formData.address,
    profileImg: formData.profileImg,
  };

  const menuref = useRef(null);
  const [menuOpen, setmenuOpen] = useState(false);

  useGSAP(() => {
    if (menuOpen) {
      gsap.to(menuref.current, {
        x: 0,
        duration: 0.6,
        ease: "power3.out",
      });
    } else {
      gsap.to(menuref.current, {
        x: 300,
        duration: 0.6,
        ease: "power3.out",
      });
    }
  }, [menuOpen]);

  return (
    <>
      <div className="relative z-[90] h-full mt-[20px]   py-10 px-4 flex flex-col items-center">
        <div
          className="text-4xl absolute right-8 -top-15 z-10"
          onClick={() => {
            setmenuOpen(!menuOpen);
          }}
        >
          <i
            className={`fa-solid fa-bars transition-transform duration-300 ease-in-out ${
              menuOpen ? "rotate-90" : ""
            }`}
          />
        </div>
        <div
          className=" absolute right-0 -top-20 translate-x-[300px]"
          ref={menuref}
        >
          <HamberMenu />
        </div>

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

        <div className=" flex flex-col gap-8">
          <div className="w-full max-w-md bg-white shadow-md rounded-xl p-6 space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-gray-800">
                <span className="font-semibold">Name:</span> {userData.name}
              </p>
              <p className="text-gray-800">
                <span className="font-semibold">Contact:</span>{" "}
                {userData.contact}
              </p>
            </div>
            <p className="text-gray-800">
              <span className="font-semibold">Email:</span> {userData.email}
            </p>
            <div>
              <span className="font-semibold text-gray-800">Address:</span>
              <p className="mt-1 bg-gray-50 p-3 rounded-md text-gray-700 shadow-sm">
                {userData.address}
              </p>
            </div>
          </div>

          <div className="w-full max-w-md bg-white shadow-md rounded-xl p-6 text-center space-y-2">
            <p className="font-medium text-gray-800">
              You haven't listed any waste material for sale yet
            </p>
            {/* bad me work krna hai ispe */}
            {/* <p className="text-sm text-gray-600">
            Once a buyer has been found, we will notify you via message. You can
            also check the status directly on our web app.
          </p> */}
          </div>
        </div>

        {/* <div className="mt-4">
          <Button
            text="Log Out"
            className="bg-red-600 hover:bg-red-700 w-40 rounded-lg shadow-md transition-transform duration-200 hover:scale-105"
            link="/user/logout"
          />
        </div> */}
      </div>
    </>
  );
}

export default UserProfile;
