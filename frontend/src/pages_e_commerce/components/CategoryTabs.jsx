import React, { useEffect, useState } from "react";
import axios from "axios";

const CategoryTabs = ({ activeCategory, setActiveCategory }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get("https://dhkshop.onrender.com/categories")
      .then((response) => {
        setCategories(response.data);
        if (response.data.length > 0) {
          setActiveCategory(response.data[0].name);
        }
      })
      .catch((error) => {
        console.error("Lỗi khi lấy danh mục:", error);
      });
  }, []);

  return (
    <nav className="flex flex-wrap gap-10 text-xl font-semibold tracking-tighter mb-5">
      <div className="flex flex-wrap">
        {categories.map((category) => (
          <button
            key={category._id}
            onClick={() => setActiveCategory(category.name)}
            className={`px-6 pb-4 border-b-2 transition-all ${
              activeCategory === category.name
                ? "text-blue-500 border-blue-500"
                : "text-neutral-500 border-transparent"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default CategoryTabs;
