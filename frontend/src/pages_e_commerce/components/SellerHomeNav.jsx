import React from 'react'
import logo from '../../assets/logo.png'
import { IoMenu } from "react-icons/io5";
import { FaStore, FaBox, FaShippingFast, FaTags, FaChartLine, FaFileInvoiceDollar, FaAdversal, FaExchangeAlt } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'
import axios from 'axios';
const SellerHomeNav = () => {
    const navigate = useNavigate();
    const menuItems = [
        { title: 'Thông tin cửa hàng', icon: <FaStore className="text-xl text-purple-600" />, click: '/e-commerce/seller/home' },
        { title: 'Bố cục gian hàng', icon: <FaAdversal className="text-xl text-purple-600" />, click: '/e-commerce/seller/ads' },
        { title: 'Sản phẩm', icon: <FaBox className="text-xl text-purple-600" />, click: '/e-commerce/seller/products' },
        // { title: 'Khuyến mãi', icon: <FaTags className="text-xl text-purple-600" />, click: '/e-commerce/seller/voucher' },
        { title: 'Đơn hàng', icon: <FaShippingFast className="text-xl text-purple-600" />, click: '/e-commerce/seller/order' },
        // { title: 'Doanh thu cửa hàng', icon: <FaChartLine className="text-xl text-purple-600" />, click: '/e-commerce/seller/revenue' },
        // { title: 'Quản lý thuế', icon: <FaFileInvoiceDollar className="text-xl text-purple-600" />, click: '/e-commerce/seller/tax' },
    ];
    const changeStore = () => {
        axios.get(`https://dhkshop.onrender.com/store/manager/${Cookies.get('customerId')}`)
        .then((response) => {
            navigate('/e-commerce/seller/list-store', { state: { items: response.data } });
        })
        .catch((e) => {
        navigate('/e-commerce/customer/home');
        })
    }
    return (
        <div className={`h-screen w-1/5 fixed rounded-r-3xl shadow-2xl bg-white transition-all duration-500`}>
            <div className='w-full p-4 flex justify-center items-center border-b'>
                <div className='flex gap-3 items-center justify-center'>
                    <div className='w-10 h-10 flex-shrink-0'>
                        <img src={logo} className='object-contain w-full h-full' alt="DHKShop Logo"/>
                    </div>
                    <p className='font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 text-2xl'>DHKShop</p>
                </div>
            </div>
            
            <div className='mt-6 flex flex-col gap-1 px-2'>
                {menuItems.map((item, index) => (
                    <div key={index} className={`w-full px-4 py-3 flex gap-4 items-center rounded-xl hover:bg-purple-100 transition duration-300 cursor-pointer`}
                    onClick={() => navigate(item.click)}>
                        <div className="flex-shrink-0">{item.icon}</div>
                        <p className='text-gray-700 font-medium'>{item.title}</p>
                    </div>
                ))}
            </div>
            <div className='absolute bottom-0 w-full flex p-4 items-center gap-4 hover:bg-purple-100 rounded-r-xl cursor-pointer'
            onClick={changeStore}>
                <div className="flex-shrink-0"><FaExchangeAlt className='text-xl text-purple-600'/></div>
                <p className='text-gray-700 font-medium'>Quản lý cửa hàng khác</p>
            </div>
        </div>
    )
}
export default SellerHomeNav