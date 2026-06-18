import React, { createContext, useState, useEffect } from "react";
import api from "../lib/api";

export const AppContext = createContext();

function AppProvider({ children }) {
  const [sellerIon, setsellerIon] = useState(
    () => localStorage.getItem("sellerIon") === "true"
  );
  const [BuyerIcon, setBuyerIcon] = useState(
    () => localStorage.getItem("BuyerIcon") === "true"
  );

  const [currentUser, setCurrentUser] = useState(null);
  const [currentBuyer, setCurrentBuyer] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    localStorage.setItem("sellerIon", sellerIon);
  }, [sellerIon]);

  useEffect(() => {
    localStorage.setItem("BuyerIcon", BuyerIcon);
  }, [BuyerIcon]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/user/auth/check");
        if (res.status === 200 && res.data.user) {
          setCurrentUser(res.data.user);
          setsellerIon(true);
        }
      } catch (_) {}

      try {
        const res = await api.get("/buyer/auth/check");
        if (res.status === 200 && res.data.buyer) {
          setCurrentBuyer(res.data.buyer);
          setBuyerIcon(true);
        }
      } catch (_) {}

      setAuthLoading(false);
    };
    checkAuth();
  }, []);

  const logoutUser = () => {
    setCurrentUser(null);
    setsellerIon(false);
    localStorage.removeItem("sellerIon");
  };

  const logoutBuyer = () => {
    setCurrentBuyer(null);
    setBuyerIcon(false);
    localStorage.removeItem("BuyerIcon");
  };

  return (
    <AppContext.Provider
      value={{
        sellerIon, setsellerIon,
        BuyerIcon, setBuyerIcon,
        currentUser, setCurrentUser,
        currentBuyer, setCurrentBuyer,
        authLoading,
        logoutUser,
        logoutBuyer,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export default AppProvider;