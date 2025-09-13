import React from "react";
import { Home, MessageCircle, Gamepad2, Recycle, User } from "lucide-react";
import NavIcon from "./NavIcon";

function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-md z-50">
      <div className="flex justify-around items-center h-16">
        <NavIcon icon={Home} text="Home" to="/home" isActive={true} />
        <NavIcon icon={MessageCircle} text="Chat Bot" to="/chatbot" />
        <NavIcon icon={Gamepad2} text="Games" to="/user/game" />
        <NavIcon icon={Recycle} text="Shop" to="/shop" />
        <NavIcon icon={User} text="Profile" to="/user/profile" />
      </div>
    </nav>
  );
}

export default BottomNav;
