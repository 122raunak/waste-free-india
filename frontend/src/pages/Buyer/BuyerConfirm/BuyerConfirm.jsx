import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Button from "../../../components/Button/Button";
import Navbar from "../../../components/Navbar/Navbar";
import WasteItem from "../../../components/WasteItem/WasteItem";
import newspaper from "../../../../public/Found/newspaper.png";

function BuyerConfirm() {
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

  const addBuyertoWaste = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/Scrap/show/${id}/confirm`,
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.error(error);
    }
  };

  if (!wasteData) return <p>Loading...</p>;

  return (
    <div className="min-h-[full] w-full flex flex-col items-center justify-center mt-2 py-[10px] px-[20px]">
      <WasteItem
        item={{
          id: wasteData._id,
          title: wasteData.title,
          category: wasteData.category,
          quantity: wasteData.quantity,
          weight: wasteData.weight,
          estimatedPrice: wasteData.estimatedPrice,
          images: wasteData.images,
          imageSrc: newspaper,
          address: wasteData.seller.Address,
        }}
        showLearnMore={false}
      />

      <div className="w-full border border-black mt-5 rounded-md flex flex-col px-4 py-3  bg-white">
        <p className="text-lg font-semibold">Seller Information:</p>
        <p>
          <b>Name:</b> {wasteData.seller?.FullName?.FirstName}{" "}
          {wasteData.seller?.FullName?.LastName}
        </p>
        <p>
          <b>ContactNo:</b> {wasteData.seller?.ContactNo}
        </p>
        <p>
          <b>Address:</b> {wasteData.seller?.Address}
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 pt-5 w-full">
        <Button
          onClick={() => navigate(-1)}
          text="Cancel"
          className="bg-[#DF3B2F] hover:bg-[#e58e87] border border-black flex-1"
        />
        <Button
          text="Confirm"
          className="border border-black flex-1"
          onClick={() => {
            addBuyertoWaste();
            navigate(`/buyer/listofwaste/${id}/found`);
          }}
        />
      </div>
      <Navbar />
    </div>
  );
}

export default BuyerConfirm;
