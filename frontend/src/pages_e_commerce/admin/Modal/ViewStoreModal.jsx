import React from 'react';

const ViewStoreModal = ({ store, onClose }) => {
  if (!store) return null;

  // Xác định logo để hiển thị
  const logoToDisplay = store.logo || '/logo_default.jpg';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg mx-4 shadow-2xl flex flex-col" style={{ maxHeight: '90vh' }}>
        {/* Header */}
        <div className="flex justify-between items-center mb-4 pb-4 border-b-2 border-[#008500]/20">
          <div className="flex items-center gap-x-3">
            {/* Hiển thị logo */}
            <img 
              src={logoToDisplay} 
              alt="Logo cửa hàng" 
              className="w-10 h-10 object-cover rounded-lg border"
            />
            {/* Tiêu đề */}
            <h3 className="text-xl font-bold text-[#008500]">Thông tin cửa hàng</h3>
          </div>
          {/* Nút đóng */}
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-[#008500] transition-colors p-1 rounded-full hover:bg-gray-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-3">
              <div className="bg-gray-100 p-3 rounded-lg">
                <label className="text-xs font-semibold text-[#008500] uppercase tracking-wide">Tên cửa hàng</label>
                <p className="mt-1 text-base font-medium text-gray-800">{store.name}</p>
              </div>

              <div className="bg-gray-100 p-3 rounded-lg">
                <label className="text-xs font-semibold text-[#008500] uppercase tracking-wide">Mô tả</label>
                <p className="mt-1 text-sm text-gray-800">{store.description || "Không có mô tả"}</p>
              </div>

              <div className="bg-gray-100 p-3 rounded-lg">
                <label className="text-xs font-semibold text-[#008500] uppercase tracking-wide">Địa chỉ</label>
                <p className="mt-1 text-sm text-gray-800">{store.address || "Chưa cập nhật"}</p>
              </div>

              <div className="bg-gray-100 p-3 rounded-lg">
                <label className="text-xs font-semibold text-[#008500] uppercase tracking-wide">Mã số thuế</label>
                <p className="mt-1 text-sm text-gray-800">
                    {store.taxCode.length > 10
                        ? `${store.taxCode.slice(0, 10)} - ${store.taxCode.slice(10)}`
                        : store.taxCode
                    }
                </p>
              </div>

              <div className="bg-gray-100 p-3 rounded-lg">
                <label className="text-xs font-semibold text-[#008500] uppercase tracking-wide">Xếp hạng</label>
                <p className="mt-1 text-sm text-gray-800 flex flex-row">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500 mt-[3px]" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {store.rating.toFixed(1)}</p>
              </div>

              <div className="bg-gray-100 p-3 rounded-lg flex items-center gap-x-2">
                <label className="text-xs font-semibold text-[#008500] uppercase tracking-wide whitespace-nowrap">Trạng thái</label>
                <p className={`flex items-center gap-x-1 text-sm ${store.status === "Active" ? "text-green-600" : "text-red-600"}`}>
                  {store.status === "Active" ? (
                    <><span className="w-2 h-2 bg-green-500 rounded-full"></span><span>Hoạt động</span></>
                  ) : (
                    <><span className="w-2 h-2 bg-red-500 rounded-full"></span><span>Đã bị khoá</span></>
                  )}
                </p>
              </div>

              {/* Danh sách Manager */}
              <div className="bg-gray-100 p-3 rounded-lg">
                    <label className="text-xs font-semibold text-[#008500] uppercase tracking-wide">Người quản lí</label>
                    <div className="mt-2 space-y-2 max-h-32 overflow-y-auto">
                        {store.manager.length > 0 ? (
                        store.manager.map((manager, index) => (
                            <div
                            key={manager._id}
                            className="flex items-center gap-x-2 p-2 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
                            >
                            <span className="text-sm text-gray-800">{index + 1}.</span>
                            <div className="flex items-center gap-x-3">
                                <p className="text-sm font-medium text-gray-800">{manager.name}</p>
                                <p className="text-xs text-gray-600">{manager.email}</p>
                            </div>
                            </div>
                        ))
                        ) : (
                        <p className="text-xs text-gray-500">Không có người quản lí</p>
                        )}
                    </div>
                </div>

              {/* Danh sách Follower */}
                <div className="bg-gray-100 p-3 rounded-lg">
                    <label className="text-xs font-semibold text-[#008500] uppercase tracking-wide">Người theo dõi</label>
                    <div className="mt-2 space-y-2 max-h-32 overflow-y-auto">
                        {store.follower.length > 0 ? (
                        store.follower.map((follower, index) => (
                            <div
                            key={follower._id}
                            className="flex items-center gap-x-2 p-2 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
                            >
                            <span className="text-sm text-gray-800">{index + 1}.</span>
                            <div className="flex items-center gap-x-3">
                                <p className="text-sm font-medium text-gray-800">{follower.name}</p>
                                <p className="text-xs text-gray-600">{follower.email}</p>
                            </div>
                            </div>
                        ))
                        ) : (
                        <p className="text-xs text-gray-500">Không có người theo dõi</p>
                        )}
                    </div>
                </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#008500] text-white rounded-md hover:bg-[#006600] transition-colors flex items-center text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewStoreModal;