import React from "react";

function LocationSearchpanel({ AddressSeggestion, setFormData, setPanelOpen }) {
  if (!AddressSeggestion?.length) {
    return null;
  }

  return (
    <div className="overflow-y-auto max-h-[380px] px-3 pb-10">
      {AddressSeggestion.map((suggestion, idx) => (
        <div
          key={idx}
          onClick={(e) => {
            e.stopPropagation();
            setFormData((prev) => ({
              ...prev,
              Address: suggestion.description,
            }));
            setPanelOpen(false);
          }}
          className="flex items-start gap-3 mb-4 cursor-pointer p-3 border-2 border-gray-100 rounded-2xl hover:border-green-400 hover:bg-gray-50 transition"
        >
          <div className="bg-[#eeeeee] h-10 w-10 flex justify-center items-center rounded-full flex-shrink-0">
            <i className="fa-solid fa-location-dot text-lg text-green-800"></i>
          </div>

          <h4 className="font-medium text-gray-700 break-words whitespace-normal flex-1 min-w-0">
            {suggestion.description}
          </h4>
        </div>
      ))}
    </div>
  );
}

export default LocationSearchpanel;
