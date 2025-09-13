import React, { useState, useEffect } from "react";
import Button from "../../../Components/Button/Button";
import Navbar from "../../../Components/Navbar/Navbar";
import WasteGame from "./WasteGame";

const Games = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // Timer logic
  useEffect(() => {
    if (!isPlaying || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameOver(true); // Game ends
          setIsPlaying(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  // Format mm:ss
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // Restart game
  const startGame = () => {
    setIsPlaying(true);
    setTimeLeft(60);
    setScore(0);
    setGameOver(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-[80%] w-full">
      {!isPlaying && !gameOver && (
        // ---------- BEFORE PLAY STARTS ----------
        <div className="flex flex-col items-center justify-center text-center space-y-4 p-4">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Sort the trash into the right bins
          </h1>

          <h2 className="text-xl font-semibold text-gray-700">
            in under <span className="text-green-600 font-bold">1 minute</span>
          </h2>

          <p className="text-lg text-gray-600">
            Earn points for every correct move
          </p>

          <h3 className="text-2xl font-bold text-green-600 animate-pulse">
            The faster you go, <br /> the higher you score!
          </h3>

          <Button
            text="Play Now"
            className="mt-20 w-[250px]"
            onClick={startGame}
          />
        </div>
      )}

      {isPlaying && !gameOver && (
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="flex space-x-6 pb-10">
            <div className="px-6 py-2 bg-[#F1BB0E] text-black font-bold rounded-lg shadow-md">
              Time: {formatTime(timeLeft)}
            </div>
            <div className="px-6 py-2 bg-[#07C907] text-white font-bold rounded-lg shadow-md">
              Score: {score}
            </div>
          </div>

          <p className="text-lg text-gray-700 mb-6">
            Drag and drop each item into the correct bin!
          </p>

          {/* Import waste game */}
          <WasteGame score={score} setScore={setScore} />
        </div>
      )}

      {gameOver && (
        // ---------- GAME OVER MODE ----------
        <div className="flex flex-col items-center justify-center text-center space-y-6">
          <h2 className="text-2xl font-bold text-red-600">Game Over!</h2>

          {/* Score Button */}
          <Button
            text={`Score: ${score}`}
            variant="secondary"
            className="bg-[#F1BB0E] text-black w-[200px]"
          />

          {/* Restart Button */}
          <Button
            text="Restart"
            variant="primary"
            className="bg-[#07c907] hover:bg-green-700 w-[200px]"
            onClick={startGame}
          />
        </div>
      )}
    </div>
  );
};

export default Games;
