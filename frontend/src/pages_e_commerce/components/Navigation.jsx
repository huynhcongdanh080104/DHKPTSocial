import React, { useEffect, useState } from "react";
import axios from "axios";
import CategoryDropdown from "./CategoryDropdown";
import NavItem from "./NavItem";

function Navigation() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("https://dhkshop.onrender.com/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <nav className="flex items-center px-10 py-4 bg-white max-md:px-5 max-md:py-2.5">
      <div className="mr-16 max-sm:w-full">
        <CategoryDropdown />
      </div>
      <div className="flex gap-20 max-sm:hidden">
        {categories.map((category) => (
          <NavItem
            key={category._id}
            icon={category.image}
            text={category.name.toUpperCase()}
            alt={category.name}
          />
        ))}
      </div>
    </nav>
  );
}

export default Navigation;
