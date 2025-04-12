import { useEffect } from 'react';
import { useAnimation, motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface ScrollAnimationProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
  delay?: number;
  duration?: number;
  threshold?: number;
  once?: boolean;
}

export default function ScrollAnimation({
  children,
  direction = 'up',
  className = '',
  delay = 0,
  duration = 0.5,
  threshold = 0.1,
  once = true,
}: ScrollAnimationProps) {
  const controls = useAnimation();
  const ref = useRef(null);
  // Use custom amount for threshold in isInView
  const isInView = useInView(ref, { 
    once, 
    amount: threshold // Using 'amount' instead of 'threshold' for framer-motion
  });

  // Determine the initial and animate values based on direction
  const getDirectionValues = () => {
    switch (direction) {
      case 'up':
        return { initial: { y: 40, opacity: 0 }, animate: { y: 0, opacity: 1 } };
      case 'down':
        return { initial: { y: -40, opacity: 0 }, animate: { y: 0, opacity: 1 } };
      case 'left':
        return { initial: { x: 40, opacity: 0 }, animate: { x: 0, opacity: 1 } };
      case 'right':
        return { initial: { x: -40, opacity: 0 }, animate: { x: 0, opacity: 1 } };
      default:
        return { initial: { y: 40, opacity: 0 }, animate: { y: 0, opacity: 1 } };
    }
  };

  const { initial, animate } = getDirectionValues();

  useEffect(() => {
    if (isInView) {
      controls.start(animate);
    }
  }, [isInView, controls, animate]);

  return (
    <motion.div
      ref={ref}
      initial={initial}
      animate={controls}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1], // Custom easing for a smooth effect
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}