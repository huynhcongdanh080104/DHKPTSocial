import React, { useState, useEffect } from 'react';
import { FaShippingFast, FaFilter, FaSearch, FaEye, FaTruck, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import SellerHomeNav from '../components/SellerHomeNav';
import  Cookie  from 'js-cookie';
import io from "socket.io-client";
import axios from 'axios';
const socket = io("https://dhkshop.onrender.com");

const SellerOrder = () => {
  // State management
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [store, setStore] = useState({});

  useEffect(() => {
          // Lắng nghe sự kiện thêm sản phẩm
          socket.on("orderAdded", (newOrder) => {
            
            if(newOrder.items[0].store === Cookie.get("store")){
              setOrders((prevOrders) => {
                const updateOrders = [...prevOrders, newOrder];
                return updateOrders;
            });
            }
            
        });
  
          // Lắng nghe sự kiện cập nhật sản phẩm
          socket.on("orderUpdated", (updatedOrder) => {
            setOrders((prevOrders) =>
                  prevOrders.map((order) =>
                      order._id === updatedOrder._id ? updatedOrder : order
                  )
              );
          });
  
          // Lắng nghe sự kiện xóa sản phẩm
          socket.on("orderDeleted", ({ orderId }) => {
            setOrders((prevOrders) =>
                  prevOrders.filter((order) => order._id !== orderId)
              );
          });
  
          return () => {
              socket.off("orderAdded");
              socket.off("orderUpdated");
              socket.off("orderDeleted");
          };
      }, []);
  // Fetch orders data
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        // Replace with actual API call
        const response = await fetch(`https://dhkshop.onrender.com/order/store/${Cookie.get('store')}`);
        const data = await response.json();
        // console.log(data);
        setOrders(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setLoading(false);
      }
    };

    fetchOrders();
    axios.get(`https://dhkshop.onrender.com/store/id/${Cookie.get('store')}`)
    .then((response) => {
      setStore(response.data);
    })
  }, []);

  // Handle status filter change
  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Filter orders based on status and search term
  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesSearch = searchTerm === '' || 
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.customer && order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesStatus && matchesSearch;
  });

  // Pagination logic
  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  // Status badge renderer
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className='px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs'>Đang chuẩn bị hàng</span>;
      case 'paid':
        return <span className='px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs'>Đã thanh toán</span>;
      case 'shipping':
        return <span className='px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs'>Đang giao</span>;
      case 'shipped':
        return <span className='px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs'>Đã giao</span>;
      case 'cancelled':
        return <span className='px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs'>Đã hủy</span>;
      default:
        return <span className='px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs'>Không xác định</span>;
    }
  };

  // View order details
  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleShip = () => {
    const storeAddress = store.address.split(',')[3].trim();
    const orderAddress = selectedOrder.address.split(',')[3].trim();
    const newStatus = {
      status: "shipping"
    }
    axios.put(`https://dhkshop.onrender.com/order/${selectedOrder._id}`,newStatus)
    .then((response) => {
      if(storeAddress === orderAddress){
        console.log("Giao cùng tỉnh, giao hàng đến khách hàng");
        axios.get(`https://dhkshop.onrender.com/shipper/getToShip/${storeAddress}`)
        .then((response) => {
          const shippingStage = {
            handler: response.data.data._id,
            fromLocation: store.address,
            toLocation: selectedOrder.address,
            status: "in_transit"
          };
          const shippingStages = [shippingStage];
          const shipping = {
            orderId: selectedOrder._id,
            status: "in_transit",
            shippingStages: shippingStages,
            recipientName: selectedOrder.customer?.name,
            recipientPhone: selectedOrder.customer?.phone,
            recipientAddress: selectedOrder.address
          }
          axios.post('https://dhkshop.onrender.com/shipping', shipping)
          .then((response) => {
            console.log(response.data);
            setShowModal(false);
            setSelectedOrder(null);
          })
        })
        
      }
      else{
        console.log("Giao liên tỉnh, giao hàng đến kho");
        axios.get(`https://dhkshop.onrender.com/shipper/getToShip/${storeAddress}`)
        .then((response) => {
          const shippingStage = {
            handler: response.data.data._id,
            fromLocation: store.address,
            toLocation: response.data.data.assignedWarehouse.location.address + ", " + response.data.data.assignedWarehouse.location.district + ", " + response.data.data.assignedWarehouse.location.ward + ", " + response.data.data.assignedWarehouse.location.province,
            status: "in_transit"
          };
          const shippingStages = [shippingStage];
          const shipping = {
            orderId: selectedOrder._id,
            status: "in_transit",
            shippingStages: shippingStages,
            recipientName: selectedOrder.customer?.name,
            recipientPhone: selectedOrder.customer?.phone,
            recipientAddress: selectedOrder.address
          }
          axios.post('https://dhkshop.onrender.com/shipping', shipping)
          .then((response) => {
            console.log(response.data);
            setShowModal(false);
            setSelectedOrder(null);
          })
          .catch((error) => {
            console.log(error);
          })
        })
      }
    })
  }
  // Modal component for order details
  const OrderDetailModal = () => {
    if (!selectedOrder) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Chi tiết đơn hàng #{selectedOrder._id}</h2>
            <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold mb-2">Thông tin khách hàng</h3>
              <p><span className="font-medium">Khách hàng:</span> {selectedOrder.customer?.name || 'N/A'}</p>
              <p><span className="font-medium">Email:</span> {selectedOrder.customer?.email || 'N/A'}</p>
              <p><span className="font-medium">Số điện thoại:</span> {selectedOrder.customer?.phone || 'N/A'}</p>
              <p><span className="font-medium">Địa chỉ:</span> {selectedOrder.customer?.address || 'N/A'}</p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Thông tin đơn hàng</h3>
              <p><span className="font-medium">Mã đơn hàng:</span> #{selectedOrder._id}</p>
              <p><span className="font-medium">Ngày đặt:</span> {new Date(selectedOrder.createAt).toLocaleDateString('vi-VN')}</p>
              <p><span className="font-medium">Tổng tiền:</span> {Number(selectedOrder.totalPrice)}đ</p>
              <p>
                <span className="font-medium">Trạng thái:</span> {renderStatusBadge(selectedOrder.status)}
              </p>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Sản phẩm đã đặt</h3>
            <div className="overflow-x-auto">
              <table className="w-full min-w-full">
                <thead>
                  <tr className="text-left bg-gray-50">
                    <th className="px-4 py-2 border-b">Sản phẩm</th>
                    <th className="px-4 py-2 border-b">Loại</th>
                    <th className="px-4 py-2 border-b">Số lượng</th>
                    <th className="px-4 py-2 border-b">Giá</th>
                    <th className="px-4 py-2 border-b">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 border-b">{item.productId?.name || 'Sản phẩm không xác định'}</td>
                      <td className="px-4 py-3 border-b flex">
                        {item.attributes.map((atr, subIndex) => (
                            <p key={subIndex}>{subIndex === 0 ? "": ", "}{atr.values.attributeName}</p>
                        ))}
                      </td>
                      <td className="px-4 py-3 border-b">{item.quantity}</td>
                      <td className="px-4 py-3 border-b">{Number(item.unitPrice)}đ</td>
                      <td className="px-4 py-3 border-b">{Number(item.quantity * item.unitPrice)}đ</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 justify-end">
            {selectedOrder.status === 'pending' && (
              <>
                <button 
                  onClick={handleShip} 
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2">
                  <FaCheckCircle /> Xác nhận hàng sẵn sàng
                </button>
              </>
            )}
            
            <button 
              onClick={() => setShowModal(false)} 
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">
              Đóng
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className='flex bg-gray-100'>
      <SellerHomeNav />
      <div className='w-1/5'></div>
      <div className='min-h-screen transition-all duration-500 w-4/5'>
        <div className='p-6'>
          <div className='bg-white rounded-xl shadow p-6 mb-6'>
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-6'>
              <h1 className='text-2xl font-bold text-gray-800 mb-4 md:mb-0'>Quản lý đơn hàng</h1>
              
              <div className='flex flex-col md:flex-row gap-4 w-full md:w-auto'>
                {/* Status Filter */}
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                    <FaFilter className='text-gray-400' />
                  </div>
                  <select
                    className='pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full md:w-auto'
                    value={statusFilter}
                    onChange={handleStatusChange}
                  >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="pending">Đang chuẩn bị hàng</option>
                    <option value="shipping">Đang giao</option>
                    <option value="shipped">Đã giao</option>
                    <option value="cancelled">Đã hủy</option>
                  </select>
                </div>
                
                {/* Search Bar */}
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                    <FaSearch className='text-gray-400' />
                  </div>
                  <input
                    type="text"
                    placeholder="Tìm kiếm đơn hàng..."
                    className='pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full md:w-64'
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                </div>
              </div>
            </div>
            
            {/* Order Stats Cards */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
              <div className='bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 text-white'>
                <div className='flex justify-between items-center mb-2'>
                  <h3 className='font-semibold'>Tổng đơn hàng</h3>
                  <FaShippingFast className='text-xl' />
                </div>
                <p className='text-2xl font-bold'>{orders.length}</p>
              </div>
              
              <div className='bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-4 text-white'>
                <div className='flex justify-between items-center mb-2'>
                  <h3 className='font-semibold'>Chờ thanh toán</h3>
                  <span className='text-xl'>💰</span>
                </div>
                <p className='text-2xl font-bold'>{orders.filter(order => order.status === 'pending').length}</p>
              </div>
              
              <div className='bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white'>
                <div className='flex justify-between items-center mb-2'>
                  <h3 className='font-semibold'>Đang giao</h3>
                  <FaTruck className='text-xl' />
                </div>
                <p className='text-2xl font-bold'>{orders.filter(order => order.status === 'shipping').length}</p>
              </div>
              
              <div className='bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white'>
                <div className='flex justify-between items-center mb-2'>
                  <h3 className='font-semibold'>Hoàn thành</h3>
                  <FaCheckCircle className='text-xl' />
                </div>
                <p className='text-2xl font-bold'>{orders.filter(order => order.status === 'shipped').length}</p>
              </div>
            </div>
            
            {/* Orders Table */}
            <div className='overflow-x-auto'>
              {loading ? (
                <div className='text-center py-4'>Đang tải dữ liệu...</div>
              ) : currentOrders.length === 0 ? (
                <div className='text-center py-4'>Không tìm thấy đơn hàng nào</div>
              ) : (
                <table className='w-full min-w-full'>
                  <thead>
                    <tr className='text-left bg-gray-50'>
                      <th className='px-4 py-2 border-b'>Mã đơn</th>
                      <th className='px-4 py-2 border-b'>Khách hàng</th>
                      <th className='px-4 py-2 border-b'>Số sản phẩm</th>
                      <th className='px-4 py-2 border-b'>Tổng tiền</th>
                      <th className='px-4 py-2 border-b'>Ngày đặt</th>
                      <th className='px-4 py-2 border-b'>Trạng thái</th>
                      <th className='px-4 py-2 border-b'>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentOrders.map((order) => (
                      <tr key={order._id}>
                        <td className='px-4 py-3 border-b'>#{order._id.substring(0, 8)}</td>
                        <td className='px-4 py-3 border-b'>{order.customer?.name || 'Khách hàng không xác định'}</td>
                        <td className='px-4 py-3 border-b'>{order.items.reduce((total, item) => total + item.quantity, 0)}</td>
                        <td className='px-4 py-3 border-b'>{order.totalPrice}đ</td>
                        <td className='px-4 py-3 border-b'>{new Date(order.createAt).toLocaleDateString('vi-VN')}</td>
                        <td className='px-4 py-3 border-b'>{renderStatusBadge(order.status)}</td>
                        <td className='px-4 py-3 border-b'>
                          <button
                            onClick={() => viewOrderDetails(order)}
                            className='p-2 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200'
                            title='Xem chi tiết'
                          >
                            <FaEye />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              
              {/* Pagination */}
              {!loading && totalPages > 1 && (
                <div className='flex justify-between items-center mt-4'>
                  <div>
                    <span className='text-sm text-gray-700'>
                      Hiển thị {indexOfFirstOrder + 1}-{Math.min(indexOfLastOrder, filteredOrders.length)} trong tổng số {filteredOrders.length} đơn hàng
                    </span>
                  </div>
                  <div className='flex gap-2'>
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-200 text-gray-500' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
                    >
                      Trước
                    </button>
                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentPage(index + 1)}
                        className={`px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
                      >
                        {index + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-200 text-gray-500' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
                    >
                      Sau
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Order Detail Modal */}
      {showModal && <OrderDetailModal />}
    </div>
  );
};

export default SellerOrder;