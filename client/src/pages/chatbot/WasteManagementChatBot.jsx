import React, { useState, useEffect, useRef } from "react";
import { Upload, Send } from "lucide-react";

const WasteManagementChatBot = () => {
  const [messages, setMessages] = useState([
    { text: "Hello! How can I assist you with waste management today?" }
  ]);
  const [input, setInput] = useState("");
  const [image, setImage] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (input.trim() || image) {
      const newMessage = { text: input, image };
      setMessages([...messages, newMessage]);

      // Simulating auto-reply after user message
      setTimeout(() => {
        const botReply = { text: "Thank you for your message! I will look into that." };
        setMessages((prevMessages) => [...prevMessages, botReply]);
      }, 1500); // Bot reply after 1.5 seconds

      setInput("");
      setImage(null);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-green-50 p-6">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-xl p-6 border border-green-300">
        <h2 className="text-2xl font-semibold text-green-700 text-center mb-4">Smart Garbage Chatbot</h2>
        <div className="h-96 overflow-y-auto mb-4 p-4 border rounded-lg bg-white shadow-inner">
          {messages.map((msg, index) => (
            <div
              key={index}
              className="mb-3 p-3 max-w-lg rounded-lg shadow-md"
              style={{
                backgroundColor: index % 2 === 0 ? "#E6F4EA" : "#D1E7D1",
              }}
            >
              {msg.text && <p className="text-green-900">{msg.text}</p>}
              {msg.image && (
                <img
                  src={URL.createObjectURL(msg.image)}
                  alt="Uploaded"
                  className="mt-2 w-full rounded-lg border border-green-300"
                />
              )}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <div className="flex items-center gap-3 p-3 bg-white border border-green-300 rounded-lg shadow-md">
          <label className="flex items-center gap-2 p-2 border rounded-lg bg-white text-green-900 cursor-pointer shadow-md hover:bg-green-100">
            <Upload className="w-5 h-5 text-green-600" />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="hidden"
            />
          </label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-3 border rounded-lg bg-white text-green-900 placeholder-gray-500 shadow-md focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <button
            onClick={handleSendMessage}
            className="p-3 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition duration-200"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WasteManagementChatBot;
