import React, { useState, useEffect, useRef } from 'react'
import io from "socket.io-client";
import Cookies from 'js-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import { FaUser, FaPlus, FaStar, FaHeart, FaComment, FaCalendarAlt, FaShoppingBag } from 'react-icons/fa';
import axios from 'axios'
import ProductList from '../components/ProductList';
import productObserver from '../../design_patterns/ObserverPattern/ObserverPattern';

const socket = io("https://dhkshop.onrender.com");

const ViewStore = () => {
    const [products, setProducts] = useState([]);
    const [topSellingProducts,setTopSelling] = useState([]);
    const [topRatedProducts, setTopRated] = useState([]);
    const [onSaleProducts, setOnSale] = useState([]);
    const [newestProducts, setNewest] = useState([]);

    const [store, setStore] = useState("");
    const [productNumber, setProductNumber] = useState("");
    const params = useParams();
    const [layout, setLayout]= useState([]);
    const [verticalLayout, setVerticalLayout] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`https://dhkshop.onrender.com/store/id/${params.id}`)
        .then((response) => {
            setStore(response.data);
        })
        axios.get(`https://dhkshop.onrender.com/product/store/${params.id}`)
        .then((response) => {
            setProductNumber(response.data.length);
        })
    }, [])
    useEffect(() => {
        axios.get(`https://dhkshop.onrender.com/layout/store/${params.id}`)
        .then((response) => {
          setLayout(response.data.filter(layout => layout.adsLayout?.adsType !== "vertical"));
          const verticalLayout = response.data.filter(layout => layout.adsLayout?.adsType === "vertical");
          setVerticalLayout(verticalLayout);

        })
        // Fetch danh sách sản phẩm ban đầu
        fetch(`https://dhkshop.onrender.com/product/store/${params.id}`)
            .then((res) => res.json())
            .then((data) => {
                setProducts(data)
                updateLists(data); //fetch dữ liệu lần đầu tiên
            });

        productObserver.subscribe(updateLists);

        socket.on("productAdded", (newProduct) => {
            setProducts((prevProducts) => {
                const updatedProducts = [...prevProducts, newProduct];
                productObserver.notify(updatedProducts);
                return updatedProducts;
            });
        });

        socket.on("productUpdated", (updatedProduct) => {
            setProducts((prevProducts) => {
                const updatedProducts = prevProducts.map(product => 
                    product._id === updatedProduct._id ? updatedProduct : product
                );
                productObserver.notify(updatedProducts);
                return updatedProducts;
            });
        });

        socket.on("productDeleted", ({ productId }) => {
            setProducts((prevProducts) => {
                const updatedProducts = prevProducts.filter(product => product._id !== productId);
                productObserver.notify(updatedProducts);
                return updatedProducts;
            });
        });

        return () => {
            socket.off("productAdded");
            socket.off("productUpdated");
            socket.off("productDeleted");
            productObserver.unsubscribe(updateLists);
        };
    }, []);
    const updateLists = (updatedProducts) => {
      setNewest([...updatedProducts]
          .sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))
          .slice(0, 10)
      );

      if (topSellingProducts.length < 10) {
          setTopSelling([...updatedProducts]
              .sort((a, b) => b.soldQuantity - a.soldQuantity)
              .slice(0, 10)
          );
      }

      if (topRatedProducts.length < 10) {
          setTopRated([...updatedProducts]
              .sort((a, b) => b.rating - a.rating)
              .slice(0, 10)
          );
      }

      if (onSaleProducts.length < 10) {
          setOnSale(updatedProducts.filter((p) => p.isSale));
      }
  };
  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Banner */}
      <div className='h-[200px] w-full bg-gradient-to-r from-purple-600 to-pink-600 relative'>
        <div className='absolute bottom-0 left-0 right-0 mx-auto w-4/5 transform translate-y-1/2'>
          <div className='flex bg-white rounded-lg shadow-xl overflow-hidden'>
            {/* Store Profile */}
            <div className="w-1/3 p-6 relative">
              <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-600 to-pink-600 opacity-10'></div>
              <div className='relative z-10 flex flex-col items-center'>
                <div className='rounded-full h-[100px] w-[100px] bg-white p-2 shadow-md'>
                  <div className='w-full h-full rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex justify-center items-center'>
                    <FaUser className='text-4xl text-white'/>
                  </div>
                </div>
                <p className='text-xl font-bold mt-4 text-gray-800'>{store.name}</p>
                <div className='flex items-center mt-2 text-sm text-gray-600'>
                  <FaStar className='text-yellow-400 mr-1'/>
                  <span>{store.rating}</span>
                  <span className='mx-2'>•</span>
                  <span>{Array.isArray(store.follower) ? store.follower.length : 0} người theo dõi</span>
                </div>
                <div className='flex w-full mt-4 gap-3'>
                  <button className='flex-1 flex justify-center items-center gap-2 rounded-md py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:shadow-lg transition duration-300 transform hover:-translate-y-1'>
                    <FaHeart className='text-xs'/>
                    <span>Theo dõi</span>
                  </button>
                  <button className='flex-1 flex justify-center items-center gap-2 rounded-md py-2 border-2 border-pink-500 text-pink-500 font-medium hover:bg-pink-50 transition duration-300 transform hover:-translate-y-1'>
                    <FaComment className='text-xs'/>
                    <span>Chat</span>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Store Info */}
            <div className="w-2/3 p-6">
              <div className='grid grid-cols-2 gap-6'>
                <div className='flex items-center'>
                  <div className='w-10 h-10 rounded-full bg-purple-100 flex justify-center items-center mr-3'>
                    <FaShoppingBag className='text-purple-600'/>
                  </div>
                  <div>
                    <p className='text-sm text-gray-500'>Sản phẩm</p>
                    <p className='font-bold text-lg'>{productNumber}</p>
                  </div>
                </div>
                <div className='flex items-center'>
                  <div className='w-10 h-10 rounded-full bg-pink-100 flex justify-center items-center mr-3'>
                    <FaHeart className='text-pink-600'/>
                  </div>
                  <div>
                    <p className='text-sm text-gray-500'>Người theo dõi</p>
                    <p className='font-bold text-lg'>{Array.isArray(store.follower) ? store.follower.length : 0}</p>
                  </div>
                </div>
                <div className='flex items-center'>
                  <div className='w-10 h-10 rounded-full bg-purple-100 flex justify-center items-center mr-3'>
                    <FaStar className='text-purple-600'/>
                  </div>
                  <div>
                    <p className='text-sm text-gray-500'>Đánh giá</p>
                    <p className='font-bold text-lg'>{store.rating}</p>
                  </div>
                </div>
                <div className='flex items-center'>
                  <div className='w-10 h-10 rounded-full bg-pink-100 flex justify-center items-center mr-3'>
                    <FaCalendarAlt className='text-pink-600'/>
                  </div>
                  <div>
                    <p className='text-sm text-gray-500'>Tham gia</p>
                    <p className='font-bold text-lg'>{store.publishDate ? new Date(store.publishDate).toLocaleDateString("vi-VN") : "Không xác định"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Navigation Spacing */}
      <div className='h-[100px]'></div>
      
      {/* Products Container */}
      <div className='flex w-full justify-center'>
        <div className='w-4/5 py-8 flex'>
          {verticalLayout.length !== 0 && (
            <div className='w-1/4 flex flex-col gap-4 p-4 mr-4'>
              {verticalLayout.map((item, index) => (
                <div key={index} className={`w-full h-[800px]  rounded-lg overflow-hidden shadow-md`}>
                  <img src={`https://dhkshop.onrender.com/files/download/${item.adsLayout?.image}`} alt="" className='w-full object-cover h-full'/>
                </div>
              ))}
            </div>
          )}
          <div className={`${verticalLayout.length === 0 ? "w-full":"w-3/4"}`}>
            {layout.map((item, index) => (
              <React.Fragment key={index}>
                {item.name === "listAll" && (
                  <ProductList listTitle="Danh sách sản phẩm" productList={products} maxVisible={verticalLayout.length === 0 ? (5):(4)} scrollLength={verticalLayout.length === 0 ? (210):(220)} key={index}/>
                )}
                {item.name === "topSellinglist" && item.status === "Active" && (
                  <ProductList listTitle="Bán chạy" productList={topSellingProducts} maxVisible={verticalLayout.length === 0 ? (5):(4)} scrollLength={verticalLayout.length === 0 ? (210):(220)} key={index}/>
                )}
                {item.name === "topRatedlist" && item.status === "Active" && (
                  <ProductList listTitle="Đánh giá tốt" productList={topRatedProducts} maxVisible={verticalLayout.length === 0 ? (5):(4)} scrollLength={verticalLayout.length === 0 ? (210):(220)} key={index}/>
                )}
                {item.name === "onSalelist" && item.status === "Active" && (
                  <ProductList listTitle="Giảm giá" productList={onSaleProducts} maxVisible={verticalLayout.length === 0 ? (5):(4)} scrollLength={verticalLayout.length === 0 ? (210):(220)} key={index}/>
                )}
                {item.name === "newestlist" && item.status === "Active" && (
                  <ProductList listTitle="Sản phẩm mới" productList={newestProducts} maxVisible={verticalLayout.length === 0 ? (5):(4)} scrollLength={verticalLayout.length === 0 ? (210):(220)} key={index}/>
                )}
                {item.layoutType === "ads" && (
                  <div key={index} className={`w-full ${item.adsLayout?.adsType === "standard" ? "h-[400px]": "h-[200px]"}  rounded-lg overflow-hidden shadow-md`}>
                    <img src={`https://dhkshop.onrender.com/files/download/${item.adsLayout?.image}`} alt="" className='w-full object-cover'/>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewStore