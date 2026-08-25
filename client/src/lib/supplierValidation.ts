export function isAliExpressProductUrl(value: string) {
  return /^https?:\/\/(?:[^/]+\.)?aliexpress\.com\//i.test(value);
}

export function isValidSupplierCost(value: string) {
  return /^\d+(?:\.\d{1,2})?$/.test(value) && Number(value) >= 0;
}

export function calculateIndicativeMargin(retailPrice: number, supplierCost: number) {
  if (!Number.isFinite(retailPrice) || !Number.isFinite(supplierCost) || retailPrice <= 0) return null;
  return { amount: retailPrice - supplierCost, percent: ((retailPrice - supplierCost) / retailPrice) * 100 };
}
