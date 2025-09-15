import React, { useEffect, useState } from 'react'
import SellerHomeNav from '../components/SellerHomeNav'
import Cookies from 'js-cookie';
import { FaStore, FaBox, FaShippingFast, FaTags, FaChartLine, FaAdversal, FaPlus, FaEdit } from "react-icons/fa";
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import {FaArrowRightFromBracket}from "react-icons/fa6"
import axios from 'axios'
const SellerHome = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [store, setStore] = useState("");
  const [numberProducts, setProduct] = useState(0);
  const [numberOrders, setOrder] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [orderList, setOrderList] = useState([]);
  useEffect(() => {
    const storeID = Cookies.get('store');
    if(storeID != undefined){
      setStore(storeID);
      axios.get(`https://dhkshop.onrender.com/product/store/${storeID}`)
      .then((response) => {
        setProduct(response.data.length);
      })
      axios.get(`https://dhkshop.onrender.com/store/id/${storeID}`)
      .then((response) => {
        setStore(response.data);
        console.log(response.data);
      })
      axios.get(`https://dhkshop.onrender.com/order/store/${storeID}`)
      .then((response) => {
        setOrder(response.data.length);
        const shippedOrder = response.data?.filter((item) => item.status === "shipped");
        setRevenue(shippedOrder.reduce((sum, item) => sum + item.totalPrice, 0));
      })
    }
    else{
      navigate('/e-commerce/login');
      enqueueSnackbar('Vui lòng đăng nhập', { variant: 'error' });
    }
  }, [])
  return (
    <div className='flex bg-gray-100'>
      <SellerHomeNav/>
      <div className='w-1/5'></div>
      {/* Main content area that adjusts based on sidebar state */}
      <div className={`min-h-screen transition-all duration-500 w-4/5`}>
        <div className='p-6'>
          <div className='bg-white rounded-xl shadow p-6 mb-6'>
            <div className='flex items-center mb-4'>
              <h1 className='text-2xl font-bold text-gray-800  w-1/2'>Dashboard</h1>
              <div className=' w-1/2 flex justify-end items-center'>
                <div className='bg-gradient-to-r from-purple-600 to-pink-600 flex items-center gap-2 text-white rounded-md shadow-md p-2 cursor-pointer
                hover:scale-105 transition duration-300'
                onClick={() => {
                  navigate('/e-commerce/login');
                  Cookies.remove('customerId');
                  Cookies.remove('customerName');
                  Cookies.remove('store');
                }}>
                  <FaArrowRightFromBracket />
                  <p className='font-bold'>Đăng xuất</p>
                </div>
              </div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {/* Thẻ thống kê 1 */}
              <div className='bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 text-white'>
                <div className='flex justify-between items-center mb-2'>
                  <h3 className='font-semibold'>Tổng đơn hàng</h3>
                  <FaShippingFast className='text-xl' />
                </div>
                <p className='text-2xl font-bold'>{numberOrders}</p>
              </div>
              
              {/* Thẻ thống kê 2 */}
              <div className='bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white'>
                <div className='flex justify-between items-center mb-2'>
                  <h3 className='font-semibold'>Doanh thu</h3>
                  <FaChartLine className='text-xl' />
                </div>
                <p className='text-2xl font-bold'>{revenue}đ</p>
              </div>
              
              {/* Thẻ thống kê 3 */}
              <div className='bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl p-4 text-white'>
                <div className='flex justify-between items-center mb-2'>
                  <h3 className='font-semibold'>Sản phẩm</h3>
                  <FaBox className='text-xl' />
                </div>
                <p className='text-2xl font-bold'>{numberProducts}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-xl p-6 relative overflow-hidden">
            
            {/* Header với màu gradient */}
            <div className='flex item-center mb-8'>
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-black flex items-center w-1/2">
              Thông tin gian hàng
            </h2>
              <div className='flex w-1/2 justify-end gap-4 font-semibold'>
                <button className='p-2 bg-gradient-to-r from-purple-600 to-pink-600 flex items-center gap-2 text-white rounded-md shadow-md
                hover:scale-105 transition duration-300'><FaPlus/> Thêm quản lý</button>
                <button className='p-2 bg-gradient-to-r from-purple-600 to-pink-600 flex items-center gap-2 text-white rounded-md shadow-md
                hover:scale-105 transition duration-300'><FaEdit/> Chỉnh sửa thông tin cửa hàng</button>
              </div>
              
            </div>
            
            
            
            {/* Logo với viền gradient */}
            {store.logo && (
              <div className="flex justify-center mb-6">
                <div className="p-1 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg transform hover:scale-105 transition-all duration-300">
                  <div className="w-20 h-20 rounded-full bg-white p-0.5">
                    <img 
                      src={`https://dhkshop.onrender.com/files/download/${store.logo}`} 
                      alt="Logo cửa hàng" 
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* Thông tin cửa hàng */}
            <div className="space-y-4 relative z-10">
              <div className="border border-gray-100 p-4 rounded-lg shadow-sm hover:shadow transition-all duration-300">
                <span className="font-semibold text-gray-700">Tên cửa hàng:</span> 
                <span className="ml-2 font-bold text-gray-800">{store?.name}</span>
              </div>
              
              <div className="border border-gray-100 p-4 rounded-lg shadow-sm hover:shadow transition-all duration-300">
                <span className="font-semibold text-gray-700">Mô tả cửa hàng:</span> 
                <span className="ml-2 text-gray-800">{store?.description}</span>
              </div>
              
              <div className="border border-gray-100 p-4 rounded-lg shadow-sm hover:shadow transition-all duration-300">
                <span className="font-semibold text-gray-700">Địa chỉ cửa hàng:</span> 
                <span className="ml-2 text-gray-800">{store?.address}</span>
              </div>
              
              {/* Thống kê với màu gradient */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-1 rounded-lg transition-all duration-300 transform hover:scale-105">
                  <div className="bg-white p-4 rounded-lg flex flex-col items-center h-full shadow-md">
                    <span className="text-sm text-gray-600 mb-1">Người theo dõi</span>
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                      {Array.isArray(store?.follower) ? store.follower.length : 0}
                    </span>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-1 rounded-lg transition-all duration-300 transform hover:scale-105">
                  <div className="bg-white p-4 rounded-lg flex flex-col items-center h-full">
                    <span className="text-sm text-gray-600 mb-1">Đánh giá</span>
                    <div className="flex items-center">
                      <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                        {store?.rating || "0"}
                      </span>
                      <span className="text-yellow-500 ml-1">★</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-1 rounded-lg transition-all duration-300 transform hover:scale-105">
                  <div className="bg-white p-4 rounded-lg flex flex-col items-center h-full">
                    <span className="text-sm text-gray-600 mb-1">Quản lý</span>
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                      {Array.isArray(store?.manager) ? store.manager.length : 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            
          </div>
        </div>
      </div>
    </div>
  )
}

export default SellerHome