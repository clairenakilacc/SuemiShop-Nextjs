//NAME VALIDATION
export const validateName = (value: string): string | null => {
  const trimmed = value.trim();

  if (!trimmed) return "Name is required";

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

//EMAIL VALIDATION
export const validateEmail = (value: string): string | null => {
  const trimmed = value.trim();

  if (!trimmed) return null; // optional field

  // must be gmail only
  if (!trimmed.endsWith("@gmail.com")) {
    return "Email must be @gmail.com";
  }

  const localPart = trimmed.replace("@gmail.com", "");

  // only letters, numbers, and dots allowed
  if (!/^[a-zA-Z0-9.]+$/.test(localPart)) {
    return "Only letters, numbers, and dots are allowed";
  }

  // no consecutive dots
  if (localPart.includes("..")) {
    return "No consecutive dots allowed";
  }

  // cannot start or end with dot
  if (localPart.startsWith(".") || localPart.endsWith(".")) {
    return "Dot cannot be at start or end";
  }

  return null;
};

//PASSWORD VALIDATION
export const validatePassword = (value: string) => {
  if (!value) return "Password is required";
  if (value.length < 6) return "Password must be at least 6 characters";
  return null;
};

//ROLE VALIDATION
export const validateRole = (value: string) => {
  if (!value) return "Role is required";
  return null;
};

export const validateHourlyRate = (value: string) => {
  if (!value) return null;
  if (Number(value) < 0) return "Invalid hourly rate";
  return null;
};

export const validatePhone = (value: string) => {
  if (!value) return null;
  const regex = /^[0-9+()-\s]{7,}$/;
  if (!regex.test(value)) return "Invalid phone number";
  return null;
};
