import React from "react";
import CategoryItem from "./CategoryItem";

function PopularCategories() {
  const categories = [
    {
      id: 1,
      name: "Thời trang",
      imageUrl:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/6a2a73546e03a5ee51920fa408f5af333b6bb54a9b1573372c09e2c6cf216164?placeholderIfAbsent=true&apiKey=c5967bc96b0c41c893e8c5b6812f33d4",
      bgColorClass: "bg-green-50",
    },
    {
      id: 2,
      name: "Đồ điện tử",
      imageUrl:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/d94fcecbfec7de718139267310e5533beeae10e0136f675ba8b493a0f4fee982?placeholderIfAbsent=true&apiKey=c5967bc96b0c41c893e8c5b6812f33d4",
      bgColorClass: "bg-rose-50",
    },
    {
      id: 3,
      name: "Túi xách",
      imageUrl:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/8c38a357408c13653fd4b6091394696033630e34eb962770c175f338ae42c0cb?placeholderIfAbsent=true&apiKey=c5967bc96b0c41c893e8c5b6812f33d4",
      bgColorClass: "bg-fuchsia-50",
    },
    {
      id: 4,
      name: "Giày dép",
      imageUrl:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/b7496db24a93e40da0e9f618f553795a2145c21fd600bf73e37926d0268223b6?placeholderIfAbsent=true&apiKey=c5967bc96b0c41c893e8c5b6812f33d4",
      bgColorClass: "bg-sky-100",
    },
    {
      id: 5,
      name: "Mỹ phẩm",
      imageUrl:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/13ac628c2d6a4f5f3641136564a1b08553f37bc499b64a71d3bf5a5b8b6dfaf2?placeholderIfAbsent=true&apiKey=c5967bc96b0c41c893e8c5b6812f33d4",
      bgColorClass: "bg-cyan-50",
    },
    {
      id: 6,
      name: "Sức khỏe",
      imageUrl:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/c37aa166d141dc348df61ea981bf7b5a1825350fb3b53369884234ac5caddc90?placeholderIfAbsent=true&apiKey=c5967bc96b0c41c893e8c5b6812f33d4",
      bgColorClass: "bg-fuchsia-50",
    },
  ];

  return (
    <section className="flex flex-col mt-9 max-md:max-w-full">
      <h2 className="ml-24 text-2xl font-semibold tracking-widest text-center text-black max-md:max-w-full">
        DANH MỤC PHỔ BIẾN
      </h2>
      <div className="relative flex flex-wrap gap-10 justify-center items-center mt-6 w-full max-md:max-w-full">
        {categories.map((category) => (
          <CategoryItem
            key={category.id}
            name={category.name}
            imageUrl={category.imageUrl}
            bgColorClass={category.bgColorClass}
          />
        ))}
      </div>
    </section>
  );
}

export default PopularCategories;
