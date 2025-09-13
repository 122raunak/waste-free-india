import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function BuyerLogout() {
  const navigate = useNavigate();

  useEffect(() => {
    const doLogout = async () => {
      try {
        await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/user/auth/logout`,
          { withCredentials: true }
        );
        localStorage.removeItem("sellerIon");
        console.log("Logged out successfully");
      } catch (err) {
        console.error("Logout failed:", err);
      } finally {
        // navigate("/user/home", { replace: true });
        // if i use this need to reload two times thts why 
        window.location.href = "/user/home";
      }
    };

    doLogout();
  }, [navigate]);

  return <p>Logging out...</p>;
}

export default BuyerLogout;
