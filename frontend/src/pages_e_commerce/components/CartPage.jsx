"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

const CartPage = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [cart, setCart] = useState({ items: [] });
    const [cartId, setCartId] = useState("");
    const [payingCart, setPayingCart] = useState({items: []});
    const navigate = useNavigate();
    useEffect(() => {
        axios.get(
            `https://dhkshop.onrender.com/cart/user/${Cookies.get('customerId')}`
        )
        .then((response) => {
            fetchCart(response.data);
            setCartId(response.data._id);
        });
        
    }, []);
    const fetchCart = async (data) => {
        try {
            setCartId(data._id)
            setCart(data || { items: [] });
        } catch (error) {
            console.error("⛔ Lỗi khi lấy giỏ hàng:", error);
        }
    };
    const updateQuantity = async (itemId, newQuantity) => {
        try {
            
            if (!cartId) return;

            await axios.put("https://dhkshop.onrender.com/cart/update", {
                cartId,
                itemId,
                quantity: newQuantity,
            });

            setCart((prevCart) => ({
                ...prevCart,
                items: prevCart.items.map((item) =>
                    item._id === itemId
                        ? { ...item, quantity: newQuantity }
                        : item
                ),
            }));
        } catch (error) {
            console.error("Lỗi khi cập nhật số lượng:", error);
        }
    };

    const removeProduct = async (itemId) => {
        try {
            
            if (!cartId) return;

            await axios.delete("https://dhkshop.onrender.com/cart/remove", {
                data: { cartId, itemId },
            });

            setCart((prevCart) => ({
                ...prevCart,
                items: prevCart.items.filter((item) => item._id !== itemId),
            }));
            window.dispatchEvent(new Event("deleteCart"));
        } catch (error) {
            console.error("Lỗi khi xoá sản phẩm:", error);
        }
    };
    const handlePayment = () => {
        if(payingCart.items.length === 0){
            enqueueSnackbar('Vui lòng chọn ít nhất 1 sản phẩm', {variant: 'warning'});
        }
        else{
            navigate('/e-commerce/customer/infor-payment', { state: { items: payingCart, cartId: cartId  } });
        }
        
    }
    const handleCheckboxChange = (product, index) => {
        // Kiểm tra xem sản phẩm đã có trong payingCart chưa
        const productIndex = payingCart.items.findIndex(item => item.originalIndex === index);
        
        if (productIndex === -1) {
          // Nếu sản phẩm chưa có trong payingCart, thêm vào
          setPayingCart(prevState => ({
            ...cart, // Copy tất cả thông tin từ cart
            items: [...prevState.items, {...product, originalIndex: index}] // Thêm sản phẩm đã chọn cùng với index
          }));
        } else {
          // Nếu sản phẩm đã có trong payingCart, xóa đi
          setPayingCart(prevState => ({
            ...prevState,
            items: prevState.items.filter(item => item.originalIndex !== index)
          }));
        }
      };
    return (
        <div>
            <Header />
            <section className="container mx-auto px-5 mt-10">
                <header className="text-start mt-4">
                    <h1 className="text-2xl font-semibold">GIỎ HÀNG CỦA BẠN</h1>
                    <p className="mt-2 text-lg text-gray-600">
                        Đang có{" "}
                        <span className="text-red-600 font-bold">
                            {cart.items.length}
                        </span>{" "}
                        sản phẩm trong giỏ
                    </p>
                </header>

                <div className="mt-6 flex gap-6">
                    {/* Left Section */}
                    <div className="w-3/4">
                        <div className="border border-gray-300 rounded-t-lg">
                            <header className="grid grid-cols-[2fr,1fr,1fr,1fr,1fr,1fr] px-6 py-4 bg-purple-500 text-white font-semibold text-center border rounded-t-lg">
                                <h2>Sản phẩm</h2>
                                <h2>Phân loại</h2>
                                <h2>Đơn giá</h2>
                                <h2>Số lượng</h2>
                                <h2>Thành tiền</h2>
                                <h2>Thao tác</h2>
                            </header>

                            {cart.items.length > 0 ? (
                                cart.items.map((product, index) => (
                                    <div
                                        key={product._id}
                                        className="grid grid-cols-[2fr,1fr,1fr,1fr,1fr,1fr] items-center px-6 py-4 border-b border-gray-300"
                                    >
                                        {/* Cột sản phẩm */}
                                        <div className="flex items-center gap-4">
                                            <input
                                                type="checkbox"
                                                className="w-3.5 h-3.5"
                                                checked={payingCart.items.some(item => item.originalIndex === index)}
                                                onChange={() => handleCheckboxChange(product, index)}
                                            />
                                            <img
                                                src={`https://dhkptsocial.onrender.com/files/download/${product.image}`}
                                                alt={product.name}
                                                className="w-20 h-20 rounded-md border border-solid border-zinc-300"
                                            />
                                            <div className="flex flex-col">
                                                <h3 className="font-medium text-base text-black truncate w-[120px]">
                                                    {product.name}
                                                </h3>
                                                <p className="text-yellow-500 text-sm">
                                                    ⭐{" "}
                                                    {product.productId?.rating
                                                        ? product.productId.rating.toFixed(
                                                              1
                                                          )
                                                        : "0"}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Cột phân loại */}
                                        <div className="text-center">
                                            {product.attributes && product.attributes.map((attr, index) => (
                                                <p key={index} className="text-sm text-gray-500">
                                                    {attr.values.attributeName}
                                                    {/* {attr.values.priceAttribute > 0 && ` (+${attr.values.priceAttribute})`} */}
                                                </p>
                                            ))}
                                        </div>

                                        {/* Cột đơn giá */}
                                        <p className="text-center">
                                            ₫ {product.unitPrice.toLocaleString()}
                                        </p>

                                        {/* Cột số lượng */}
                                        <div className="flex gap-5 justify-center items-center whitespace-nowrap">
                                            <button
                                                onClick={() =>
                                                    updateQuantity(
                                                        product._id,
                                                        Math.max(
                                                            1,
                                                            product.quantity - 1
                                                        )
                                                    )
                                                }
                                                aria-label="Decrease quantity"
                                            >
                                                <img
                                                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/b86fbabe01af02eee93c70b08843560b519a0cca92efc65cd10c16415e61eb64?placeholderIfAbsent=true"
                                                    alt="Decrease"
                                                    className="object-contain shrink-0 self-stretch my-auto aspect-square w-[20px]"
                                                />
                                            </button>
                                            <span className="self-stretch my-auto text-lg font-semibold">
                                                {product.quantity}
                                            </span>
                                            <button
                                                onClick={() =>
                                                    updateQuantity(
                                                        product._id,
                                                        product.quantity + 1
                                                    )
                                                }
                                                aria-label="Increase quantity"
                                            >
                                                <img
                                                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/b372c4dc5db8ed14568bbbbcb5a690cefa78d86ce525d8fdfab2d2709588fb64?placeholderIfAbsent=true"
                                                    alt="Increase"
                                                    className="object-contain shrink-0 self-stretch my-auto aspect-square w-[20px]"
                                                />
                                            </button>
                                        </div>

                                        {/* Cột thành tiền */}
                                        <p className="text-center text-red-600">
                                            ₫{" "}
                                            {(
                                                product.unitPrice * product.quantity
                                            ).toLocaleString()}
                                        </p>

                                        {/* Cột thao tác - Xóa sản phẩm */}
                                        <button
                                            onClick={() =>
                                                removeProduct(product._id)
                                            }
                                            className="text-red-600 text-xl"
                                        >
                                            ✖
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center p-5">
                                    Giỏ hàng trống.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Right Section - Order Summary */}
                    <aside className="w-1/4">
                        <div className="border border-gray-300 rounded-lg p-5">
                            <h2 className="text-xl font-semibold">
                                TỔNG GIỎ HÀNG
                            </h2>
                            <hr className="my-4" />
                            <div className="flex justify-between text-lg">
                                <span>Tạm tính</span>
                                <span className="text-red-600">
                                    ₫{" "}
                                    {payingCart.items
                                        .reduce(
                                            (acc, item) =>
                                                acc +
                                                item.unitPrice * item.quantity,
                                            0
                                        )
                                        .toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between text-lg font-bold mt-2">
                                <span>Tổng cộng</span>
                                <span className="text-red-600">
                                    ₫{" "}
                                    {payingCart.items
                                        .reduce(
                                            (acc, item) =>
                                                acc +
                                                item.unitPrice * item.quantity,
                                            0
                                        )
                                        .toLocaleString()}
                                </span>
                            </div>
                            <button className="w-full bg-purple-500 text-white text-lg font-semibold py-3 rounded-lg mt-4" onClick={handlePayment}>
                                Thanh toán
                            </button>
                        </div>
                    </aside>
                </div>
            </section>
        </div>
    );
};

export default CartPage;
