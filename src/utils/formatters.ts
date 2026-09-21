/**
  Format currency and generate order IDs
 */

export const formatPrice = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

export const generateOrderId = (existingOrdersCount: number): string => {
  const nextNum = existingOrdersCount + 1;
  const padded = String(nextNum).padStart(4, '0');
  return `TW2026${padded}`;
};
