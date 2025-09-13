import React, { useRef } from "react";

const InputField = ({ type, placeholder, icon, value, onChange, name }) => {
  const inputRef = useRef(null);

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div
      className="flex items-center border rounded-lg bg-white shadow-sm mb-4 w-full h-[48px] cursor-text px-3"
      onClick={handleClick}
    >
      {/* Icon wrapper with fixed width */}
      {icon && (
        <span className="text-gray-500 w-6 flex justify-center mr-3">
          {icon}
        </span>
      )}

      {/* Input */}
      <input
        ref={inputRef}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        name={name}
        required
        className={`px-4 py-3 rounded  w-full text-base text-gray-700 bg-transparent outline-none overflow-hidden placeholder:text-gray-400 `}
      />
    </div>
  );
};

export default InputField;
