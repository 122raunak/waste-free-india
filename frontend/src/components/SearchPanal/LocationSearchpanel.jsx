import React from "react";

function LocationSearchpanel({ AddressSeggestion, setFormData, setPanelOpen }) {
  // Return null when no suggestions — the GSAP animation handles showing/hiding
  // the parent panel div, so we don't need to show anything here when empty
  if (!AddressSeggestion?.length) {
    return null;
  }

  return (
    <div className="overflow-y-auto max-h-[320px] px-3 pt-2 pb-6">
      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide px-1 mb-2">
        Suggestions
      </p>
      {AddressSeggestion.map((suggestion, idx) => {
        const label =
          suggestion.description ||
          suggestion.display_name ||
          "Unknown location";
        const mainText =
          suggestion.structured_formatting?.main_text ||
          label.split(",")[0];
        const subText =
          suggestion.structured_formatting?.secondary_text ||
          label.split(",").slice(1, 3).join(",").trim();

        return (
          <div
            key={idx}
            onClick={(e) => {
              e.stopPropagation();
              setFormData((prev) => ({
                ...prev,
                Address: label,
              }));
              setPanelOpen(false);
            }}
            className="flex items-start gap-3 mb-2 cursor-pointer p-3 border border-gray-100 rounded-2xl hover:border-green-400 hover:bg-green-50 active:bg-green-100 transition"
          >
            <div className="bg-[#e8f8ea] h-9 w-9 flex justify-center items-center rounded-full flex-shrink-0 mt-0.5">
              <i className="fa-solid fa-location-dot text-base text-green-700" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 text-sm truncate">{mainText}</p>
              {subText && (
                <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{subText}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default LocationSearchpanel;