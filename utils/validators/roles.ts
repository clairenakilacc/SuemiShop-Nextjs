import { supabase } from "@/lib/supabase";

//ROLE VALIDATION
export const validateRoleName = async (
  value: string,
  excludeId?: number,
): Promise<string | null> => {
  const trimmed = value.trim();

  if (!trimmed) return "Role name is required";
  if (trimmed.length > 50) return "Must be 50 characters or less";

  // allow letters, spaces, and period only
  if (!/^[a-zA-Z. ]+$/.test(trimmed)) {
    return "Only letters, spaces, and period allowed";
  }

  if (/\s{2,}/.test(trimmed)) return "Too many spaces";
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

  // 🔥 DB duplicate check
  let query = supabase.from("roles").select("id").ilike("name", trimmed);

  if (excludeId) {
    query = query.neq("id", excludeId);
  }

  const { data, error } = await query;

  if (error) return error.message;

  if (data && data.length > 0) {
    return "Role already exists";
  }

  return null;
};
