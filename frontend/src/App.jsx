import React from "react";
import { Route, Routes } from "react-router-dom";

import Start from "./pages/Start/Start";
import Home from "./pages/Home/Home";

import UserLogin from "./pages/User/UserLogin/UserLogin";
import UserSignup from "./pages/User/UserSignup/UserSignup";
import SellingPage from "./pages/User/Selling page/SellingPage";
import Chatbot from "./pages/Chatbot/Chatbot";
import logo from "../public/Logo/logoAnimation.gif"; // adjust path if needed
import logoimg from "../public/Logo/logo.png"; // adjust path if needed
import SelectionPage from "./pages/Selection/SelectionPage";
import Games from "./pages/User/Games/Games";
import UserProfile from "./pages/User/UserProfile/UserProfile";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Logout from "./pages/User/LogOut/Logout";
import Navbar from "./components/Navbar/Navbar";
import BuyerLogin from "./pages/Buyer/BuyerLogin/BuyerLogin";
import BuyerSignup from "./pages/Buyer/BuyerSignup/BuyerSignup";
import BuyerLogout from "./pages/Buyer/Logout/Logout";
import { Video } from "lucide-react";
import BuyerProfile from "./pages/Buyer/BuyerProfile/BuyerProfile";

// yaha changes karne hai
import EditUser from "./pages/User/UserProfile/EditUser";
import ListOfWaste from "./pages/Buyer/BuyScrap/ListOfWaste";
import WasteDescription from "./pages/Buyer/BuyScrap/WasteDescription";
import BuyerConfirm from "./pages/Buyer/BuyerConfirm/BuyerConfirm";
import Sell from "./pages/User/SellScrap/Sell";
import Found from "./pages/Buyer/SellerFound/Found";
import EditBuyer from "./pages/Buyer/BuyerProfile/EditBuyer";

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
        <div className=" fixed top-6 right-6 z-311  ">
          <img
            src={logoimg}
            alt="logo"
            className="w-25 sm:w-20 md:w-24 h-auto"
          />
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

            {/* yaha se routes change karne hai */}

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
              <Route
                path="profile/edit"
                element={
                  <ProtectedRoute>
                    <EditUser />
                  </ProtectedRoute>
                }
              />
              <Route
                path="sellingpage/sellscrap"
                element={
                  <ProtectedRoute>
                    <Sell />
                  </ProtectedRoute>
                }
              />
            </Route>
            {/*  nested routes for buyer /buyer/profile */}
            <Route path="/buyer" element={<Navbar />}>
              <Route path="profile" element={<BuyerProfile />} />
              <Route path="profile/edit" element={<EditBuyer />} />
              <Route path="logout" element={<BuyerLogout />} />
              <Route path="listofwaste" element={<ListOfWaste />} />
              <Route path="listofwaste/:id" element={<WasteDescription />} />
              <Route
                path="listofwaste/:id/confirm"
                element={<BuyerConfirm />}
              />
              <Route path="listofwaste/:id/found" element={<Found />} />
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
