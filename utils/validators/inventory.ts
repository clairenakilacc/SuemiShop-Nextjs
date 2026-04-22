// SUPPLIER VALIDATION
export const validateSupplierName = async (
  value: string,
): Promise<string | null> => {
  const trimmed = value.trim();

  if (!trimmed) return "Supplier is required";

  if (trimmed.length > 50) return "Must be 50 characters or less";

  // allow letters, spaces, and period only
  if (!/^[a-zA-Z. ]+$/.test(trimmed)) {
    return "Only letters, spaces, and period allowed";
  }

  // no double spaces
  if (/\s{2,}/.test(trimmed)) return "Too many spaces";

  // no double period
  if (/\.\./.test(trimmed)) return "No consecutive periods allowed";

  const clean = trimmed.replace(/[.\s]/g, "").toLowerCase();

  const vowels = "aeiou";

  let vowelCount = 0;
  let consonantCount = 0;

  for (const char of clean) {
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

// PHONE VALIDATION
export const validatePhoneNumber = (value: string): string | null => {
  const trimmed = value.trim();

  if (!trimmed) return "Phone number is required";

  if (!/^\d+$/.test(trimmed)) return "Only numbers allowed";

  if (trimmed.length !== 11) return "Must be exactly 11 digits";

  if (!/^09\d{9}$/.test(trimmed)) {
    return "Must start with 09";
  }

  return null;
};
