import React, { useState, useEffect } from 'react';

const Clock = () => {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const days = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"];
      const formattedTime = `${days[now.getDay()]}, ${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} - ${now.getHours()} giờ ${now.getMinutes()} phút ${now.getSeconds()} giây`;
      setCurrentTime(formattedTime);
    };
    
    const interval = setInterval(updateClock, 1000);
    updateClock();
    return () => clearInterval(interval);
  }, []);

  return <span className="text-gray-600 text-sm">{currentTime}</span>;
};

export default Clock;