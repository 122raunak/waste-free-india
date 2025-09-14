import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import paper from "../../../../public/Found/newspaper.png";
import Button from "../../../components/Button/Button";
import Navbar from "../../../components/Navbar/Navbar";
import WasteItem from "../../../components/WasteItem/WasteItem";

function WasteDescription() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-[full] w-full flex flex-col items-center justify-center mt-2 py-[10px] px-[20px]">
      <WasteItem 
          item={{
              id: 1,
              type: "Paper",
              quantity: 30,
              weight: "5KG",
              price: 500,
              imageSrc: paper,
              title: "Newspaper"
          }} 
          showLearnMore={false}
        />

        <div className="w-full border border-black mt-5 rounded-md flex px-[10px] py-[20px]">
          Description about waste
        </div>

      <div className="flex gap-3 pt-5 w-full">
        <Button 
        onClick={()=>navigate(-1)}
         text="Cancel" className="bg-[#DF3B2F] hover:bg-[#e58e87] border border-black flex-1"/>
        <Button text="Accept" className="border border-black flex-1" onClick={() => navigate(`/buyer/listofwaste/${id}/confirm`)}/>
      </div>
        <Navbar/>
      </div>
    
  );
}

export default WasteDescription;
