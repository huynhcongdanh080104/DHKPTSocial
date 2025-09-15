import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import axios from 'axios';
const PaymentPage = () => {
  const location = useLocation();
  const orders = location.state?.items || [];
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    if (Array.isArray(orders)) {
      const total = orders.reduce((sum, order) => sum + order.totalPrice, 0);
      setTotalAmount(total);
    } else if (orders && orders.totalPrice) {
      setTotalAmount(orders.totalPrice);
    }
  }, [orders]);

  const handlePayment = async () => {
    try {
      const orderIds = Array.isArray(orders) 
        ? orders.map(order => order._id).join(',')
        : orders._id;
        
      const res = await axios.post('https://dhkshop.onrender.com/vnpay/payment', {
        amount: totalAmount,
        orderId: orderIds,
        returnURL: window.location.origin
      });
      
      window.location.href = res.data.paymentUrl;
    } catch (error) {
      console.error('Payment processing error:', error);
      alert('Có lỗi xảy ra khi xử lý thanh toán. Vui lòng thử lại.');
    }
  };

  const renderOrderDetails = (order, index) => {
    return (
      <div key={order._id || index} className="bg-white p-4 rounded-lg shadow-md mb-4">
        <div className="flex justify-between mb-2">
          <span className="font-semibold">Mã đơn hàng:</span>
          <span>{order._id}</span>
        </div>
        
        <div className="flex justify-between mb-2">
          <span className="font-semibold">Ngày đặt hàng:</span>
          <span>{order.createAt}</span>
        </div>
        
        <div className="flex justify-between mb-2">
          <span className="font-semibold">Địa chỉ giao hàng:</span>
          <span>{order.address}</span>
        </div>
        
        <div className="flex justify-between mb-2">
          <span className="font-semibold">Trạng thái đơn hàng:</span>
          <span className="capitalize">{order.status}</span>
        </div>
        
        <div className="mt-4">
          <h3 className="font-semibold text-lg mb-2">Sản phẩm:</h3>
          {order.items && order.items.map((item, itemIndex) => (
            <div key={itemIndex} className="flex justify-between border-b py-2">
              <div className="flex">
                {item.image && (
                  <img src={`https://dhkshop.onrender.com/files/download/${item.image}`} alt={item.name} className="w-16 h-16 object-cover mr-2 rounded-md" />
                )}
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-600">SL: {item.quantity}</p>
                  {item.attributes && item.attributes.length > 0 && (
                    <div className="text-xs text-gray-500">
                      {item.attributes.map((attr, attrIndex) => (
                        <p key={attrIndex}>
                          {attr.name}: {attr.values.attributeName}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p>{(item.unitPrice).toLocaleString('vi-VN')} đ</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between">
            <span className="font-semibold">Ghi chú:</span>
            <span>{order.note || "Không có"}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Phí giao hàng:</span>
            <span>10.000đ</span>
          </div>
          <div className="flex justify-between mt-2">
            
            <span className="font-semibold">Tổng tiền đơn hàng:</span>
            <span className="text-lg font-bold text-red-600">{(order.totalPrice).toLocaleString('vi-VN')} đ</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-2xl font-bold text-center mb-6">Xác nhận thanh toán</h1>
        
        <div className="mb-6">
          {Array.isArray(orders) ? (
            orders.map((order, index) => renderOrderDetails(order, index))
          ) : (
            orders && renderOrderDetails(orders, 0)
          )}
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Tổng cộng thanh toán</h2>
            <span className="text-2xl font-bold text-red-600">{totalAmount.toLocaleString('vi-VN')} đ</span>
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold">Phương thức thanh toán:</span>
            <span>VNPay</span>
          </div>
          
          <div className="text-center mt-8">
            <button
              onClick={handlePayment}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-8 rounded-lg text-lg font-semibold hover:opacity-90 transition"
            >
              Xác nhận thanh toán
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


export default PaymentPage