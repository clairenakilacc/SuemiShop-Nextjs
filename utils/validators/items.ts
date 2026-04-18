// BRAND VALIDATION
export const validateBrand = async (value: string): Promise<string | null> => {
  const trimmed = value.trim();

  if (!trimmed) return "Brand is required";

  if (trimmed.length > 20) return "Must be 20 characters or less";

  // allow letters + numbers + single spaces only
  if (!/^[a-zA-Z0-9 ]+$/.test(trimmed)) return "No special characters allowed";

  if (/\s{2,}/.test(trimmed)) return "Too many spaces";

  const clean = trimmed.replace(/\s+/g, "").toLowerCase();

  const vowels = "aeiou";

  let vowelCount = 0;
  let consonantCount = 0;

  for (const char of clean) {
    if (/[0-9]/.test(char)) {
      vowelCount = 0;
      consonantCount = 0;
      continue;
    }

    if (vowels.includes(char)) {
      vowelCount++;
      consonantCount = 0;
    } else {
      consonantCount++;
      vowelCount = 0;
    }

    if (vowelCount >= 4) return "No 4 consecutive vowels allowed";

    if (consonantCount >= 4) return "No 4 consecutive consonants allowed";
  }

  return null;
};

//ORDER ID VALIDATION
export const validateOrderId = (value: string): string | null => {
  const trimmed = value.trim().toUpperCase();

  // required
  if (!trimmed) return "Order ID is required";

  // must be exactly 4 characters
  if (trimmed.length !== 4) {
    return "Order ID must be exactly 4 characters";
  }

  // only letters + numbers allowed
  if (!/^[A-Z0-9]+$/.test(trimmed)) {
    return "Only letters and numbers allowed (no special characters)";
  }

  return null;
};

//LIVE SELLER VALIDATION
export const validateLiveSeller = (value: string): string | null => {
  if (!value) return "Live Seller is required";
  return null;
};

//CATEGORY VALIDATION
export const validateCategory = (value: string): string | null => {
  const trimmed = value.trim();

  if (!trimmed) return "Category is required";

  return null;
};

//MINED FROM VALIDATION
export const validateMinedFrom = (value: string): string | null => {
  if (!value) return "Mined From is required";
  return null;
};

// SELLING PRICE VALIDATION
export const validateSellingPrice = (value: string): string | null => {
  const trimmed = value.trim();

  if (!trimmed) return "Selling Price is required";

  if (/,/.test(trimmed)) return "No commas allowed";

  if (!/^\d+(\.\d+)?$/.test(trimmed)) {
    return "Must be a valid number";
  }

  const num = Number(trimmed);

  if (num < 0) return "Must be non-negative";

  return null;
};

//CAPITAL VALIDATION
export const validateCapital = (value: string): string | null => {
  const trimmed = value.trim();

  if (!trimmed) return "Capital is required";

  if (/,/.test(trimmed)) return "No commas allowed";

  if (!/^\d+(\.\d+)?$/.test(trimmed)) {
    return "Must be a valid number";
  }

  const num = Number(trimmed);

  if (num < 0) return "Must be non-negative";

  return null;
};

//QUANTITY VALIDATION
export const validateQuantity = (value: string): string | null => {
  const trimmed = value.trim();

  if (!trimmed) return "Quantity is required";

  if (!/^\d+$/.test(trimmed)) {
    return "Must be a whole number";
  }

  const num = Number(trimmed);

  if (num < 1) return "Must start at 1";

  return null;
};
