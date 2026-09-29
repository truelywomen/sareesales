/**
  Date utilities for TruelyWomen order calculation & display.
 */

export const calculateDeliveryDate = (orderDateISO: string): string => {
  const date = new Date(orderDateISO);
  date.setDate(date.getDate() + 7);
  return date.toISOString();
};

export const formatDate = (dateISO: string): string => {
  if (!dateISO) return '';
  const date = new Date(dateISO);
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(date);
};

export const formatDateTime = (dateISO: string): string => {
  if (!dateISO) return '';
  const date = new Date(dateISO);
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

export const isToday = (dateISO: string): boolean => {
  if (!dateISO) return false;
  const today = new Date();
  const date = new Date(dateISO);
  return (
    today.getFullYear() === date.getFullYear() &&
    today.getMonth() === date.getMonth() &&
    today.getDate() === date.getDate()
  );
};
