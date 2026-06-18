import React, { useContext } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Home, MessageCircle, Gamepad2, Recycle, User, List } from "lucide-react";
import { AppContext } from "../../context/AppContext";

const Icons = ({ icon: Icon, title }) => (
  <div className="flex flex-col items-center justify-center gap-0.5 py-1 px-2 min-w-[48px]">
    <Icon size={20} strokeWidth={1.8} />
    <span className="text-[10px] leading-tight font-medium whitespace-nowrap">{title}</span>
  </div>
);

const Navbar = () => {
  const { sellerIon, BuyerIcon } = useContext(AppContext);

  const cls = ({ isActive }) =>
    isActive ? "text-[#41c45a] font-semibold" : "text-gray-500 hover:text-gray-800 transition-colors";

  return (
    <>
      <div className="fixed flex flex-row items-center justify-around w-full h-[60px] bg-white bottom-0 z-[100] border-t border-gray-200 shadow-[0_-2px_8px_rgba(0,0,0,0.06)]">

        {/* Always visible: Home */}
        <NavLink to="/user/home" end className={cls}>
          <Icons icon={Home} title="Home" />
        </NavLink>

        {/* Always visible: Chatbot */}
        <NavLink to="/user/chatbot" end className={cls}>
          <Icons icon={MessageCircle} title="Chat" />
        </NavLink>

        {/* Seller: Sell Waste */}
        {sellerIon && (
          <NavLink to="/user/sellingpage" end className={cls}>
            <Icons icon={Recycle} title="Sell" />
          </NavLink>
        )}

        {/* Seller: My Listings */}
        {sellerIon && (
          <NavLink to="/user/my-listings" end className={cls}>
            <Icons icon={List} title="Listings" />
          </NavLink>
        )}

        {/* Buyer: Browse Waste */}
        {BuyerIcon && (
          <NavLink to="/buyer/listofwaste" end className={cls}>
            <Icons icon={Recycle} title="Browse" />
          </NavLink>
        )}

        {/* Buyer: My Accepted */}
        {BuyerIcon && (
          <NavLink to="/buyer/my-accepted" end className={cls}>
            <Icons icon={List} title="Accepted" />
          </NavLink>
        )}

        {/* Games - only for users */}
        {!BuyerIcon && (
          <NavLink to="/user/game" end className={cls}>
            <Icons icon={Gamepad2} title="Games" />
          </NavLink>
        )}

        {/* Profile */}
        <NavLink to={BuyerIcon ? "/buyer/profile" : "/user/profile"} end className={cls}>
          <Icons icon={User} title="Profile" />
        </NavLink>
      </div>

      {/* Page content with bottom padding so it's not hidden by navbar */}
      <div className="pb-[72px] w-full">
        <Outlet />
      </div>
    </>
  );
};

export default Navbar;