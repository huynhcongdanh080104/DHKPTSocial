import React from 'react';
import Header from '../components/Header';
import PopularCategories from '../components/PopularCategories';
import PopularProducts from '../components/PopularProducts';
import NewProducts from '../components/NewProducts';
import Advertisement from '../components/Advertisement';
import Ads1 from '../../../public/Ads1.jpg'
const CustomerHomePage = () => {
  return (
    <div className="overflow-x-hidden ">
      <Header />
      <div className="w-screen">
        <div className="w-full h-full flex justify-center h-96 mt-20 mb-9">
          <img src={Ads1} alt="" classname=' w-full h-full'/>
        </div>
      </div>
      <PopularCategories />
      <div className="container mx-auto my-9 flex gap-5 max-md:flex-col">
        <main className="min-w-[100%] max-md:ml-0 max-md:w-full ml-11">
          <PopularProducts />
          <NewProducts />
        </main>
      </div>
    </div>
  );
};

export default CustomerHomePage;