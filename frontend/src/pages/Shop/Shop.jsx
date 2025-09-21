import React, { useState } from "react";
import bin from "../../../public/SellingPage/bin.png";
import broom from "../../../public/SellingPage/broom.webp";
import cleaningbrush from "../../../public/SellingPage/cleaning brush.jpeg";
import dustpan from "../../../public/SellingPage/dustpan.jpeg";
import FaceMask from "../../../public/SellingPage/face mask.jpeg";
import gloves from "../../../public/SellingPage/gloves.jpg";
import handSanitizar from "../../../public/SellingPage/hand sanitager.jpeg";
import mop from "../../../public/SellingPage/mop.jpeg";
import recylingBin from "../../../public/SellingPage/recycling bin.jpeg";
import trashBag from "../../../public/SellingPage/trash bag.jpg";
import wasteCompactor from "../../../public/SellingPage/trasCompactor.jpg";
import { useSearchParams } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";

function Shop() {
  const Products = [
    { price: 450, name: "Dustbin", discount: 20, img: recylingBin },
    { price: 150, name: "Gloves", discount: 10, img: gloves },
    { price: 250, name: "Face Mask", discount: 15, img: FaceMask },
    { price: 750, name: "Broom", discount: 25, img: broom },
    { price: 500, name: "Trash Bags", discount: 18, img: trashBag },
    { price: 1200, name: "Recycling Bin", discount: 30, img: recylingBin },
    { price: 300, name: "Hand Sanitizer", discount: 12, img: handSanitizar },
    { price: 650, name: "Cleaning Brush", discount: 22, img: cleaningbrush },
    { price: 2500, name: "Industrial Dustbin", discount: 35, img: recylingBin },
    { price: 350, name: "Mop", discount: 15, img: mop },
    { price: 100, name: "Dustpan", discount: 10, img: dustpan },
    { price: 1800, name: "Waste Compactor", discount: 40, img: wasteCompactor },
  ];

  const [search, setSearch] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const newprodct = Products.filter((p) =>
    p.name.toLowerCase().includes(search)
  );

  return (
    <>
      <div className="h-[80vh] w-full mt-10 px-4 mb-10">
        <div className="bg-zinc-700 w-full h-14 flex items-center px-4 sm:px-8 rounded-md gap-2 sm:gap-4">
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

        <div className="flex flex-wrap justify-center gap-4 sm:gap-5 mt-10 sm:mt-20 overflow-y-auto max-h-[72vh]">
          {newprodct.map(({ price, name, discount, img }) => {
            return (
              <div className="w-full sm:w-60 flex flex-col">
                <div className="relative w-full h-52 flex items-center justify-center bg-green-100 rounded-md overflow-hidden">
                  <span className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded shadow z-10">
                    ₹{discount} OFF
                  </span>
                  <img
                    className="h-48 sm:h-[12rem] object-contain"
                    src={img}
                    alt={name}
                  />
                </div>

                <div className="flex justify-between items-center px-4 py-3 sm:py-4 bg-green-50 text-green-900 rounded-md mt-2 gap-2">
                  <div className="text-center sm:text-left">
                    <h3 className="font-semibold text-sm sm:text-base text-black">
                      {name}
                    </h3>
                    <div className="flex justify-center sm:justify-start items-center gap-2 mt-1">
                      <h4 className="line-through text-xs sm:text-sm opacity-70">
                        {price}
                      </h4>
                      <h4 className="text-green-800 font-semibold text-sm ">
                        {price - discount}
                      </h4>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-2 sm:mt-0">
                    <button
                      type="button"
                      className="bg-yellow-400 hover:bg-yellow-500 px-4 py-2 text-white rounded-md transition"
                    >
                      Learn More
                    </button>
                    <button
                      type="button"
                      className="bg-green-600 hover:bg-green-700 px-4 py-2 text-white rounded-md transition"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Navbar />
    </>
  );
}

export default Shop;
