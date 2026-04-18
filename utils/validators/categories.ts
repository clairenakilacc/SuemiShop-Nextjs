export const validateCategoryDescription = (value: string): string | null => {
  const trimmed = value.trim();

  if (!trimmed) return "Description is required";

  if (trimmed.length > 20) return "Must be 20 characters or less";

  // letters and spaces only (NO numbers, NO symbols)
  if (!/^[a-zA-Z ]+$/.test(trimmed))
    return "No numbers or special characters allowed";

  // prevent multiple spaces
  if (/\s{2,}/.test(trimmed)) return "Too many spaces between words";

  // remove spaces and lowercase for pattern checking
  //no consecutive 3 vowels and consonants
  const clean = trimmed.replace(/\s+/g, "").toLowerCase();

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

    if (vowelCount >= 3) return "No 3 consecutive vowels allowed";

    if (consonantCount >= 3) return "No 3 consecutive consonants allowed";
  }

  return null;
};
