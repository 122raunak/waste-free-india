import React, { useEffect, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import WasteCard from "../../../components/WasteCard/WasteCard";
import api from "../../../lib/api";

const CATEGORIES = ["All", "Paper", "Plastic", "Metal", "E-waste"];

function ListOfWaste() {
  const [wasteItems, setWasteItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await api.get("/Scrap/show");
        setWasteItems(res.data.wasteItems || []);
      } catch (err) {
        setError("Failed to load listings. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = wasteItems.filter((item) => {
    const matchesSearch =
      item.title?.toLowerCase().includes(search.toLowerCase()) ||
      item.category?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      activeCategory === "All" || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-[calc(100dvh-60px)] w-full bg-[#f5f5f5] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 pt-4 pb-3 sticky top-0 z-10">
        <h1 className="text-lg font-bold text-gray-900 mb-3">Available Waste</h1>

        {/* Search bar */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or category..."
            className="w-full h-10 pl-9 pr-9 rounded-xl bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#81E68D] transition-all"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              <X size={14} />
            </button>
          )}
        </div>

        {/* Category filter chips */}
        <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 text-xs px-3 py-1.5 rounded-full font-medium transition-all border
                ${activeCategory === cat
                  ? "bg-[#41c45a] text-white border-[#41c45a]"
                  : "bg-white text-gray-600 border-gray-200 hover:border-[#81E68D]"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-4 space-y-3 overflow-y-auto">
        {loading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl h-28 animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16 text-red-500">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">♻️</p>
            <p className="text-gray-500 font-medium">No listings found</p>
            <p className="text-gray-400 text-sm mt-1">
              {search || activeCategory !== "All" ? "Try different filters" : "Check back later"}
            </p>
          </div>
        ) : (
          <>
            <p className="text-xs text-gray-400 pb-1">{filtered.length} listing{filtered.length !== 1 ? "s" : ""} found</p>
            {filtered.map((item) => (
              <WasteCard
                key={item._id}
                item={item}
                showLearnMore
                linkTo={`/buyer/listofwaste/${item._id}`}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default ListOfWaste;