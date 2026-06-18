import React, { useRef, useState } from "react";
import { ChevronDown, ArrowLeft, ImagePlus, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import imageCompression from "browser-image-compression";
import api from "../../../lib/api";

const CATEGORIES = [
  { value: "Paper", label: "📦 Paper" },
  { value: "Plastic", label: "🥤 Plastic" },
  { value: "Metal", label: "⚙️ Metal" },
  { value: "E-waste", label: "💻 E-waste" },
];

function SellScrap() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [previewUrl, setPreviewUrl] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    quantity: "",
    estimatedPrice: "",
    weight: "",
    images: null,
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const compressed = await imageCompression(file, { maxSizeMB: 1, maxWidthOrHeight: 800 });
      setPreviewUrl(URL.createObjectURL(compressed));
      setForm((prev) => ({ ...prev, images: compressed }));
    } catch (err) {
      console.error("Compression failed", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.images) {
      setError("Please upload an image of your waste");
      return;
    }

    setSubmitting(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, val]) => {
        if (val !== null && val !== "") data.append(key, val);
      });

      const res = await api.post("/Scrap/create", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 201) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/user/my-listings");
        }, 1800);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create listing. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[calc(100dvh-60px)] flex flex-col items-center justify-center px-6 gap-4">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle2 size={36} className="text-green-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Listing Created!</h2>
        <p className="text-gray-500 text-sm text-center">Redirecting to your listings...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100dvh-60px)] w-full bg-[#f5f5f5] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-1 -ml-1 rounded-lg hover:bg-gray-100">
          <ArrowLeft size={20} className="text-gray-700" />
        </button>
        <h1 className="font-bold text-gray-900">List Your Waste</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* Image upload */}
        <div>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`w-full h-44 rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-2
              ${previewUrl ? "border-[#41c45a] p-1" : "border-gray-300 hover:border-[#81E68D] bg-white"}`}
          >
            {previewUrl ? (
              <img src={previewUrl} alt="preview" className="w-full h-full object-cover rounded-lg" />
            ) : (
              <>
                <ImagePlus size={28} className="text-gray-400" />
                <p className="text-sm text-gray-500 font-medium">Tap to upload image</p>
                <p className="text-xs text-gray-400">JPG, PNG up to 1MB</p>
              </>
            )}
          </button>
          {previewUrl && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-1 text-xs text-[#41c45a] underline w-full text-center"
            >
              Change image
            </button>
          )}
        </div>

        {/* Category */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-3">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
              Waste Category *
            </label>
            <div className="relative">
              <select
                name="category"
                required
                value={form.category}
                onChange={handleChange}
                className="w-full h-11 bg-gray-50 rounded-lg border border-gray-200 px-3 pr-10 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#81E68D]"
              >
                <option value="">Select category</option>
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Title *</label>
            <input
              type="text"
              name="title"
              required
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Old newspapers bundle"
              className="w-full h-11 bg-gray-50 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#81E68D]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Description *</label>
            <textarea
              name="description"
              required
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Describe the condition, quantity, and any other details..."
              className="w-full bg-gray-50 rounded-lg border border-gray-200 px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#81E68D]"
            />
          </div>
        </div>

        {/* Numbers */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
                Est. Price (₹) *
              </label>
              <input
                type="number"
                name="estimatedPrice"
                required
                min="0"
                value={form.estimatedPrice}
                onChange={handleChange}
                placeholder="0"
                className="w-full h-11 bg-gray-50 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#81E68D]"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                min="0"
                value={form.quantity}
                onChange={handleChange}
                placeholder="Optional"
                className="w-full h-11 bg-gray-50 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#81E68D]"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
              Weight (Optional)
            </label>
            <input
              type="text"
              name="weight"
              value={form.weight}
              onChange={handleChange}
              placeholder="e.g. 5 kg"
              className="w-full h-11 bg-gray-50 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#81E68D]"
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full h-12 bg-[#41c45a] hover:bg-[#36a84c] active:scale-[0.98] text-white font-semibold rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Listing...
            </>
          ) : (
            "List Waste for Sale"
          )}
        </button>
        <div className="h-2" />
      </form>
    </div>
  );
}

export default SellScrap;