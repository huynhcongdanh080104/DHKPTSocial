import React, { useEffect, useState } from "react";
import axios from "axios";
import SearchInput from "./SearchInput";
import CartIcon from "./CartIcon";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

function HeaderTop() {
    const [user, setUser] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const userId = Cookies.get("customerId");
    const navigate = useNavigate();

    useEffect(() => {
        if (userId) {
            axios.get(`https://dhkptsocial.onrender.com/users/${userId}`)
                .then((response) => {
                    setUser(response.data);
                })
                .catch((error) => {
                    console.error("Lỗi khi lấy thông tin user:", error);
                });
        }
    }, [userId]);

    const handleLogout = () => {
        Cookies.remove("customerId");
        Cookies.remove("customerName")
        Cookies.remove("store");
        window.location.href = "/e-commerce";
    };

    return (
        <header className="relative flex justify-center items-center px-10 py-5 bg-white max-md:px-5 max-md:py-4 max-sm:flex-col max-sm:gap-4">
            <div className="flex gap-3.5 items-center w-1/2">
                <img
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/1e2032fd40796519a4886960ff20baefdcfcd0e3"
                    className="h-[50px] w-[50px]"
                    alt="Logo"
                />
                <h1 className="text-2xl font-bold text-black hover:cursor-pointer" onClick={() => navigate('/e-commerce/customer/home')}>DHKPTShop</h1>
            </div>


            <div className="flex gap-11 items-center justify-end w-1/2">
                {/* 🔥 Avatar với dropdown */}
                <div className="relative">
                    <img
                        src={user?.avatar ? `https://dhkptsocial.onrender.com/files/download/${user.avatar}` : "https://cdn.builder.io/api/v1/image/assets/TEMP/default-avatar.png"}
                        className="border border-solid border-zinc-400 h-[50px] rounded-[99px] w-[50px] object-cover cursor-pointer"
                        alt="User Avatar"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                    />
                    {dropdownOpen && user && (
                        <div className="absolute right-0 mt-2 w-56 bg-white border rounded-md shadow-md z-50 p-2">
                            <ul className="space-y-2">
                                <li
                                    className="cursor-pointer px-4 py-2 hover:bg-gray-100 rounded-md flex items-center gap-2"
                                    onClick={() => navigate("/e-commerce/customer/account")}
                                >
                                    🧑‍💼 Thông tin tài khoản
                                </li>
                                <li
                                    className="cursor-pointer px-4 py-2 hover:bg-gray-100 rounded-md flex items-center gap-2"
                                    onClick={() => navigate("/e-commerce/customer/account/orders")}
                                >
                                    📦 Đơn hàng
                                </li>
                                <li
                                    className="cursor-pointer px-4 py-2 bg-red-500 text-white hover:bg-red-600 rounded-md text-center"
                                    onClick={handleLogout}
                                >
                                    🚪 Đăng xuất
                                </li>
                            </ul>
                        </div>
                    )}
                </div>

                <CartIcon />
            </div>
        </header>
    );
}

export default HeaderTop;
