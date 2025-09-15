import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import LogoSvg from '../components/svgs/DHKPTSocial.jsx'
const Login = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState();
  const [user, setUser] = useState();

  useEffect(() => {
        const id = Cookies.get('customerId');
        const name = Cookies.get('customerName');
        const store = Cookies.get('store');
        // console.log(id != undefined);
        // console.log(name != undefined);
        if(store != undefined && id != undefined && name != undefined){
          navigate('/e-commerce/seller/home');
        }
        else if(id != undefined && name != undefined) {
          navigate('/e-commerce/customer/home'); 
        }
      })
      const handleLogin = () => {
        setLoading(true);
        axios
        .get(`https://dhkptsocial.onrender.com/users/username/${username}`)
        .then((response) => {
            setUser(response.data);
            setLoading(false);
            if(password === ''){
              enqueueSnackbar('Chưa nhập đầy đủ thông tin', { variant: 'error' });
              setLoading(false);
            }
            else if(password !== response.data.password){
              enqueueSnackbar('Sai mật khẩu', { variant: 'error' });
              setLoading(false);
            }
            else if (response.data.status ==='Banned'){
              enqueueSnackbar('Tài khoản của bạn đã bị khóa', {variant: 'error'}) ;
            }
            else{
              Cookies.set('customerId', response.data._id, { expires: 1 });
              Cookies.set('customerName', response.data.name, { expires: 1 });
              setLoading(false);
              axios.get(`https://dhkshop.onrender.com/store/manager/${response.data._id}`)
              .then((response) => {
                console.log(response.data);
                if(response.data.length === 0) navigate('/e-commerce/customer/home');
                else{
                  navigate('/e-commerce/seller/list-store', { state: { items: response.data } });
                }
              })
              .catch((e) => {
                navigate('/e-commerce/customer/home');
              })
              // Lấy vị trí hiện tại của người dùng 
              // if (navigator.geolocation) {
              //   navigator.geolocation.getCurrentPosition(
              //     (position) => {
              //       setLocation({
              //         latitude: position.coords.latitude,
              //         longitude: position.coords.longitude,
              //       });
              //       console.log(position.coords.latitude +' / ' + position.coords.longitude);
              //     },
              //     (err) => {
              //       console.log(err);
              //     }
              //   );
              // } else {
              //   setError("Trình duyệt của bạn không hỗ trợ Geolocation.");
              // }
            }
        })
        .catch((error) => {
            enqueueSnackbar('Người dùng không tồn tại', { variant: 'error' });
            setLoading(false);
        });
    }
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="py-6 px-6 bg-gradient-to-r from-purple-500 to-blue-500 text-center">
            <h1 className="text-3xl font-bold text-white">DHKShop</h1>
            <p className="text-sm text-white/80 mt-1">Sàn thương mại điện tử uy tín</p>
          </div>

          {/* Form Section */}
          <div className="p-6 space-y-6">
            <div className="text-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Đăng nhập tài khoản</h2>
              <p className="text-sm text-gray-500 mt-1">Mua sắm dễ dàng với hàng ngàn sản phẩm</p>
            </div>

            {/* Social Login */}
            {/* <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center py-2 px-4 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg border border-blue-200 transition-colors">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                </svg>
                Facebook
              </button>
              <button className="flex items-center justify-center py-2 px-4 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg border border-red-200 transition-colors">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2.917 16.083c-2.258 0-4.083-1.825-4.083-4.083s1.825-4.083 4.083-4.083c1.103 0 2.024.402 2.735 1.067l-1.107 1.068c-.304-.292-.834-.63-1.628-.63-1.394 0-2.531 1.155-2.531 2.579 0 1.424 1.138 2.579 2.531 2.579 1.616 0 2.224-1.162 2.316-1.762h-2.316v-1.4h3.855c.036.204.064.408.064.677.001 2.332-1.563 3.988-3.919 3.988zm9.917-3.5h-1.75v1.75h-1.167v-1.75h-1.75v-1.166h1.75v-1.75h1.167v1.75h1.75v1.166z" />
                </svg>
                Google
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-gray-500">hoặc đăng nhập với</span>
              </div>
            </div> */}

            {/* Email/Username Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email hoặc tên đăng nhập
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    let value = e.target.value;
                    if (value.length > 50) value = value.slice(0, 50);
                    setUsername(value);
                  }}
                  className="pl-10 w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white transition-all"
                  placeholder="Nhập email hoặc tên đăng nhập"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  maxLength={30}
                  type="password"
                  value={password}
                  onChange={(e) => {
                    let value = e.target.value;
                    if (value.length > 30) value = value.slice(0, 30);
                    setPassword(value);
                  }}
                  className="pl-10 w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white transition-all"
                  placeholder="Nhập mật khẩu"
                />
              </div>
            </div>

            {/* Remember Me and Forgot Password */}
            <div className="flex items-center justify-end">
              <div className="text-sm">
                <a href="#" className="font-medium text-purple-600 hover:text-purple-500">
                  Quên mật khẩu?
                </a>
              </div>
            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border 
              border-transparent rounded-lg shadow-lg text-sm font-medium 
              text-white bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 hover:scale-105
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all"
            >
              {loading ? (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              {loading ? "Đang xử lý..." : "Đăng nhập"}
            </button>

            {/* Register Section */}
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Chưa có tài khoản?{" "}
                <a href="/register" className="font-medium text-purple-600 hover:text-purple-500">
                  Đăng ký ngay
                </a>
              </p>
              <p className="text-xs text-gray-500 mt-3">
                Bằng việc đăng nhập, bạn đồng ý với{" "}
                <a href="#" className="text-purple-600 hover:text-purple-500">Điều khoản dịch vụ</a>
                {" "}và{" "}
                <a href="#" className="text-purple-600 hover:text-purple-500">Chính sách bảo mật</a>
                {" "}của chúng tôi.
              </p>
            </div>
          </div>
        </div>
      </div>
  )
}

export default Login