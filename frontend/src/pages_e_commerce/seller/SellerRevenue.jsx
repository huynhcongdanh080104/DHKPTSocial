import React, { useState } from 'react';
import { FaChartLine, FaDownload, FaCalendarAlt, FaChartBar, FaChartPie, FaDollarSign, FaShoppingCart } from 'react-icons/fa';
import SellerHomeNav from '../components/SellerHomeNav';

const SellerRevenue = () => {
  const [period, setPeriod] = useState('month');
  const [chartType, setChartType] = useState('line');
  
  // Dữ liệu mẫu cho biểu đồ
  const monthlyData = [
    { month: 'T1', revenue: 48500000, orders: 182 },
    { month: 'T2', revenue: 52300000, orders: 195 },
    { month: 'T3', revenue: 56700000, orders: 210 },
    { month: 'T4', revenue: 49800000, orders: 186 },
    { month: 'T5', revenue: 58900000, orders: 224 },
    { month: 'T6', revenue: 60200000, orders: 237 },
    { month: 'T7', revenue: 57400000, orders: 218 },
    { month: 'T8', revenue: 64100000, orders: 253 },
    { month: 'T9', revenue: 63250000, orders: 244 },
    { month: 'T10', revenue: 67800000, orders: 268 },
    { month: 'T11', revenue: 71200000, orders: 282 },
    { month: 'T12', revenue: 86500000, orders: 340 },
  ];

  // Dữ liệu thống kê tổng quan
  const stats = {
    totalRevenue: '785.650.000đ',
    avgOrderValue: '2.815.000đ',
    salesGrowth: '+12.3%',
    topCategory: 'Điện thoại & Phụ kiện',
    topProduct: 'iPhone 14 Pro Max'
  };
  
  // Dữ liệu sản phẩm bán chạy
  const topProducts = [
    { name: 'iPhone 14 Pro Max', revenue: '156.250.000đ', quantity: 47, percentage: 19.8 },
    { name: 'Laptop Dell XPS 13', revenue: '128.760.000đ', quantity: 35, percentage: 16.4 },
    { name: 'Samsung Galaxy S23', revenue: '110.500.000đ', quantity: 42, percentage: 14.1 },
    { name: 'AirPods Pro', revenue: '78.340.000đ', quantity: 106, percentage: 10.0 },
    { name: 'iPad Air', revenue: '65.780.000đ', quantity: 29, percentage: 8.4 },
  ];

  return (
    <div className='flex bg-gray-100'>
      <SellerHomeNav />
      <div className='w-1/5'></div>
      <div className='min-h-screen w-4/5'>
        <div className='p-6'>
          <div className='bg-white rounded-xl shadow p-6 mb-6'>
            <div className='flex justify-between items-center mb-6'>
              <h1 className='text-2xl font-bold text-gray-800'>Quản lý doanh thu</h1>
              <div className='flex space-x-2'>
                <div className='relative'>
                  <select 
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-8'
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                  >
                    <option value="day">Ngày</option>
                    <option value="week">Tuần</option>
                    <option value="month">Tháng</option>
                    <option value="quarter">Quý</option>
                    <option value="year">Năm</option>
                  </select>
                  <FaCalendarAlt className='absolute right-3 top-3 text-gray-400' />
                </div>
                <button className='bg-green-600 text-white px-3 py-2 rounded-lg flex items-center'>
                  <FaDownload className='mr-2' /> Xuất báo cáo
                </button>
              </div>
            </div>
            
            {/* Thống kê tổng quan */}
            <div className='grid grid-cols-1 md:grid-cols-5 gap-4 mb-6'>
              <div className='bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white'>
                <div className='flex justify-between items-center mb-2'>
                  <h3 className='font-semibold'>Tổng doanh thu</h3>
                  <FaDollarSign className='text-xl' />
                </div>
                <p className='text-2xl font-bold'>{stats.totalRevenue}</p>
              </div>
              
              <div className='bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 text-white'>
                <div className='flex justify-between items-center mb-2'>
                  <h3 className='font-semibold'>Giá trị trung bình</h3>
                  <FaShoppingCart className='text-xl' />
                </div>
                <p className='text-2xl font-bold'>{stats.avgOrderValue}</p>
              </div>
              
              <div className='bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white'>
                <div className='flex justify-between items-center mb-2'>
                  <h3 className='font-semibold'>Tăng trưởng</h3>
                  <FaChartLine className='text-xl' />
                </div>
                <p className='text-2xl font-bold'>{stats.salesGrowth}</p>
              </div>
              
              <div className='bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl p-4 text-white'>
                <div className='flex justify-between items-center mb-2'>
                  <h3 className='font-semibold'>Danh mục tốt nhất</h3>
                  <FaChartPie className='text-xl' />
                </div>
                <p className='text-xl font-bold truncate'>{stats.topCategory}</p>
              </div>
              
              <div className='bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-4 text-white'>
                <div className='flex justify-between items-center mb-2'>
                  <h3 className='font-semibold'>Sản phẩm tốt nhất</h3>
                  <FaChartBar className='text-xl' />
                </div>
                <p className='text-xl font-bold truncate'>{stats.topProduct}</p>
              </div>
            </div>
            
            {/* Biểu đồ doanh thu */}
            <div className='bg-white rounded-xl border p-4 mb-6'>
              <div className='flex justify-between items-center mb-4'>
                <h2 className='text-lg font-semibold'>Biểu đồ doanh thu</h2>
                <div className='flex space-x-2'>
                  <button 
                    className={`px-3 py-1 rounded ${chartType === 'line' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'}`}
                    onClick={() => setChartType('line')}
                  >
                    <FaChartLine className='inline mr-1' /> Đường
                  </button>
                  <button 
                    className={`px-3 py-1 rounded ${chartType === 'bar' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'}`}
                    onClick={() => setChartType('bar')}
                  >
                    <FaChartBar className='inline mr-1' /> Cột
                  </button>
                </div>
              </div>
              
              {/* Đây là vùng hiển thị biểu đồ - trong thực tế sẽ dùng thư viện như Chart.js, Recharts */}
              <div className='h-64 w-full bg-gray-50 flex items-center justify-center border border-dashed border-gray-300 rounded'>
                <p className='text-gray-500'>Biểu đồ doanh thu theo {period === 'day' ? 'ngày' : period === 'week' ? 'tuần' : period === 'month' ? 'tháng' : period === 'quarter' ? 'quý' : 'năm'} sẽ hiển thị ở đây</p>
              </div>
            </div>
            
            {/* Top sản phẩm */}
            <div className='bg-white rounded-xl border p-4 mb-6'>
              <h2 className='text-lg font-semibold mb-4'>Sản phẩm bán chạy nhất</h2>
              <div className='overflow-x-auto'>
                <table className='w-full min-w-full'>
                  <thead>
                    <tr className='text-left bg-gray-50'>
                      <th className='px-4 py-2 border-b'>Sản phẩm</th>
                      <th className='px-4 py-2 border-b'>Doanh thu</th>
                      <th className='px-4 py-2 border-b'>Số lượng</th>
                      <th className='px-4 py-2 border-b'>% Doanh thu</th>
                      <th className='px-4 py-2 border-b'>Hiệu suất</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topProducts.map((product, index) => (
                      <tr key={index}>
                        <td className='px-4 py-3 border-b font-medium'>{product.name}</td>
                        <td className='px-4 py-3 border-b'>{product.revenue}</td>
                        <td className='px-4 py-3 border-b'>{product.quantity}</td>
                        <td className='px-4 py-3 border-b'>{product.percentage}%</td>
                        <td className='px-4 py-3 border-b'>
                          <div className='w-full bg-gray-200 rounded-full h-2.5'>
                            <div className='bg-blue-600 h-2.5 rounded-full' style={{ width: `${product.percentage}%` }}></div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Tips Section */}
            <div className='p-4 bg-blue-50 rounded-lg'>
              <h3 className='font-semibold text-blue-800 mb-2'>Mẹo tối ưu doanh thu</h3>
              <ul className='text-sm text-blue-700'>
                <li className='mb-1'>• Phân tích các mẫu doanh thu theo mùa để chuẩn bị cho các thời điểm cao điểm</li>
                <li className='mb-1'>• Tập trung quảng bá các sản phẩm có tỷ suất lợi nhuận cao</li>
                <li className='mb-1'>• Theo dõi tỷ lệ chuyển đổi và tối ưu hóa quy trình thanh toán</li>
                <li>• Sử dụng chiến dịch email marketing để tăng giá trị đơn hàng trung bình</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerRevenue;