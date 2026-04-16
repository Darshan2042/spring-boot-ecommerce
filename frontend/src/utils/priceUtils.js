export const USD_TO_INR_RATE = 82.5;

export const formatINR = (value) => {
  const amount = parseFloat(value) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount * USD_TO_INR_RATE);
};
