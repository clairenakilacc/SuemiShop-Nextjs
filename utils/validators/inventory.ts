// DATE ARRIVED
export const validateDateArrived = (value: string): string | null => {
  if (!value) return "Date arrived is required";
  return null;
};

// BOX NUMBER
export const validateBoxNumber = (value: string): string | null => {
  const trimmed = value.trim();

  if (!trimmed) return "Box number is required";

  if (trimmed.length > 20) return "Max 20 characters";

  if (!/^[a-zA-Z0-9 ]+$/.test(trimmed)) return "No special characters allowed";

  const clean = trimmed.replace(/\s+/g, "").toLowerCase();

  const vowels = "aeiou";
  let v = 0;
  let c = 0;

  for (const ch of clean) {
    if (vowels.includes(ch)) {
      v++;
      c = 0;
    } else {
      c++;
      v = 0;
    }

    if (v >= 10) return "No 3 consecutive vowels";
    if (c >= 10) return "No 3 consecutive consonants";
  }

  return null;
};

// QUANTITY
export const validateQuantity = (value: string): string | null => {
  if (!value) return "Quantity is required";

  if (!/^\d+(\.\d+)?$/.test(value)) return "Must be a number";

  return null;
};

// PRICE
export const validatePrice = (value: string): string | null => {
  if (!value) return "Price is required";

  if (!/^\d+(\.\d+)?$/.test(value)) return "Must be a number";

  return null;
};
