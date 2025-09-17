import React, { useEffect, useState } from "react";
import WasteItem from "../../../components/WasteItem/WasteItem";
import newspaper from "../../../../public/Found/newspaper.png";
import Navbar from "../../../components/Navbar/Navbar";
import axios from "axios";

function ListOfWaste() {
  const [wasteItem, setWasteItem] = useState([]);
  useEffect(() => {
    const loadAllWasteItems = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/Scrap/show`,
          {
            withCredentials: true,
          }
        );
        setWasteItem(res.data.wasteItems);
      } catch (error) {}
    };
    loadAllWasteItems();
  }, []);
  return (
    <div className="h-[100vh] w-full font-sans flex flex-col justify-center items-center z-10">
      {/* Scrollable Section */}
      <div
        className="overflow-y-auto px-6 no-scrollbar "
        style={{ height: "calc(100vh - 250px)" }}
      >
        {wasteItem.map((item) => (
          <WasteItem key={item.id} item={item} showLearnMore={true} />
        ))}
      </div>

      {/* Bottom Nav stays at bottom */}
    </div>
  );
}

export default ListOfWaste;
