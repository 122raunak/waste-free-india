import React from "react";
import { Route, Routes } from "react-router-dom";

import Start from "./pages/Start/Start";
import Home from "./pages/Home/Home";

import UserLogin from "./pages/User/UserLogin/UserLogin";
import UserSignup from "./pages/User/UserSignup/UserSignup";
import SellingPage from "./pages/Selling page/SellingPage";
import Chatbot from "./pages/Chatbot/Chatbot";
import logo from "../public/Logo/logo.png"; // adjust path if needed
import SelectionPage from "./pages/Selection/SelectionPage";
import Games from "./pages/User/Games/Games";
import UserProfile from "./pages/User/UserProfile/UserProfile";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Logout from "./pages/User/LogOut/Logout";
import Navbar from "./components/Navbar/Navbar";
import BuyerLogin from "./pages/Seller/SellerLogin/BuyerLogin";
import BuyerSignup from "./pages/Seller/SellerSignup/BuyerSignup";
import BuyerProfile from "./pages/Seller/Profile/Profile";
import BuyerLogout from "./pages/Seller/Logout/Logout";

function App() {
  return (
    <>
      <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-[#eeeeee] relative overflow-hidden ">
        {/* top circles */}
        <div className=" fixed top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-[-16px] left-[-75px] bg-[#B8EBBE] w-[200px] h-[200px] rounded-full z-[10]" />
          <div className="absolute top-[-74px] left-[15px] bg-[#81E68D] w-[200px] h-[200px] rounded-full opacity-40 z-[20]" />
        </div>

        {/* logo */}
        <div className="absolute top-6 right-6 z-31 ">
          <img src={logo} alt="logo" className="w-25 sm:w-20 md:w-24 h-auto" />
        </div>

        {/* Routes in center */}
        <div className="relative w-full h-full flex flex-col justify-center items-center">
          <Routes>
            {/* public */}
            <Route path="/" element={<Start />} />
            <Route path="/user/login" element={<UserLogin />} />
            <Route path="/user/signup" element={<UserSignup />} />
            <Route path="/buyer/login" element={<BuyerLogin />} />
            <Route path="/buyer/signup" element={<BuyerSignup />} />

            {/* nested rotes with /user/roouteName */}
            <Route path="/user" element={<Navbar />}>
              <Route path="home" element={<Home />} />{" "}
              <Route
                path="sellingpage"
                element={
                  <ProtectedRoute>
                    <SellingPage />
                  </ProtectedRoute>
                }
              />
              <Route path="chatbot" element={<Chatbot />} />
              <Route path="selection" element={<SelectionPage />} />
              <Route path="game" element={<Games />} />
              <Route path="logout" element={<Logout />} />
              <Route
                path="profile"
                element={
                  <ProtectedRoute>
                    <UserProfile />
                  </ProtectedRoute>
                }
              />
            </Route>
            {/*  nested routes for buyer /buyer/profile */}
            <Route path="/buyer" element={<Navbar />}>
              <Route path="profile" element={<BuyerProfile />} />
              <Route path="logout" element={<BuyerLogout />} />
            </Route>
          </Routes>
        </div>

        {/* bottom circles */}
        <div className=" fixed top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute bottom-[-30px] right-[-75px] bg-[#B8EBBE] w-[200px] h-[200px] rounded-full z-[10]" />
          <div className="absolute bottom-[-92px] right-[2px] bg-[#81E68D] w-[200px] h-[200px] rounded-full opacity-40 z-[20]" />
        </div>
      </div>
    </>
  );
}

export default App;
