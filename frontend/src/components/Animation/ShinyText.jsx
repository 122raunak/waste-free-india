import React from "react";

const ShinyText = ({
  text,
  disabled = false,
  speed = 5,
  className = "",
  baseColor = "#388e3c",
  shineColor = "#ffffff",
}) => {
  const animationDuration = `${speed}s`;

  return (
    <span className={`relative inline-block ${className}`}>
      <span className="relative z-0" style={{ color: baseColor }}>
        {text}
      </span>

      {!disabled && (
        <span
          className="absolute inset-0 z-10 text-transparent"
          style={{
            backgroundImage: `linear-gradient(
              120deg, 
              rgba(255,255,255,0) 40%, 
              ${shineColor} 50%, 
              rgba(255,255,255,0) 60%
            )`,
            backgroundSize: "200% 100%",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            animation: `shine ${animationDuration} linear infinite`,
          }}
        >
          {text}
        </span>
      )}

      <style>{`
        @keyframes shine {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </span>
  );
};

export default ShinyText;
