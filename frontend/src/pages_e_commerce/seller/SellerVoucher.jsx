import React, { useState } from 'react';
import { FaEdit, FaTrash, FaPlus, FaTag, FaPaperPlane, FaHistory } from 'react-icons/fa';
import SellerHomeNav from '../components/SellerHomeNav';

const SellerVoucher = () => {
  const [activeTab, setActiveTab] = useState('active');
  
  const [vouchers, setVouchers] = useState([
    { 
      id: 1, 
      code: 'SUMMER30', 
      type: 'Giảm giá cố định', 
      value: '30.000đ', 
      minOrder: '100.000đ', 
      startDate: '01/03/2025', 
      endDate: '31/03/2025', 
      status: 'Đang hoạt động',
      usageCount: 45,
      limit: 100
    },
    { 
      id: 2, 
      code: 'FLASH15', 
      type: 'Giảm theo %', 
      value: '15%', 
      minOrder: '200.000đ', 
      startDate: '05/03/2025', 
      endDate: '10/03/2025', 
      status: 'Đang hoạt động',
      usageCount: 23,
      limit: 50
    },
    { 
      id: 3, 
      code: 'WELCOME10', 
      type: 'Giảm theo %', 
      value: '10%', 
      minOrder: '150.000đ', 
      startDate: '01/01/2025', 
      endDate: '01/02/2025', 
      status: 'Hết hạn',
      usageCount: 89,
      limit: 100
    },
  ]);

  return (
    <div className='flex bg-gray-100'>
      <SellerHomeNav />
      <div className='w-1/5'></div>
      <div className='min-h-screen w-4/5'>
        <div className='p-6'>
          <div className='bg-white rounded-xl shadow p-6 mb-6'>
            <div className='flex justify-between items-center mb-4'>
              <h1 className='text-2xl font-bold text-gray-800'>Quản lý khuyến mãi</h1>
              <button className='bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center'>
                <FaPlus className='mr-2' /> Tạo khuyến mãi mới
              </button>
            </div>
            
            {/* Thống kê tổng quan */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
              <div className='bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 text-white'>
                <div className='flex justify-between items-center mb-2'>
                  <h3 className='font-semibold'>Khuyến mãi đang chạy</h3>
                  <FaTag className='text-xl' />
                </div>
                <p className='text-2xl font-bold'>2</p>
              </div>
              
              <div className='bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white'>
                <div className='flex justify-between items-center mb-2'>
                  <h3 className='font-semibold'>Tổng lượt sử dụng</h3>
                  <FaPaperPlane className='text-xl' />
                </div>
                <p className='text-2xl font-bold'>157</p>
              </div>
              
              <div className='bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl p-4 text-white'>
                <div className='flex justify-between items-center mb-2'>
                  <h3 className='font-semibold'>Tiết kiệm cho khách</h3>
                  <FaHistory className='text-xl' />
                </div>
                <p className='text-2xl font-bold'>4.350.000đ</p>
              </div>
            </div>
            
            {/* Tabs */}
            <div className='flex border-b mb-6'>
              <button 
                className={`px-4 py-2 font-medium ${activeTab === 'active' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('active')}
              >
                Khuyến mãi đang chạy
              </button>
              <button 
                className={`px-4 py-2 font-medium ${activeTab === 'scheduled' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('scheduled')}
              >
                Khuyến mãi đã lên lịch
              </button>
              <button 
                className={`px-4 py-2 font-medium ${activeTab === 'expired' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('expired')}
              >
                Khuyến mãi đã hết hạn
              </button>
            </div>
            
            {/* Voucher List */}
            <div className='overflow-x-auto'>
              <table className='w-full min-w-full'>
                <thead>
                  <tr className='text-left bg-gray-50'>
                    <th className='px-4 py-2 border-b'>Mã khuyến mãi</th>
                    <th className='px-4 py-2 border-b'>Loại</th>
                    <th className='px-4 py-2 border-b'>Giá trị</th>
                    <th className='px-4 py-2 border-b'>Đơn tối thiểu</th>
                    <th className='px-4 py-2 border-b'>Thời gian</th>
                    <th className='px-4 py-2 border-b'>Đã dùng/Giới hạn</th>
                    <th className='px-4 py-2 border-b'>Trạng thái</th>
                    <th className='px-4 py-2 border-b'>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {vouchers.filter(v => 
                    (activeTab === 'active' && v.status === 'Đang hoạt động') ||
                    (activeTab === 'scheduled' && v.status === 'Đã lên lịch') ||
                    (activeTab === 'expired' && v.status === 'Hết hạn')
                  ).map((voucher) => (
                    <tr key={voucher.id}>
                      <td className='px-4 py-3 border-b font-medium'>{voucher.code}</td>
                      <td className='px-4 py-3 border-b'>{voucher.type}</td>
                      <td className='px-4 py-3 border-b'>{voucher.value}</td>
                      <td className='px-4 py-3 border-b'>{voucher.minOrder}</td>
                      <td className='px-4 py-3 border-b text-sm'>
                        {voucher.startDate} - {voucher.endDate}
                      </td>
                      <td className='px-4 py-3 border-b'>
                        {voucher.usageCount}/{voucher.limit}
                      </td>
                      <td className='px-4 py-3 border-b'>
                        {voucher.status === 'Đang hoạt động' && 
                          <span className='px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs'>Đang hoạt động</span>
                        }
                        {voucher.status === 'Đã lên lịch' && 
                          <span className='px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs'>Đã lên lịch</span>
                        }
                        {voucher.status === 'Hết hạn' && 
                          <span className='px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs'>Hết hạn</span>
                        }
                      </td>
                      <td className='px-4 py-3 border-b'>
                        <button className='text-green-600 mr-3' title='Chỉnh sửa'>
                          <FaEdit />
                        </button>
                        <button className='text-red-600' title='Xóa'>
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Tips Section */}
            <div className='mt-6 p-4 bg-blue-50 rounded-lg'>
              <h3 className='font-semibold text-blue-800 mb-2'>Mẹo tối ưu khuyến mãi</h3>
              <ul className='text-sm text-blue-700'>
                <li className='mb-1'>• Tạo mã giảm giá ngắn và dễ nhớ để khách hàng dễ dàng sử dụng</li>
                <li className='mb-1'>• Đặt giới hạn số lượng hợp lý để tránh ảnh hưởng đến lợi nhuận</li>
                <li className='mb-1'>• Tích hợp khuyến mãi với các sự kiện mùa vụ để thu hút khách hàng</li>
                <li>• Phân tích hiệu quả của các mã giảm giá trước để tối ưu các chiến dịch sau</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerVoucher;