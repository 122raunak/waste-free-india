import React from "react";

const InputField = ({ type = "text", placeholder, value, onChange, name }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
      name={name}
      required
    />
  );
};

export default InputField;
