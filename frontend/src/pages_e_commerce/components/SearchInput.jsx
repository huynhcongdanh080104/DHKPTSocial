import React from "react";

function SearchInput() {
  return (
    <div className="relative max-w-[783px] w-full mx-10 my-0 max-md:mx-5 max-md:my-0 max-sm:mx-0 max-sm:my-4">
      <input
        type="text"
        placeholder="Nhập thông tin sản phẩm cần tìm..."
        className="px-6 py-0 w-full text-lg bg-zinc-300 border-[none] h-[50px] text-zinc-400"
      />
      <div className="absolute right-[15px] top-1/2 transform -translate-y-1/2">
        <svg
          width="36"
          height="36"
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M27.818 31.9178L19.95 24.05C19.2 24.65 18.338 25.125 17.363 25.475C16.388 25.825 15.35 26 14.25 26C11.525 26 9.219 25.0563 7.331 23.1688C5.444 21.2813 4.5 18.975 4.5 16.25C4.5 13.525 5.444 11.2188 7.331 9.3313C9.219 7.4438 11.525 6.5 14.25 6.5C16.975 6.5 19.281 7.4438 21.169 9.3313C23.056 11.2188 24 13.525 24 16.25C24 17.35 23.825 18.3875 23.475 19.3625C23.125 20.3375 22.65 21.2 22.05 21.95L30.068 29.5416L27.818 31.9178ZM14.25 23C16.125 23 17.719 22.3438 19.031 21.0313C20.344 19.7188 21 18.125 21 16.25C21 14.375 20.344 12.7813 19.031 11.4688C17.719 10.1563 16.125 9.5 14.25 9.5C12.375 9.5 10.781 10.1563 9.469 11.4688C8.156 12.7813 7.5 14.375 7.5 16.25C7.5 18.125 8.156 19.7188 9.469 21.0313C10.781 22.3438 12.375 23 14.25 23Z"
            fill="#6D6D6D"
          />
        </svg>
      </div>
    </div>
  );
}

export default SearchInput;