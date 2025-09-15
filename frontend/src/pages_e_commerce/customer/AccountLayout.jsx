import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import Header from "../components/Header";
const AccountLayout = () => {
    return (
        <div>
            <Header />
            <div className="flex min-h-screen mt-[25px]">
            {/* Sidebar bên trái */}
            <aside className="w-64 bg-white border-r p-5 shadow-md">
                <h2 className="text-xl font-bold mb-6">👤 Tài khoản</h2>
                <nav className="flex flex-col space-y-3">
                    <NavLink
                        to="/e-commerce/customer/account"
                        end 
                        className={({ isActive }) =>
                            isActive
                                ? "text-blue-600 font-semibold"
                                : "text-gray-700 hover:text-blue-500"
                        }
                    >
                        🧾 Thông tin tài khoản
                    </NavLink>
                    <NavLink
                        to="/e-commerce/customer/account/orders"
                        className={({ isActive }) =>
                            isActive
                                ? "text-blue-600 font-semibold"
                                : "text-gray-700 hover:text-blue-500"
                        }
                    >
                        📦 Đơn mua
                    </NavLink>
                </nav>
            </aside>

            <main className="flex-1 bg-gray-50">
                <Outlet />
            </main>
        </div>
        </div>
    );
};

export default AccountLayout;
