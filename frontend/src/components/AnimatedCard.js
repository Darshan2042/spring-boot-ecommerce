import React from 'react';
import { motion } from 'framer-motion';
import { useScrollAnimation, useHoverAnimation } from '../hooks/useAnimation';

/**
 * AnimatedCard Component
 * React-exclusive feature combining React hooks, Suspense-like patterns, and Framer Motion
 * Creates smooth entrance, hover, and exit animations using React state management
 */
const AnimatedCard = ({
  children,
  index = 0,
  delay = 0,
  onHover,
  className = '',
  variant = 'default',
}) => {
  const { ref, isVisible } = useScrollAnimation();
  const { handleMouseEnter, handleMouseLeave } = useHoverAnimation();

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: delay + index * 0.1,
        ease: 'easeOut',
      },
    },
    hover: {
      y: -8,
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      transition: { duration: 0.3, ease: 'easeOut' },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isVisible ? 'visible' : 'hidden'}
      whileHover="hover"
      variants={cardVariants}
      onMouseEnter={() => {
        handleMouseEnter(index);
        onHover?.(true);
      }}
      onMouseLeave={() => {
        handleMouseLeave();
        onHover?.(false);
      }}
      className={`bg-white rounded-lg transition-all ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCard;
