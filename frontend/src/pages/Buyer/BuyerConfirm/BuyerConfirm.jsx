import React from "react";
import Button from "../../../components/Button/Button";
import Navbar from "../../../components/Navbar/Navbar";
import paper from "../../../../public/Found/newspaper.png";
import { useNavigate , useParams} from "react-router-dom";
import WasteItem from "../../../components/WasteItem/WasteItem";

function BuyerConfirm() {
  const { id } = useParams();
  const navigate = useNavigate();
  return(
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

        <div className="w-full border border-black mt-5 rounded-md flex p-2">
             <div className="w-full text-lg py-3">Adress of the user</div>
        </div>

      <div className="flex gap-3 pt-5 w-full">
        <Button 
        onClick={()=>navigate(-1)}
         text="Cancel" className="bg-[#DF3B2F] hover:bg-[#e58e87] border border-black flex-1"/>
        <Button text="Confirm" className="border border-black flex-1" onClick={() => navigate(`/buyer/listofwaste/${id}/found`)}/>
      </div>
        <Navbar/>
      </div>
  );
}

export default BuyerConfirm;
