import React, { useEffect, useState } from "react";
import WasteItem from "../../../components/WasteItem/WasteItem";
import Navbar from "../../../components/Navbar/Navbar";
import axios from "axios";

function ListOfWaste() {
  const [wasteItem, setWasteItem] = useState([]);

  useEffect(() => {
    const loadAllWasteItems = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/Scrap/show`,
          { withCredentials: true }
        );
        setWasteItem(res.data.wasteItems);
      } catch (error) {}
    };
    loadAllWasteItems();
  }, []);

  return (
    <div className="h-[80vh] w-full font-sans flex flex-col bg-gray-50">
      <div
        className="overflow-y-auto px-4 sm:px-6 py-6 no-scrollbar space-y-4"
        style={{ height: "calc(100vh - 80px)" }}
      >
        {wasteItem.length > 0 ? (
          wasteItem.map((item) => (
            <WasteItem key={item.id || item._id} item={item} showLearnMore />
          ))
        ) : (
          <p className="text-center text-gray-500 mt-20">loading....</p>
        )}
      </div>
    </div>
  );
}

export default ListOfWaste;
