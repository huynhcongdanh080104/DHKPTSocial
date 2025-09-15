import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import Cookies from "js-cookie";
import defaultAvatar from "../../../avatars/naruto.png";

function SearchPage() {
    const currentUserId = Cookies.get("customerId");
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [mayKnowUsers, setMayKnowUsers] = useState([]);
    const [randomUsers, setSuggestedUsers] = useState([]);
    useEffect(() => {
        // Lấy danh sách người dùng ngẫu nhiên
        axios
            .get(`https://dhkptsocial.onrender.com/search/random?userId=${currentUserId}`)
            .then((res) => {
                setSuggestedUsers(res.data.data);
            })
            .catch((err) => {
                console.error("Error fetching random users:", err);
            });

        // Lấy danh sách "Có thể bạn sẽ biết"
        axios
            .get(
                `https://dhkptsocial.onrender.com/search/may-know?userId=${currentUserId}`
            )
            .then((res) => {
                setMayKnowUsers(res.data.data);
            })
            .catch((err) => {
                console.error("Error fetching may-know users:", err);
            });
    }, [currentUserId]);
    // Xử lý tìm kiếm
    const handleSearch = (event) => {
        const term = event.target.value;
        setSearchTerm(term);

        if (term.trim() === "") {
            setSearchResults([]);
        } else {
            axios
                .get(
                    `https://dhkptsocial.onrender.com/search/users?query=${term}&userId=${currentUserId}`
                )
                .then((res) => {
                    setSearchResults(res.data.data);
                })
                .catch((err) => {
                    console.error("Error searching users:", err);
                });
        }
    };

    // Hiển thị danh sách người dùng
    const renderUserList = (users) => (
        <div className="w-full space-y-4 max-h-[70vh] pr-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800 overflow-y-auto">
            {users.map((user) => (
                <Link to={`/users/${user._id}`} key={user._id}>
                    <div className="flex items-center space-x-3 cursor-pointer hover:bg-gray-800 p-2 rounded-md">
                        <img
                            src={
                                user.avatar
                                    ? `https://dhkptsocial.onrender.com/files/download/${user.avatar}`
                                    : defaultAvatar
                            }
                            alt="Avatar"
                            className="w-14 h-14 rounded-full"
                        />
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold">
                                {user.name}
                            </h3>
                            <p className="text-sm text-gray-400">
                                {user.username}
                            </p>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );

    return (
        <div className="flex flex-col items-start p-8 bg-black text-white min-h-screen max-w-md mx-auto">
            <h2 className="text-3xl font-bold mb-6">Tìm kiếm</h2>

            {/* Thanh tìm kiếm */}
            <div className="relative w-full mb-6">
                <input
                    type="text"
                    placeholder="Nhập thông tin tìm kiếm"
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full p-3 pl-12 rounded-full bg-gray-800 text-white placeholder-gray-500 focus:outline-none"
                />
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg" />
            </div>

            {/* Nội dung cuộn */}

            <div className="w-full">
                {searchTerm.trim() === "" ? (
                    <>
                        <h3 className="text-xl font-semibold mb-4">Đề xuất</h3>
                        {renderUserList(randomUsers)}

                        <h3 className="text-xl font-semibold mt-8 mb-4">
                            Những người bạn có thể biết
                        </h3>
                        {renderUserList(mayKnowUsers)}
                    </>
                ) : (
                    <>
                        <h3 className="text-xl font-semibold mb-4">
                            Kết quả tìm kiếm
                        </h3>
                        {searchResults.length > 0 ? (
                            renderUserList(searchResults)
                        ) : (
                            <p className="text-gray-400">
                                Không tìm thấy kết quả
                            </p>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default SearchPage;
