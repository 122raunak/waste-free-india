import React, { useState } from "react";
import Button from "../../../Components/Button/Button";
import { Mail, Lock } from "lucide-react"; 
import logo from "../../../../public/Logo/logo.png";
import googlelogo from "../../../../public/UserLogin/google-icon.png"
import InputField from "../../../Components/Input/InputField";
import { Link } from "react-router-dom";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  return (
    <>

      
      {/* Form container */}
<div className="flex flex-col items-center justify-center z-20 w-full max-w-md px-4 sm:px-6">
  {/* Sign In heading */}
  <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-center">Sign In</h1>
  <p className="text-sm sm:text-base md:text-lg text-[#6A6A6A] mb-8 text-center">
    Sign in to your account via email
  </p>

  {/* Inputs */}
  <InputField 
    type="email" 
    placeholder="Email" 
    icon={<Mail size={20} />} 
    value={email}
    onChange={handleEmailChange}
  />
  <InputField 
    type="password" 
    placeholder="Password" 
    icon={<Lock size={20} />} 
    value={password}
    onChange={handlePasswordChange}
  />

  {/* Sign In button */}
  <Button text="Sign In" className="w-full max-w-[350px] mt-3" />

  {/* Divider */}
  <div className="flex items-center w-full max-w-[350px] my-6">
    <div className="flex-grow border-t border-gray-300"></div>
    <span className="mx-3 text-gray-500 text-xs sm:text-sm">
      Sign in with Social Media
    </span>
    <div className="flex-grow border-t border-gray-300"></div>
  </div>

  {/* Google Button */}
  <div className="w-full max-w-[350px] h-[48px] bg-white text-black rounded-lg border flex items-center justify-center gap-3 px-4 py-3 sm:py-4 cursor-pointer hover:shadow-md transition">
    <img src={googlelogo} alt="google" className="w-6 h-6 sm:w-6 sm:h-6 object-contain" />
    <span className="text-xl sm:text-base md:text-lg font-medium">
      Sign in with Google
    </span>
  </div>

  {/* Signup link */}
  <div className="mt-6 text-xs sm:text-sm text-gray-600">
    Don’t have an account?{" "}
    <Link 
      to="/seller/signup" 
      className="text-green-600 font-medium hover:underline cursor-pointer"
    >
      Create one
    </Link>
  </div>
</div>
      
    </>
  );
};

export default UserLogin;