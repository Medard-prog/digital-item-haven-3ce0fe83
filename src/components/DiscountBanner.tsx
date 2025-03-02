
import React, { useState, useEffect } from 'react';
import { Clock, Sparkles } from 'lucide-react';

const DiscountBanner = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  useEffect(() => {
    const calculateTimeLeft = () => {
      // Set target to end of current month
      const now = new Date();
      const targetDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      
      const difference = targetDate.getTime() - now.getTime();
      
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        setTimeLeft({ days, hours, minutes, seconds });
      }
    };
    
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  return (
    <div className="w-full bg-gradient-to-r from-purple-600 to-purple-800 text-white py-2 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-purple-500 opacity-30">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzBoLTIydjJoMjJ2LTJ6TTM2IDI2aC0yMnYyaDIydi0yek0zNiAyMmgtMjJ2MmgyMnYtMnpNNTQgMjBoLTJ2M2gtMnYtM2gtM3YtMmgzdi0zaDJ2M2gydjJ6Ii8+PC9nPjwvZz48L3N2Zz4=')]"></div>
      </div>
      
      <div className="content-container flex flex-wrap items-center justify-center text-sm sm:text-base gap-2 z-10 relative">
        <div className="flex items-center font-bold animate-pulse">
          <Sparkles className="h-4 w-4 mr-1" />
          <span>LIMITED TIME:</span>
          <Sparkles className="h-4 w-4 ml-1" />
        </div>
        
        <div className="font-medium">50% OFF All Digital Products</div>
        
        <div className="flex items-center ml-2 gap-1">
          <Clock className="h-4 w-4" />
          <div className="flex items-center space-x-1">
            <div className="bg-white/20 px-2 py-0.5 rounded">
              {String(timeLeft.days).padStart(2, '0')}
            </div>
            <span>:</span>
            <div className="bg-white/20 px-2 py-0.5 rounded">
              {String(timeLeft.hours).padStart(2, '0')}
            </div>
            <span>:</span>
            <div className="bg-white/20 px-2 py-0.5 rounded">
              {String(timeLeft.minutes).padStart(2, '0')}
            </div>
            <span>:</span>
            <div className="bg-white/20 px-2 py-0.5 rounded">
              {String(timeLeft.seconds).padStart(2, '0')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscountBanner;
