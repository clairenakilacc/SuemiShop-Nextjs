export const validateBoxNumber = (value: string): string | null => {
  const v = value.trim();
  if (!v) return "Box number is required";
  if (v.length > 20) return "Max 20 characters";
  return null;
};

export const validateQuantity = (value: string): string | null => {
  if (!value) return "Quantity is required";
  if (!/^\d+(\.\d+)?$/.test(value)) return "Must be a number";
  return null;
};

export const validatePrice = (value: string): string | null => {
  if (!value) return "Price is required";
  if (!/^\d+(\.\d+)?$/.test(value)) return "Must be a number";
  return null;
};

export const validateSupplier = (value: string): string | null => {
  if (!value) return "Supplier is required";
  return null;
};

export const validateCategory = (value: string): string | null => {
  if (!value) return "Category is required";
  return null;
};
