import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface FloatingIconProps {
  icon: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  className?: string;
}

export default function FloatingIcon({
  icon,
  size = 'md',
  color = 'text-primary-500',
  className = '',
}: FloatingIconProps) {
  const iconRef = useRef<HTMLDivElement>(null);

  // Determine the size class
  const sizeClass = {
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-5xl',
    xl: 'text-7xl',
  }[size];

  // Floating animation
  const floatingAnimation = {
    y: [0, -10, 0],
    rotate: [0, 5, 0],
  };

  useEffect(() => {
    // Add parallax effect on mouse move
    const handleMouseMove = (e: MouseEvent) => {
      if (!iconRef.current) return;
      
      // Calculate mouse position relative to the center of the screen
      const x = (e.clientX / window.innerWidth - 0.5) * 10;
      const y = (e.clientY / window.innerHeight - 0.5) * 10;
      
      // Apply a subtle transformation
      iconRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) rotateX(${y}deg) rotateY(${-x}deg)`;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <motion.div
      ref={iconRef}
      className={`relative inline-flex justify-center items-center ${sizeClass} ${color} ${className}`}
      animate={floatingAnimation}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      style={{ 
        transformStyle: 'preserve-3d',
        transition: 'transform 0.1s ease' 
      }}
    >
      {/* Shadow effect */}
      <div className="absolute -bottom-2 left-0 w-full h-1 bg-current opacity-20 blur-sm rounded-full transform scale-x-75"></div>
      
      {/* Icon */}
      <div className="transform translateZ(10px)">{icon}</div>
    </motion.div>
  );
}