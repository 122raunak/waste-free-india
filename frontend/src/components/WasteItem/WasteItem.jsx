import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button"
import newspaperImg from "../../../public/Found/newspaper.png";

function WasteItem({ item, showLearnMore = true , classname="" }) {
  const { id, type, quantity, weight, price, imageSrc, title } = item;
  const navigate = useNavigate();

  return (
    <div className = {`bg-white w-full rounded-lg shadow-md p-4 flex flex-row items-center justify-center mb-4 border border-gray-300 ${classname}`}>
  {/* Image Section */}
  <div className="w-32 h-32 sm:w-48 sm:h-48 border overflow-hidden border-gray-400 rounded-md flex items-center justify-center bg-contain">
    <img
      src={imageSrc || newspaperImg}
      alt={title}
      className="w-full h-full object-cover"
    />
  </div>

  {/* Details + Buttons */}
  <div className="flex flex-col justify-between flex-grow ml-4">
        {/* Description */}
        <div className="space-y-1">
          <p className="font-medium text-sm sm:text-base"><b>Type: </b>{type}</p>
          <p className="text-sm sm:text-base font-medium"><b>Quantity: </b>{quantity}</p>
          {weight && <p className="text-sm sm:text-base"><b>Weight: </b>{weight}</p>}
        </div>

        {/* Buttons side by side, smaller size */}
        <div className="flex flex-row gap-2 mt-3">
          <Button 
            text={`₹${price}`} 
            className=" h-[45px] text-sm px-3 font-semibold flex-1"
          />

          {showLearnMore && (
            <Button
              text="Learn More"
              className="text-[15px] px-3 py-1 bg-yellow-400 hover:bg-yellow-300 flex-1"
              onClick={() => navigate(`/buyer/listofwaste/${id}`)}
            />
          )}
        </div>
      </div>
    </div>


  );
}
export default WasteItem;
