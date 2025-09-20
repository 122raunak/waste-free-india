import React, { useRef, useState } from "react";
import { ChevronDown, MapPin } from "lucide-react";
import wastebin from "../../../../public/SellingPage/bin.png";
import Button from "../../../components/Button/Button";
import imageCompression from "browser-image-compression";
import axios from "axios";

function RecyclingWaste() {
  const [WasteItemImage, setWasteItemImage] = useState(wastebin);
  const [ImgData, setImgData] = useState(null);
  const [msg, setMsg] = useState("");

  const [FormData, setFormData] = useState({
    category: "",
    quantity: "",
    reporter: "",
    description: "",
    location: "",
    images: null,
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

    setFormData({
      category: "",
      quantity: "",
      reporter: "",
      description: "",
      location: "",
      images: null,
    });
    setWasteItemImage(wastebin);
  };

  const fileInputRef = useRef(null);
  const handleImageClick = () => fileInputRef.current?.click();

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
    <div className="min-h-screen w-full flex justify-center items-start py-12">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl p-8 space-y-8 rounded-xl shadow-lg"
      >
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="flex flex-col items-center ">
            <div className="w-40 h-40 md:w-48 md:h-48 rounded-lg border overflow-hidden flex items-center justify-center ">
              <img
                src={WasteItemImage}
                alt="Waste Preview"
                className="object-contain w-full h-full"
              />
            </div>
            <button
              type="button"
              onClick={handleImageClick}
              className="mt-4 px-4 py-2 border rounded-md font-medium bg-white"
            >
              Upload Image/File
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          <div className="flex-1 space-y-6 ">
            <div>
              <label className="block font-medium mb-2">Waste Type:</label>
              <div className="relative ">
                <select
                  name="category"
                  value={FormData.category}
                  onChange={handleChange}
                  required
                  className="block w-full p-3 pr-10 border rounded-md shadow-sm text-sm appearance-none bg-white"
                >
                  <option value="">Select Waste Type</option>
                  <option value="Paper">Dry / Recyclable</option>
                  <option value="Plastic">Wet / Organic</option>
                  <option value="Metal">Hazardous</option>
                  <option value="E-waste">Mixed Waste</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <div>
                <label className="block font-medium mb-2">Quantity:</label>
                <select
                  name="quantity"
                  value={FormData.quantity}
                  onChange={handleChange}
                  required
                  className="block w-full p-3 pr-10 border rounded-md shadow-sm text-sm appearance-none bg-white"
                >
                  <option value="">Select Quantity</option>
                  <option value="1-5kg">Small Load (1–5 kg)</option>
                  <option value="6-20kg">Medium Load (6–20 kg)</option>
                  <option value="21-50kg">Large Load (21–50 kg)</option>
                </select>
              </div>

              <div>
                <label className="block font-medium mb-2">Reporter Info:</label>
                <select
                  name="reporter"
                  value={FormData.reporter}
                  onChange={handleChange}
                  required
                  className="block w-full p-3 pr-10 border rounded-md shadow-sm text-sm appearance-none bg-white"
                >
                  <option value="">Select Reporter</option>
                  <option value="Anonymous">Anonymous</option>
                  <option value="Citizen">Show Citizen Info</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-medium mb-2">Description:</label>
              <textarea
                name="description"
                value={FormData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Add a description of your waste"
                required
                className="block w-full p-3 border rounded-md shadow-sm text-sm resize-none bg-white"
              />
            </div>

            <div className="flex items-center gap-4 border p-4 rounded-xl bg-white">
              <MapPin size={28} />
              <input
                type="text"
                name="location"
                placeholder="Enter Your Location"
                value={FormData.location}
                onChange={handleChange}
                className="flex-1 p-3 border rounded-md shadow-sm text-sm"
              />
            </div>
          </div>
        </div>

        <Button type="submit" text="Sell Waste" />
        {msg && <p className="text-green-600 font-medium">{msg}</p>}
      </form>
    </div>
  );
}

export default RecyclingWaste;
