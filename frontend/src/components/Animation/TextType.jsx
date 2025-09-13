import React, { useState, useEffect } from "react";

const TextType = ({ text = [], typingSpeed = 100, pauseDuration = 1500, showCursor = true, cursorCharacter = "|" }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let typingTimeout;

    if (!isDeleting && charIndex < text[currentIndex].length) {
      typingTimeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex][charIndex]);
        setCharIndex((prev) => prev + 1);
      }, typingSpeed);
    } else if (!isDeleting && charIndex === text[currentIndex].length) {
      typingTimeout = setTimeout(() => setIsDeleting(true), pauseDuration);
    } else if (isDeleting && charIndex > 0) {
      typingTimeout = setTimeout(() => {
        setDisplayedText((prev) => prev.slice(0, -1));
        setCharIndex((prev) => prev - 1);
      }, typingSpeed / 2);
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setCurrentIndex((prev) => (prev + 1) % text.length);
    }

    return () => clearTimeout(typingTimeout);
  }, [charIndex, isDeleting, text, currentIndex, typingSpeed, pauseDuration]);

  return (
    <span>
      {displayedText}
      {showCursor && <span className="animate-pulse">{cursorCharacter}</span>}
    </span>
  );
};

export default TextType;
