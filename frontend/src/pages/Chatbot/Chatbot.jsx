import React, { useRef, useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar"
import { Plus, Send, X, Image as ImageIcon, Paperclip } from "lucide-react";
import axios from "axios";

const Chatbot = () => {
  const [showOptions, setShowOptions] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [inputFocused, setInputFocused] = useState(false);
  const [botreply, setbotReply] = useState("");
  const [loading, setloading] = useState(false);

  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const handleSend = async () => {
    setloading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/chatbot/api/chat`,
        { message: message },
        {
          withCredentials: true,
        }
      );

      const reply = res.data.reply;
      setbotReply(reply);
      console.log(res.data.reply);

      setChat((prev) => [
        ...prev,
        { text: message, sender: "user" },
        { text: reply, sender: "bot" },
      ]);
      setMessage("");
    } catch (error) {
      console.error(error);
    } finally {
      setloading(false);
    }
  };

  // handle image upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setChat((prev) => [
        ...prev,
        { text: `📎 Attached: ${file.name}`, sender: "user" },
      ]);
    }
  };

  // auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  return (
    <>
      {/* Chat messages area */}
      <div
        className={`flex-1 w-full px-4 py-2 overflow-y-auto fixed top-40 transition-all duration-200 ${
          inputFocused ? "bottom-35" : "bottom-40"
        }`}
      >
        {chat.map((msg, i) => (
          <div
            key={i}
            className={`mb-2 p-2 rounded-lg max-w-[80%] break-words ${
              msg.sender === "user"
                ? "ml-auto bg-green-200"
                : "mr-auto bg-gray-200"
            }`}
          >
            {msg.text}
          </div>
        ))}

        {/* Show loading bubble separately */}
        {loading && (
          <div className="mb-2 p-2 rounded-lg max-w-[80%] break-words mr-auto bg-gray-200 text-gray-400 italic">
            We are trying to give you the best results possible, so it may take
            up to 10–15 seconds
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Options popup */}
      {showOptions && (
        <div
          className={`${
            inputFocused ? "sticky bottom-32" : "fixed bottom-44"
          } left-10 rounded-lg p-4 flex flex-col z-40 w-60 bg-white h-40 border justify-center items-center shadow-md`}
        >
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            className="flex items-center gap-2 p-2 border rounded-lg hover:bg-gray-100 w-full"
            onClick={() => fileInputRef.current.click()}
          >
            <ImageIcon className="w-5 h-5" />
            Add Photo
          </button>

          <button
            onClick={() => setShowOptions(false)}
            className="absolute top-2 right-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Input box */}
      <div
        className={`px-3 pb-2 fixed w-full z-30 transition-all duration-200 ${
          inputFocused ? "bottom-18" : "bottom-20"
        }`}
      >
        <div
          className={`w-full flex items-center border rounded-xl p-2 shadow-md bg-white transition ${
            inputFocused ? "ring-2 ring-green-400 border-green-400" : ""
          }`}
        >
          <button onClick={() => setShowOptions(!showOptions)} className="p-2">
            {showOptions ? (
              <Plus className="w-6 h-6 text-gray-500" />
            ) : (
              <Paperclip className="w-6 h-6 text-gray-500" />
            )}
          </button>
          <input
            type="text"
            placeholder="Ask your waste-related questions"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            className="flex-1 px-2 outline-none"
          />

          <button onClick={handleSend} className="p-2">
            <Send className="w-6 h-6 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Navbar stays at bottom */}
      <Navbar/>
    </>
  );
};

export default Chatbot;
