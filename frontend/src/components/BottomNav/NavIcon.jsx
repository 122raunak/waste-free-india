import React from "react";
import { Link, NavLink } from "react-router-dom";

const NavIcon = ({ icon: IconComponent, text, to, isActive = false }) => {
  const activeClass = isActive ? "text-green-600" : "text-gray-600";

  return (
    <NavLink to={to} className={`flex flex-col items-center ${activeClass}`}>
      <IconComponent className="h-6 w-6" />
      <span className="text-xs">{text}</span>
    </NavLink>
  );
};

export default NavIcon;
