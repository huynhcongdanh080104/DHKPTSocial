import React, { useEffect, useState } from 'react'
import Spiner from '../../components/Spiner';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { MdOutlineMail } from "react-icons/md";
import { MdPassword } from "react-icons/md";
import LogoSvg from '../../components/svgs/DHKPTSocial';
import bcrypt from "bcryptjs";
const checkAutoLogin = async (navigate, enqueueSnackbar) => {
  const username = Cookies.get("username");
  const password = Cookies.get("password");
  if (!username || !password) return;
  try {
      const response = await axios.get(`https://dhkshop.onrender.com/admins/username/${username}`);
      const userData = response.data;
      const isPasswordValid = await bcrypt.compare(password, userData.password);
      if (!isPasswordValid || userData.status === "Banned") {
        Cookies.remove("username");
        Cookies.remove("password");
        Cookies.remove("role");
        return;
      }
      const expiresInMinutes = 15 / 1440;
      Cookies.set("username", username, { expires: expiresInMinutes });
      Cookies.set("password", password, { expires: expiresInMinutes });
      Cookies.set("role", userData.role, { expires: expiresInMinutes });
      enqueueSnackbar("Tự động đăng nhập thành công", { variant: "success" });
      navigate("/admin/e-commerce");
  } catch (error) {
    Cookies.remove("username");
    Cookies.remove("password");
    Cookies.remove("role");
  }
};
const Login = () => {
    const [user, setUser] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    useEffect(() => {
        checkAutoLogin(navigate, enqueueSnackbar);
    }, [navigate, enqueueSnackbar]);
    const handleLogin = async () => {
      setLoading(true);
      try {
          if (username === "" || password === "") {
            enqueueSnackbar("Chưa nhập đầy đủ thông tin", { variant: "error" });
            setLoading(false);
            return;
          }
          const response = await axios.get(`https://dhkshop.onrender.com/admins/username/${username}`);
          setUser(response.data);
          // Kiểm tra mật khẩu với bcrypt
          const isPasswordValid = await bcrypt.compare(password, response.data.password);
          if (!isPasswordValid) {
            enqueueSnackbar("Sai mật khẩu", { variant: "error" });
            setLoading(false);
            return;
        }
  
          if (response.data.status === "banned") {
            enqueueSnackbar("Tài khoản của bạn đã bị khóa", { variant: "error" });
            setLoading(false);
            return;
          }
          // Nếu đăng nhập thành công
          const expiresInMinutes = 15 / 1440;
          Cookies.set("username", username, { expires: expiresInMinutes });
          Cookies.set("password", password, { expires: expiresInMinutes });
          Cookies.set("role", response.data.role, { expires: expiresInMinutes });
          setLoading(false);
          enqueueSnackbar("Đăng nhập thành công", { variant: "success" });
          navigate("/admin/e-commerce");
      } catch (error) {
        enqueueSnackbar("Người dùng không tồn tại", { variant: "error" });
        setLoading(false);
      }
  };
  return (
    <div className="min-h-screen bg-[url('/br_adminlogin.jpg')] bg-cover bg-center flex before:content-[''] before:absolute before:inset-0  before:backdrop-blur-lg z-0">
      {/* Logo Section */}
      <div className="hidden lg:flex w-1/2 justify-center items-center">
        <div className="w-2/3 h-32 bg-gradient-to-r from-[#40571f] to-[#6e864a] rounded-xl shadow-xl flex items-center justify-center z-10" >
          <h1 className="text-4xl font-bold text-white"><LogoSvg className='lg:w-2/3 fill-black' /></h1>
        </div>
      </div>

    {/* Login Form Section */}
    <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 z-10">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 style={{height:"45px"}} className="text-center text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#1f5621] to-[#0a400c]">
          Chào mừng trở lại Admin
        </h2>
        <p className="mt-2 text-center text-base text-white">
          Đăng nhập để tiếp tục với tài khoản của bạn
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/80 backdrop-blur-sm py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-gray-100">
          <div className="space-y-6">
            {/* Username Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tên đăng nhập
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  let value = e.target.value.toLowerCase();
                  value = value.replace(/[^a-z0-9]/g, "");
                  if (value.length > 30) value = value.slice(0, 30);
                  setUsername(value);
                }}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/50 backdrop-blur-sm transition-all"
                placeholder="Nhập tên đăng nhập"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mật khẩu
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  let value = e.target.value;
                  if (value.length > 30) value = value.slice(0, 30);
                  setPassword(value);
                }}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/50 backdrop-blur-sm transition-all"
                placeholder="Nhập mật khẩu"
              />
            </div>

            {/* Login Button */}
            <div>
              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-semibold text-white bg-gradient-to-r 
                from-[#0d330e] to-[#6e864a] hover:from-[#071f07] hover:to-[#2d531a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transform transition-all hover:scale-105"
              >
                {loading ? <Spiner/> : 'Đăng nhập'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default Login