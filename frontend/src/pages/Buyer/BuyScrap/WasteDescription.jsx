import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../../../components/Button/Button";
import Navbar from "../../../components/Navbar/Navbar";
import WasteItem from "../../../components/WasteItem/WasteItem";
import axios from "axios";
import newspaper from "../../../../public/Found/newspaper.png";

function WasteDescription() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [wasteData, setWasteData] = useState(null);

  useEffect(() => {
    const loadWasteItem = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/Scrap/show/${id}`,
          { withCredentials: true }
        );
        setWasteData(res.data.wasteItem);
      } catch (error) {
        console.error(error);
      }
    };
    loadWasteItem();
  }, [id]);

  if (!wasteData) return <p>Loading...</p>;

  return (
    <div className="min-h-[full] w-full flex flex-col items-center justify-center mt-2 py-[10px] px-[20px]">
      {/* Waste Item display */}
      <WasteItem
        item={{
          id: wasteData._id,
          title: wasteData.title,
          category: wasteData.category,
          quantity: wasteData.quantity,
          weight: wasteData.weight,
          estimatedPrice: wasteData.estimatedPrice,
          images: wasteData.images,
          imageSrc: newspaper, // fallback image
        }}
        showLearnMore={false}
      />

      {/* Description */}
      <div className="w-full border border-black mt-5 rounded-md flex px-[10px] py-[20px] bg-white ">
        {wasteData.description || "No description provided"}
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 pt-5 w-full">
        <Button
          onClick={() => navigate(-1)}
          text="Cancel"
          className="bg-[#DF3B2F] hover:bg-[#e58e87] border border-black flex-1"
        />
        <Button
          text="Accept"
          className="border border-black flex-1"
          onClick={() => navigate(`/buyer/listofwaste/${id}/confirm`)}
        />
      </div>
      <Navbar />
    </div>
  );
}

export default WasteDescription;
