const HamburgerIcon = ({ menuOpen, onClick }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      className="w-8 h-8 cursor-pointer"
      onClick={onClick}
    >
      {/* Top Line */}
      <rect
        x="10"
        y="20"
        width="44"
        height="4"
        className={`fill-black transition-transform duration-300 ease-in-out origin-center ${
          menuOpen ? "rotate-45 translate-y-12" : ""
        }`}
      />
      {/* Middle Line */}
      <rect
        x="10"
        y="32"
        width="44"
        height="4"
        className={`fill-black transition-opacity duration-300 ${
          menuOpen ? "opacity-0" : "opacity-100"
        }`}
      />
      {/* Bottom Line */}
      <rect
        x="10"
        y="44"
        width="44"
        height="4"
        className={`fill-black transition-transform duration-300 ease-in-out origin-center ${
          menuOpen ? "-rotate-45 -translate-y-12" : ""
        }`}
      />
    </svg>
  );
};

export default HamburgerIcon;
