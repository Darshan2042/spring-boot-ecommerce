import React from 'react';
import { useAppContext } from '../context/AppContext';

const Notification = () => {
  const { notification } = useAppContext();

  if (!notification) return null;

  const bgColor =
    notification.type === 'success'
      ? 'bg-green-500'
      : notification.type === 'error'
      ? 'bg-red-500'
      : 'bg-yellow-500';

  return (
    <div
      className={`${bgColor} text-white px-6 py-3 rounded shadow-lg fixed top-4 right-4 z-50 animate-slideUp`}
    >
      {notification.message}
    </div>
  );
};

export default Notification;
