
import React, { useState, useEffect, useRef } from 'react';

interface AnimateOnScrollProps {
  children: React.ReactNode;
  animation?: 'fade-in' | 'slide-in-left' | 'slide-in-right' | 'zoom-in';
  delay?: number;
  threshold?: number;
  className?: string;
}

const ScrollAnimation: React.FC<AnimateOnScrollProps> = ({
  children,
  animation = 'fade-in',
  delay = 0,
  threshold = 0.1,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const current = domRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold }
    );
    
    if (current) {
      observer.observe(current);
    }
    
    return () => {
      if (current) {
        observer.unobserve(current);
      }
    };
  }, [threshold]);

  const animationClass = isVisible ? `${animation} visible` : animation;
  const delayStyle = delay ? { transitionDelay: `${delay}ms` } : {};

  return (
    <div 
      ref={domRef}
      className={`${animationClass} ${className}`}
      style={delayStyle}
    >
      {children}
    </div>
  );
};

export default ScrollAnimation;
