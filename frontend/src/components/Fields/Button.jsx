import React from "react";

const Button = ({ text, onClick, type = "button" , className=""}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={` w-full h-[58px] bg-[#37B943] text-white  rounded-lg shadow-md font-semibold hover:bg-[#81e68d] transition duration-300 ${className}  `}
    >
      {text}
    </button>
  );
};

export default Button;
