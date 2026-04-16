import React from 'react';
import { motion } from 'framer-motion';
import { useCountUp } from '../hooks/useAnimation';

/**
 * AnimatedCounter Component
 * React-exclusive: uses custom React hook (useCountUp) for animated counting
 * Great for displaying statistics or achievements with smooth animation
 */
const AnimatedCounter = ({
  target = 100,
  duration = 2000,
  prefix = '',
  suffix = '',
  label = '',
}) => {
  const count = useCountUp(target, duration);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center"
    >
      <motion.div
        className="text-4xl font-bold text-blue-600"
        key={count}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {prefix}
        {count}
        {suffix}
      </motion.div>
      {label && (
        <motion.p
          className="text-gray-600 mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {label}
        </motion.p>
      )}
    </motion.div>
  );
};

export default AnimatedCounter;
