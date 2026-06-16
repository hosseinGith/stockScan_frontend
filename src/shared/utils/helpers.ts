export const today = new Date();
today.setHours(0, 0, 0, 0);

export const isExpired = (expiryDateStr: string | null): boolean => {
  if (!expiryDateStr) return false;
  return new Date(expiryDateStr) < today;
};

export const isExpiringSoon = (expiryDateStr: string | null): boolean => {
  if (!expiryDateStr) return false;
  const expiry = new Date(expiryDateStr);
  const diffDays = Math.ceil(
    (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );
  return diffDays <= 7 && diffDays >= 0;
};

export const formatPrice = (price: number): string => {
  return price.toLocaleString("fa-IR") + " تومان";
};

export const formatDateToPersian = (dateStr: string | null): string => {
  if (!dateStr) return "نامشخص";
  return new Date(dateStr).toLocaleDateString("fa-IR");
};

export const generateId = (): string => {
  return Date.now().toString();
};
