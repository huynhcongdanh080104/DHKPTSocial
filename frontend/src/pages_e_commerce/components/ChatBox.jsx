import React, { useState } from "react";
import axios from "axios";
import { Send, X } from "lucide-react";
import Cookies from "js-cookie";

const ChatBox = ({ storeId, storeName, onClose }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const userId = Cookies.get("customerId");

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;
        
        const messageData = {
            sender: userId,
            receiver: storeId, // ID của shop
            message: newMessage,
        };

        try {
            // Gửi tin nhắn lên server
            const res = await axios.post("https://dhkshop.onrender.com/chat/send", messageData);
            setMessages([...messages, { sender: "user", text: newMessage }, { sender: "ai", text: res.data.response }]);
            setNewMessage(""); // Xóa input sau khi gửi
        } catch (error) {
            console.error("Lỗi khi gửi tin nhắn:", error);
        }
    };

    return (
        <div className="fixed bottom-5 right-5 w-80 bg-white shadow-lg border rounded-lg overflow-hidden">
            <div className="bg-blue-500 text-white p-3 flex justify-between items-center">
                <span className="font-bold">Chat với {storeName}</span>
                <button onClick={onClose} className="text-white">
                    <X size={20} />
                </button>
            </div>
            <div className="h-60 p-3 overflow-y-auto bg-gray-100">
                {messages.map((msg, index) => (
                    <div key={index} className={`p-2 my-1 rounded-md ${msg.sender === "user" ? "bg-blue-500 text-white self-end" : "bg-gray-300 text-black self-start"}`}>
                        {msg.text}
                    </div>
                ))}
            </div>
            <div className="flex p-3 border-t">
                <input 
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="w-full p-2 border rounded-md"
                    placeholder="Nhập tin nhắn..."
                />
                <button onClick={handleSendMessage} className="bg-blue-500 text-white px-3 py-2 rounded-md flex items-center gap-1 ml-2">
                    Gửi <Send size={16} />
                </button>
            </div>
        </div>
    );
};

export default ChatBox;
