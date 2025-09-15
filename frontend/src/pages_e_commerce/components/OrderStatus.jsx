import React from "react";

const OrderStatus = ({ status, paymentMethod, paymentStatus }) => {
    const statusSteps = [
        { key: "pending", label: "🕒 Đã đặt hàng" },
        { key: "shipping", label: "🚚 Đang giao hàng" },
        { key: "shipped", label: "📦 Đã nhận hàng" },
        { key: "completed", label: "⭐ Đã đánh giá" }
    ];

    // Nếu chưa thanh toán VNPay thì không hiển thị tiến trình
    const isVNPayPending = paymentMethod === "VNPay" && paymentStatus === "pending";

    // Lấy bước hiện tại theo trạng thái đơn hàng
    const getCurrentStep = () => {
        if (isVNPayPending) return -1; // Không hiển thị tiến trình nếu chưa thanh toán
        const index = statusSteps.findIndex((step) => step.key === status);
        return index !== -1 ? index : 0;
    };

    return (
        <div className="bg-white p-5 rounded-md shadow-md mb-8 mt-1">
            <h2 className="text-lg font-semibold mb-4">📦 Tiến trình đơn hàng</h2>

            {isVNPayPending ? (
                <p className="text-orange-500 font-bold text-center">
                    🛑 Chưa thanh toán (VNPay) – Vui lòng hoàn tất thanh toán để xử lý đơn hàng.
                </p>
            ) : (
                <div className="flex items-center justify-between relative">
                    {statusSteps.map((step, index) => (
                        <div key={index} className="text-center relative flex-1">
                            {/* Nút tròn thể hiện bước */}
                            <div
                                className={`w-10 h-10 mx-auto flex items-center justify-center rounded-full
                                ${index <= getCurrentStep()
                                    ? "bg-green-500 text-white"
                                    : "bg-gray-200 text-gray-500"}`}
                            >
                                {index + 1}
                            </div>

                            {/* Nhãn trạng thái */}
                            <p
                                className={`mt-2 text-sm ${
                                    index <= getCurrentStep()
                                        ? "text-green-500"
                                        : "text-gray-500"
                                }`}
                            >
                                {step.label}
                            </p>

                            {/* Thanh kết nối giữa các bước */}
                            {index < statusSteps.length - 1 && (
                                <div
                                    className={`absolute top-5 left-full w-full h-1 ${
                                        index < getCurrentStep()
                                            ? "bg-green-500"
                                            : "bg-gray-300"
                                    }`}
                                ></div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderStatus;
