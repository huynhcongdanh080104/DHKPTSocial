import React, { useEffect, useRef, useState } from 'react';
import { FaEdit, FaTrash, FaPlus, FaEye, FaImages, FaColumns, FaImage } from 'react-icons/fa';
import SellerHomeNav from '../components/SellerHomeNav';
import axios from 'axios'
import Cookies from 'js-cookie'
import { GoTriangleDown } from 'react-icons/go';
import io from "socket.io-client";
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';

const socket = io("https://dhkshop.onrender.com");
const SellerAds = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [layout, setLayout] = useState([]);
  const [verticalLayout, setVerticalLayout] = useState([]);
  const [isAddAds, setIsAddAds] = useState(false);
  const [layoutItem, setLayoutItem] = useState("");

  const [isShowProduct, setIsShowProduct] = useState(false);
  const [isShowAdsType, setIsShowAdsType] = useState(false);

  const [store, setStore] = useState(Cookies.get('store'));
  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const [product, setProduct] = useState("");
  const [products, setProducts] = useState([]);
  const [adsType, setAdsType] = useState("standard");
  const [file, setFile] = useState({});
  const [media, setMedia] = useState([]);
  const imgRef = useRef(null);

  const [adsTypes, setAdsTypes] = useState(["standard", "vertical", "horizontal"]);
  const [adsTypeName, setAdsTypeName] = useState("Quảng cáo tiêu chuẩn");
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
  useEffect(() => {
    const storeID = Cookies.get('store');
    axios.get(`https://dhkshop.onrender.com/layout/store/${storeID}`)
    .then((response) => {
      setLayout(response.data.filter(layout => layout.adsLayout?.adsType !== "vertical"));
      const verticalLayout = response.data.filter(layout => layout.adsLayout?.adsType === "vertical");
      setVerticalLayout(verticalLayout);
    })
    axios.get(`https://dhkshop.onrender.com/product/store/${storeID}`)
    .then((response) => {
      setProducts(response.data);
    })
  }, [])
  const handleAddLayout = () => {
    if(name.trim() === ""){
      enqueueSnackbar('Vui lòng thêm tên bố cục', {variant: 'warning'});
    }
    else if(media.length === 0){
      enqueueSnackbar('Vui lòng thêm ảnh quảng cáo', {variant: 'warning'});
    }
    else{
      axios.get(`https://dhkshop.onrender.com/layout/name/${name}/${Cookies.get('store')}`)
      .then((response) => {
        enqueueSnackbar('Bố cục đã tồn tại', {variant: 'warning'});
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
            const newAds = {
              image: response.data.file._id,
              adsType:adsType
            }
            if(link !== "") newAds.link = link;
            axios.post('https://dhkshop.onrender.com/ads', newAds)
            .then((response) => {
              const newLayout = {
                store: Cookies.get('store'),
                name: name,
                index: layout.length + verticalLayout.length + 1,
                layoutType: "ads",
                adsLayout: response.data._id
              }
              axios.post('https://dhkshop.onrender.com/layout', newLayout)
              .then((response) => {
                console.log(response.data);
                enqueueSnackbar('Thêm bố cục thành công', {variant: 'success'});
                setName("");
                setMedia([]);
                setFile({});
                setLink("");
                setAdsType("standard");
                setAdsTypeName("Quảng cáo tiêu chuẩn");
              })
            })
          })
          .catch((error) => {
            console.log(error);
          })
      })
    }
  }
  useEffect(() => {
      // Lắng nghe sự kiện thêm sản phẩm
      socket.on("layoutAdded", (newLayout) => {
        newLayout.adsLayout?.adsType === "vertical"?(
          setVerticalLayout((preLayouts) => {
            const updatedLayouts = [...preLayouts, newLayout];
            
            return updatedLayouts;
          })
        ):(
          setLayout((preLayouts) => {
          
            const updatedLayouts = [...preLayouts, newLayout];
            
            return updatedLayouts;
          })
        )
      });

      // Lắng nghe sự kiện cập nhật sản phẩm
      socket.on("layoutUpdated", (updatedLayout) => {
        setLayout((prevObjects) =>
            prevObjects.map((object) =>
                object._id === updatedLayout._id ? updatedLayout : object
              )
          );
      });

      // Lắng nghe sự kiện xóa sản phẩm
      socket.on("layoutDeleted", ({ layoutId }) => {
        setLayout((prevObjects) =>
            prevObjects.filter((object) => object._id !== layoutId)
          );
      });

      return () => {
          socket.off("layoutAdded");
          socket.off("layoutUpdated");
          socket.off("layoutDeleted");
      };
  }, []);
  return (
    <div className='flex bg-gray-100'>
      <SellerHomeNav />
      <div className='w-1/5'></div>
      <div className='min-h-screen w-4/5'>
        <div className='p-6'>
          <div className='bg-white rounded-xl shadow p-6 mb-6'>
            <div className='flex justify-center items-center'>
              <h1 className='text-2xl font-bold text-gray-800 mb-4 w-1/2 text-start'>Quản lý giao diện gian hàng</h1>
              <div className=' w-1/2 flex justify-end'>
                <div className='p-4 rounded-full bg-purple-200 shadow-md cursor-pointer transition duration-400 
                hover:scale-105 hover:opacity-90'
                onClick={() =>  navigate(`/e-commerce/seller/view-store/${store}`)}>
                  <FaEye className='text-purple-600 text-lg'/>
                </div>
                
              </div>
              
            </div>
            
            <div>
              <div className='flex justify-between mb-4 items-end'>
                <button className='bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center font-semibold
                transition duration-300
                hover:scale-110' onClick={() => setIsAddAds(!isAddAds)}>
                  <FaPlus className='mr-2' /> Thêm quảng cáo
                </button>
                <div className='relative w-1/2'>
                  <div className={`absolute bottom-2 w-full text-center transform transition-all duration-500  ease-in-out font-bold text-lg ${isAddAds?"translate-y-2 opacity-100":"translate-y-0 opacity-0"}`}>Thêm quảng cáo</div>
                
                  <div className={`absolute bottom-2 w-full text-center transform transition-all duration-500 ease-in-out font-bold text-lg ${isAddAds?"translate-y-0 opacity-0":"translate-y-2 opacity-100"}`}>Thông tin của bố cục</div>
                </div>
              </div>
            </div>
            <div className='flex justify-center gap-2'>
              <div className='flex gap-2 w-1/2 border-r-2 border-black pr-2 h-[500px] overflow-y-auto'>
                {verticalLayout.length !== 0 && (
                  <div className='w-1/4 flex flex-col gap-2'>
                    {verticalLayout.map((item, index) => (
                      <div 
                        key={index}
                        className='w-full h-auto rounded-md bg-white shadow-md min-h-[400px] 
                          transition duration-300 hover:scale-95 hover:cursor-pointer' 
                        onClick={() => {setLayoutItem(item); setIsAddAds(false)}}
                      >
                        <img 
                          src={`https://dhkshop.onrender.com/files/download/${item.adsLayout?.image}`} 
                          alt="" 
                          className='rounded-md w-full h-full object-cover'
                        />
                      </div>
                    ))}
                  </div>
                )}
                <div className={`${verticalLayout.length === 0 ? "w-full" : "w-3/4"} flex flex-col gap-2 h-auto`}>
                  {layout.map((item, index) => (
                    item.name === "newestlist" || item.name === "listAll" || item.name === "topSellinglist" || 
                    item.name === "topRatedlist" || item.name === "onSalelist" ? (
                      <div 
                        key={index} 
                        className='w-full rounded-md bg-white p-2 shadow-md border-2 border-black min-h-[120px]
                          transition duration-300 hover:scale-95 hover:cursor-pointer' 
                        onClick={() => {setLayoutItem(item); setIsAddAds(false)}}
                      >
                        <p>
                          {item.name === "newestlist" && "Sản phẩm mới nhất"}
                          {item.name === "listAll" && "Tất cả sản phẩm"}
                          {item.name === "topSellinglist" && "Sản phẩm bán chạy"}
                          {item.name === "topRatedlist" && "Sản phẩm có đánh giá cao"}
                          {item.name === "onSalelist" && "Sản phẩm giảm giá"}
                        </p>
                      </div>
                    ) : (
                      <div 
                        key={index} 
                        className='w-full rounded-md bg-white shadow-md min-h-[100px]
                          transition duration-300 hover:scale-95 hover:cursor-pointer' 
                        onClick={() => {setLayoutItem(item); setIsAddAds(false)}}
                      >
                        <img 
                          src={`https://dhkshop.onrender.com/files/download/${item.adsLayout?.image}`} 
                          alt="" 
                          className='rounded-md w-full h-full object-cover'
                        />
                      </div>
                    )
                  ))}
                </div>
              </div>
              <div className='w-1/2 h-full flex flex-col justify-center'> 
                {isAddAds?(
                  <div className='flex flex-col justify-start items-start gap-2 p-4 border-2 border-black rounded-md'>
                    <p className='ml-2 font-semibold'>Tên bố cục:</p>
                    <input type="text" placeholder='Nhập tên bố cục' className='w-full p-2 rounded-md border-2 border-gray-200' onChange={(e) => setName(e.target.value)}/>
                    <p className='ml-2 font-semibold'>Đường dẫn đến:</p>
                    <div className='flex w-full border-2 rounded-md border-gray-300 py-2 px-4 items-center hover:cursor-pointer'
                    onClick={() => {setIsShowProduct(!isShowProduct)}}>
                        <p className={` w-1/2 ${product === "" ?"text-gray-400":"text-black"}`}>{product === "" ? "Chọn sản phẩm": product}</p>
                        <div className={`w-1/2 flex justify-end`}>
                            <GoTriangleDown className={`text-2xl transition-all duration-500 ease-in-out ${isShowProduct? "rotate-180": ""}`}/>
                        </div>  
                    </div>
                    <div className={`relative w-full transform transition-all duration-300 ease-in-out ${isShowProduct? "translate-y-0 opacity-100" : "translate-y-6 opacity-0 pointer-events-none" }`}>
                        <div className='border-2 border-black absolute w-full bg-white h-[150px] overflow-y-auto mt-2 rounded-md'>
                            {products.map((item, index) => (
                                <div className='p-2 border-b-2 border-black transition-all duration-300 ease-in-out hover:pl-4 hover:font-semibold hover:cursor-pointer'
                                key={index}
                                onClick={() =>{setProduct(item.name); setLink('/customer/details/'+ item._id); setIsShowProduct(false);}}>
                                    <div className='w-full justify-center items-center'>
                                        <p>{item.name}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <p className='ml-2 font-semibold'>Kiểu quảng cáo:</p>
                    <div className='flex w-full border-2 rounded-md border-gray-300 py-2 px-4 items-center hover:cursor-pointer'
                    onClick={() => {setIsShowAdsType(!isShowAdsType)}}>
                        <p className={` w-1/2 ${adsType === "" ?"text-gray-400":"text-black"}`}>{adsTypeName === "" ? "Chọn kiểu quảng cáo": adsTypeName}</p>
                        <div className={`w-1/2 flex justify-end`}>
                            <GoTriangleDown className={`text-2xl transition-all duration-500 ease-in-out ${isShowAdsType? "rotate-180": ""}`}/>
                        </div>  
                    </div>
                    <div className={`relative w-full transform transition-all duration-300 ease-in-out ${isShowAdsType? "translate-y-0 opacity-100" : "translate-y-6 opacity-0 pointer-events-none" }`}>
                        <div className='border-2 border-black absolute w-full bg-white h-auto overflow-y-auto mt-2 rounded-md'>
                            {adsTypes.map((item, index) => (
                                <div className='p-2 border-b-2 border-black transition-all duration-300 ease-in-out hover:pl-4 hover:font-semibold hover:cursor-pointer'
                                key={index}
                                onClick={() => {
                                  setAdsType(item);
                                  setAdsTypeName(item === "standard" ? "Quảng cáo tiêu chuẩn" : item === "vertical" ? "Quảng cáo dọc" : "Quảng cáo ngang");
                                  setIsShowAdsType(false);
                                }}>
                                    <div className='w-full justify-center items-center'>
                                        <p>
                                          {item === "standard" && "Quảng cáo tiêu chuẩn"}
                                          {item === "vertical" && "Quảng cáo dọc"}
                                          {item === "horizontal" && "Quảng cáo ngang"}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {adsType === "standard" && (
                     media.length === 0 ? (
                      <div className='w-full flex justify-center'>
                         <div className='w-1/2 h-[100px] border-2 border-dashed border-gray-400 text-gray-400 rounded-md hover:border-purple-400 hover:text-purple-400 cursor-pointer 
                          flex flex-col justify-center items-center
                          transition duration-400'
                          onClick={() => imgRef.current.click()}>
                            <FaImage className='text-[50px]'/>
                            <p className='mt-2'>Ảnh quảng cáo</p>
                          </div>
                      </div>
                      ):(
                        <div className='w-full flex justify-center'>
                          <div className='w-1/2 h-[100px] rounded-md shadow-md hover:opacity-90'>
                            <img src={media[0].url} alt="Ảnh quảng cáo" className='w-full h-full object-cover rounded-md cursor-pointer' onClick={() => imgRef.current.click()}/>
                          </div>
                        </div>
                      )
                    )}
                    {adsType === "horizontal" && (
                      media.length === 0 ? (
                        <div className='w-full h-[100px] border-2 border-dashed border-gray-400 text-gray-400 rounded-md hover:border-purple-400 hover:text-purple-400 cursor-pointer 
                        flex flex-col justify-center items-center
                        transition duration-400 '
                        onClick={() => imgRef.current.click()}>
                          <FaImage className='text-[50px]'/>
                          <p className='mt-2'>Ảnh quảng cáo</p>
                        </div>
                        ):(
                          <div className='w-full h-[100px] rounded-md shadow-md hover:opacity-90'>
                            <img src={media[0].url} alt="Ảnh quảng cáo" className='w-full h-full object-cover rounded-md cursor-pointer' onClick={() => imgRef.current.click()}/>
                          </div>
                        )
                    )}
                    {adsType === "vertical" && (
                      media.length === 0 ? (
                        <div className='flex justify-center w-full'>
                          <div className='w-1/3 h-[400px] border-2 border-dashed border-gray-400 text-gray-400 rounded-md hover:border-purple-400 hover:text-purple-400 cursor-pointer 
                          flex flex-col justify-center items-center
                          transition duration-400'
                          onClick={() => imgRef.current.click()}>
                            <FaImage className='text-[50px]'/>
                            <p className='mt-2'>Ảnh quảng cáo</p>
                          </div>
                        </div>
                        ):(
                          <div className='w-full flex justify-center'>
                            <div className='w-1/3 h-[400px] rounded-md shadow-md hover:opacity-90'>
                              <img src={media[0].url} alt="Ảnh quảng cáo" className='w-full h-full object-cover rounded-md cursor-pointer' onClick={() => imgRef.current.click()}/>
                            </div>
                          </div>
                        )
                    )}
                    <input className='hidden' type="file" name="adsImage" id="adsImage" ref={imgRef} accept="image/*" onChange={handleFileChange}/>
                    
                    <div className='flex justify-end w-full'>
                      <button className='p-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-md' onClick={handleAddLayout}>Thêm bố cục mới</button>
                    </div>
                    
                  </div>
                ): (
                  <div className='w-full flex justify-center item-center'>
                    {layoutItem === "" ? (
                      <p className='text-yellow-400 font-semibold'>
                        Vui lòng chọn 1 bố cục bên trái
                      </p>
                    ):(
                    <div className='p-4 border-2 border-black rounded-md flex flex-col gap-2 w-full'>
                      <div className='flex gap-2 justify-start'>
                        <p>Tên bố cục: </p>
                        <p>
                          {layoutItem.name === "newestlist" && "Sản phẩm mới nhất"}
                          {layoutItem.name === "listAll" && "Tất cả sản phẩm"}
                          {layoutItem.name === "topSellinglist" && "Sản phẩm bán chạy"}
                          {layoutItem.name === "topRatedlist" && "Sản phẩm có đánh giá cao"}
                          {layoutItem.name === "onSalelist" && "Sản phẩm giảm giá"}
                          {layoutItem.layoutType === "ads" && layoutItem.name}
                        </p>
                      </div>
                      <p>Vị trí: {layoutItem.index}</p>
                      <p>Loại bố cục: {layoutItem.layoutType === "list" ? "Danh sách": "Quảng cáo"}</p>
                      <p>Ngày thêm: {layoutItem.publishDate ? new Date(layoutItem.publishDate).toLocaleDateString("vi-VN") : "Không xác định"}</p>
                      <div className='flex gap-2'>Trạng thái {layoutItem.status === "Active"? (
                        <p className='rounded-full bg-green-100 text-green-600 px-2'>
                          Hoạt động
                        </p>
                      ):(
                        <p className='rounded-md bg-red-100 text-red-600 px-2'>
                          Dừng hoạt động
                        </p>
                      )}
                      </div>
                      <div className='flex justify-center items-center gap-8'>
                        <button className='py-2 px-4 flex justify-center items-center gap-2 font-semibold border-2 border-blue-500 rounded-md text-blue-500
                        transition duration-300
                        hover:text-white hover:bg-blue-500 hover:shadow-lg'><FaEdit/>Chỉnh sửa bố cục</button>
                        <button className='py-2 px-4 flex justify-center items-center gap-2 font-semibold border-2 border-red-500 rounded-md text-red-500
                        transition duration-300
                        hover:text-white hover:bg-red-500 hover:shadow-lg'><FaTrash/>Xóa bố cục</button>
                      </div>
                    </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerAds;