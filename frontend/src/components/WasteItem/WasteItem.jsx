import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";
import newspaperImg from "../../../public/Found/newspaper.png";

function WasteItem({ item, showLearnMore = true, classname = "" }) {
  const { id, _id, category, quantity, weight, estimatedPrice, images, title } =
    item;
  const navigate = useNavigate();

  let profileImgBase64 = newspaperImg;

  if (images && images.length > 0) {
    const firstImage = images[0];
    if (firstImage?.data) {
      const binary = new Uint8Array(firstImage.data);
      const base64String = btoa(
        binary.reduce((acc, byte) => acc + String.fromCharCode(byte), "")
      );
      profileImgBase64 = `data:image/jpeg;base64,${base64String}`;
    }
  }

  return (
    <div
      className={`bg-white w-full rounded-lg shadow-md p-4 flex flex-row items-center justify-center mb-4 border border-gray-300 ${classname}`}
    >
      {/* Image Section */}
      <div className="w-32 h-32 sm:w-48 sm:h-48 border overflow-hidden border-gray-400 rounded-md flex items-center justify-center bg-contain">
        <img
          src={profileImgBase64 || newspaperImg}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Details + Buttons */}
      <div className="flex flex-col justify-between flex-grow ml-4">
        {/* Description */}
        <div className="space-y-1">
          <p className="font-medium text-sm sm:text-base">
            <b>category: </b>
            {category}
          </p>
          <p className="text-sm sm:text-base font-medium">
            <b>Quantity: </b>
            {quantity}
          </p>
          {weight && (
            <p className="text-sm sm:text-base">
              <b>Weight: </b>
              {weight}
            </p>
          )}
        </div>

        {/* Buttons side by side, smaller size */}
        <div className="flex flex-row gap-2 mt-3">
          <Button
            text={`₹${estimatedPrice}`}
            className=" h-[45px] text-sm px-3 font-semibold flex-1"
          />

          {showLearnMore && (
            <Button
              text="Learn More"
              className="text-[15px] px-3 py-1 bg-yellow-400 hover:bg-yellow-300 flex-1"
              onClick={() => navigate(`/buyer/listofwaste/${_id}`)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
export default WasteItem;
