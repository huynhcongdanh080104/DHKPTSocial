import React, { useState, useEffect } from 'react'
import logo from '../../assets/logo.png'
import { FaAngleDown } from "react-icons/fa";
import axios from 'axios';
import { useSnackbar } from 'notistack';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const SellerRegistNav = () => {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const [username, setUsername] = useState("");
    const [avatar, setAvatar] = useState("");
    useEffect(() => {
        const id = Cookies.get('customerId');
        const name = Cookies.get('customerName');
        if (id === undefined && name === undefined) {
          navigate('/login');
          enqueueSnackbar('Vui lòng đăng nhập', { variant: 'error' });
        }
        else{
            axios.get(`https://dhkptsocial.onrender.com/users/${Cookies.get('customerId')}`)
            .then((response) => {
                setUsername(response.data.name);
                setAvatar(response.data.avatar)
            })
        }
      }, [navigate, enqueueSnackbar]);
  return (
    <div className='w-screen h-14 bg-white flex p-2 shadow-lg'>
        <div className='w-1/2 flex'>
            <div className='h-full w-[150px] flex justify-center items-center rounded-md'>
                <div className='flex w-full h-full'>
                    <div className='w-1/3 h-full'>
                        <img src={logo} className='object-contain w-full h-full'/>
                    </div>
                    <div className='w-2/3 h-full flex justify-center items-center'>
                        <p className='font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600'>DHKShop</p>
                    </div>
                </div>
            </div>
            <div className='h-full flex justify-center items-center ml-2'>
                <p className='font-semibold'>
                    Đăng ký trở thành Người bán 
                </p>
            </div>
        </div>
        <div className='w-1/2 flex flex-row-reverse gap-2'>
            <div className='h-full w-auto flex justify-center items-center'>
                <FaAngleDown className='text-2xl '/>
            </div>
            <div className='h-full w-auto flex justify-center items-center'>
                <p>{username}</p>
            </div>
            <div className='h-full w-auto flex justify-center items-center'>
                <div className='h-[45px] w-[45px] bg-gray-500 rounded-full border-2 border-gray-200 shadow-md'>
                    <img src={`https://dhkptsocial.onrender.com/files/download/${avatar}`} className='object-cover h-full w-full rounded-full'/>
                </div>
            </div>
        </div>
    </div>
  )
}

export default SellerRegistNav