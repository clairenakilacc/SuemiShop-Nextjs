// BRAND VALIDATION
export const validateDescription = async (
  value: string,
): Promise<string | null> => {
  const trimmed = value.trim();

  if (!trimmed) return "Description is required";

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

//AMOUNT VALIDATION
export const validateAmount = (value: string): string | null => {
  const trimmed = value.trim();

  if (!trimmed) return "Amount is required";

  if (/,/.test(trimmed)) return "No commas allowed";

  if (!/^\d+(\.\d+)?$/.test(trimmed)) {
    return "Must be a valid number";
  }

  const num = Number(trimmed);

  if (num < 0) return "Must be non-negative";

  return null;
};
