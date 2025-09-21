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

  const [search, setSearch] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const NewWasteItem = wasteItem.filter((p) =>
    p.category.toLowerCase().includes(search)
  );

  return (
    <div className="h-[80vh] w-full font-sans flex flex-col  px-2">
      <div className="bg-zinc-700 w-full h-16 flex items-center px-4 sm:px-8 rounded-md gap-2 sm:gap-4">
        <form
          onSubmit={handleSubmit}
          className="flex w-full items-center gap-2"
        >
          <input
            className="w-full h-10 sm:h-12 rounded-md px-2 bg-white text-sm sm:text-base"
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            placeholder="Search products..."
          />
          <button
            type="submit"
            className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-md "
          >
            <i className="text-white text-xl sm:text-2xl fa-solid fa-magnifying-glass"></i>
          </button>
        </form>
      </div>
      <div
        className="overflow-y-auto px-4 sm:px-6 py-6 no-scrollbar space-y-4 mt-10"
        style={{ height: "80vh" }}
      >
        {wasteItem.length > 0 ? (
          NewWasteItem.map((item) => (
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
