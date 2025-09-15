"use client";
import React, { useEffect, useState } from "react";
import HeaderTop from "./HeaderTop";
import Navigation from "./Navigation";

function Header() {
  const [showHeaderTop, setShowHeaderTop] = useState(true);
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsAtTop(currentScrollY < 50);

      if (currentScrollY > lastScrollY) {
        setShowHeaderTop(false);
      } else {
        setShowHeaderTop(true);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const headerTopHeight = 92; 
return (
  <>
    {/* HeaderTop */}
    <div
      className={`fixed top-0 left-0 w-full z-50 bg-white transition-all duration-300 ease-in-out transform ${
        showHeaderTop ? "translate-y-0 opacity-100" : "-translate-y-full opacity-100"
      }`}
    >
      <HeaderTop />
    </div>

    {/* Navigation */}
    <div
      className="fixed left-0 w-full z-40 bg-white border-b border-zinc-300 shadow-md transition-all duration-300"
      style={{ top: showHeaderTop ? `${headerTopHeight}px` : "0px" }}
    >
      <Navigation />
    </div>

    {/* Spacer */}
    <div style={{ paddingTop: `${headerTopHeight + 56}px` }} /> {/* 56 = chiều cao Navigation */}
  </>
);
}

export default Header;
