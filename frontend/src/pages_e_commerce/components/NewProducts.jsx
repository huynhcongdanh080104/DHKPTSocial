import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";

const NewProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get("https://dhkshop.onrender.com/product/new")
      .then((response) => {
        const sortedProducts = response.data.sort((a, b) => 
          new Date(b.publishDate) - new Date(a.publishDate)
        );
        setProducts(sortedProducts);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy sản phẩm mới:", error);
      });
  }, []);

  return (
    <section className="new-products-container flex flex-col gap-5 max-md:flex-col mt-10">
      <main className="w-full max-md:ml-0 max-md:w-full">
        <div className="w-full max-md:mt-10 max-md:max-w-full">
          <header className="flex flex-wrap w-full max-md:max-w-full gap-5">
            <h2 className="grow shrink self-start text-3xl font-medium tracking-tighter text-black">
              SẢN PHẨM MỚI
            </h2>
          </header>

          <section className="flex flex-wrap justify-start gap-x-4 gap-y-5 mt-4">
            {products.map((product) => (
              <div key={product._id} className="w-[240px]">
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
        </div>
      </main>
    </section>
  );
};

export default NewProducts;
