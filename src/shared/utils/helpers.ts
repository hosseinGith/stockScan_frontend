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

export const formatPrice = (price: number | string): string => {
  return Number(price).toLocaleString("fa-IR") + " تومان";
};

export const formatDateToPersian = (dateStr: string | null): string => {
  if (!dateStr) return "نامشخص";
  return new Date(dateStr).toLocaleDateString("fa-IR");
};

export const generateId = (): string => {
  return Date.now().toString();
};
export function faToEnNumbers(str: string): string {
  const map: Record<string, string> = {
    "۰": "0",
    "۱": "1",
    "۲": "2",
    "۳": "3",
    "۴": "4",
    "۵": "5",
    "۶": "6",
    "۷": "7",
    "۸": "8",
    "۹": "9",
  };
  return str.replace(/[۰-۹]/g, (m) => map[m]);
}
