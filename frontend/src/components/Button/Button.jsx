import React from "react";
import { Link } from "react-router-dom";

const Button = ({ text, onClick, variant = "primary", className = "", link }) => {
  const baseStyle = `h-[48px] flex rounded-lg font-bold text-center items-center justify-center transition duration-200 shadow-md cursor-pointer text-xl sm:text-base md:text-lg`;
  const styles = {
    primary: "bg-[#37B943] text-white hover:bg-[#81e68d]",
    secondary: "bg-white text-gray-700 border hover:bg-gray-100",
  };

  // If `link` is provided, render an <a> instead of a <button>
  if (link) {
    return (
      <Link
        to={link}
        className={`${baseStyle} ${styles[variant]} ${className || "w-full"}`}
      >
        {text}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick} // ✅ use the prop directly
      className={`${baseStyle} ${styles[variant]} ${className || "w-full"}`}
    >
      {text}
    </button>
  );
};

export default Button;

