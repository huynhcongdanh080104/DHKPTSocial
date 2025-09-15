import React from 'react';

const ViewAdminModal = ({ admin, onClose }) => {
  if (!admin) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl p-8 w-full max-w-2xl mx-4 shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-[#008500]/20">
          <h3 className="text-2xl font-bold text-[#008500]">
            Thông tin Admin
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-[#008500] transition-colors p-2 rounded-full hover:bg-gray-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Cột 1 */}
          <div className="space-y-4">
            <div className="bg-gray-100 p-4 rounded-xl">
              <label className="text-sm font-semibold text-[#008500] uppercase tracking-wide">Họ và tên</label>
              <p className="mt-1 text-lg font-medium text-gray-800">{admin.name}</p>
            </div>

            <div className="bg-gray-100 p-4 rounded-xl">
              <label className="text-sm font-semibold text-[#008500] uppercase tracking-wide">Vai trò</label>
              <p className="mt-1 text-gray-800">
                <span className={`inline-flex items-center px-3 py-1 rounded-full ${admin.role === 'admin' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                  {admin.role === "admin" ? "Admin" : "Super Admin"}
                </span>
              </p>
            </div>

            <div className="bg-gray-100 p-4 rounded-xl flex flex-row items-center gap-x-3">
              <label className="text-sm font-semibold text-[#008500] uppercase tracking-wide whitespace-nowrap">
                Trạng thái
              </label>
              <p className={`flex items-center gap-x-2 ${admin.status === "active" ? "text-green-600" : "text-red-600"}`}>
                {admin.status === "active" ? (
                  <>
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>Hoạt động</span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    <span>Đã khoá</span>
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Cột 2 */}
          <div className="space-y-4">
            <div className="bg-gray-100 p-4 rounded-xl">
              <label className="text-sm font-semibold text-[#008500] uppercase tracking-wide">Thông tin liên hệ</label>
              <div className="mt-2 space-y-2">
                <p className="flex items-center text-gray-800">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#008500]" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  {admin.gmail}
                </p>
                <p className="flex items-center text-gray-800">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#008500]" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  {admin.phoneNumber}
                </p>
              </div>
            </div>

            <div className="bg-gray-100 p-4 rounded-xl">
              <label className="text-sm font-semibold text-[#008500] uppercase tracking-wide">Thông tin cá nhân</label>
              <div className="mt-2 space-y-2">
                <p className="text-gray-800">
                  <span className="font-medium">Giới tính: </span> 
                  {admin.gender === "male" ? "Nam" : admin.gender === "female" ? "Nữ" : "Khác"}
                </p>
                <p className="text-gray-800">
                  <span className="font-medium">Địa chỉ:</span> {admin.address || "Chưa cập nhật"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#008500] text-white rounded-lg hover:bg-[#006600] transition-colors flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewAdminModal;