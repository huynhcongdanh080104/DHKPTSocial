import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const ProductReview = ({ productId }) => {
    const [reviews, setReviews] = useState([]);
    const [userCanReview, setUserCanReview] = useState(false);
    const [newRating, setNewRating] = useState(5);
    const [newComment, setNewComment] = useState("");

    const customerId = Cookies.get("customerId");

    useEffect(() => {
        // Lấy danh sách đánh giá sản phẩm
        axios.get(`https://dhkshop.onrender.com/review/product/${productId}`)
            .then(res => setReviews(res.data))
            .catch(err => console.error("Lỗi lấy đánh giá:", err));

        // Kiểm tra người dùng có thể đánh giá không (đã mua sản phẩm và status = shipped)
        if (customerId) {
            axios
                .get(`https://dhkshop.onrender.com/order/check-review/${customerId}/${productId}`)
                .then(res => {
                    setUserCanReview(res.data.canReview); // 👈 sửa lại chỗ này
                })
                .catch(err => {
                    console.error("Lỗi khi kiểm tra quyền đánh giá:", err);
                });
        }
    }, [productId, customerId]);

    const handleSubmit = async () => {
        if (!newComment.trim()) return alert("Vui lòng nhập nội dung");

        try {
            await axios.post("https://dhkshop.onrender.com/review", {
                userId: customerId,
                productId,
                rating: newRating,
                comment: newComment
            });
            alert("Đánh giá thành công!");
            setNewComment("");
            setNewRating(5);
            // Reload review
            const res = await axios.get(`https://dhkshop.onrender.com/review/product/${productId}`);
        setReviews(res.data);
        setUserCanReview(false);
        } catch (error) {
            console.error("Lỗi khi gửi đánh giá:", error);
        }
        const message = error.response?.data?.message || "Có lỗi xảy ra!";
        alert(message);
    };

    return (
        <div className="mt-10 border-t pt-5">
            <h2 className="text-xl font-bold mb-4">⭐ Đánh giá sản phẩm</h2>

            {userCanReview && (
                <div className="mb-6">
                    <div className="flex gap-2 items-center mb-2">
                        <label>Chọn sao:</label>
                        <select
                            value={newRating}
                            onChange={e => setNewRating(Number(e.target.value))}
                            className="border p-1 rounded"
                        >
                            {[1, 2, 3, 4, 5].map((s) => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>
                    <textarea
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                        className="w-full border p-2 rounded"
                        placeholder="Nhập nội dung đánh giá..."
                    />
                    <button
                        onClick={handleSubmit}
                        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Gửi đánh giá
                    </button>
                </div>
            )}

            {reviews.length === 0 ? (
                <p className="text-gray-500">Chưa có đánh giá nào.</p>
            ) : (
                <ul className="space-y-4">
                    {reviews.map((review, index) => (
                        <li key={index} className="border p-3 rounded">
                            <p className="font-semibold">
                                {review.rating} ⭐
                            </p>
                            <p>{review.comment}</p>
                            <p className="text-sm text-gray-500">👤 {review.userId?.name || "Người dùng"}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ProductReview;
