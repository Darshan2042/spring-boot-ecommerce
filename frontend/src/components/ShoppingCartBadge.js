import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useBounce } from '../hooks/useAnimation';
import { ShoppingCart } from 'lucide-react';

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
      aria-label={`Shopping cart with ${count} items`}
      className="relative inline-flex items-center justify-center rounded-2xl border border-slate-200/80 bg-white/75 p-3 text-slate-900 shadow-sm backdrop-blur transition"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <ShoppingCart size={22} strokeWidth={2.1} />
      {count > 0 && (
        <motion.div
          className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-teal-500 text-[11px] font-bold text-white shadow-lg"
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
