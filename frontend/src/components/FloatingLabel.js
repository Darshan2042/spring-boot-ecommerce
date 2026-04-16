import React, { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * FloatingLabel Component
 * React-exclusive: uses React state (useState) to manage focus state
 * Provides smooth floating label animation on focus/blur
 */
const FloatingLabel = ({ label, type = 'text', value, onChange, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value && value.trim() !== '';

  const labelVariants = {
    floating: {
      y: -30,
      scale: 0.85,
      transition: { duration: 0.2 },
    },
    default: {
      y: 0,
      scale: 1,
      transition: { duration: 0.2 },
    },
  };

  return (
    <div className="relative mb-4">
      <input
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-transparent focus:outline-none focus:border-blue-500 transition-colors"
        {...props}
      />
      <motion.label
        animate={isFocused || hasValue ? 'floating' : 'default'}
        variants={labelVariants}
        className="absolute left-4 top-4 text-gray-600 pointer-events-none origin-left"
      >
        {label}
      </motion.label>
    </div>
  );
};

export default FloatingLabel;
