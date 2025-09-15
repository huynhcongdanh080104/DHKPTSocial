import React, { useEffect, useRef, useState } from 'react'
import SellerRegistNav from '../components/SellerRegistNav';
import LeafletMap from "../components/LeafletMap";
import { IoIosAdd } from "react-icons/io";
import axios from 'axios';
import { useSnackbar } from 'notistack';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { GoTriangleDown } from "react-icons/go";
import { FaUser } from 'react-icons/fa';

const RegistSeller = () => {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const [loadingInfor, setLoadingInfor] = useState(false);
    const [loadingTax, setLoadingTax] = useState(false);

    const [isOpenModal, setisOpenModal] = useState(false);

    const [isShowProvince, setIsShowProvince] = useState(false);
    const [isShowDistrict, setIsShowDistrict] = useState(false);
    const [isShowWard, setIsShowWard] = useState(false);

    const [hiddenWelcome, sethiddenWelcome] = useState(false);
    const [isCompleteInfor, setisCompleteInfor] = useState(false);
    const [isCompleteTax, setisCompleteTax] = useState(false);

    const [address, setAddress] = useState("");
    const [acceptAddress, setacceptAddress] = useState("");
    const [sellerName, setsellerName] = useState("");
    const [phoneNumber, setphoneNumber] = useState("");
    const [ward, setWard] = useState("");
    const [district, setDistrict] = useState("");
    const [province, setProvince] = useState("");
    const [shopName, setshopName] = useState("");
    const [email, setEmail] = useState("");
    const [taxCode, setTaxCode] = useState("");
    const [file, setFile] = useState({});
    const [logo, setLogo] = useState("");
    const [mediaLogo, setMedia] = useState([]);
    const [store, setStore] = useState("");

    const [wardTax, setWardTax] = useState("");
    const [districtTax, setDistrictTax] = useState("");
    const [provinceTax, setProvinceTax] = useState("");
    const [addressTax, setAddressTax] = useState("");

    const [otp, setOTP] = useState("");
    const [requestId, setRequestId] = useState("")
    const [isAuthenticPhone, setIsAuthenticPhone] = useState(false);

    const [user, setUser] = useState("");

    const [listProvince, setListProvince] = useState([]);
    const [listDistrict, setListDistrict] = useState([]);
    const [listWard, setListWard] = useState([]);

    const [provinceCode, setProvinceCode] = useState(0);
    const [districtCode, setDistrictCode] = useState(0);

    const [latitude, setLatitude] = useState(0);
    const [longtitude, setLongtitude] = useState(0);

    const [businessType, setBusinessType] = useState("Cá nhân");
    const imgRef = useRef(null);
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        const file = e.target.files[0];
    
        const readFileAsDataURL = (file) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = () => reject(new Error('File reading has failed'));
                reader.readAsDataURL(file);
            });
        };
    
        const loadMedia = async () => {
            const mediaPromises = [];
    
            if(file){
            const mediaType = file.type.startsWith('image/') ? 'image' : 'video';
                mediaPromises.push(
                    readFileAsDataURL(e.target.files[0]).then((dataURL) => ({
                        type: mediaType,
                        url: dataURL,
                    }))
                );
            }
    
            const media = await Promise.all(mediaPromises); // Đợi tất cả media (ảnh/video) được đọc xong
            setMedia(media); // Lưu media vào state
        };
    
        loadMedia();
      };
    const handleRegist = () => {
        sethiddenWelcome(true);
    }
    function generateRandomSixDigit() {
        return Math.floor(100000 + Math.random() * 900000);
    }
    const sendOTP = async () => {
        try {
            const phoneRegex = /^(?:\+84|0)(3[2-9]|5[2689]|7[06-9]|8[1-9]|9[0-9])\d{7}$/;
            if(phoneNumber === ""){
                enqueueSnackbar('Chưa nhập số điện thoại', {variant: 'warning'});
            }
            else if(!phoneRegex.test(phoneNumber)){
                enqueueSnackbar('Số điện thoại không hợp lệ', {variant: 'warning'});
            }
            else{
                const response = await axios.post("https://dhkshop.onrender.com/send-sms/send-otp", { phone: phoneNumber });
                setRequestId(response.data.requestId);
                console.log("Mã OTP đã được gửi! " + response.data.requestId);
            }
            
        } catch (error) {
            console.log(error);
        }
      };
    
      // Xác minh OTP
      const verifyOTP = async () => {
        try {
            const response = await axios.post("https://dhkshop.onrender.com/send-sms/verify-otp", {
                requestId,
                code: otp
            });
            console.log(response.data.message);
        } catch (error) {
            console.log(error.response?.data?.error || "Xác minh OTP thất bại!");
        }
      };

      const sendSMS = async () => {
        try {
            const response = await axios.post("https://dhkshop.onrender.com/send-sms/send-sms", { phone: phoneNumber, code: generateRandomSixDigit() });
            console.log(response);
        } catch (error) {
            console.log(error.response.data);
        }
      };
    const checkInforShop = async () => {
        try{
            setLoadingInfor(true);
            if(shopName.trim() === ""){
                enqueueSnackbar('Vui lòng nhập tên cửa hàng', {variant: 'warning'});
                setLoadingInfor(false);
                return;
            }
            else if(acceptAddress.trim() === ""){
                enqueueSnackbar('Vui lòng nhập địa chỉ cửa hàng', {variant: 'warning'});
                setLoadingInfor(false);
                return;
            }
            else if(phoneNumber.trim() === ""){
                enqueueSnackbar('Vui lòng nhập số điện thoại', {variant: 'warning'});
                setLoadingInfor(false);
                return;
            }
            else {
                const phoneRegex = /^(?:\+84|0)(3[2-9]|5[2689]|7[06-9]|8[1-9]|9[0-9])\d{7}$/;
                axios.get(`https://dhkshop.onrender.com/store/${shopName}`)
                .then((response) => {
                    enqueueSnackbar('Trùng tên shop', {variant: 'warning'});
                    setLoadingInfor(false);
                })
                .catch((error) => {
                    if(!phoneRegex.test(phoneNumber)){
                        enqueueSnackbar('Số điện thoại không hợp lệ', {variant: 'warning'});
                        setLoadingInfor(false);
                    }
                    else{
                        setisCompleteInfor(true);
                        setLoadingInfor(false);
                    }
                })
            }
        } catch (error){
            console.log(error);
        }
    }
    const checkTaxInfor = () => {
        setLoadingTax(true);
        const taxCodeRegex = /^\d{10}(\d{3})?$/;
        if(provinceTax === "" || wardTax === "" || districtTax === "" || addressTax === ""){
            enqueueSnackbar('Vui lòng nhập đầy đủ thông tin địa chỉ', {variant: 'warning'});
            setLoadingTax(false);
            return;
        }
        else if(taxCode === "" || !taxCodeRegex.test(taxCode)){
            enqueueSnackbar('Mã số thuế sai định dạng', {variant: 'warning'});
            setLoadingTax(false);
            return;
        }
        else{
            axios.get(`https://api.vietqr.io/v2/business/${taxCode}`)
            .then((response) => {
                if(response.data.code === "00"){
                    const addressTaxFull = addressTax+", "+wardTax+", "+districtTax+", "+provinceTax;
                    if(!response.data.data.address.includes(addressTaxFull)){
                        enqueueSnackbar('Dữ liệu địa chỉ không khớp', {variant: 'warning'});
                        setLoadingTax(false);
                        return;
                    }
                    else{
                        axios.get(`https://dhkshop.onrender.com/store/taxCode/${taxCode}`)
                        .then((response) => {
                            enqueueSnackbar('Mã số thuế đã được sử dụng', {variant: 'warning'});
                            setLoadingTax(false);
                            return;
                        })
                        .catch((error) => {
                            const formData = new FormData();
                            formData.append('avatar', file);
                            axios.post('https://dhkshop.onrender.com/files/upload/avatar', formData, {
                                headers: {
                                    'Content-Type': 'multipart/form-data',
                                },
                                })
                              .then((response) => {
                                console.log('Last file uploaded successfully:', response.data.file);
                                console.log(response.data.file._id);
                                    const store = {
                                        name: shopName,
                                        address: acceptAddress,
                                        logo: response.data.file._id,
                                        taxCode: taxCode,
                                        manager: [Cookies.get("customerId")],
                                    }
                                    axios.post('https://dhkshop.onrender.com/store', store)
                                    .then((response) => {
                                        setStore(response.data);
                                        axios.post(`https://dhkshop.onrender.com/layout/newStore/${response.data._id}`)
                                        .then((response) => {
                                            setLoadingTax(false);
                                            setisCompleteTax(true);
                                            enqueueSnackbar('Đăng ký cửa hàng mới thành công', {variant: 'success'});
                                        })
                                        
                                    })
                                })
                                .catch((error) => {
                                    const store = {
                                        name: shopName,
                                        address: acceptAddress,
                                        taxCode: taxCode,
                                        manager: [Cookies.get("customerId")],
                                    }
                                    axios.post('https://dhkshop.onrender.com/store', store)
                                    .then((response) => {
                                        setStore(response.data);
                                        axios.post(`https://dhkshop.onrender.com/layout/newStore/${response.data._id}`)
                                        .then((response) => {
                                            setLoadingTax(false);
                                            setisCompleteTax(true);
                                            enqueueSnackbar('Đăng ký cửa hàng mới thành công', {variant: 'success'});
                                        })
                                    })
                                })
                            
                        })
                    }
                }
                else if(response.data.code === "51"){
                    enqueueSnackbar('Mã số thuế không tồn tại', {variant: 'warning'});
                    setLoadingTax(false);
                    return;
                }
            })
        }
    }
    const handleSuccess = () => {
        navigate('/e-commerce/login');
        Cookies.remove('store');
        Cookies.remove('customerId');
        Cookies.remove('customerName');
    }
    const translateToEnglish = async (text) => {
        const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=vi|en`);
        return (await response.json()).responseData.translatedText;
    };
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
        else if(address === ""){
            enqueueSnackbar('Chưa nhập địa chỉ chi tiết', {variant: 'warning'});
        }
        else{
            setacceptAddress(address+", "+ward+", "+district+", "+province);
            enqueueSnackbar('Lưu địa chỉ thành công', {variant: 'success'});
            setisOpenModal(false)
        }
    }
    useEffect(() => {
        const id = Cookies.get('customerId');
        const name = Cookies.get('customerName');
        if (id === undefined && name === undefined) {
            navigate('/login');
        }
        else{
            axios.get(`https://dhkptsocial.onrender.com/users/${Cookies.get('customerId')}`)
            .then((response) => {
                setUser(response.data);
                setEmail(response.data.email);
            })
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
        }
      }, [navigate, enqueueSnackbar]);
  return (
    <div className='w-full h-full bg-gray-50'>
        <SellerRegistNav/>
        {/* Welcome Box */}
        <div className={`w-screen p-8 h-auto ${hiddenWelcome ? "hidden":"flex"} justify-center items-center `}>
            <div className='w-2/3 h-[500px] bg-white shadow-lg rounded-2xl flex justify-center items-center py-2'>
                <div className='w-1/2 h-full flex justify-center items-center'>
                    <div>
                        <div className='w-full flex justify-center items-center mb-4'>
                            <div className='h-[150px] w-[150px] bg-gray-500 rounded-full'>

                            </div>
                        </div>
                        <p className='w-full text-center text-md font-semibold mb-2'>Chào mừng đến với DHKShop!</p>
                        <div className='w-full flex justify-center mb-4'>
                            <p className='w-2/3 text-center text-sm'>
                                Vui lòng cung cấp thông tin để thành lập tài khoản người bán trên DHKShop
                            </p>
                        </div>
                        <div className='w-full flex justify-center'>
                            <button className='bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-2 px-4 rounded-md text-sm hover:opacity-75'
                            onClick={handleRegist}>
                                Bắt đầu đăng ký
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {/* Regist Box */}
        <div className={`w-screen p-8 h-auto ${hiddenWelcome ? "flex":"hidden"} justify-center items-center`}>
            <div className='w-2/3 h-auto bg-white shadow-lg rounded-2xl py-2'>
                <div className='w-full h-[80px] flex justify-center items-center'>
                    <div className='flex justify-center items-center gap-x-12'>
                        <div>
                            <div className='w-full flex justify-center mb-2'>
                                <div className='h-[10px] w-[10px] bg-gradient-to-r from-purple-600 to-pink-600 rounded-full'></div>
                            </div>
                            <p className={`font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600`}>
                                Thông tin Shop
                            </p>
                        </div>
                        <div>
                            <div className='w-full flex justify-center mb-2'>
                            <div className={`h-[10px] w-[10px] ${isCompleteInfor? "bg-gradient-to-r from-purple-600 to-pink-600": "bg-gray-500"} rounded-full`}></div>
                            </div>
                            <p className={`${isCompleteInfor? "font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600": "font-bold text-gray-500"} `}>
                                Thông tin thuế
                            </p>
                        </div>
                        <div>
                            <div className='w-full flex justify-center mb-2'>
                                <div className={`h-[10px] w-[10px] ${isCompleteTax? "bg-gradient-to-r from-purple-600 to-pink-600": "bg-gray-500"} rounded-full`}></div>
                            </div>
                            <p className={`${isCompleteTax? "font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600": "font-bold text-gray-500"} `}>
                                Hoàn tất
                            </p>
                        </div>
                    </div>
                </div>
                <hr className='w-full border-gray-200'/>
                {/* Thông tin shop */}
                {isCompleteInfor ? (<div className='hidden'/>):(
                    <div>
                        <div className='w-full h-auto flex justify-center items-center py-4'>
                            <div className='w-full h-full flex items-center p-4'>
                                <div className='w-1/2 flex flex-col justify-center items-center'>
                                    <div className='rounded-full h-[200px] w-[200px] bg-white p-2 shadow-md'>
                                        {mediaLogo.length === 0 ? (
                                            <div className='w-full h-full rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex justify-center items-center cursor-pointer' onClick={() => imgRef.current.click()}>
                                            <FaUser className='text-[70px] text-white'/>
                                            </div>
                                        ):(
                                            <img src={mediaLogo[0].url} alt="Shop logo" className='w-full h-full object-cover rounded-full cursor-pointer' onClick={() => imgRef.current.click()}/>
                                        )}
                                        
                                    </div>
                                    <p className='mt-4 font-semibold'>Thêm logo cho shop</p>
                                    <input type="file" name="logo" id="logo" ref={imgRef} accept="image/*" className='hidden' onChange={handleFileChange}/>
                                </div>
                                <div className='w-1/2'>
                                    <div className='w-full mb-2'>
                                        <p className='w-full font-semibold mb-2 ml-2'>Tên cửa hàng:</p>
                                        <div className='w-full flex items-center gap-2 border-2 border-gray-300 p-2 rounded-md'>
                                            <input type="text" 
                                            maxLength={30}
                                            className='rounded-md w-3/4 focus:outline-none' 
                                            placeholder='Nhập tên cửa hàng'
                                            value={shopName}
                                            onChange={(e) => setshopName(e.target.value)}/>
                                            <p className='w-1/4 text-right text-gray-400'>{shopName.length}/30</p>
                                        </div>
                                    </div>
                                    <div className='w-full gap-2 mt-2'>
                                        <p className='w-full font-semibold mb-2 ml-2'>Địa chỉ cửa hàng:</p>
                                        <button className='w-full flex items-center gap-2 rounded-md hover:bg-gray-200 hover:opacity-50'>
                                            <div className='w-full p-2 h-auto border-2 border-gray-300 rounded-md hover:text-gray-600'
                                            onClick={() => setisOpenModal(true)}>
                                                {acceptAddress === ""?(
                                                    <div className='flex w-full items-center gap-2'>
                                                        <IoIosAdd className='text-2xl'/>
                                                        <p>Thêm địa chỉ</p>
                                                    </div>
                                                ):(
                                                    <div className='w-full h-auto '>
                                                        <p className='w-full text-start'>{acceptAddress}</p>
                                                    </div>
                                                )}
                                                
                                            </div>
                                        </button>
                                    </div>
                                    <div className='w-full mt-2'>
                                        <p className='w-full font-semibold ml-2 mb-2'>Email:</p>
                                        <div className='w-full flex items-center gap-2 border-2 border-gray-300 p-2 rounded-md bg-gray-200'>
                                            <input type="text" 
                                            maxLength={50}
                                            className='rounded-md w-full focus:outline-none text-gray-500' 
                                            placeholder='Nhập email'
                                            value={email}
                                            disabled={true}
                                            onChange={(e) => setEmail(e.target.value)}/>
                                        </div>
                                    </div>
                                    <div className='w-full gap-2 mt-2'>
                                        <p className='w-full font-semibold mb-2 ml-2'>Số điện thoại:</p>
                                        <div className='w-full flex items-center gap-2 border-2 border-gray-300 p-2 rounded-md'>
                                            <input type="tel" 
                                                maxLength={10}
                                                className='rounded-md w-full focus:outline-none text-gray-500' 
                                                placeholder='Nhập số điện thoại'
                                                value={phoneNumber}
                                                onChange={(e) => setphoneNumber(e.target.value)}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr className='w-full border-gray-200'/>
                        <div className='w-full h-[80px] flex flex-row-reverse gap-2 px-4 items-center'>
                            <button disabled={loadingInfor} className='border-2 px-4 py-2 rounded-md bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold focus:outline-none hover:opacity-80' onClick={checkInforShop}>Tiếp theo</button>
                        </div>
                    </div>
                )}
                {/* Thông tin thuế*/}
                {isCompleteInfor && !isCompleteTax ? (
                    <div>
                        <div className={`w-full h-auto flex flex-col justify-center items-center py-4`}>
                            <div className='w-3/4 flex gap-4'>
                                <div className='w-1/3 text-end font-bold'>
                                    Loại hình kinh doanh: 
                                </div>
                                <div className='w-2/3 flex'>
                                    <div className='w-1/3 flex justidy-center items-center gap-2'>
                                        <div onClick={() => setBusinessType("Cá nhân")} 
                                        className={`w-6 h-6 rounded-full shadow-md transition duration-300 cursor-pointer  ${businessType === "Cá nhân" ? "border-4 border-purple-500": "border-2 border-gray-200"}`}>
                                        </div>
                                        <p>Cá nhân</p>
                                    </div>
                                    <div className='w-1/3 flex justidy-center items-center gap-2'>
                                        <div onClick={() => setBusinessType("Hộ kinh doanh")} 
                                        className={`w-6 h-6 rounded-full shadow-md transition duration-300 cursor-pointer  ${businessType === "Hộ kinh doanh" ? "border-4 border-purple-500": "border-2 border-gray-200"}`}>
                                        </div>
                                        <p>Hộ kinh doanh</p>
                                    </div>
                                    <div className='w-1/3 flex justidy-center items-center gap-2'>
                                        <div onClick={() => setBusinessType("Công ty")} 
                                        className={`w-6 h-6 rounded-full shadow-md transition duration-300 cursor-pointer  ${businessType === "Công ty" ? "border-4 border-purple-500": "border-2 border-gray-200"}`}>
                                        </div>
                                        <p>Công ty</p>
                                    </div>
                                </div>
                            </div>
                            <div className='w-3/4 flex gap-4 mt-4'>
                                <div className='w-1/3 text-end font-bold mt-2'>
                                    Địa chỉ đăng ký kinh doanh: 
                                </div>
                                <div className='w-2/3 flex flex-col gap-2'>
                                    <div className='flex w-full border-2 rounded-md border-gray-300 py-2 px-4 items-center hover:cursor-pointer'
                                    onClick={() => {setIsShowProvince(!isShowProvince); setIsShowDistrict(false); setIsShowWard(false)}}>
                                        <p className={` w-1/2 ${provinceTax === "" ?"text-gray-400":"text-black"}`}>{provinceTax === "" ? "Chọn tỉnh / thành phố": provinceTax}</p>
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
                                                setProvinceTax(province.name);
                                                setProvinceCode(province.code);
                                                setDistrictTax("");
                                                setWardTax("")}}>
                                                    <div className='w-full justify-center items-center'>
                                                        <p>{province.name}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className='flex w-full border-2 rounded-md border-gray-300 py-2 px-4 items-center hover:cursor-pointer'
                                    onClick={() => {setIsShowDistrict(!isShowDistrict); setIsShowProvince(false); setIsShowWard(false)}}>
                                        <p className={` w-1/2 ${districtTax === "" ?"text-gray-400":"text-black"}`}>{districtTax === "" ? "Chọn quận / huyện": districtTax}</p>
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
                                                setDistrictTax(district.name);
                                                setDistrictCode(district.code);
                                                setWardTax("")}}>
                                                    <div className='w-full justify-center items-center'>
                                                        <p>{district.name}</p>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                        </div>
                                    </div>

                                    <div className='flex w-full border-2 rounded-md border-gray-300 py-2 px-4 items-center hover:cursor-pointer'
                                    onClick={() => {setIsShowDistrict(false); setIsShowProvince(false); setIsShowWard(!isShowWard)}}>
                                        <p className={` w-1/2 ${wardTax === "" ?"text-gray-400":"text-black"}`}>{wardTax === "" ? "Chọn phường / xã": wardTax}</p>
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
                                                setWardTax(ward.name);}}>
                                                    <div className='w-full justify-center items-center'>
                                                        <p>{ward.name}</p>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                        </div>
                                    </div>
                                    <textarea 
                                    className='w-full h-[80px] p-2 border-2 rounded-md border-gray-300' style={{resize:'none'}}
                                    placeholder='Ví dụ: số nhà, tên đường, khu phố,...' onChange={(e) =>  setAddressTax(e.target.value)}
                                    maxLength={110}>
                                    </textarea>
                                </div>
                            </div>
                            <div className='w-3/4 flex gap-4 items-center mt-4'>
                                <div className='w-1/3 text-end font-bold'>
                                    Mã số thuế: 
                                </div>
                                <div className='w-2/3 flex '>
                                    <div className='w-full flex items-center gap-2 border-2 border-gray-300 p-2 rounded-md'>
                                        <input type="text" 
                                        maxLength={14}
                                        className='rounded-md w-3/4 focus:outline-none' 
                                        placeholder='Nhập mã số thuế'
                                        value={taxCode}
                                        onChange={(e) => setTaxCode(e.target.value)}/>
                                        <p className='w-1/4 text-right text-gray-400'>{taxCode.length}/14</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr className='w-full border-gray-200'/>
                        <div className='w-full h-[80px] flex  gap-2 px-4 items-center'>
                            <div className='flex items-center w-1/2'>
                                <button className='border-2 px-4 py-2 rounded-md hover:bg-gray-200' onClick={() => setisCompleteInfor(false)}>Quay lại</button>
                            </div>
                            <div className='flex flex-row-reverse items-center w-1/2'>
                                <button disabled={loadingTax} className='border-2 px-4 py-2 rounded-md bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold focus:outline-none hover:opacity-80' onClick={checkTaxInfor}>Tiếp theo</button>
                            </div>
                        </div>
                    </div>
                ): (<div className='hidden'/>)}
                {/* Hoàn tất*/}
                {isCompleteInfor && isCompleteTax ? (
                    <div>
                        <div className={`w-full flex flex-col justify-center items-center py-8`}>
                            <div className="w-32 h-32 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            
                            <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                                Đăng Ký Thành Công!
                            </h2>
                            
                            <div className="w-3/4 bg-gray-50 rounded-lg p-6 shadow-md">
                                <div className="flex mb-4">
                                    <div className="w-full text-center">
                                        <div className="flex justify-center mb-4">
                                            {store?.logo ? (
                                                <img 
                                                    src={`https://dhkshop.onrender.com/files/download/${store.logo}`}
                                                    alt="Shop Logo" 
                                                    className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-lg"
                                                />
                                            ) : (
                                                <div className="h-24 w-24 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                                                    <span className="text-2xl font-bold text-white">{store?.name?.charAt(0)}</span>
                                                </div>
                                            )}
                                        </div>
                                        <h3 className="text-xl font-bold mb-1">{store?.name}</h3>
                                        <p className="text-gray-500 text-sm">Ngày đăng ký: {new Date(store?.publishDate).toLocaleDateString('vi-VN')}</p>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                    <div className="border-l-4 border-purple-500 pl-3">
                                        <p className="text-sm text-gray-500">Địa chỉ</p>
                                        <p className="font-medium">{store?.address}</p>
                                    </div>
                                    <div className="border-l-4 border-pink-500 pl-3">
                                        <p className="text-sm text-gray-500">Mã số thuế</p>
                                        <p className="font-medium">{store?.taxCode}</p>
                                    </div>
                                    {store?.description && (
                                        <div className="border-l-4 border-purple-500 pl-3 md:col-span-2">
                                            <p className="text-sm text-gray-500">Mô tả</p>
                                            <p className="font-medium">{store?.description}</p>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 rounded-lg mt-6 text-white">
                                    <p className="text-center font-medium">Trạng thái cửa hàng: <span className="font-bold">{store?.status === "Active" ? "Đang hoạt động" : "Bị khóa"}</span></p>
                                </div>
                            </div>
                        </div>
                        <hr className='w-full border-gray-200'/>
                        <div className='w-full h-[80px] flex  gap-2 px-4 items-center'>
                            <div className='flex items-center justify-center w-full '>
                                <button className='border-2 px-4 py-2 rounded-md bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold transition duration-300 focus:outline-none hover:scale-105 hover:shadow-md hover:opacity-90' onClick={handleSuccess}>Tiến hành đăng nhập</button>
                            </div>
                        </div>
                    </div>
                ): (<div className='hidden'/>)}
            </div>
        </div>
        {/* Modal địa chỉ */}
        <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50  ${isOpenModal?"":"opacity-0 pointer-events-none"}`}>
            <div className={`relative p-4 bg-white rounded-lg shadow-lg w-auto transform transition-all duration-300 ease-in-out ${isOpenModal?"translate-y-0":" translate-y-10 pointer-events-none"}`}>
                {/* Tiêu đề */}
                <h2 className="text-xl font-semibold text-gray-800 pb-4 ">Sửa địa chỉ</h2>
                <hr className='w-full border-black'/>
                {/* Nội dung */}
                <div className='w-full h-[500px] overflow-y-auto px-4'>

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
                    className='w-full h-[80px] p-2 border-2 rounded-md border-gray-300' style={{resize:'none'}}
                    placeholder='Ví dụ: số nhà, tên đường, khu phố,...' onChange={(e) =>  setAddress(e.target.value)}
                    maxLength={110}>
                    </textarea>
                    <div>
                        <p className='mt-2 ml-2 font-semibold'>Vị trí cụ thể</p>
                        <p className='mb-2 ml-2 text-xs'>Giúp cho người giao hàng nhận hàng đúng địa chỉ hơn!</p>
                    </div>
                    <input 
                    type="text" 
                    name="latitude" 
                    id="latitude" 
                    placeholder='Nhập kinh độ và vĩ độ. Ví dụ: 10.762622, 106.660172' 
                    onChange={(e) => {setLatitude(e.target.value.split(",")[0].trim()); setLongtitude(e.target.value.split(",")[1].trim())}}
                    className='w-full p-2 border-gray-200 border-2 rounded-md'/>
                    <div className='w-full h-auto p-6'>
                        <div className='w-[400px] h-[400px]'>
                            <LeafletMap lat={latitude} lon={longtitude}/>
                        </div>
                    </div>
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
    </div>
  )
}

export default RegistSeller