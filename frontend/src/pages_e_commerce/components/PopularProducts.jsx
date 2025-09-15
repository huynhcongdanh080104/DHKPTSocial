import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";
import CategoryTabs from "./CategoryTabs";

const PopularProducts = () => {
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("");
  const sliderRef = useRef(null);

  useEffect(() => {
    if (activeCategory) {
      axios.get(`https://dhkshop.onrender.com/product/category/${activeCategory}`)
        .then((response) => {
          const sortedProducts = response.data.sort((a, b) => b.soldQuantity - a.soldQuantity);
          setProducts(sortedProducts);
        })
        .catch((error) => {
          console.error("Lỗi khi lấy sản phẩm:", error);
        });
    }
  }, [activeCategory]);

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };
  
  const scrollRight = () => {
    if (sliderRef.current) {
      const container = sliderRef.current;
      const maxScrollLeft = container.scrollWidth - container.clientWidth;
  
      // Đảm bảo không scroll quá giới hạn
      const newScrollLeft = Math.min(container.scrollLeft + 300, maxScrollLeft);
      container.scrollTo({ left: newScrollLeft, behavior: "smooth" });
    }
  };
  

  return (
    <section className="popular-products-container flex flex-col gap-5 max-md:flex-col">
      <main className="w-full max-md:ml-0 max-md:w-full ">
        <div className="w-full max-md:mt-10 max-md:max-w-full">
          <header className="flex flex-wrap w-full max-md:max-w-full gap-5">
            <h2 className="grow shrink self-start text-3xl font-medium tracking-tighter text-black">
              SẢN PHẨM PHỔ BIẾN
            </h2>
            <CategoryTabs activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
          </header>

          <div className="relative w-full">
            {products.length >= 5 && (
              <button 
                onClick={scrollLeft} 
                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-300 p-3 rounded-full shadow-md hover:bg-gray-400 transition duration-200 flex items-center justify-center w-10 h-10"
              >
                &#10094;
              </button>
            )}

            <section 
              ref={sliderRef} 
              className="flex overflow-x-auto gap-x-4 custom-scrollbar w-full"
              style={{ scrollbarWidth: "none", overflowX: "scroll", whiteSpace: "nowrap", paddingRight: "15px" }}
            >
              {products.map((product) => (
                <div key={product._id} className="inline-block w-[240px]">
                  <ProductCard
                    id={product._id} 
                    imageId={product.images[0]}
                    name={product.name}
                    price={`₫ ${product.price}`}
                    salesCount={`Đã bán ${product.soldQuantity}`}
                    rating={product.rating}
                  />
                </div>
              ))}
            </section>

            {products.length >= 5 && (
              <button 
                onClick={scrollRight} 
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-300 p-3 rounded-full shadow-md hover:bg-gray-400 transition duration-200 flex items-center justify-center w-10 h-10"
              >
                &#10095;
              </button>
            )}
          </div>
        </div>
      </main>
    </section>
  );
};

export default PopularProducts;
