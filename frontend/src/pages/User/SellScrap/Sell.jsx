import React, { useRef, useState } from "react";
import { ChevronDown, Package, Droplet, Cog, Laptop } from "lucide-react";
import wastebin from "../../../../public/SellingPage/bin.png";
import InputField from "../../../Components/Input/InputField";
import Button from "../../../components/Button/Button";
import Navbar from "../../../components/Navbar/Navbar";

import imageCompression from "browser-image-compression";
import axios from "axios";

function SellScrap() {
  const [WasteItemImage, setWasteItemImage] = useState(wastebin);
  const [ImgData, setImgData] = useState(null);
  const [msg, setmsg] = useState("");

  const [FormData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    quantity: "",
    estimatedPrice: "",
    images: "",
    weight: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(FormData);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/Scrap/create`,
        FormData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (res.status == 201) {
        setmsg(res.data.message);
      }

      setFormData({
        title: "",
        category: "",
        description: "",
        quantity: "",
        estimatedPrice: "",
        images: "",
        weight: "",
      });
    } catch (err) {
      console.error(err);
    }
  };

  const fileInputRef = useRef(null);
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const compressed = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 800,
      });
      const imageUrl = URL.createObjectURL(compressed);
      setWasteItemImage(imageUrl);
      setImgData(compressed);

      setFormData((prev) => ({
        ...prev,
        images: compressed,
      }));
    }
  };
  return (
    <div className="min-h-[100dvh] w-[90%]  relative overflow-hidden flex justify-center items-center flex-col top-[-70px]   ">
      {/* Main Content */}
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
        />

        <div className="relative z-50 pt-[180px]">
          <div className="flex items-center justify-between gap-8">
            <div>
              <div className="flex-shrink-0 bg-white w-38 h-30 md:w-40 md:h-40 rounded-lg border border-black flex items-center justify-center p-4">
                <img
                  src={WasteItemImage}
                  alt="Waste Preview"
                  className="w-full h-full object-contain"
                />
              </div>
              <button
                type="button"
                onClick={handleImageClick}
                className="w-full text-black border font-medium border-black mt-3 rounded-md mb-4"
              >
                Upload Image/File
              </button>
            </div>

            <div className="relative mt-[-100px]">
              <h2 className="p-2 font-medium">Waste Type:</h2>
              <div className="relative mt-1">
                <select
                  id="waste-type"
                  name="category"
                  className="block w-full bg-white rounded-md shadow-sm p-2 pr-10 text-sm appearance-none"
                  required
                  onChange={handleChange}
                >
                  <option value="">Select Waste Type</option>
                  <option value="Paper">📦 Paper</option>
                  <option value="Plastic">🥤 Plastic</option>
                  <option value="Metal">⚙️ Metal</option>
                  <option value="E-waste">💻 E-waste</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <ChevronDown className="h-4 w-4 text-black-400" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex flex-col gap-1 mb-4">
              <p className="font-medium">Title:</p>
              <InputField
                type="text"
                name="title"
                placeholder="Enter Title"
                required
                value={FormData.title}
                onChange={handleChange}
              />
            </div>

            {/* Description */}
            <div className="mb-4">
              <p className="font-medium">Description:</p>
              <textarea
                id="description"
                name="description"
                className="block w-full rounded-md border p-2 text-sm resize-none bg-white"
                rows="2"
                placeholder="Add a description of your waste"
                required
                onChange={handleChange}
                value={FormData.description}
              />
            </div>

            <div className=" flex items-cente gap-4">
              <div className="flex flex-col gap-1 mb-4">
                <p className="font-medium">Quantity(Optional)</p>
                <InputField
                  type="number"
                  name="quantity"
                  placeholder="Enter Quantity"
                  onChange={handleChange}
                  value={FormData.quantity}
                />
              </div>

              <div className="flex flex-col gap-1 mb-4">
                <p className="font-medium">Estimated Price:</p>
                <InputField
                  type="number"
                  name="estimatedPrice"
                  placeholder="Enter Estimated Price"
                  required
                  onChange={handleChange}
                  value={FormData.estimatedPrice}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1 mb-4">
              <p className="font-medium">Estimated Weight(Optional)</p>
              <div className=" w-[60%]">
                <InputField
                  type="text"
                  name="weight"
                  placeholder="Enter Estimated Weight"
                  onChange={handleChange}
                  value={FormData.weight}
                />
              </div>
            </div>
          </div>

          <Button type="submit" text="Sell Waste" />
        </div>
      </form>
      <p className="mt-2 text-green-600 z-10">{msg}</p>
    </div>
  );
}

export default SellScrap;
