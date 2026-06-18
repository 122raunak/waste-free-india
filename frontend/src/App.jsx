import React from "react";
import { Route, Routes } from "react-router-dom";

// Public pages
import Start from "./pages/Start/Start";
import Home from "./pages/Home/Home";
import SelectionPage from "./pages/Selection/SelectionPage";

// User auth
import UserLogin from "./pages/User/UserLogin/UserLogin";
import UserSignup from "./pages/User/UserSignup/UserSignup";

// Buyer auth
import BuyerLogin from "./pages/Buyer/BuyerLogin/BuyerLogin";
import BuyerSignup from "./pages/Buyer/BuyerSignup/BuyerSignup";

// User pages
import SellingPage from "./pages/User/Selling page/SellingPage";
import Sell from "./pages/User/SellScrap/Sell";
import MyListings from "./pages/User/MyListings/MyListings";
import UserProfile from "./pages/User/UserProfile/UserProfile";
import EditUser from "./pages/User/UserProfile/EditUser";
import Games from "./pages/User/Games/Games";
import RecyclingPonts from "./pages/User/recycling/RecyclingPonts";
import RecyclingWaste from "./pages/User/recycling/RecyclingWaste";
import LeaderBord from "./pages/User/LeaderBord/LeaderBord";
import Logout from "./pages/User/LogOut/Logout";

// Buyer pages
import ListOfWaste from "./pages/Buyer/BuyScrap/ListOfWaste";
import WasteDescription from "./pages/Buyer/BuyScrap/WasteDescription";
import BuyerConfirm from "./pages/Buyer/BuyerConfirm/BuyerConfirm";
import Found from "./pages/Buyer/SellerFound/Found";
import MyAccepted from "./pages/Buyer/MyAccepted/MyAccepted";
import BuyerProfile from "./pages/Buyer/BuyerProfile/BuyerProfile";
import EditBuyer from "./pages/Buyer/BuyerProfile/EditBuyer";
import BuyerLogout from "./pages/Buyer/Logout/Logout";

// Shared
import Chatbot from "./pages/Chatbot/Chatbot";
import Shop from "./pages/Shop/Shop";
import Navbar from "./components/Navbar/Navbar";
import ProtectedRoute, { ProtectedBuyerRoute } from "./components/ProtectedRoute/ProtectedRoute";

function App() {
  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-[#eeeeee] relative overflow-hidden">
      {/* Decorative circles */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-16px] left-[-75px] bg-[#B8EBBE] w-[200px] h-[200px] rounded-full z-[10]" />
        <div className="absolute top-[-74px] left-[15px] bg-[#81E68D] w-[200px] h-[200px] rounded-full opacity-40 z-[20]" />
        <div className="absolute bottom-[-30px] right-[-75px] bg-[#B8EBBE] w-[200px] h-[200px] rounded-full z-[10]" />
        <div className="absolute bottom-[-92px] right-[2px] bg-[#81E68D] w-[200px] h-[200px] rounded-full opacity-40 z-[10]" />
      </div>

      <div className="relative w-full h-full flex flex-col justify-center items-center z-30">
        <Routes>
          {/* ── Public ──────────────────────────────────────── */}
          <Route path="/" element={<Start />} />
          <Route path="/user/login" element={<UserLogin />} />
          <Route path="/user/signup" element={<UserSignup />} />
          <Route path="/buyer/login" element={<BuyerLogin />} />
          <Route path="/buyer/signup" element={<BuyerSignup />} />
          <Route path="/recyclingpoints" element={<RecyclingPonts />} />
          <Route path="/user/buyer/shop" element={<Shop />} />

          {/* ── User (seller) routes with Navbar ────────────── */}
          <Route path="/user" element={<Navbar />}>
            <Route path="home" element={<Home />} />
            <Route path="chatbot" element={<Chatbot />} />
            <Route path="selection" element={<SelectionPage />} />
            <Route path="game" element={<Games />} />
            <Route path="logout" element={<Logout />} />

            <Route path="sellingpage" element={
              <ProtectedRoute><SellingPage /></ProtectedRoute>
            } />
            <Route path="sellingpage/sellscrap" element={
              <ProtectedRoute><Sell /></ProtectedRoute>
            } />
            {/* NEW: seller's own listings */}
            <Route path="my-listings" element={
              <ProtectedRoute><MyListings /></ProtectedRoute>
            } />
            <Route path="profile" element={
              <ProtectedRoute><UserProfile /></ProtectedRoute>
            } />
            <Route path="profile/edit" element={
              <ProtectedRoute><EditUser /></ProtectedRoute>
            } />
            <Route path="leaderbord" element={
              <ProtectedRoute><LeaderBord /></ProtectedRoute>
            } />
            <Route path="reportwaste" element={
              <ProtectedRoute><RecyclingWaste /></ProtectedRoute>
            } />
          </Route>

          {/* ── Buyer routes with Navbar ─────────────────────── */}
          <Route path="/buyer" element={<Navbar />}>
            <Route path="logout" element={<BuyerLogout />} />

            <Route path="listofwaste" element={
              <ProtectedBuyerRoute><ListOfWaste /></ProtectedBuyerRoute>
            } />
            <Route path="listofwaste/:id" element={
              <ProtectedBuyerRoute><WasteDescription /></ProtectedBuyerRoute>
            } />
            <Route path="listofwaste/:id/confirm" element={
              <ProtectedBuyerRoute><BuyerConfirm /></ProtectedBuyerRoute>
            } />
            <Route path="listofwaste/:id/found" element={
              <ProtectedBuyerRoute><Found /></ProtectedBuyerRoute>
            } />
            {/* NEW: buyer's accepted listings */}
            <Route path="my-accepted" element={
              <ProtectedBuyerRoute><MyAccepted /></ProtectedBuyerRoute>
            } />
            <Route path="profile" element={
              <ProtectedBuyerRoute><BuyerProfile /></ProtectedBuyerRoute>
            } />
            <Route path="profile/edit" element={
              <ProtectedBuyerRoute><EditBuyer /></ProtectedBuyerRoute>
            } />
          </Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;