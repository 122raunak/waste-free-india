import React, { useContext, useEffect } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import Icons from "./Icons";
import { Home, MessageCircle, Gamepad2, Recycle, User } from "lucide-react";
import { AppContext } from "../../context/AppContext";

const Navbar = () => {
  const getLinkClasses = (isActive) =>
    isActive ? "text-[#81E68D] font-semibold" : "text-black";

  const { sellerIon, BuyerIcon } = useContext(AppContext);

  useEffect(() => {
    console.log("form lgoin page", sellerIon);
    if (sellerIon) {
      localStorage.setItem("sellerIon", sellerIon);
    }
  }, []);
  useEffect(() => {
    console.log("form lgoin page BuyerIcon", BuyerIcon);
    if (BuyerIcon) {
      localStorage.setItem("BuyerIcon", BuyerIcon);
    }
  }, []);

  const localData = localStorage.getItem("sellerIon");
  console.log("value of localdata", localData);
  const localData2 = localStorage.getItem("BuyerIcon");
  console.log("value of localdata", localData2);

  return (
    <>
      <div className="fixed flex flex-row items-center justify-around w-full h-[64px] bg-white bottom-0 z-[50] border-t">
        <NavLink
          to="/user/home"
          end
          className={({ isActive }) => getLinkClasses(isActive)}
        >
          <Icons icon={Home} title="Home" />
        </NavLink>

        <NavLink
          to="/user/chatbot"
          end
          className={({ isActive }) => getLinkClasses(isActive)}
        >
          <Icons icon={MessageCircle} title="Chat Bot" />
        </NavLink>

        <NavLink
          to="/user/game"
          end
          className={({ isActive }) => getLinkClasses(isActive)}
        >
          <Icons icon={Gamepad2} title="Games" />
        </NavLink>

        <div className={`${localData ? "block" : "hidden"}`}>
          <NavLink
            end
            to="/user/sellingpage"
            className={({ isActive }) => getLinkClasses(isActive)}
          >
            <Icons icon={Recycle} title="Sell Waste" />
          </NavLink>
        </div>

        <div className={`${localData2 ? "block" : "hidden"}`}>
          <NavLink
            end
            to="/user/sellingpage"
            className={({ isActive }) => getLinkClasses(isActive)}
          >
            <Icons icon={Recycle} title="Buy Waste" />
          </NavLink>
        </div>

        <NavLink
          to={`/${localData2 ? "buyer" : "user"}/profile`}
          end
          className={({ isActive }) => getLinkClasses(isActive)}
        >
          <Icons icon={User} title="Profile" />
        </NavLink>
      </div>
      <Outlet />
    </>
  );
};

export default Navbar;
