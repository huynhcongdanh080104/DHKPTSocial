import React, { useEffect, useRef, useState } from 'react'
import { FaAngleLeft, FaAngleRight, FaStar, FaShoppingBag, FaHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
const ProductList = ({listTitle, productList}) => {
    const [title, setTitle] = useState("");
    const [products, setProducts] = useState([]);
    const [startIndex, setStartIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const sliderRef = useRef(null);
    const navigate = useNavigate();
    // Đảm bảo không vượt quá số lượng sản phẩm hiển thị
    const maxVisibleProducts = 5;
    const maxStartIndex = Math.max(0, productList.length - maxVisibleProducts);
    
    const handleTurnLeft = () => {
        if (startIndex > 0 && !isAnimating) {
          setIsAnimating(true);
          setStartIndex(prev => Math.max(0, prev - 1));
        }
      };
      
      const handleTurnRight = () => {
        if (startIndex < maxStartIndex && !isAnimating) {
          setIsAnimating(true);
          setStartIndex(prev => Math.min(maxStartIndex, prev + 1));
        }
      };
    useEffect(() => {
        setTitle(listTitle);
        setProducts(productList);
    }, [productList])
    useEffect(() => {
        const timer = setTimeout(() => {
          setIsAnimating(false);
        }, 300); // Thời gian bằng với thời gian transition
        
        return () => clearTimeout(timer);
      }, [startIndex]);
      
      // Tính toán vị trí transform
      const translateX = `-${startIndex * (200 + 10)}px`; 
  return (
    <div className='w-full py-6'>
      <div className='flex flex-col items-start justify-between w-max'>
        <h2 className='font-bold text-xl text-gray-800 relative inline-block w-max'>
          {title}
          
        </h2>
        <span className='h-1 w-1/2 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 mt-[2px]'/>
        {/* {productList.length > maxVisibleProducts && (
          <div className='flex items-center gap-2'>
            <button className='text-xs text-purple-600 hover:underline transition duration-300 hover:text-pink-600'>
              Xem tất cả
            </button>
          </div>
        )} */}
      </div>
      
      <div className='relative w-full'>
        {productList.length > maxVisibleProducts && (
          <div className='absolute inset-y-0 left-0 flex items-center -ml-6 z-10'>
            <button
              onClick={handleTurnLeft}
              disabled={startIndex === 0 || isAnimating}
              className={`w-10 h-10 rounded-full shadow-md flex justify-center items-center transition-all duration-300 transform ${
                startIndex === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-800 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:text-white hover:scale-110'
              }`}
            >
              <FaAngleLeft className='text-lg' />
            </button>
          </div>
        )}
        
        <div className='overflow-hidden'>
          <div 
            ref={sliderRef}
            className='flex gap-5 w-full py-4 transition-transform duration-300 ease-out'
            style={{ transform: `translateX(${translateX})` }}
          >
            {productList.map((product, index) => (
              <div 
                  onClick={() => navigate(`/product/${product._id}`)}
                key={index} 
                className='w-[200px] flex-none bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-xl'
              >
                {/* Product Image */}
                <div className='relative w-full h-[180px] bg-gray-100 overflow-hidden group'>
                  <img 
                    src={`https://dhkshop.onrender.com/files/download/${product.images[0]}`} 
                    alt={product.name} 
                    className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
                  />
                  {product.isSale && (
                    <div className='absolute top-2 right-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-2 py-1 rounded-md transition-transform duration-300 transform hover:scale-110'>
                      -{Math.round(100 - ((product.salePrice/product.price) * 100))}%
                    </div>
                  )}
                  {/* <button className='absolute top-2 right-2 w-8 h-8 bg-white bg-opacity-80 rounded-full flex justify-center items-center transition-all duration-300 hover:bg-pink-100 transform hover:scale-110'>
                    <FaHeart className='text-gray-400 transition-colors duration-300 hover:text-pink-500' />
                  </button> */}
                  
                  
                </div>
                
                {/* Product Info */}
                <div className='p-4'>
                  <h3 className='font-semibold text-gray-800 mb-2 line-clamp-2 h-12 transition-colors duration-300 hover:text-purple-600'>
                    {product.name !== "" ? product.name : "Tên sản phẩm"}
                  </h3>
                  
                  {/* Price */}
                  <div className='mb-3'>
                    {product.isSale ? (
                      <div className='flex items-center gap-2'>
                        <span className='font-bold text-md text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600'>
                          {product.salePrice === 0 ? "100.000" : Number(product.salePrice).toLocaleString("vi-VN")} đ
                        </span>
                        <span className='text-[11px] text-gray-500 line-through'>
                          {Number(product.price).toLocaleString("vi-VN")} đ
                        </span>
                      </div>
                    ) : (
                      <span className='font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600'>
                        {Number(product.price).toLocaleString("vi-VN")} đ
                      </span>
                    )}
                  </div>
                  
                  {/* Rating & Sold */}
                  <div className='flex items-center justify-between text-xs text-gray-500'>
                    <div className='flex items-center transition-transform duration-300 hover:scale-110'>
                      <FaStar className='text-yellow-400 mr-1' />
                      <span>{product.rating}</span>
                    </div>
                    <div className='flex items-center transition-transform duration-300 hover:scale-110'>
                      <FaShoppingBag className='text-gray-400 mr-1' />
                      <span>Đã bán {product.soldQuantity}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {productList.length > maxVisibleProducts && (
          <div className='absolute inset-y-0 right-0 flex items-center -mr-6 z-10'>
            <button
              onClick={handleTurnRight}
              disabled={startIndex >= maxStartIndex || isAnimating}
              className={`w-10 h-10 rounded-full shadow-md flex justify-center items-center transition-all duration-300 transform ${
                startIndex >= maxStartIndex ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-800 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:text-white hover:scale-110'
              }`}
            >
              <FaAngleRight className='text-lg' />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductList
