import { useStatStyles } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { HiOutlineShoppingBag } from 'react-icons/hi';
import { MdStorefront } from 'react-icons/md';

const ListStore = () => {
    const location = useLocation();
    const [listStore, setListStore] = useState(location.state?.items);
    const navigate = useNavigate();
    useEffect(() => {
        console.log(listStore);
    }, [])
    const handleStoreSelect = (storeId) => {
        navigate('/e-commerce/seller/home');
        Cookies.set('store', storeId, { expires: 1 });
      };
  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-purple-600 to-pink-600 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl p-6 md:p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <MdStorefront className="text-5xl text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Chọn cửa hàng</h1>
          <p className="text-gray-500">Vui lòng chọn cửa hàng mà bạn muốn quản lý</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {listStore && listStore.length > 0 ? (
            listStore.map((store, index) => (
              <div
                key={index}
                onClick={() => handleStoreSelect(store._id)}
                className="relative bg-gradient-to-br from-purple-100 to-pink-50 rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border border-transparent hover:border-purple-300"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full">
                    <HiOutlineShoppingBag className="text-white text-xl" />
                  </div>
                  <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded-full">
                    Store #{index + 1}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2 truncate">{store.name}</h2>
                {store.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{store.description}</p>
                )}
                <div className="absolute bottom-6 right-6">
                  <div className="w-8 h-8 flex items-center justify-center bg-purple-600 rounded-full text-white font-bold">
                    {store.name.charAt(0).toUpperCase()}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-gray-500">No stores available. Please create a store first.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ListStore