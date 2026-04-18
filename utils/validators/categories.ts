import { supabase } from "@/lib/supabase";

export const validateCategoryDescription = async (
  value: string,
  currentId?: string,
): Promise<string | null> => {
  const trimmed = value.trim();

  if (!trimmed) return "Description is required";

  if (trimmed.length > 20) return "Must be 20 characters or less";

  if (!/^[a-zA-Z ]+$/.test(trimmed))
    return "No numbers or special characters allowed";

  if (/\s{2,}/.test(trimmed)) return "Too many spaces between words";

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

    if (vowelCount >= 4) return "No 4 consecutive vowels allowed";

    if (consonantCount >= 4) return "No 4 consecutive consonants allowed";
  }

  // UNIQUE description
  const { data, error } = await supabase
    .from("categories")
    .select("id, description")
    .ilike("description", trimmed);

  if (error) return "Validation error";

  const exists = data?.some(
    (c) =>
      c.description.toLowerCase() === trimmed.toLowerCase() &&
      c.id !== currentId,
  );

  if (exists) return "Category already exists";

  return null;
};
