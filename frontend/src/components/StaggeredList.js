import React from 'react';
import { motion } from 'framer-motion';

/**
 * StaggeredList Component
 * React-exclusive: uses React children rendering with Framer Motion stagger animations
 * Perfect for animating lists of items with sequential entrance animations
 */
const StaggeredList = ({
  children,
  delay = 0,
  staggerDelay = 0.1,
  className = '',
  direction = 'vertical',
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      [direction === 'vertical' ? 'y' : 'x']: direction === 'vertical' ? 20 : 20,
    },
    visible: {
      opacity: 1,
      [direction === 'vertical' ? 'y' : 'x']: 0,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={className}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default StaggeredList;
