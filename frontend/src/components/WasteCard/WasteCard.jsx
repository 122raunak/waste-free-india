import React from "react";
import { useNavigate } from "react-router-dom";
import { Package, Weight, DollarSign, Tag, Clock } from "lucide-react";

// Reusable waste listing card used in ListOfWaste, MyListings, MyAccepted
const categoryEmoji = {
  Paper: "📦",
  Plastic: "🥤",
  Metal: "⚙️",
  "E-waste": "💻",
};

const statusColors = {
  pending:   "bg-yellow-100 text-yellow-700",
  assigned:  "bg-blue-100 text-blue-700",
  collected: "bg-purple-100 text-purple-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-600",
};

const WasteCard = ({ item, showLearnMore = false, linkTo, onStatusChange }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (linkTo) navigate(linkTo);
  };

  return (
    <div
      onClick={handleClick}
      className={`bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all
        ${linkTo ? "cursor-pointer hover:shadow-md hover:-translate-y-0.5 active:scale-[0.99]" : ""}
      `}
    >
      <div className="flex gap-3 p-3 sm:p-4">
        {/* Image */}
        <div className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
          {item.image ? (
            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl">
              {categoryEmoji[item.category] || "♻️"}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
              {item.title || "Untitled"}
            </h3>
            {item.status && (
              <span className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-medium capitalize shrink-0 ${statusColors[item.status] || "bg-gray-100 text-gray-600"}`}>
                {item.status}
              </span>
            )}
          </div>

          <span className="inline-flex items-center gap-1 text-xs text-gray-500 mt-0.5">
            <Tag size={11} />
            {categoryEmoji[item.category]} {item.category}
          </span>

          <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2">
            {item.quantity && (
              <span className="flex items-center gap-1 text-xs text-gray-600">
                <Package size={12} className="text-gray-400" />
                {item.quantity} units
              </span>
            )}
            {item.weight && (
              <span className="flex items-center gap-1 text-xs text-gray-600">
                <Weight size={12} className="text-gray-400" />
                {item.weight}
              </span>
            )}
            {item.estimatedPrice && (
              <span className="flex items-center gap-1 text-xs font-medium text-green-700 col-span-2"> 
                ₹{item.estimatedPrice}
              </span>
            )}
          </div>

          {/* Assigned buyer badge */}
          {item.assignedBuyer && (
            <div className="mt-2 flex items-center gap-1.5 text-xs text-blue-700 bg-blue-50 px-2 py-1 rounded-md">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              Buyer: {item.assignedBuyer.FullName?.FirstName} {item.assignedBuyer.FullName?.LastName}
            </div>
          )}
        </div>
      </div>

      {/* Learn More / View button */}
      {showLearnMore && linkTo && (
        <div className="border-t border-gray-100 px-4 py-2 bg-gray-50">
          <span className="text-xs font-medium text-[#41c45a]">View Details →</span>
        </div>
      )}

      {/* Status update dropdown (for seller's My Listings) */}
      {onStatusChange && (
        <div className="border-t border-gray-100 px-3 py-2 bg-gray-50 flex items-center justify-between">
          <span className="text-xs text-gray-500">Update status:</span>
          <select
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => onStatusChange(item._id, e.target.value)}
            value={item.status}
            className="text-xs border border-gray-200 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-green-400"
          >
            <option value="pending">Pending</option>
            <option value="assigned">Assigned</option>
            <option value="collected">Collected</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      )}
    </div>
  );
};

export default WasteCard;