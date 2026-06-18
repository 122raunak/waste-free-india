import React, { useContext, useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../../../context/AppContext";
import AuthLayout from "../../../components/Layout/AuthLayout";
import googlelogo from "../../../../public/UserLogin/google-icon.png";

const BuyerLogin = () => {
  const { setBuyerIcon, setCurrentBuyer } = useContext(AppContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/buyer/auth/login`,
        formData,
        { withCredentials: true }
      );
      if (res.status === 201) {
        setBuyerIcon(true);
        setCurrentBuyer(res.data.user);
        navigate("/buyer/listofwaste");
      } else {
        setMsg(res.data.message);
      }
    } catch {
      setMsg("Login failed. Check your credentials.");
    } finally {
      setLoading(false);
      setFormData({ email: "", password: "" });
    }
  };

  return (
    <AuthLayout role="buyer">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Partner Login</h1>
      <p className="text-sm text-gray-500 mb-7">Sign in to your buyer account</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="email" name="email" placeholder="Email address"
            value={formData.email} onChange={handleChange} required
            className="w-full h-11 pl-9 pr-4 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:bg-white transition"
          />
        </div>

        <div className="relative">
          <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type={showPw ? "text" : "password"} name="password" placeholder="Password"
            value={formData.password} onChange={handleChange} required
            className="w-full h-11 pl-9 pr-10 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:bg-white transition"
          />
          <button type="button" onClick={() => setShowPw((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        {msg && <p className="text-red-500 text-xs">{msg}</p>}

        <button
          type="submit" disabled={loading}
          className="w-full h-11 bg-[#2196F3] hover:bg-[#1976D2] active:scale-[0.98] text-white font-semibold rounded-xl text-sm transition-all disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
          {loading ? "Signing in..." : "Login as Partner"}
        </button>
      </form>

      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400">or</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <button className="w-full h-11 flex items-center justify-center gap-3 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition text-sm font-medium text-gray-700">
        <img src={googlelogo} alt="Google" className="w-4 h-4" />
        Continue with Google
      </button>

      <p className="text-center text-xs text-gray-500 mt-6">
        Don't have an account?{" "}
        <Link to="/buyer/signup" className="text-[#2196F3] font-semibold hover:underline">Create one</Link>
      </p>
    </AuthLayout>
  );
};

export default BuyerLogin;