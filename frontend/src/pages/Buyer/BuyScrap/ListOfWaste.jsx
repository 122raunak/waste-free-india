import React from "react";
import WasteItem from "../../../components/WasteItem/WasteItem"
import newspaper from "../../../../public/Found/newspaper.png"
import Navbar from "../../../components/Navbar/Navbar";

const wasteItems = [
  {
    id: 1,
    type: "Paper",
    quantity: 30,
    price: 500,
    title: "box of Newspaper",
    imageSrc: newspaper,
  },
  {
    id: 2,
    type: "Plastic",
    quantity: 50,
    weight: "5KG",
    price: 800,
    title: "Plastic Bottles",
    imageSrc: newspaper,
  },
  {
    id: 3,
    type: "Metal",
    quantity: 15,
    price: 1200,
    title: "Metal Scrap",
    imageSrc: newspaper,
  },
  {
    id: 4,
    type: "Metal",
    quantity: 15,
    price: 1200,
    title: "Metal Scrap",
    imageSrc: newspaper,
  },
  {
    id: 5,
    type: "Metal",
    quantity: 15,
    price: 1200,
    title: "Metal Scrap",
    imageSrc: newspaper,
  },
];

function ListOfWaste() {
  return (
    <div className="h-[100vh] w-full font-sans flex flex-col justify-center items-center">
      
      {/* Scrollable Section */}
      <div className="overflow-y-auto px-6 no-scrollbar "
           style={{ height: "calc(100vh - 250px)" }}> 

        {wasteItems.map((item) => (
          <WasteItem key={item.id} item={item} showLearnMore={true}  />
        ))}
      </div>

      {/* Bottom Nav stays at bottom */}
      <Navbar/>
    </div>
  );
}


export default ListOfWaste;
