import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Cookies from "js-cookie";    

// ✅ Map trạng thái đơn hàng thành nội dung dễ hiểu
const statusMapping = {
    pending: { text: "🕒 Đơn hàng đã đặt", color: "text-yellow-500" },
    shipping: { text: "🚚 Đang giao hàng", color: "text-blue-500" },
    shipped: { text: "📦 Đã nhận hàng", color: "text-purple-500" },
    cancelled: { text: "❌ Đã hủy", color: "text-red-500" },
};

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const userId = Cookies.get("customerId");

    useEffect(() => {
        axios.get(`https://dhkshop.onrender.com/order/user/${userId}`)
            .then((res) => setOrders(res.data))
            .catch((err) => console.error("Lỗi khi lấy danh sách đơn hàng:", err));
    }, []);

    return (
        <div>
            <div className="container mx-auto p-5">

                <h1 className="text-2xl font-bold mb-5">🛒 Danh sách đơn hàng</h1>
                {orders.length === 0 ? (
                    <p>Chưa có đơn hàng nào.</p>
                ) : (
                    <ul className="space-y-4">
                        {orders.map((order) => {
                            const isVNPayPending = order.paymentMethod === "VNPay" && order.paymentStatus === "pending";
                            const statusInfo = statusMapping[order.status] || { text: "❓ Không xác định", color: "text-gray-500" };

                            return (
                                <li key={order._id} className="border p-4 rounded-lg shadow-md">
                                    <h2 className="font-semibold">🆔 Mã đơn: {order._id}</h2>

                                    <p>
                                        📦 Trạng thái:{" "}
                                        {isVNPayPending ? (
                                            <span className="font-bold text-orange-500">
                                                🛑 Chưa thanh toán (VNPay)
                                            </span>
                                        ) : (
                                            <span className={`font-bold ${statusInfo.color}`}>
                                                {statusInfo.text}
                                            </span>
                                        )}
                                    </p>

                                    <p>💰 Tổng tiền: <span className="text-red-600 font-bold">₫{order.totalPrice.toLocaleString()}</span></p>

                                    <Link 
                                        to={`/e-commerce/customer/account/order/${order._id}`}
                                        className="text-blue-500 underline"
                                    >
                                        🔍 Xem chi tiết ➝
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default OrderList;
