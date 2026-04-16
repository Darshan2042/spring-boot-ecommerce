import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useBounce } from '../hooks/useAnimation';

/**
 * ShoppingCartBadge Component
 * React-exclusive: uses custom React hooks for animation state (useBounce)
 * Animates when cart count changes with bounce effect
 */
const ShoppingCartBadge = ({ count = 0, onClick }) => {
  const { isBouncing, trigger } = useBounce();
  const [prevCount, setPrevCount] = useState(count);

  useEffect(() => {
    if (count !== prevCount && count > 0) {
      trigger();
      setPrevCount(count);
    }
  }, [count, prevCount, trigger]);

  const badgeVariants = {
    initial: { scale: 1, rotate: 0 },
    bounce: {
      scale: [1, 1.3, 0.8, 1.2, 1],
      rotate: [0, -10, 10, -10, 0],
      transition: { duration: 0.5 },
    },
  };

  return (
    <motion.button
      onClick={onClick}
      className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <span className="text-2xl">🛒</span>
      {count > 0 && (
        <motion.div
          className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold"
          initial={{ scale: 0 }}
          animate={isBouncing ? 'bounce' : { scale: 1 }}
          variants={badgeVariants}
        >
          {count > 99 ? '99+' : count}
        </motion.div>
      )}
    </motion.button>
  );
};

export default ShoppingCartBadge;
