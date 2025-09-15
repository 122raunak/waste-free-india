import React, { use } from "react";
import { UserCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/Navbar/Navbar";
import Button from "../../../components/Button/Button";
import profile from "../../../../public/Profile/profile.png";

function BuyerProfile() {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate("/buyer/profile/edit");
    }
  const userData = {
    name: "Unknown",
    email: "Unknown",
    contact: "NA",
    address: "NA",
  };

  return (
    <>
      <div className="relative z-[90] h-full mt-[-20px]  pb-20 flex flex-col items-center justify-center">
        {/*top porsion */}
        <div className=" flex flex-row justify-center  gap-4 mb-6">
             
          <div className="flex flex-col items-center  gap-6">

            <div className="w-24 h-24 rounded-full overflow-hidden border-2  flex items-center justify-center bg-gray-200">
              <img src={profile} alt="" />
            </div>
            {/* edit button */}
            <div className="">
              <button onClick={handleClick} className="border border-black bg-[#07C907] text-white w-[100px] h-[35px] rounded-2xl"><b>Edit</b></button>
            </div>

          </div>

          <div className="">
            <h2>
              {" "}
              <b>Name: </b> {userData.name}
            </h2>
            <p>
              <b>Email: </b>
              {userData.email}
            </p>
            <p>
              <b>Contact: </b>
              {userData.contact}
            </p>
            <p>
              <b>Address: </b> {userData.address}
            </p>
          </div>
        </div>

        {/*partition line  */}
        <div className="w-full h-0.5 mt-2 bg-black"> </div>

        {/* bottom portion */}
        <div className="h-[60px] w-full">
          <p className=" font-medium mb-3 mt-10 text-center   ">You haven't listed any waste material for sale yet</p>
          <p className=" font-normal text-center ">
            Once a buyer has been found,we will notify you soonvia message. You
            can also check the status directly on our web app
          </p>
        </div>
        <Button text="LogOut" className="bg-red-700 absolute bottom-[-230px] right-[10px] w-40" link="/buyer/logout"/>
        <Navbar/>
      </div>
    </>
  );
}

export default BuyerProfile;
