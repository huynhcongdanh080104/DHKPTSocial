import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie'

function CartIcon() {
  const [count, setCount] = useState(0);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const res = await axios.get(`https://dhkshop.onrender.com/cart/user/${Cookies.get('customerId')}`);
        setCount(res.data.items.length);
      } catch (error) {
        console.error("Lỗi khi lấy số lượng giỏ hàng:", error);
      }
    };

    fetchCartCount();

    // Lắng nghe sự kiện cập nhật giỏ hàng
    window.addEventListener("updateCart", fetchCartCount);
    window.addEventListener("deleteCart", fetchCartCount);
    return () => {
      window.removeEventListener("updateCart", fetchCartCount);
      window.removeEventListener("deleteCart", fetchCartCount);
    };
  }, []);

  return (
    <button
      onClick={() => navigate("/cart")} 
      className="relative"
    >
      <svg width="68" height="71" viewBox="0 0 68 71" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="29.5" cy="35.5" r="25" fill="#FFF0EE"></circle>
        <circle cx="29.5" cy="35.5" r="25" stroke="#A6A6B0" strokeOpacity="0.33"></circle>
        <g transform="scale(0.75, 0.75) translate(8, 8)">
          <path
            d="M23.6667 51.6667C22.9333 51.6667 22.3056 51.4056 21.7833 50.8833C21.2611 50.3611 21 49.7333 21 49V33C21 32.2667 21.2611 31.6389 21.7833 31.1167C22.3056 30.5944 22.9333 30.3333 23.6667 30.3333H26.3333C26.3333 28.8667 26.8556 27.6111 27.9 26.5667C28.9444 25.5222 30.2 25 31.6667 25C33.1333 25 34.3889 25.5222 35.4333 26.5667C36.4778 27.6111 37 28.8667 37 30.3333H39.6667C40.4 30.3333 41.0278 30.5944 41.55 31.1167C42.0722 31.6389 42.3333 32.2667 42.3333 33V49C42.3333 49.7333 42.0722 50.3611 41.55 50.8833C41.0278 51.4056 40.4 51.6667 39.6667 51.6667H23.6667ZM23.6667 49H39.6667V33H37V35.6667C37 36.0444 36.8722 36.3611 36.6167 36.6167C36.3611 36.8722 36.0444 37 35.6667 37C35.2889 37 34.9722 36.8722 34.7167 36.6167C34.4611 36.3611 34.3333 36.0444 34.3333 35.6667V33H29V35.6667C29 36.0444 28.8722 36.3611 28.6167 36.6167C28.3611 36.8722 28.0444 37 27.6667 37C27.2889 37 26.9722 36.8722 26.7167 36.6167C26.4611 36.3611 26.3333 36.0444 26.3333 35.6667V33H23.6667V49ZM29 30.3333H34.3333C34.3333 29.6 34.0722 28.9722 33.55 28.45C33.0278 27.9278 32.4 27.6667 31.6667 27.6667C30.9333 27.6667 30.3056 27.9278 29.7833 28.45C29.2611 28.9722 29 29.6 29 30.3333Z"
            fill="#1C1B1F"
          ></path>
        </g>
        <circle cx="45" cy="16" r="10" fill="#FF0000"></circle>
        <text
          fill="white"
          style={{ whiteSpace: "pre" }}
          fontFamily="Inter"
          fontSize="15"
          letterSpacing="0em"
        >
          <tspan x="40.4" y="21.3">
            {count}
          </tspan>
        </text>
      </svg>
    </button>
  );
}

export default CartIcon;
