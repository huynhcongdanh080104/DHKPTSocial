import React, { useState } from 'react';
import { FaClipboardList, FaDownload, FaCalendarAlt, FaExclamationTriangle, FaCheck, FaClock, FaChartPie, FaFileInvoiceDollar } from 'react-icons/fa';
import SellerHomeNav from '../components/SellerHomeNav';

const SellerTax = () => {
  const [period, setPeriod] = useState('quarter');
  const [status, setStatus] = useState('all');
  
  // Dữ liệu thuế theo quý
  const taxData = [
    { 
      id: 1, 
      period: 'Quý 1/2025', 
      revenue: '157.500.000đ', 
      taxAmount: '15.750.000đ', 
      taxRate: '10%', 
      status: 'Đã nộp',
      dueDate: '30/04/2025',
      paymentDate: '25/04/2025',
      invoiceNum: 'INV-20250425'
    },
    { 
      id: 2, 
      period: 'Quý 2/2025', 
      revenue: '178.300.000đ', 
      taxAmount: '17.830.000đ', 
      taxRate: '10%', 
      status: 'Chưa đến hạn',
      dueDate: '30/07/2025',
      paymentDate: '-',
      invoiceNum: '-'
    },
    { 
      id: 3, 
      period: 'Quý 3/2024', 
      revenue: '142.800.000đ', 
      taxAmount: '14.280.000đ', 
      taxRate: '10%', 
      status: 'Đã nộp',
      dueDate: '30/10/2024',
      paymentDate: '28/10/2024',
      invoiceNum: 'INV-20241028'
    },
    { 
      id: 4, 
      period: 'Quý 4/2024', 
      revenue: '165.200.000đ', 
      taxAmount: '16.520.000đ', 
      taxRate: '10%', 
      status: 'Đã nộp',
      dueDate: '30/01/2025',
      paymentDate: '27/01/2025',
      invoiceNum: 'INV-20250127'
    },
  ];
  
  // Dữ liệu tổng quan thuế
  const taxSummary = {
    yearToDate: '33.580.000đ',
    nextDueAmount: '17.830.000đ',
    nextDueDate: '30/07/2025',
    totalPaid: '46.550.000đ',
    avgTaxRate: '10%'
  };

  return (
    <div className='flex bg-gray-100'>
      <SellerHomeNav />
      <div className='w-1/5'></div>
      <div className='min-h-screen w-4/5'>
        <div className='p-6'>
          <div className='bg-white rounded-xl shadow p-6 mb-6'>
            <div className='flex justify-between items-center mb-6'>
              <h1 className='text-2xl font-bold text-gray-800'>Quản lý thuế</h1>
              <div className='flex space-x-2'>
                <button className='bg-green-600 text-white px-3 py-2 rounded-lg flex items-center'>
                  <FaDownload className='mr-2' /> Xuất báo cáo thuế
                </button>
              </div>
            </div>
            
            {/* Thống kê tổng quan thuế */}
            <div className='grid grid-cols-1 md:grid-cols-5 gap-4 mb-6'>
              <div className='bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white'>
                <div className='flex justify-between items-center mb-2'>
                  <h3 className='font-semibold'>Thuế năm hiện tại</h3>
                  <FaFileInvoiceDollar className='text-xl' />
                </div>
                <p className='text-2xl font-bold'>{taxSummary.yearToDate}</p>
              </div>
              
              <div className='bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-4 text-white'>
                <div className='flex justify-between items-center mb-2'>
                  <h3 className='font-semibold'>Thuế kỳ tới</h3>
                  <FaClock className='text-xl' />
                </div>
                <p className='text-2xl font-bold'>{taxSummary.nextDueAmount}</p>
                <p className='text-xs mt-1'>Hạn nộp: {taxSummary.nextDueDate}</p>
              </div>
              
              <div className='bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white'>
                <div className='flex justify-between items-center mb-2'>
                  <h3 className='font-semibold'>Đã nộp</h3>
                  <FaCheck className='text-xl' />
                </div>
                <p className='text-2xl font-bold'>{taxSummary.totalPaid}</p>
              </div>
              
              <div className='bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 text-white'>
                <div className='flex justify-between items-center mb-2'>
                  <h3 className='font-semibold'>Suất thuế trung bình</h3>
                  <FaChartPie className='text-xl' />
                </div>
                <p className='text-2xl font-bold'>{taxSummary.avgTaxRate}</p>
              </div>
              
              <div className='bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-4 text-white'>
                <div className='flex justify-between items-center mb-2'>
                  <h3 className='font-semibold'>Trạng thái</h3>
                  <FaExclamationTriangle className='text-xl' />
                </div>
                <p className='text-xl font-bold'>Đang tuân thủ</p>
              </div>
            </div>
            
            {/* Bộ lọc */}
            <div className='flex items-center space-x-4 mb-4'>
              <div className='relative'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Thời gian</label>
                <select 
                  className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-8'
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                >
                  <option value="month">Tháng</option>
                  <option value="quarter">Quý</option>
                  <option value="year">Năm</option>
                </select>
                <FaCalendarAlt className='absolute right-3 bottom-3 text-gray-400' />
              </div>
              
              <div className='relative'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Trạng thái</label>
                <select 
                  className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-8'
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="all">Tất cả</option>
                  <option value="paid">Đã nộp</option>
                  <option value="pending">Chưa đến hạn</option>
                  <option value="overdue">Quá hạn</option>
                </select>
                <FaClipboardList className='absolute right-3 bottom-3 text-gray-400' />
              </div>
            </div>
            
            {/* Danh sách thuế */}
            <div className='overflow-x-auto'>
              <table className='w-full min-w-full'>
                <thead>
                  <tr className='text-left bg-gray-50'>
                    <th className='px-4 py-2 border-b'>Kỳ thuế</th>
                    <th className='px-4 py-2 border-b'>Doanh thu</th>
                    <th className='px-4 py-2 border-b'>Thuế suất</th>
                    <th className='px-4 py-2 border-b'>Số tiền thuế</th>
                    <th className='px-4 py-2 border-b'>Hạn nộp</th>
                    <th className='px-4 py-2 border-b'>Ngày thanh toán</th>
                    <th className='px-4 py-2 border-b'>Số hóa đơn</th>
                    <th className='px-4 py-2 border-b'>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {taxData.filter(tax => 
                    status === 'all' || 
                    (status === 'paid' && tax.status === 'Đã nộp') ||
                    (status === 'pending' && tax.status === 'Chưa đến hạn') ||
                    (status === 'overdue' && tax.status === 'Quá hạn')
                  ).map((tax) => (
                    <tr key={tax.id}>
                      <td className='px-4 py-3 border-b font-medium'>{tax.period}</td>
                      <td className='px-4 py-3 border-b'>{tax.revenue}</td>
                      <td className='px-4 py-3 border-b'>{tax.taxRate}</td>
                      <td className='px-4 py-3 border-b font-medium'>{tax.taxAmount}</td>
                      <td className='px-4 py-3 border-b'>{tax.dueDate}</td>
                      <td className='px-4 py-3 border-b'>{tax.paymentDate}</td>
                      <td className='px-4 py-3 border-b'>{tax.invoiceNum}</td>
                      <td className='px-4 py-3 border-b'>
                        {tax.status === 'Đã nộp' && 
                          <span className='px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs'>Đã nộp</span>
                        }
                        {tax.status === 'Chưa đến hạn' && 
                          <span className='px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs'>Chưa đến hạn</span>
                        }
                        {tax.status === 'Quá hạn' && 
                          <span className='px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs'>Quá hạn</span>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Thông tin thuế */}
            <div className='mt-6 p-4 bg-blue-50 rounded-lg'>
              <h3 className='font-semibold text-blue-800 mb-2'>Thông tin thuế quan trọng</h3>
              <ul className='text-sm text-blue-700'>
                <li className='mb-1'>• Thuế GTGT: 10% áp dụng cho hầu hết các sản phẩm</li>
                <li className='mb-1'>• Thuế TNCN: Áp dụng theo biểu thuế lũy tiến từ 5-35% tùy thu nhập</li>
                <li className='mb-1'>• Hạn nộp thuế GTGT: ngày 30 của tháng đầu tiên quý tiếp theo</li>
                <li className='mb-1'>• Hạn nộp thuế TNCN: ngày 15/12 hàng năm cho tạm nộp, 30/3 năm sau cho quyết toán</li>
                <li>• Giữ lại hóa đơn và chứng từ kế toán tối thiểu 5 năm theo quy định</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerTax;