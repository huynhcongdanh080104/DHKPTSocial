import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios'
const ReturnPayment = () => {
    const {enqueueSnackbar} = useSnackbar(); 
      const location = useLocation();
      const queryParams = new URLSearchParams(location.search);
      const navigate = useNavigate();
      const orderId = queryParams.get('vnp_OrderInfo');
      const amount = queryParams.get('vnp_Amount') / 100;
      const paymentStatus = queryParams.get('vnp_TransactionStatus');
      const [orders, setOrders] = useState([]);
      useEffect(() => {
        if(paymentStatus === '02'){
              navigate('/e-commerce/customer/home');
              enqueueSnackbar('Thanh toán thất bại', { variant: 'warning' });
            }
            else if(paymentStatus === '00'){
              
              const orderSplit = orderId.split('Thanh toan cho don hang')[1];
              const orderList = orderSplit.split(',')
              setOrders(orderSplit.split(','));
              console.log(orderSplit.split(','));
              orderList.map(async (item) => {
                const newStatus = {
                  paymentStatus: "paid"
                }
                const response = await axios.put(`https://dhkshop.onrender.com/order/${item.trim()}`,newStatus)
                console.log(response.data);
              })
              enqueueSnackbar('Thanh toán thành công', { variant: 'success' });
              
            }
      },[])
  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-600 to-pink-600 flex flex-col justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Cảm ơn bạn!</h1>
        <p className="text-gray-600 text-lg mb-6">Đơn hàng của bạn đã được xác nhận và đang được xử lý.</p>
        
        
        <div className="flex flex-col gap-4">
          <button 
            onClick={() => navigate('/e-commerce/customer/account/orders')}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition duration-300 shadow-md"
          >
            Theo dõi đơn hàng
          </button>
          <button 
            onClick={() => navigate('/e-commerce/customer/home')}
            className="text-purple-600 hover:text-purple-800 font-medium transition duration-300"
          >
            Tiếp tục mua sắm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReturnPayment