import React from "react";

function CategoryDropdown() {
  return (
    <button className="flex items-center justify-between w-[200px] h-[42px] bg-[#6D4AAE] rounded-[26px] px-5 text-white font-bold">
      {/* Menu Icon */}
      <div className="flex flex-col justify-between h-[14px]">
        <div className="w-5 h-[2px] bg-white"></div>
        <div className="w-5 h-[2px] bg-white"></div>
        <div className="w-5 h-[2px] bg-white"></div>
      </div>

      {/* Text với kích thước lớn hơn */}
      <span className="text-center flex-1 text-xs">TẤT CẢ DANH MỤC</span>

      {/* Dropdown Icon */}
      <span className="text-sm">▼</span>
    </button>
  );
}

export default CategoryDropdown;
