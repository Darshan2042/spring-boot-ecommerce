import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * PulseNotification Component
 * React-exclusive: uses useState for notification management with Framer Motion animations
 * Shows animated notifications with auto-dismiss using React effect cleanup
 */
const PulseNotification = ({
  message,
  type = 'info',
  duration = 3000,
  onDismiss,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!message || !isVisible) return;

    const timer = setTimeout(() => {
      setIsVisible(false);
      onDismiss?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [message, isVisible, duration, onDismiss]);

  const notificationVariants = {
    initial: { opacity: 0, x: 300, y: 0 },
    animate: { opacity: 1, x: 0, y: 0 },
    exit: { opacity: 0, x: 300, y: 0 },
  };

  const typeClasses = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500',
  };

  return (
    <AnimatePresence>
      {isVisible && message && (
        <motion.div
          initial="initial"
          animate="animate"
          exit="exit"
          variants={notificationVariants}
          transition={{ type: 'spring', stiffness: 100, damping: 15 }}
          className={`
            fixed bottom-6 right-6 px-6 py-4 rounded-lg text-white font-semibold
            shadow-lg z-50 max-w-sm
            ${typeClasses[type]}
          `}
        >
          <div className="flex items-center justify-between gap-4">
            <span>{message}</span>
            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsVisible(false)}
              className="text-white text-lg"
            >
              ✕
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PulseNotification;
