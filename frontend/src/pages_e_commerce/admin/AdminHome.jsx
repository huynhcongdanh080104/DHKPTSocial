import React, { useState } from 'react';
import { FaUserShield, FaStore, FaChartBar, FaList, FaSignOutAlt, FaBoxes, FaComments, FaChevronDown, FaChevronUp, FaClipboardList } from "react-icons/fa";
import AdminManagement from './AdminManagement';
import StoreManagement from './StoreManagement';
import CategoryManagement from './CategoryManagement';
import RevenueStatistics from './RevenueStatistics';
import ProductReport from './Report/ProductReport';
import CommentReport from './Report/CommentReport';
import StoreReport from './Report/StoreReport';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import LogoSvg from '../../components/svgs/DHKPTSocial_Admin';
import { motion, AnimatePresence } from "framer-motion";
const AdminHome = () => {
  const [activeTab, setActiveTab] = useState('admin');
  const [showReportMenu, setShowReportMenu] = useState(false);
  const navigate = useNavigate();
  const handleLogout = () => {
    Cookies.remove("username");
    Cookies.remove("password");
    Cookies.remove("role");
    navigate("/admin/e-commerce/login");
  };
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  const menuItems = [
    ...(Cookies.get("role") === 'superadmin' ? [{ id: 'admin', label: 'Quản lý Admin', icon: FaUserShield }] : []),
    { id: 'store', label: 'Quản lý Cửa hàng', icon: FaStore },
    { id: 'categories', label: 'Quản lý Danh mục', icon: FaList },
    { id: 'revenue', label: 'Thống kê Doanh thu', icon: FaChartBar }
  ];

  const reportTabs = [
    { id: 'storeReport', label: 'Cửa hàng', icon: FaStore },
    { id: 'productReport', label: 'Sản phẩm', icon: FaBoxes },
    { id: 'commentReport', label: 'Bình luận', icon: FaComments }
  ];

  const getPageTitle = () => {
    const allTabs = [...menuItems, ...reportTabs];
    const activeItem = allTabs.find(item => item.id === activeTab);
    return activeItem ? activeItem.label : 'Trang quản trị';
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-[#003500] text-white p-4 flex flex-col justify-between h-full fixed left-0 top-0 bottom-0 overflow-y-auto">
        <h3 className="text-4xl font-bold text-white">
          <LogoSvg className="max-w-xs h-auto fill-black" />
        </h3>
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200
              ${activeTab === item.id ? 'bg-gradient-to-r from-[#6e864a] to-[#0d330e]' : 'hover:bg-gradient-to-r hover:from-[#2d531a] hover:to-[#2d531a]'}`}
            >
              <item.icon className="text-xl" />
              <span>{item.label}</span>
            </button>
          ))}

          {/* Quản lý Báo cáo Dropdown */}
<button
  onClick={() => setShowReportMenu(!showReportMenu)}
  className="w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200
   hover:bg-gradient-to-r hover:from-[#2d531a] hover:to-[#2d531a]"
>
  <FaClipboardList className="text-xl" />
  <span>Quản lý Báo cáo</span>
  {showReportMenu ? <FaChevronUp className="ml-auto" /> : <FaChevronDown className="ml-auto" />}
</button>

{/* Hiệu ứng xổ xuống */}
<AnimatePresence>
  {showReportMenu && (
    <motion.div
      initial={{ height: 0, opacity: 0, scale: 0.9, translateY: -10 }}
      animate={{ height: "auto", opacity: 1, scale: 1, translateY: 0 }}
      exit={{ height: 0, opacity: 0, scale: 0.9, translateY: -10 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="ml-4 overflow-hidden flex flex-col gap-2"
    >
      {reportTabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleTabChange(tab.id)}
          className={`w-full flex items-center space-x-3 p-2 rounded-lg transition-all duration-200 bg-gradient-to-r 
          ${activeTab === tab.id ? 'from-[#6e864a] to-[#0d330e]' : 'hover:from-[#2d531a] hover:to-[#2d531a]'}`}
        >
          <tab.icon className="text-lg" />
          <span>{tab.label}</span>
        </button>
      ))}
    </motion.div>
  )}
</AnimatePresence>
        </nav>
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 p-3 mt-auto text-red-400 hover:text-red-600 hover:bg-gradient-to-l hover:from-[#a94432] hover:to-[#682c21] rounded-lg"
        >
          <FaSignOutAlt className="text-xl" />
          <span>Đăng xuất</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-[#f1f1f1] ml-64">
        {activeTab === 'admin' && <AdminManagement />}
        {activeTab === 'store' && <StoreManagement />}
        {activeTab === 'categories' && <CategoryManagement />}
        {activeTab === 'revenue' && <RevenueStatistics />}
        {activeTab === 'storeReport' && <StoreReport />}
        {activeTab === 'productReport' && <ProductReport />}
        {activeTab === 'commentReport' && <CommentReport />}
      </div>
    </div>
  );
}

export default AdminHome;
