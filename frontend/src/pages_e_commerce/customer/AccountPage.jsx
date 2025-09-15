import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const AccountPage = () => {
    const [user, setUser] = useState(null);
    const userId = Cookies.get("customerId");

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

    if (!user) return <p className="text-center mt-10">🔄 Đang tải thông tin...</p>;

    return (
        <div className="w-full p-8">
            <div className="mx-auto w-full max-w-4xl border rounded-lg shadow-md bg-white p-8">
                <h1 className="text-3xl font-bold mb-6 text-center">🧑‍💼 Thông tin tài khoản</h1>

                <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex justify-center md:justify-start">
                        <img
                            src={user.avatar ? `https://dhkptsocial.onrender.com/files/download/${user.avatar}` : "https://cdn.builder.io/api/v1/image/assets/TEMP/default-avatar.png"}
                            className="border border-solid border-zinc-400 h-[120px] w-[120px] rounded-full object-cover"
                            alt="User Avatar"
                        />
                    </div>

                    <div className="flex-1 space-y-4 text-[17px]">
                        <p><strong>👤 Họ và Tên:</strong> {user.name}</p>
                        <p><strong>📧 Email:</strong> {user.email}</p>
                        <p><strong>📱 Số điện thoại:</strong> {user.phone}</p>
                        <p><strong>📅 Ngày sinh:</strong> {new Date(user.dob).toLocaleDateString()}</p>
                        {user.address?.length > 0 && (
                            <p><strong>🏠 Địa chỉ:</strong> {user.address}</p>
                        )}
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <button className="bg-blue-500 text-white px-5 py-2.5 rounded-md hover:bg-blue-600 transition">
                        ✏️ Chỉnh sửa thông tin
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AccountPage;
