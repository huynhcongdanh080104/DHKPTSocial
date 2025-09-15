import { useState } from 'react'
import './App.css'
import {Routes, Route, useLocation} from 'react-router-dom'
import React from 'react'
import Home from './pages/Home';
import Register from './pages/Register';
import ListUser from './pages/ListUser';
import Login from './pages/Login'
import EditProfilePage from'./pages/customer/EditProfilePage';
import UserProfilePage from'./pages/customer/UserProfilePage';
import PostDetails from './pages/customer/PostDetails'
import AdminLoginPage from './pages/admin/AdminLoginPage'
import AdminPage from './pages/admin/AdminPage'
import CommentsReports from './pages/admin/CommentsReports'
import PostsReports from './pages/admin/PostsReports'

import RegistSeller from './pages_e_commerce/seller/RegistSeller'
import SellerHome from './pages_e_commerce/seller/SellerHome'
import SellerProducts from './pages_e_commerce/seller/SellerProducts'
import LoginEcommerce from './pages_e_commerce/Login.jsx'
import CustomerHomePage from './pages_e_commerce/customer/CustomerHomePage.jsx'
import ListStoreEcommerce from './pages_e_commerce/seller/ListStore.jsx'
import ViewStore from './pages_e_commerce/seller/ViewStore.jsx'
import SellerAds from './pages_e_commerce/seller/SellerAds.jsx'
import SellerVoucher from './pages_e_commerce/seller/SellerVoucher.jsx'
import SellerRevenue from './pages_e_commerce/seller/SellerRevenue.jsx'
import SellerTax from './pages_e_commerce/seller/SellerTax.jsx'
import SellerOrder from './pages_e_commerce/seller/SellerOrder.jsx'

import ProductDetail from './pages_e_commerce/components/ProductDetail.jsx'
import CartPage from './pages_e_commerce/components/CartPage.jsx'
import InforPayment from './pages_e_commerce/customer/InforPayment.jsx'
import PaymentPage from './pages_e_commerce/customer/PaymentPage.jsx'
import ReturnPayment from './pages_e_commerce/customer/ReturnPayment.jsx'
import OrderList from "./pages_e_commerce/customer/OrderList.jsx";
import OrderDetail from "./pages_e_commerce/customer/OrderDetail";
import AccountLayout from "./pages_e_commerce/customer/AccountLayout";
import AccountPage from "./pages_e_commerce/customer/AccountPage.jsx";

import AssignOrdersWarehouse from './pages_e_commerce/shipper/AssignOrdersWarehouse'
import LoginShipper from './pages_e_commerce/shipper/LoginShipper'

import LoginWarehouseStaff from './pages_e_commerce/shipper/LoginWarehouseStaff'
import ShipperDashboard from './pages_e_commerce/shipper/ShipperDashboard'
import ShipperOrders from './pages_e_commerce/shipper/ShipperOrders'
import WarehouseDashboard from './pages_e_commerce/shipper/WarehouseDashboard'
import WarehouseOrders from './pages_e_commerce/shipper/WarehouseOrders'
import WarehouseOrdersPage from './pages_e_commerce/shipper/WarehouseOrdersPage'
import WarehousePage from './pages_e_commerce/shipper/WarehousePage'
import WarehouseShippers from './pages_e_commerce/shipper/WarehouseShippers';

import AdminLogin from './pages_e_commerce/admin/Login'
import AdminHome from './pages_e_commerce/admin/AdminHome'

import {
  Chart as ChartJS,
  CategoryScale, // Đăng ký CategoryScale
  LinearScale,   // Đăng ký LinearScale
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import AcceptableUsePolicy from './pages/AcceptableUsePolicy.jsx';

// Đăng ký các thành phần cần thiết
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);
const App = () => {
  return (
      <Routes>
        <Route path='/use-policy' element={<AcceptableUsePolicy/>}/>
        {/* Social Media */}
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        {/* User */}
        <Route path='/' element={<Login/>}/>
        <Route path='/home' element={<Home/>}/>
        <Route path='/users/list' element={<ListUser/>}/>
        <Route path='/edit/:id' element={<EditProfilePage/>}/>
        <Route path='/users/:id' element={<UserProfilePage/>}/>
        <Route path='/article' element={<PostDetails/>}/>
        {/* Admin */}
        <Route path='/admin/login' element={<AdminLoginPage/>}/>
        <Route path='/admin' element={<AdminPage/>} />
        <Route path='/comments/reports' element={<CommentsReports/>}/>
        <Route path='/posts/reports' element={<PostsReports/>}/>

        {/* E-Commerce */}
        <Route path='/e-commerce' element={<LoginEcommerce/>}/>
        <Route path='/e-commerce/login' element={<LoginEcommerce/>}/>
        {/* Customer */}
        <Route path='/e-commerce/customer/home' element={<CustomerHomePage/>}/>
        <Route path='/product/:id' element={<ProductDetail/>}/>
        <Route path='/cart' element={<CartPage/>}/>
        <Route path='/e-commerce/customer/infor-payment' element={<InforPayment/>}/>
        <Route path='/e-commerce/customer/payment' element={<PaymentPage/>}/>
        <Route path='/e-commerce/customer/return-payment' element={<ReturnPayment/>}/>
        <Route path="/e-commerce/customer/account" element={<AccountLayout />}>
          <Route index element={<AccountPage />} /> {/* /account */}
          <Route path="orders" element={<OrderList />} /> {/* /account/orders */}
          <Route path="order/:orderId" element={<OrderDetail />} />
        </Route>

        {/* Seller */}
        <Route path='/e-commerce/seller/view-store/:id' element={<ViewStore/>}/>
        <Route path='/e-commerce/seller/list-store' element={<ListStoreEcommerce/>}/>
        <Route path='/e-commerce/seller/home' element={<SellerHome/>}/>
        <Route path='/e-commerce/seller/regist-seller' element={<RegistSeller/>}/>
        <Route path='/e-commerce/seller/products' element={<SellerProducts/>}/>
        <Route path='/e-commerce/seller/ads' element={<SellerAds/>}/>
        <Route path='/e-commerce/seller/voucher' element={<SellerVoucher/>}/>
        <Route path='/e-commerce/seller/revenue' element={<SellerRevenue/>}/>
        <Route path='/e-commerce/seller/tax' element={<SellerTax/>}/>
        <Route path='/e-commerce/seller/order' element={<SellerOrder/>}/>
        {/* Shipper */}
        <Route path="/shipper-login" element={<LoginShipper />} />
        <Route path="/assignorderswarehouse" element={<AssignOrdersWarehouse/>}/>
        <Route path="/loginwarehousestaff" element={<LoginWarehouseStaff/>}/>
        <Route path="/shipperdashboard" element={<ShipperDashboard/>}/>
        <Route path="/shipperorders" element={<ShipperOrders/>}/>
        <Route path="/warehousedashboard" element={<WarehouseDashboard/>}/>
        <Route path="/warehouseorders" element={<WarehouseOrders/>}/>
        <Route path="/warehouseorderspage" element={<WarehouseOrdersPage/>}/>
        <Route path="/warehousepage" element={<WarehousePage/>}/>
        <Route path="/warehouseshippers" element={<WarehouseShippers/>}/>   
        {/* Admin */}
        <Route path='/admin/e-commerce/login' element={<AdminLogin/>}/>
        <Route path='/admin/e-commerce' element={<AdminHome/>} />
      </Routes>
  )
}

export default App
