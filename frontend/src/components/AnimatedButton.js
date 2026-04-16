import React from 'react';
import { motion } from 'framer-motion';
import { useBounce } from '../hooks/useAnimation';

/**
 * AnimatedButton Component
 * React-exclusive: uses custom React hook (useBounce) for state management
 * Provides bounce animation on click with optimistic UI feedback
 */
const AnimatedButton = ({
  children,
  onClick,
  className = '',
  variant = 'primary',
  loading = false,
  disabled = false,
}) => {
  const { isBouncing, trigger } = useBounce();

  const handleClick = (e) => {
    if (!disabled && !loading) {
      trigger();
      onClick?.(e);
    }
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
    bounce: {
      scale: [1, 0.95, 1.05, 1],
      transition: { duration: 0.4 },
    },
  };

  const variantClasses = {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    success: 'bg-green-500 hover:bg-green-600 text-white',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
  };

  return (
    <motion.button
      variants={buttonVariants}
      initial="initial"
      whileHover={!disabled ? 'hover' : 'initial'}
      whileTap={!disabled ? 'tap' : 'initial'}
      animate={isBouncing ? 'bounce' : 'initial'}
      onClick={handleClick}
      disabled={disabled || loading}
      className={`
        px-4 py-2 rounded-lg font-semibold transition-all
        ${variantClasses[variant]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      {loading ? (
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          ⟳
        </motion.span>
      ) : (
        children
      )}
    </motion.button>
  );
};

export default AnimatedButton;
