import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import OrderStatus from "../components/OrderStatus";
import axios from "axios";

const OrderDetail = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios
            .get(`https://dhkshop.onrender.com/order/${orderId}`)
            .then((res) => {
                setOrder(res.data.order);
                setStores(res.data.stores);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Lỗi khi lấy chi tiết đơn hàng:", err);
                setLoading(false);
            });
    }, [orderId]);

    const handleRetryPayment = async () => {
        try {
            const res = await axios.post(
                `https://dhkshop.onrender.com/vnpay/payment`,
                {
                    orderId: order._id,
                    amount: order.totalPrice,
                    returnURL: "http://localhost:5173",
                }
            );

            if (res.data.paymentUrl) {
                window.location.href = res.data.paymentUrl; // Chuyển hướng tới trang thanh toán VNPay
            } else {
                alert("Không thể tạo lại thanh toán.");
            }
        } catch (error) {
            console.error("Lỗi khi tạo thanh toán lại:", error);
            alert("Có lỗi xảy ra khi tạo lại thanh toán.");
        }
    };
    const getOrderStatusLabel = () => {
        if (order.paymentMethod === "VNPay") {
            if (order.paymentStatus === "pending") {
                return "🛑 Chưa thanh toán (VNPay) - Chờ khách thanh toán";
            }
            if (order.paymentStatus === "paid") {
                return "📦 Đơn hàng đã đặt - Chờ xử lý";
            }
        }
        if (order.paymentMethod === "COD") {
            if (order.status === "pending") {
                return "📦 Đơn hàng đã đặt - Chờ xác nhận";
            }
            if (order.status === "shipping") {
                return "🚚 Đang giao hàng";
            }
            if (order.status === "shipped") {
                return "💰 Đã thanh toán khi nhận hàng (Ship Code)";
            }
            if (order.status === "completed") {
                return "⭐ Hoàn thành - Đánh giá đơn hàng";
            }
        }
        return "❓ Không xác định";
    };
    if (loading) return <p>🔄 Đang tải...</p>;
    if (!order) return <p>❌ Không tìm thấy đơn hàng.</p>;

    return (
        <div>
            <div className="container mx-auto">
                <OrderStatus
                    status={order.status}
                    paymentMethod={order.paymentMethod}
                    paymentStatus={order.paymentStatus}
                />
                <h1 className="text-2xl font-bold mb-5">
                    📋 Chi tiết đơn hàng
                </h1>
                <p>
                    <strong>🆔 Mã đơn:</strong> {order._id}
                </p>
                <p>
                    <strong>📦 Trạng thái đơn hàng:</strong>{" "}
                    <span className="font-semibold capitalize">
                        {getOrderStatusLabel()}
                    </span>
                </p>
                <p>
                    <strong>💰 Tổng tiền:</strong>{" "}
                    <span className="text-red-600 font-bold">
                        ₫{order.totalPrice.toLocaleString()}
                    </span>
                </p>
                <p>
                    <strong>🏠 Địa chỉ giao hàng:</strong> {order.address}
                </p>

                {order.paymentMethod === "VNPay" &&
                    order.paymentStatus === "pending" && (
                        <div className="mt-4">
                            <p className="text-yellow-500">
                                ⚠️ Đơn hàng chưa được thanh toán. Vui lòng thanh
                                toán để xử lý đơn hàng.
                            </p>
                            <button
                                onClick={handleRetryPayment}
                                className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                            >
                                🔄 Thanh toán lại
                            </button>
                        </div>
                    )}
                {/* 🔥 Hiển thị danh sách Shop */}
                <h2 className="text-xl font-semibold mt-5">🏪 Cửa hàng</h2>
                <ul className="space-y-3 mt-3">
                    {stores.map((store) => (
                        <li
                            key={store._id}
                            className="flex items-center gap-3 border p-3 rounded-md"
                        >
                            <img
                                src={
                                    store.logo
                                        ? `https://dhkptsocial.onrender.com/files/download/${store.logo}`
                                        : "https://via.placeholder.com/50"
                                }
                                alt={store.name}
                                className="w-10 h-10 rounded-full"
                            />
                            <p>
                                <strong>{store.name}</strong>
                            </p>
                        </li>
                    ))}
                </ul>

                {/* Hiển thị danh sách sản phẩm */}
                <h2 className="text-xl font-semibold mt-5">
                    📦 Sản phẩm trong đơn
                </h2>
                <ul className="space-y-3 mt-3">
                    {order.items.map((item, index) => (
                        <li
                            key={index}
                            className="border p-3 rounded-md flex gap-4 items-center"
                        >
                            <img
                                src={
                                    item.image
                                        ? `https://dhkptsocial.onrender.com/files/download/${item.image}`
                                        : "https://via.placeholder.com/100"
                                }
                                alt={item.productId?.name || "Sản phẩm"}
                                className="w-16 h-16 object-cover"
                            />
                            <div>
                                <p>
                                    <strong>
                                        {item.productId?.name ||
                                            "Sản phẩm không tồn tại"}
                                    </strong>
                                </p>
                                <p>🔢 Số lượng: {item.quantity}</p>
                                <p>
                                    💲 Giá: ₫{item.unitPrice.toLocaleString()}
                                </p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default OrderDetail;
