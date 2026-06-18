import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";

// Protects seller (user) routes
const ProtectedRoute = ({ children }) => {
  const { sellerIon, authLoading } = useContext(AppContext);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#81E68D] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return sellerIon ? children : <Navigate to="/user/selection" replace />;
};

// Protects buyer routes
export const ProtectedBuyerRoute = ({ children }) => {
  const { BuyerIcon, authLoading } = useContext(AppContext);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#81E68D] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return BuyerIcon ? children : <Navigate to="/buyer/login" replace />;
};

export default ProtectedRoute;