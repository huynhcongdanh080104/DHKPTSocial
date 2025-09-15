import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router-dom';
import Cookie from 'js-cookie'
import logo from '../../assets/logo.png'
import { useSnackbar } from 'notistack';
import Cookies from 'js-cookie';
import { GoTriangleDown } from 'react-icons/go';
import LeafletMap from '../components/LeafletMap';
const InforPayment = () => {
    const location = useLocation();
    const cart = useState(location.state?.items);
    const cartId = useState(location.state?.cartId);
    const [paymentMethod, setPaymentMethod] = useState("COD"); 
    const [totalPrice, setTotalPrice] = useState(0);
    const [shippingPrice, setShippingPrice] = useState(0);
    const [note, setNote] = useState("");
    const [address, setAddress] = useState("");
    const [user, setUser] = useState('');
    const [phone, setPhone] = useState("");
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const [isOpenModal, setisOpenModal] = useState(false);
    
    const [isShowProvince, setIsShowProvince] = useState(false);
    const [isShowDistrict, setIsShowDistrict] = useState(false);
    const [isShowWard, setIsShowWard] = useState(false);

    const [ward, setWard] = useState("");
    const [district, setDistrict] = useState("");
    const [province, setProvince] = useState(""); 

    const [listProvince, setListProvince] = useState([]);
    const [listDistrict, setListDistrict] = useState([]);
    const [listWard, setListWard] = useState([]);

    const [provinceCode, setProvinceCode] = useState(0);
    const [districtCode, setDistrictCode] = useState(0);

    const [acceptAddress, setAcceptAddress] = useState("");

    const saveAddress = () => {
        if(province === ""){
            enqueueSnackbar('Chưa chọn tỉnh thành', {variant: 'warning'});
        }
        else if(district === ""){
            enqueueSnackbar('Chưa chọn quận huyện', {variant: 'warning'});
        }
        else if(ward === ""){
            enqueueSnackbar('Chưa chọn phường xã', {variant: 'warning'});
        }
        else if(acceptAddress === ""){
            enqueueSnackbar('Chưa nhập địa chỉ chi tiết', {variant: 'warning'});
        }
        else{
            const user = {
                address: acceptAddress+", "+ward+", "+district+", "+province
            }
            axios.put(`https://dhkptsocial.onrender.com/users/edit/${Cookie.get('customerId')}`, user)
            .then((response) => {
                setAddress(acceptAddress+", "+ward+", "+district+", "+province);
                enqueueSnackbar('Lưu địa chỉ thành công', {variant: 'success'});
                setisOpenModal(false)
                setDistrict(""),
                setWard("");
                setProvince("");
                setDistrictCode(0);
                setProvinceCode(0);
                setAcceptAddress("");
            })
        }
    }
    useEffect(() => {
        axios.get(`https://dhkptsocial.onrender.com/users/${Cookie.get('customerId')}`)
        .then((response) => {
            setUser(response.data);
            setAddress(response.data.address);
            setPhone(response.data.phone);
        })
        setTotalPrice(Array.isArray(cart[0].items) && cart[0].items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0));
        setShippingPrice([...new Map(cart[0].items.map(item => [item.store, item])).values()].length * 10000);
        axios.get(`https://provinces.open-api.vn/api/p/`)
        .then((response) => {
            setListProvince(response.data);
        })
        axios.get(`https://provinces.open-api.vn/api/d/`)
        .then((response) => {
            setListDistrict(response.data);
        })
        axios.get(`https://provinces.open-api.vn/api/w/`)
        .then((response) => {
            setListWard(response.data);
        })
    }, [address])
    useEffect(() => {
        console.log(cartId[0]);
        console.log(cart[0]);
    },[])
    const handlePayment = async () => {
        const phoneRegex = /^(?:\+84|0)(3[2-9]|5[2689]|7[06-9]|8[1-9]|9[0-9])\d{7}$/;
        if(address === ""){
            enqueueSnackbar('Vui lòng thêm địa chỉ', {variant: 'warning'});
            return;
        }
        if(phone === ""){
            enqueueSnackbar('Vui lòng thêm số điện thoại', {variant: 'warning'});
            return;
        }
        if(!phoneRegex.test(phone)){
            enqueueSnackbar('Số điện thoại không hợp lệ', {variant: 'warning'});
            return;
        }
        if(!user.phone){
            const user = {
                phone: phone
            }
            axios.put(`https://dhkptsocial.onrender.com/users/edit/${Cookies.get('customerId')}`, user)
            .then((response) => {
            });
        }

        if (!cart.length) return; // Kiểm tra nếu giỏ hàng rỗng

        // Nhóm sản phẩm theo cửa hàng
        const storeOrders = cart[0].items.reduce((acc, item) => {
            if (!acc[item.store]) acc[item.store] = [];
            acc[item.store].push(item);
            return acc;
        }, {});

        // Danh sách promises để tạo đơn hàng
        const orderPromises = Object.keys(storeOrders).map(async (storeId) => {
            const items = storeOrders[storeId];
            const order = {
                customer: cart[0].userId,
                totalPrice: items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0) + 10000,
                description: paymentMethod === "COD" ? "Đơn hàng thanh toán khi nhận hàng" : "Đơn hàng thanh toán VNPay",
                note: note,
                address: address,
                status: "pending",
                paymentMethod: paymentMethod,
                paymentStatus: "pending",
                items: items
            };

            return axios.post("https://dhkshop.onrender.com/order", order);
        });

        try {
            const responses = await Promise.all(orderPromises);

            // Xóa sản phẩm khỏi giỏ hàng sau khi đặt hàng thành công
            for (let item of cart[0].items) {
                await removeProduct(item._id);
            }

            if (paymentMethod === "COD") {
                enqueueSnackbar("Đặt hàng thành công", { variant: "success" });
                navigate("/e-commerce/customer/home");
            } else if (paymentMethod === "VNPay") {
                navigate("/e-commerce/customer/payment", { state: { items: responses.map(res => res.data) } });
            }
        } catch (error) {
            enqueueSnackbar("Đặt hàng thất bại, vui lòng thử lại!", { variant: "error" });
        }
    }
    const removeProduct = async (itemId) => {
        try {
            
            if (!cartId[0]) return;

            await axios.delete("https://dhkshop.onrender.com/cart/remove", {
                data: { cartId: cartId[0], itemId },
            });
            window.dispatchEvent(new Event("deleteCart"));
        } catch (error) {
            console.error("Lỗi khi xoá sản phẩm:", error);
        }
    };
  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 min-h-screen transition-all duration-300">
        {/* Modal địa chỉ */}
        <div className={`fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50  ${isOpenModal?"":"opacity-0 pointer-events-none"}`}>
            <div className={`relative w-1/2 p-4 bg-white rounded-lg shadow-lg transform transition-all duration-300 ease-in-out ${isOpenModal?"translate-y-0":" translate-y-10 pointer-events-none"}`}>
                {/* Tiêu đề */}
                <h2 className="text-xl font-semibold text-gray-800 pb-4 ">Sửa địa chỉ</h2>
                <hr className='w-full border-black'/>
                {/* Nội dung */}
                <div className='w-full h-auto  px-4'>
                    <p className='my-2 ml-2 font-semibold'>Tỉnh / Thành phố</p>
                    <div className='flex w-full border-2 rounded-md border-gray-300 py-2 px-4 items-center hover:cursor-pointer'
                    onClick={() => {setIsShowProvince(!isShowProvince); setIsShowDistrict(false); setIsShowWard(false)}}>
                        <p className={` w-1/2 ${province === "" ?"text-gray-400":"text-black"}`}>{province === "" ? "Chọn tỉnh / thành phố": province}</p>
                        <div className={`w-1/2 flex justify-end`}>
                            <GoTriangleDown className={`text-2xl transition-all duration-500 ease-in-out ${isShowProvince? "rotate-180": ""}`}/>
                        </div>  
                    </div>
                    <div className={`relative w-full transform transition-all duration-300 ease-in-out ${isShowProvince? "translate-y-0 opacity-100" : "translate-y-6 opacity-0 pointer-events-none" }`}>
                        <div className='border-2 border-black absolute w-full bg-white h-[150px] overflow-y-auto mt-2 rounded-md'>
                            {listProvince.map((province, index) => (
                                <div className='p-2 border-b-2 border-black transition-all duration-300 ease-in-out hover:pl-4 hover:font-semibold hover:cursor-pointer'
                                key={index}
                                onClick={() =>{
                                setIsShowProvince(!isShowProvince); 
                                setProvince(province.name);
                                setProvinceCode(province.code);
                                setDistrict("");
                                setWard("")}}>
                                    <div className='w-full justify-center items-center'>
                                        <p>{province.name}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <p className='my-2 ml-2 font-semibold'>Quận / Huyện</p>
                    <div className='flex w-full border-2 rounded-md border-gray-300 py-2 px-4 items-center hover:cursor-pointer'
                    onClick={() => {setIsShowDistrict(!isShowDistrict); setIsShowProvince(false); setIsShowWard(false)}}>
                        <p className={` w-1/2 ${district === "" ?"text-gray-400":"text-black"}`}>{district === "" ? "Chọn quận / huyện": district}</p>
                        <div className='w-1/2 flex justify-end'>
                            <GoTriangleDown className={`text-2xl transition-all duration-500 ease-in-out ${isShowDistrict? "rotate-180": ""}`}/>
                        </div>
                    </div>
                    <div className={`relative w-full transform transition-all duration-300 ease-in-out ${isShowDistrict? "translate-y-0 opacity-100" : "translate-y-6 opacity-0 pointer-events-none" }`}>
                        <div className='border-2 border-black absolute w-full bg-white h-[150px] overflow-y-auto mt-2 rounded-md'>
                        {provinceCode === 0 ? (
                            <div className='p-2 hover:cursor-pointer text-red-500'>Vui lòng chọn tỉnh / thành phố</div>
                        ):(
                            listDistrict.filter(district => district.province_code === provinceCode).map((district, index) => (
                                <div className='p-2 border-b-2 border-black transition-all duration-300 ease-in-out hover:pl-4 hover:font-semibold hover:cursor-pointer'
                                key={index}
                                onClick={() =>{
                                setIsShowDistrict(!isShowDistrict); 
                                setDistrict(district.name);
                                setDistrictCode(district.code);
                                setWard("")}}>
                                    <div className='w-full justify-center items-center'>
                                        <p>{district.name}</p>
                                    </div>
                                </div>
                            ))
                        )}
                        </div>
                    </div>

                    <p className='my-2 ml-2 font-semibold'>Phường / Xã</p>
                    <div className='flex w-full border-2 rounded-md border-gray-300 py-2 px-4 items-center hover:cursor-pointer'
                    onClick={() => {setIsShowDistrict(false); setIsShowProvince(false); setIsShowWard(!isShowWard)}}>
                        <p className={` w-1/2 ${ward === "" ?"text-gray-400":"text-black"}`}>{ward === "" ? "Chọn phường / xã": ward}</p>
                        <div className='w-1/2 flex justify-end'>
                            <GoTriangleDown className={`text-2xl transition-all duration-500 ease-in-out ${isShowWard? "rotate-180": ""}`}/>
                        </div>
                    </div>
                    <div className={`relative w-full transform transition-all duration-300 ease-in-out ${isShowWard? "translate-y-0 opacity-100" : "translate-y-6 opacity-0 pointer-events-none" }`}>
                        <div className='border-2 border-black absolute w-full bg-white h-[150px] overflow-y-auto mt-2 rounded-md'>
                        {districtCode === 0 ? (
                            <div className='p-2 hover:cursor-pointer text-red-500'>Vui lòng chọn quận / huyện</div>
                        ):(
                            listWard.filter(ward => ward.district_code === districtCode).map((ward, index) => (
                                <div className='p-2 border-b-2 border-black transition-all duration-300 ease-in-out hover:pl-4 hover:font-semibold hover:cursor-pointer'
                                key={index}
                                onClick={() =>{
                                setIsShowWard(!isShowWard); 
                                setWard(ward.name);}}>
                                    <div className='w-full justify-center items-center'>
                                        <p>{ward.name}</p>
                                    </div>
                                </div>
                            ))
                        )}
                        </div>
                    </div>

                    <p className='my-2 ml-2 font-semibold'>Địa chỉ chi tiết</p>
                    <textarea 
                    value={acceptAddress}
                    className='w-full h-[80px] p-2 border-2 rounded-md border-gray-300' style={{resize:'none'}}
                    placeholder='Ví dụ: số nhà, tên đường, khu phố,...' onChange={(e) =>  setAcceptAddress(e.target.value)}
                    maxLength={110}>
                    </textarea>
                </div>
                

                {/* Nút hành động */}
                <div className="mt-4 flex justify-end gap-x-4">
                <button
                    onClick={saveAddress}
                    className="px-4 py-2 text-black bg-white border-gray-400 border-2 rounded-md font-semibold transform transition duration-200 hover:scale-110">
                    Lưu
                </button>
                <button
                    onClick={() => setisOpenModal(false)}
                    className="px-4 py-2 text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg transform transition duration-200 hover:scale-110">
                    Đóng
                </button>
                </div>
            </div>
        </div>
        {/* Header với hiệu ứng */}
        <div className="w-full h-[80px] bg-white shadow-lg flex justify-center sticky top-0 z-10 transition-all duration-300 hover:shadow-xl">
            <div className="w-full md:w-3/4 h-full flex items-center gap-4 px-4">
                <div className="flex items-center gap-2 h-full group">
                    <img src={logo} className="object-contain h-2/3 transition-transform duration-300 group-hover:scale-110" alt="DHKShop Logo"/>
                    <p className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 text-2xl transition-all duration-300 group-hover:text-3xl">DHKShop</p>
                </div>
                <div className="h-1/2 w-[2px] bg-gradient-to-b from-purple-600 to-pink-600 animate-pulse"></div>
                <p className="text-xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 hover:text-2xl">Thanh toán</p>
            </div>
        </div>

        {/* Main Content */}
        <div className="w-full flex justify-center pt-6 pb-10">
            <div className="w-full md:w-3/4 px-4 space-y-6">
                {/* Địa chỉ với hiệu ứng */}
                <div className="w-full p-6 rounded-lg bg-white shadow-md transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 relative">
                        Thông tin khách hàng
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 group-hover:w-full"></span>
                    </h2>
                    <p>Số điện thoại</p>
                    {user.phone ? (
                        <p className='p-2 rounded-md w-1/6 mt-2 shadow-lg border-2 border-gray-100'>{user.phone}</p>
                    ):(
                        <input type="tel" maxLength={10} name="cusPhone" id="cusPhone" className='p-2 border-2 mt-2 border-gray-200 rounded-md transition duration-400 
                        hover:outline-none focus:outline-none focus:border-purple-400' placeholder='Nhập số điện thoại' onChange={(e) => setPhone(e.target.value)}/>
                    )}
                    <p className='mt-2'>Địa chỉ nhận hàng</p>
                    {user.address ? (
                        <div className="flex flex-col md:flex-row md:items-center justify-between mt-2">
                            <p className="text-gray-700 mb-4 md:mb-0 md:w-2/3 p-2 shadow-lg border-2 border-gray-100 h-auto">{user.address}</p>
                            <button onClick={() => setisOpenModal(true)} 
                            className="px-4 py-2 border-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-md transition-all duration-300 hover:opacity-90 hover:shadow-lg transform hover:-translate-y-1 focus:ring-2 focus:ring-purple-300 focus:outline-none">
                                Thay đổi địa chỉ
                            </button>
                        </div>
                    ) : (
                        <button onClick={() => setisOpenModal(true)} 
                        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-md transition-all duration-300 hover:opacity-90 hover:shadow-lg transform hover:-translate-y-1 focus:ring-2 focus:ring-purple-300 focus:outline-none">
                            Thêm địa chỉ
                        </button>
                    )}
                </div>

                {/* Sản phẩm với hiệu ứng */}
                <div className="w-full p-6 rounded-lg bg-white shadow-md transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1">
                    <div className="grid grid-cols-12 gap-2 pb-3 border-b-2 border-gray-100">
                        <p className="col-span-5 font-medium text-gray-800">Sản phẩm</p>
                        <p className="col-span-2 text-end font-medium text-gray-800">Phân loại</p>
                        <p className="col-span-2 text-end font-medium text-gray-800">Đơn giá</p>
                        <p className="col-span-1 text-end font-medium text-gray-800">SL</p>
                        <p className="col-span-2 text-end font-medium text-gray-800">Thành tiền</p>
                    </div>

                    {cart[0].items.map((item, index) => (
                        <div key={index} className="grid grid-cols-12 gap-2 py-4 border-b border-gray-100 transition-all duration-200 hover:bg-purple-50">
                            <p className="col-span-5 text-gray-700">{item.name}</p>
                            <div className="col-span-2 flex justify-end">
                                {item.attributes.map((attribute, subIndex) => (
                                    <span key={subIndex} className="text-gray-500 text-sm">
                                        {subIndex === 0 ? "" : ", "}
                                        {attribute.values.attributeName}
                                    </span>
                                ))}
                            </div>
                            <p className="col-span-2 text-end text-gray-700">{item.unitPrice.toLocaleString()} đ</p>
                            <p className="col-span-1 text-end text-gray-700">{item.quantity}</p>
                            <p className="col-span-2 text-end font-medium text-gray-800">{(item.quantity * item.unitPrice).toLocaleString()} đ</p>
                        </div>
                    ))}

                    <div className="w-full flex flex-col md:flex-row md:items-center justify-between py-4 border-b border-gray-100">
                        <div className="w-full md:w-1/2 mb-4 md:mb-0">
                            <p className="text-gray-700 mb-2">Lời nhắn:</p>
                            <input 
                                type="text" 
                                name="note" 
                                id="note" 
                                placeholder="Lưu ý cho người bán..." 
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300"
                            />
                        </div>
                        <div className="w-full md:w-1/2 text-end">
                            <p className="text-gray-700">Phí vận chuyển: <span className="font-medium">{shippingPrice.toLocaleString()} đ</span></p>
                        </div>
                    </div>

                    <div className="w-full flex justify-end items-center pt-4">
                        <div className="flex items-center gap-2">
                            <p className="text-gray-700">
                                Tổng số tiền ({Array.isArray(cart[0].items) && cart[0].items.reduce((sum, item) => sum + item.quantity, 0)} sản phẩm):
                            </p>
                            <p className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 hover:text-xl"> 
                                {totalPrice.toLocaleString()} đ
                            </p>
                        </div>
                    </div>
                </div>

                {/* Phương thức thanh toán với hiệu ứng */}
                <div className="w-full p-6 rounded-lg bg-white shadow-md transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 relative inline-block group">
                        Phương thức thanh toán
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 group-hover:w-full"></span>
                    </h2>
                    
                    <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex flex-col md:flex-row gap-3 w-full">
                            <button 
                                className={`p-3 rounded-md flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-300
                                    ${paymentMethod !== "COD" 
                                        ? "border-2 border-gray-200 text-gray-700 hover:border-purple-300" 
                                        : "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md"}`}
                                onClick={() => setPaymentMethod("COD")}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                                </svg>
                                Thanh toán khi nhận hàng
                            </button>
                            <button 
                                className={`p-3 rounded-md flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-300
                                    ${paymentMethod === "COD" 
                                        ? "border-2 border-gray-200 text-gray-700 hover:border-purple-300" 
                                        : "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md"}`}
                                onClick={() => setPaymentMethod("VNPay")}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                </svg>
                                Ví VNPay
                            </button>
                        </div>
                    </div>
                    
                    <div className="w-full flex flex-col mt-6 pt-4 border-t-2 border-gray-100">
                        <div className="w-full flex flex-col items-end gap-2">
                            <p className="text-gray-700 transition-all duration-200 hover:font-medium">Tổng tiền hàng: <span className="font-medium">{totalPrice.toLocaleString()} đ</span></p>
                            <p className="text-gray-700 transition-all duration-200 hover:font-medium">Tổng phí vận chuyển: <span className="font-medium">{shippingPrice.toLocaleString()} đ</span></p>
                            <p className="text-xl mt-2 group">Tổng thanh toán: 
                                <span className="ml-2 font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 group-hover:text-2xl">
                                    {(totalPrice + shippingPrice).toLocaleString()} đ
                                </span>
                            </p>
                        </div>
                    </div>
                    
                    <div className="w-full flex items-center justify-end py-4 mt-4 border-t-2 border-gray-100">
                        <button 
                        onClick={handlePayment}
                        className="relative px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-md font-medium shadow-md transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-purple-300 overflow-hidden group">
                            <span className="absolute w-0 h-0 transition-all duration-300 rounded-full bg-white opacity-10 group-hover:w-full group-hover:h-full group-hover:top-0 group-hover:left-0"></span>
                            Đặt hàng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default InforPayment