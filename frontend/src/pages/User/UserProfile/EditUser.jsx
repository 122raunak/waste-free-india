import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft, Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import imageCompression from "browser-image-compression";
import LocationSearchpanel from "../../../components/SearchPanal/LocationSearchpanel";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import defaultProfile from "../../../../public/Profile/profile.png";

function EditUser() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const panelRef = useRef(null);

  const [profileImage, setProfileImage] = useState(defaultProfile);
  const [ImgData, setImgData] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [AddressSeggestion, setAddressSeggestion] = useState([]);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    FullName: { FirstName: "", LastName: "" },
    ContactNo: "", Address: "",
  });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/user/auth/check`,
          { withCredentials: true }
        );
        const u = res.data.user;
        setFormData({
          FullName: { FirstName: u.FullName?.FirstName || "", LastName: u.FullName?.LastName || "" },
          ContactNo: u.ContactNo || "",
          Address: u.Address || "",
        });
      } catch {}
    };
    load();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "FirstName" || name === "LastName") {
      setFormData((p) => ({ ...p, FullName: { ...p.FullName, [name]: value } }));
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

  const handleAddressChange = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/map/get-suggestion`,
        { params: { query: formData.Address }, withCredentials: true }
      );
      setAddressSeggestion(res.data.predictions || []);
    } catch {}
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      if (ImgData) fd.append("profileImg", ImgData);
      fd.append("FirstName", formData.FullName.FirstName);
      fd.append("LastName", formData.FullName.LastName);
      fd.append("ContactNo", formData.ContactNo);
      fd.append("Address", formData.Address);

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/user/profile/edit`,
        fd,
        { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } }
      );
      navigate("/user/profile");
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  useGSAP(() => {
    if (!panelRef.current) return;
    gsap.to(panelRef.current, { height: panelOpen ? "55%" : "0%", padding: panelOpen ? 16 : 0, duration: 0.3 });
  }, [panelOpen]);

  useEffect(() => {
    const handleOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target) && e.target.name !== "Address") {
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
        <h1 className="font-bold text-gray-900">Edit Profile</h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-xl mx-auto px-4 py-6 space-y-5">
        {/* Profile picture */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white shadow-md bg-gray-200">
              <img src={profileImage} alt="profile" className="w-full h-full object-cover" />
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#37B943] text-white rounded-full flex items-center justify-center shadow-md hover:bg-[#2ea038] transition"
            >
              <Camera size={14} />
            </button>
          </div>
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
          <p className="text-xs text-gray-400 mt-3">Tap the camera to change photo</p>
        </div>

        {/* Fields */}
        <Section title="Personal Info">
          <div className="grid grid-cols-2 gap-3">
            <Field label="First Name" name="FirstName" value={formData.FullName.FirstName} onChange={handleChange} />
            <Field label="Last Name" name="LastName" value={formData.FullName.LastName} onChange={handleChange} />
          </div>
          <Field label="Contact Number" name="ContactNo" type="tel" value={formData.ContactNo} onChange={handleChange} />
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Address</label>
            <textarea
              name="Address"
              rows={3}
              value={formData.Address}
              onChange={(e) => { handleChange(e); handleAddressChange(); }}
              onClick={() => setPanelOpen(true)}
              placeholder="Your address"
              className="w-full bg-gray-50 rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-[#37B943]"
            />
          </div>
        </Section>

        <button
          type="submit" disabled={saving}
          className="w-full h-12 bg-[#37B943] hover:bg-[#2ea038] text-white font-semibold rounded-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {saving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>

      {/* Address panel */}
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

const Field = ({ label, name, type = "text", value, onChange, disabled }) => (
  <div>
    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">{label}</label>
    <input
      type={type} name={name} value={value || ""} onChange={onChange} disabled={disabled}
      className="w-full h-11 bg-gray-50 rounded-xl border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#37B943] disabled:opacity-60 disabled:cursor-not-allowed"
    />
  </div>
);

export default EditUser;