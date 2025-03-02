
import React, { useState, useEffect } from 'react';
import { Clock, Tag } from 'lucide-react';

const DiscountBanner = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  useEffect(() => {
    const calculateTimeLeft = () => {
      // Get the end of the month
      const now = new Date();
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      const difference = endOfMonth.getTime() - now.getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };
    
    // Calculate immediately
    calculateTimeLeft();
    
    // Then update every second
    const timer = setInterval(calculateTimeLeft, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  return (
    <div className="py-2 px-4 bg-primary text-primary-foreground flex flex-col sm:flex-row items-center justify-center gap-2">
      <div className="flex items-center">
        <Tag className="h-4 w-4 mr-2 animate-pulse" />
        <span className="font-medium">Limited Time: 50% OFF All Courses!</span>
      </div>
      <div className="flex items-center">
        <Clock className="h-4 w-4 mr-2" />
        <span className="font-medium">Offer ends in:</span>
        <div className="countdown ml-2">
          <span className="countdown-item">{timeLeft.days}</span>
          <span className="countdown-separator">:</span>
          <span className="countdown-item">{String(timeLeft.hours).padStart(2, '0')}</span>
          <span className="countdown-separator">:</span>
          <span className="countdown-item">{String(timeLeft.minutes).padStart(2, '0')}</span>
        </div>
      </div>
    </div>
  );
};

export default DiscountBanner;
