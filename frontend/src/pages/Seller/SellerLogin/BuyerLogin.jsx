import React, { useContext, useEffect, useState } from "react";
import Button from "../../../Components/Button/Button";
import { Mail, Lock } from "lucide-react";
import logo from "../../../../public/Logo/logo.png";
import googlelogo from "../../../../public/UserLogin/google-icon.png";
import InputField from "../../../Components/Input/InputField";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../../../context/AppContext";

const BuyerLogin = () => {
  const { BuyerIcon, setBuyerIcon } = useContext(AppContext);

  useEffect(() => {
    console.log("form login page", BuyerIcon);
    localStorage.setItem("BuyerIcon", BuyerIcon);
  }, []);

  const [msg, setmsg] = useState("");

  const navigate = useNavigate();
  const [formData, setfromData] = useState({
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    setfromData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = {
      email: formData.email,
      password: formData.password,
    };
    console.log(formData);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/buyer/auth/login`,
        user,
        {
          withCredentials: true,
        }
      );
      console.log(res);

      if (res.status == 201) {
        console.log(" Login successful, redirecting...");
        setBuyerIcon(true);
        navigate("/buyer/profile");
      }
      setmsg(res.data.message);
    } catch (error) {}
    setfromData({
      email: "",
      password: "",
    });
  };

  return (
    <>
      {/* Form container */}
      <div className="flex flex-col items-center justify-center z-20 w-full max-w-md px-4 sm:px-6">
        {/* Sign In heading */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-center">
          Sign In
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-[#6A6A6A] mb-8 text-center">
          Sign in to your account via email
        </p>

        {/* Inputs */}
        <form onSubmit={handleSubmit} className=" w-full">
          <InputField
            type="email"
            name="email"
            placeholder="Email"
            icon={<Mail size={20} />}
            value={formData.email}
            onChange={handleChange}
          />
          <InputField
            type="password"
            name="password"
            placeholder="Password"
            icon={<Lock size={20} />}
            value={formData.password}
            onChange={handleChange}
          />
          <input
            className="bg-[#2196F3] text-white px-4 py-3 rounded text-lg font-semibold w-full mb-2"
            type="submit"
            value={"Login - WasteFreeIndia Partner"}
          />
        </form>
        <p className="text-red-500">{msg}</p>
        {/* Sign In button */}

        {/* Divider */}
        <div className="flex items-center w-full max-w-[350px] my-6">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-3 text-gray-500 text-xs sm:text-sm">
            Sign in with Social Media
          </span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* Google Button */}
        <div className="bg-white text-black px-4 py-3 rounded  w-full flex justify-center items-center gap-4 border mb-2">
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
          Don’t have an account?{" "}
          <Link
            to="/buyer/signup"
            className="text-[#2196F3] font-medium hover:underline cursor-pointer"
          >
            Create one
          </Link>
        </div>
      </div>
    </>
  );
};

export default BuyerLogin;
