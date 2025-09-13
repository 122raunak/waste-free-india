import React, { createContext, useState } from "react";

export const AppContext = createContext();

function AppProvider({ children }) {
  const [sellerIon, setsellerIon] = useState(false);
  const [IssellerIon, setIssellerIon] = useState(false);
  return (
    <AppContext.Provider
      value={{ sellerIon, setsellerIon, setIssellerIon, IssellerIon }}
    >
      {children}
    </AppContext.Provider>
  );
}

export default AppProvider;
