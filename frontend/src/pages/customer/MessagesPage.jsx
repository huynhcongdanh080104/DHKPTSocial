import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import defaultAvatar from "../../../avatars/image.png";
import { io } from "socket.io-client";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button,
    HStack,
    VStack,
    Box,
    Input,
    Avatar,
  } from '@chakra-ui/react'
function MessagesPage() {
    const currentUserId = Cookies.get("customerId");
    const [contacts, setContacts] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [lastMessages, setLastMessages] = useState({});
    const messagesEndRef = useRef(null);
    const socket = useRef(null);

    // Kết nối với Socket.IO chỉ một lần khi component được mount
    useEffect(() => {
      // Khởi tạo socket với cấu hình tự động kết nối lại
      socket.current = io("https://dhkptsocial.onrender.com", {
          transports: ["websocket"],
          reconnection: true,
          reconnectionAttempts: 10,
          reconnectionDelay: 1000,
      });
  
      socket.current.on("connect", () => {
          console.log("Socket connected:", socket.current.id);
      });
  
      socket.current.on("disconnect", () => {
          console.log("Socket disconnected");
      });
  
      socket.current.on("connect_error", (error) => {
          console.error("Socket connection error:", error);
      });
  
      // Hủy đăng ký sự kiện trước khi đăng ký lại
      socket.current.off("newMessage");
  
      // Lắng nghe sự kiện nhận tin nhắn mới
      socket.current.on("newMessage", (message) => {
          console.log("Received new message:", message);
  
          if (
              (message.sender === currentUserId && message.receiver === selectedContact?._id) ||
              (message.sender === selectedContact?._id && message.receiver === currentUserId)
          ) {
              setMessages((prevMessages) => filterMessages([...prevMessages, message]));
              scrollToBottom();
          }
      });
  
      // Ngắt kết nối khi component bị unmount
      return () => {
          socket.current.off("newMessage");
          socket.current.disconnect();
          console.log("Socket cleaned up");
      };
  }, [currentUserId, selectedContact]);
  

    // Cuộn xuống cuối danh sách tin nhắn
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
    };
    useEffect(() => {
        axios
            .get(
                `https://dhkptsocial.onrender.com/users/mutual-follows?currentUserId=${currentUserId}`
            )
            .then((response) => {
                setContacts(response.data); // Gán danh sách mutual follows
            })
            .catch((error) => {
                console.error("Error fetching mutual follows:", error);
            });
    }, [currentUserId]);
    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    const filterMessages = (messagesList) => {
      const receiverId = selectedContact?._id;
      return messagesList.filter(
          (msg) =>
              (msg.sender === currentUserId && msg.receiver === receiverId) ||
              (msg.sender === receiverId && msg.receiver === currentUserId)
      );
  };

    // Lấy danh sách người dùng và tin nhắn cuối cùng
    useEffect(() => {
        axios
            .get("https://dhkptsocial.onrender.com/users")
            .then((response) => {
                const userList = response.data.data.filter(
                    (user) => user._id !== currentUserId
                );
                setContacts(userList);

                userList.forEach((contact) => {
                    const contactId = contact._id;
                    axios
                        .get(
                            `https://dhkptsocial.onrender.com/messages/lastMessage/${currentUserId}/${contactId}`
                        )
                        .then((res) => {
                            setLastMessages((prev) => ({
                                ...prev,
                                [contactId]: res.data,
                            }));
                        })
                        .catch((err) =>
                            console.error("Error fetching last message:", err)
                        );
                });
            })
            .catch((error) => {
                console.error("Error fetching user list:", error);
            });
    }, [currentUserId]);

    // Lấy tin nhắn giữa currentUserId và selectedContact
  // Lấy tin nhắn giữa currentUserId và selectedContact
  useEffect(() => {
    if (selectedContact) {
        const receiverId = selectedContact._id;

        // Fetch tin nhắn ban đầu từ API
        Promise.all([
            axios.get(`https://dhkptsocial.onrender.com/messages/${currentUserId}/${receiverId}`),
            axios.get(`https://dhkptsocial.onrender.com/messages/${receiverId}/${currentUserId}`),
        ])
            .then(([res1, res2]) => {
                const combinedMessages = [...res1.data, ...res2.data];
                combinedMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
                setMessages(filterMessages(combinedMessages));
            })
            .catch((error) => {
                console.error("Error fetching messages:", error);
            });

        // Hủy lắng nghe sự kiện cũ trước khi đăng ký lại
        socket.current.off("newMessage");

        // Đăng ký sự kiện newMessage từ Socket.IO
        socket.current.on("newMessage", (message) => {
            if (
                (message.sender === currentUserId && message.receiver === receiverId) ||
                (message.sender === receiverId && message.receiver === currentUserId)
            ) {
                // Thêm tin nhắn mới vào state
                setMessages((prevMessages) => filterMessages([...prevMessages, message]));
            }
        });

        // Cleanup: Hủy lắng nghe sự kiện khi component unmount hoặc selectedContact thay đổi
        return () => {
            socket.current.off("newMessage");
        };
    }
}, [selectedContact, currentUserId]);
    // Gửi tin nhắn
    const sendMessage = () => {
      if (!newMessage.trim()) return;
  
      const receiverId = selectedContact._id;
      const messageData = {
          sender: currentUserId,
          receiver: receiverId,
          content: newMessage,
          timestamp: new Date(),
      };
  
      // Gửi tin nhắn qua API
      axios
          .post("https://dhkptsocial.onrender.com/messages", messageData)
          .then(() => {
              // Emit sự kiện qua Socket.IO, không cần thêm vào state
              socket.current.emit("sendMessage", messageData);
              console.log("Message sent:", messageData);
              setNewMessage("");
          })
          .catch((error) => {
              console.error("Error sending message:", error);
          });
  };

    return (
        <div className="flex flex-col md:flex-row md:h-screen ">
            <div className="w-full md:w-1/3 bg-black text-white p-4 overflow-y-auto border-r border-gray-700">
                <h2 className="text-2xl font-bold mb-4">Tin nhắn</h2>
                {contacts.map((contact) => (
                    <div
                        key={contact._id}
                        onClick={() => setSelectedContact(contact)}
                        className={`p-4 flex items-center hover:bg-gray-800 cursor-pointer ${
                            selectedContact?._id === contact._id
                                ? "bg-gray-800"
                                : ""
                        }`}
                    >
                        <Avatar
                            src={`https://dhkptsocial.onrender.com/files/download/${contact.avatar}`}
                            alt="Avatar"
                            className="w-12 h-12 rounded-full mr-3"
                        />
                        <div className="flex-1">
                            <div className="text-lg font-semibold">
                                {contact.name}
                            </div>
                            <div className="text-sm text-gray-400">
                                {lastMessages[contact._id]?.content ||
                                    "No messages yet"}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="w-full md:w-2/3 flex flex-col bg-black text-white md:h-full h-[500px]">
                {selectedContact ? (
                    <>
                        {/* Header của hộp chat */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-700">
                            <div className="flex items-center">
                                <Avatar
                                    src={
                                        `https://dhkptsocial.onrender.com/files/download/${selectedContact?.avatar}`
                                    }
                                    alt="Avatar"
                                    className="w-10 h-10 rounded-full mr-3"
                                />
                                <div>
                                    <h3 className="text-lg font-bold">
                                        {selectedContact?.name || "User"}
                                    </h3>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 p-4 overflow-y-auto">
                            {messages.map((msg, index) => (
                                <div
                                    key={msg._id || index}
                                    className={`mb-4 ${
                                        msg.sender === currentUserId
                                            ? "flex justify-end"
                                            : "flex justify-start"
                                    }`}
                                >
                                    <div
                                        className={`inline-block max-w-xs p-3 rounded-lg shadow-md ${
                                            msg.sender === currentUserId
                                                ? "bg-blue-600 text-white"
                                                : "bg-gray-700 text-white"
                                        } text-left`}
                                        style={{
                                            wordWrap: "break-word",
                                            textAlign: "left",
                                            marginBottom: "8px", // Thêm khoảng cách giữa các tin nhắn
                                        }}
                                    >
                                        <p className="break-words">
                                            {msg.content}
                                        </p>
                                        <span className="text-xs text-gray-300 mt-1 block">
                                            {new Date(
                                                msg.timestamp
                                            ).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="p-4 flex">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") sendMessage();
                                }}
                                className="flex-1 p-2 bg-gray-800 rounded text-white"
                                placeholder="Nhập tin nhắn..."
                            />
                            <button
                                onClick={sendMessage}
                                className="ml-2 p-2 bg-blue-600 rounded text-white"
                            >
                                Gửi
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                        Chọn một cuộc trò chuyện để bắt đầu
                    </div>
                )}
            </div>
        </div>
    );
}

export default MessagesPage;
