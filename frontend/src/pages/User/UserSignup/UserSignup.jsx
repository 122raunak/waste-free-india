import React, { useContext, useState } from "react";
import Button from "../../../Components/Button/Button";
import { Mail, Lock } from "lucide-react";
import logo from "../../../../public/Logo/logo.png";
import googlelogo from "../../../../public/UserLogin/google-icon.png";
import InputField from "../../../Components/Input/InputField";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../../../context/AppContext";

const UserSignup = () => {
  const { setsellerIon } = useContext(AppContext);

  const navigate = useNavigate();
  const [formData, setfromData] = useState({
    email: "",
    password: "",
    FirstName: "",
    LastName: "",
  });

  const [msg, setmsg] = useState("");
  const [userData, setUserData] = useState({});
  const handleChange = (e) => {
    setfromData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = {
      FullName: {
        FirstName: formData.FirstName,
        LastName: formData.LastName,
      },
      email: formData.email,
      password: formData.password,
    };
    console.log(formData);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/user/auth/register`,
        user,
        {
          withCredentials: true,
        }
      );

      if (res.status == 201) {
        navigate("/user/login");
      }
      setmsg(res.data.message);
    } catch (error) {}
    setfromData({
      email: "",
      password: "",
      FirstName: "",
      LastName: "",
    });
  };
  const handleGoogleRegistration = () => {
    setsellerIon(true);
    window.location.href = `${
      import.meta.env.VITE_BACKEND_URL
    }/user/auth/google`;
  };

  return (
    <>
      {/* Form container */}
      <div className="flex flex-col items-center justify-center z-20 w-full max-w-md px-4 sm:px-6">
        {/* Sign In heading */}
        <h1 className="text-2xl sm:text-xl md:text-4xl font-semibold text-center">
          Sign Up
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-[#6A6A6A] mb-8 text-center">
          Create new account via email
        </p>

        <form onSubmit={handleSubmit}>
          <div className="w-full flex flex-col">
            <div className="flex flex-row w-full justify-between">
              <span className="w-[48%] ">
                <InputField
                  type="text"
                  name="FirstName"
                  placeholder="First Name"
                  value={formData.FirstName}
                  onChange={handleChange}
                />
              </span>
              <span className="w-[48%]">
                <InputField
                  type="text"
                  name="LastName"
                  placeholder="Last Name"
                  value={formData.LastName}
                  onChange={handleChange}
                />
              </span>
            </div>

            <InputField
              type="email"
              placeholder="email"
              name="email"
              icon={<Mail size={20} />}
              value={formData.email}
              onChange={handleChange}
            />
            <InputField
              type="password"
              placeholder="Password"
              name="password"
              icon={<Lock size={20} />}
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <input
            className="bg-[#37B943] text-white px-4 py-3 rounded text-lg font-semibold w-full mb-2"
            type="submit"
            value={"Create account"}
          />
        </form>
        <p className=" text-red-500">{msg}</p>

        {/* Sign In button */}

        {/* Divider */}
        <div className="flex items-center w-full max-w-[350px] my-6">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-3 text-gray-500 text-xs sm:text-sm">
            Sign up with Social Media
          </span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* Google Button */}
        <div
          onClick={handleGoogleRegistration}
          className="bg-white text-black px-4 py-3 rounded  w-full flex justify-center items-center gap-4 border mb-2"
        >
          <img
            src={googlelogo}
            alt="google"
            className="w-6 h-6 sm:w-6 sm:h-6 object-contain"
          />
          <span className="text-xl sm:text-base md:text-lg font-semibold">
            Sign up with Google
          </span>
        </div>

        {/* Signup link */}
        <div className="mt-6 text-xs sm:text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to={"/user/login"}
            className="text-green-600 font-medium hover:underline cursor-pointer"
          >
            Sign In
          </Link>
        </div>
      </div>
    </>
  );
};

export default UserSignup;
