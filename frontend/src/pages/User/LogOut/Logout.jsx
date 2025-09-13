import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    const doLogout = async () => {
      try {
        await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/user/auth/logout`,
          { withCredentials: true }
        );
        console.log("Logged out successfully");
      } catch (err) {
        console.error("Logout failed:", err);
      } finally {
        localStorage.removeItem("sellerIon");
        navigate("/user/home", { replace: true });
      }
    };

    doLogout();
  }, [navigate]);

  return <p>Logging out...</p>;
}

export default Logout;
