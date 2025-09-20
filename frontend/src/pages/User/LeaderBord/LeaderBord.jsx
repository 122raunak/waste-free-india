import React from "react";
import ShinyText from "../../../components/Animation/ShinyText";
import profile from "../../../../public/Profile/profile.png";

function LeaderBord() {
  const LeadrBordRank = [
    { rank: 4, name: "Unknown", segregation: 92 },
    { rank: 5, name: "Unknown", segregation: 90 },
    { rank: 6, name: "Unknown", segregation: 88 },
    { rank: 7, name: "Unknown", segregation: 85 },
    { rank: 8, name: "Unknown", segregation: 83 },
    { rank: 9, name: "Unknown", segregation: 80 },
    { rank: 10, name: "Unknown", segregation: 78 },
    { rank: 11, name: "Unknown", segregation: 75 },
    { rank: 12, name: "Unknown", segregation: 72 },
  ];

  return (
    <div className="flex flex-col h-screen w-full pt-10 bg-gradient-to-b from-[#B8EBBE] to-[#81E68D] text-center">
      <ShinyText
        text="Champions of the Week"
        speed={4}
        textColor="#155724"
        className="text-3xl font-bold mb-6"
      />

      <div className="flex justify-center items-end gap-6 mb-10">
        <div className="flex flex-col items-center">
          <div className="relative h-20 w-20 sm:h-24 sm:w-24">
            <img
              src={profile}
              className="h-full w-full rounded-full shadow-md border-2 border-green-600"
            />
            <p className="absolute -bottom-2 right-1 bg-gray-300 text-black font-bold text-sm rounded-full px-2 py-1">
              2
            </p>
          </div>
          <h2 className="text-green-900 font-bold mt-2">Unknown</h2>
          <div className="w-20 bg-green-200 rounded-full h-2 mt-1">
            <div
              className="bg-green-700 h-2 rounded-full"
              style={{ width: "92%" }}
            ></div>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="relative h-28 w-28 sm:h-32 sm:w-32">
            <img
              src={profile}
              className="h-full w-full rounded-full shadow-xl border-4 border-yellow-400"
            />
            <i className="fa-solid fa-crown absolute -top-4 left-1/2 transform -translate-x-1/2 text-yellow-400 text-3xl animate-bounce"></i>
            <p className="absolute -bottom-2 right-1 bg-yellow-400 text-black font-bold text-sm rounded-full px-3 py-1">
              1
            </p>
          </div>
          <h2 className="text-green-900 font-bold mt-2">Unknown</h2>
          <div className="w-24 bg-green-200 rounded-full h-3 mt-1">
            <div
              className="bg-green-700 h-3 rounded-full"
              style={{ width: "95%" }}
            ></div>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="relative h-20 w-20 sm:h-24 sm:w-24">
            <img
              src={profile}
              className="h-full w-full rounded-full shadow-md border-2 border-orange-400"
            />
            <p className="absolute -bottom-2 right-1 bg-orange-500 text-black font-bold text-sm rounded-full px-2 py-1">
              3
            </p>
          </div>
          <h2 className="text-green-900 font-bold mt-2">Unknown</h2>
          <div className="w-20 bg-green-200 rounded-full h-2 mt-1">
            <div
              className="bg-green-700 h-2 rounded-full"
              style={{ width: "90%" }}
            ></div>
          </div>
        </div>
      </div>

      <div className="bg-green-100 flex-1 overflow-y-auto px-4 py-4 rounded-t-3xl mb-10">
        {LeadrBordRank.map((user) => (
          <div
            key={user.rank}
            className="flex items-center justify-between gap-5 bg-green-200 rounded-2xl py-3 px-6 mb-6 hover:scale-105 transform transition duration-200 shadow"
          >
            <p className={`font-semibold text-xl text-black`}>{user.rank}</p>
            <img
              src={profile}
              alt=""
              className="h-12 w-12 rounded-full object-cover border-2 border-green-500"
            />
            <div className="flex-1 ml-4 text-left">
              <h2 className="text-green-900 font-semibold">{user.name}</h2>
              <div className="w-full bg-green-300 rounded-full h-2 mt-1">
                <div
                  className="bg-green-700 h-2 rounded-full"
                  style={{ width: `${user.segregation}%` }}
                ></div>
              </div>
            </div>
            <p className="text-green-900 font-bold ml-4">{user.segregation}%</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LeaderBord;
