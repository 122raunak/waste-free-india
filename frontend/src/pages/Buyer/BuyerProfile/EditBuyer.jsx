import React, { useState, useRef, useEffect, useCallback } from "react";
import { ArrowLeft, Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import imageCompression from "browser-image-compression";
import LocationSearchpanel from "../../../components/SearchPanal/LocationSearchpanel";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import defaultProfile from "../../../../public/Profile/profile.png";

const WASTE_CATS = ["Paper", "Plastic", "Metal", "E-waste"];

function EditBuyer() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const panelRef = useRef(null);
  const debounceRef = useRef(null);

  const [profileImage, setProfileImage] = useState(defaultProfile);
  const [ImgData, setImgData] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [AddressSeggestion, setAddressSeggestion] = useState([]);
  const [saving, setSaving] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);

  const [formData, setFormData] = useState({
    FullName: { FirstName: "", LastName: "" },
    email: "",
    ContactNo: "",
    BusinessName: "",
    Address: "",
    ServiceArea: "",
    WasteCategories: [],
    BankDetails: { accountNumber: "", ifsc: "", upiId: "" },
  });

  // Load existing buyer data
  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/buyer/auth/check`,
          { withCredentials: true }
        );
        const b = res.data.buyer;

        let profileImg = defaultProfile;
        if (b.profileImg?.data) {
          const binary = new Uint8Array(b.profileImg.data);
          profileImg = `data:image/jpeg;base64,${btoa(
            binary.reduce((a, c) => a + String.fromCharCode(c), "")
          )}`;
          setProfileImage(profileImg);
        }

        setFormData({
          FullName: {
            FirstName: b.FullName?.FirstName || "",
            LastName: b.FullName?.LastName || "",
          },
          email: b.email || "",
          ContactNo: b.ContactNo || "",
          BusinessName: b.BusinessName || "",
          Address: b.Address || "",
          ServiceArea: b.ServiceArea || "",
          WasteCategories: b.WasteCategories || [],
          BankDetails: b.BankDetails || { accountNumber: "", ifsc: "", upiId: "" },
        });
      } catch {}
    };
    load();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith("FullName.")) {
      const field = name.split(".")[1];
      setFormData((p) => ({ ...p, FullName: { ...p.FullName, [field]: value } }));
    } else if (name.startsWith("BankDetails.")) {
      const field = name.split(".")[1];
      setFormData((p) => ({ ...p, BankDetails: { ...p.BankDetails, [field]: value } }));
    } else if (name === "WasteCategories") {
      setFormData((p) => ({
        ...p,
        WasteCategories: checked
          ? [...p.WasteCategories, value]
          : p.WasteCategories.filter((c) => c !== value),
      }));
    } else {
      setFormData((p) => ({ ...p, [name]: value }));
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const compressed = await imageCompression(file, { maxSizeMB: 1, maxWidthOrHeight: 800 });
    setProfileImage(URL.createObjectURL(compressed));
    setImgData(compressed);
  };

  // Debounced address search — 800ms delay to avoid Nominatim 429 rate limit
  const fetchAddressSuggestions = useCallback(async (value) => {
    if (!value || value.trim().length < 3) {
      setAddressSeggestion([]);
      return;
    }
    setAddressLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/map/get-suggestion`,
        { params: { query: value.trim() }, withCredentials: true }
      );
      setAddressSeggestion(res.data.predictions || []);
    } catch {
      setAddressSeggestion([]);
    } finally {
      setAddressLoading(false);
    }
  }, []);

  const handleAddressChange = (e) => {
    const value = e.target.value;
    handleChange(e);
    setPanelOpen(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchAddressSuggestions(value);
    }, 800);
  };

  useEffect(() => {
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("FullName[FirstName]", formData.FullName.FirstName);
      fd.append("FullName[LastName]", formData.FullName.LastName);
      fd.append("ContactNo", formData.ContactNo);
      fd.append("BusinessName", formData.BusinessName);
      fd.append("Address", formData.Address);
      fd.append("ServiceArea", formData.ServiceArea);
      fd.append("BankDetails[accountNumber]", formData.BankDetails.accountNumber);
      fd.append("BankDetails[ifsc]", formData.BankDetails.ifsc);
      fd.append("BankDetails[upiId]", formData.BankDetails.upiId);
      formData.WasteCategories.forEach((c) => fd.append("WasteCategories[]", c));
      if (ImgData) fd.append("profileImg", ImgData);

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/buyer/profile/edit`,
        fd,
        { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } }
      );
      if (res.status === 200) navigate("/buyer/profile");
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  useGSAP(() => {
    if (!panelRef.current) return;
    gsap.to(panelRef.current, {
      height: panelOpen ? "30%" : "0%",
      padding: panelOpen ? 10 : 0,
      duration: 0.3,
      ease: "power2.out",
    });
  }, [panelOpen]);

  useEffect(() => {
    const handleOutside = (e) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target) &&
        e.target.name !== "Address"
      ) {
        setPanelOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  return (
    <div className="min-h-[calc(100dvh-60px)] bg-[#f5f5f5]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-1 -ml-1 rounded-lg hover:bg-gray-100">
          <ArrowLeft size={20} className="text-gray-700" />
        </button>
        <h1 className="font-bold text-gray-900">Edit Partner Profile</h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-xl mx-auto px-4 py-6 space-y-4 pb-10">

        {/* Avatar */}
        <div className="flex flex-col items-center mb-2">
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white shadow-md bg-gray-200">
              <img src={profileImage} alt="profile" className="w-full h-full object-cover" />
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#2196F3] text-white rounded-full flex items-center justify-center shadow-md hover:bg-[#1976D2] transition"
            >
              <Camera size={14} />
            </button>
          </div>
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
          <p className="text-xs text-gray-400 mt-3">Tap the camera to change photo</p>
        </div>

        {/* Personal */}
        <Section title="Personal Info">
          <div className="grid grid-cols-2 gap-3">
            <Field label="First Name" name="FullName.FirstName" value={formData.FullName.FirstName} onChange={handleChange} accent="blue" />
            <Field label="Last Name" name="FullName.LastName" value={formData.FullName.LastName} onChange={handleChange} accent="blue" />
          </div>
          <Field label="Email" name="email" type="email" value={formData.email} disabled accent="blue" />
          <Field label="Contact" name="ContactNo" type="tel" value={formData.ContactNo} onChange={handleChange} accent="blue" />
        </Section>

        {/* Business */}
        <Section title="Business Info">
          <Field label="Business Name" name="BusinessName" value={formData.BusinessName} onChange={handleChange} accent="blue" />
          <Field label="Service Area" name="ServiceArea" value={formData.ServiceArea} onChange={handleChange} accent="blue" />

          {/* Address with autocomplete */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
              Address
            </label>
            <div className="relative">
              <textarea
                name="Address"
                rows={3}
                value={formData.Address}
                onChange={handleAddressChange}
                onClick={() => setPanelOpen(true)}
                placeholder="Start typing your address..."
                className="w-full bg-gray-50 rounded-xl border border-gray-200 px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#2196F3]"
              />
              {addressLoading && (
                <div className="absolute right-3 top-3">
                  <div className="w-4 h-4 border-2 border-[#2196F3] border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-1">Type at least 3 characters to see suggestions</p>
          </div>

          {/* Waste categories */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
              Waste Categories
            </label>
            <div className="flex flex-wrap gap-2">
              {WASTE_CATS.map((cat) => (
                <label
                  key={cat}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-sm cursor-pointer transition
                    ${formData.WasteCategories.includes(cat)
                      ? "bg-[#2196F3] text-white border-[#2196F3]"
                      : "bg-white text-gray-600 border-gray-200 hover:border-[#2196F3]"
                    }`}
                >
                  <input
                    type="checkbox"
                    name="WasteCategories"
                    value={cat}
                    checked={formData.WasteCategories.includes(cat)}
                    onChange={handleChange}
                    className="hidden"
                  />
                  {cat}
                </label>
              ))}
            </div>
          </div>
        </Section>

        {/* Bank */}
        <Section title="Bank Details">
          <Field label="Account Number" name="BankDetails.accountNumber" value={formData.BankDetails.accountNumber} onChange={handleChange} accent="blue" />
          <Field label="IFSC Code" name="BankDetails.ifsc" value={formData.BankDetails.ifsc} onChange={handleChange} accent="blue" />
          <Field label="UPI ID" name="BankDetails.upiId" value={formData.BankDetails.upiId} onChange={handleChange} accent="blue" />
        </Section>

        <button
          type="submit"
          disabled={saving}
          className="w-full h-12 bg-[#2196F3] hover:bg-[#1976D2] text-white font-semibold rounded-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {saving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>

      {/* Address suggestions panel */}
      <div
        ref={panelRef}
        className="bg-white w-full fixed bottom-0 left-0 z-50 h-0 overflow-hidden shadow-2xl rounded-t-2xl"
      >
        <LocationSearchpanel
          AddressSeggestion={AddressSeggestion}
          setFormData={setFormData}
          setPanelOpen={setPanelOpen}
        />
      </div>
    </div>
  );
}

const Section = ({ title, children }) => (
  <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4">
    <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{title}</h2>
    {children}
  </div>
);

const Field = ({ label, name, type = "text", value, onChange, disabled, accent = "green" }) => (
  <div>
    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">{label}</label>
    <input
      type={type} name={name} value={value || ""} onChange={onChange} disabled={disabled}
      className={`w-full h-11 bg-gray-50 rounded-xl border border-gray-200 px-3 text-sm focus:outline-none
        ${accent === "blue" ? "focus:ring-2 focus:ring-[#2196F3]" : "focus:ring-2 focus:ring-[#37B943]"}
        disabled:opacity-60 disabled:cursor-not-allowed`}
    />
  </div>
);

export default EditBuyer;