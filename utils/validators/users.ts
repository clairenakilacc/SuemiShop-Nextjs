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

  if (!trimmed) return "Email is required";

  if (!trimmed.endsWith("@gmail.com")) {
    return "Email must be @gmail.com";
  }

  const local = trimmed.replace("@gmail.com", "");

  if (!/^[a-zA-Z0-9.]+$/.test(local)) {
    return "Only letters, numbers, and dots allowed";
  }

  if (local.includes("..")) return "No consecutive dots allowed";
  if (local.startsWith(".") || local.endsWith(".")) {
    return "Dot cannot be start or end";
  }

  return null;
};

//PASSWORD VALIDATION
export const validatePassword = (value: string): string | null => {
  if (!value.trim()) return "Password is required";
  if (value.length < 6) return "Password must be at least 6 characters";
  return null;
};

//ROLE VALIDATION
export const validateRole = (value: string): string | null => {
  if (!value) return "Role is required";
  return null;
};

//PHONE NUMBER VALIDATION
export const validatePhoneNumber = (value: string): string | null => {
  const trimmed = value.trim();

  if (!trimmed) return null;

  // must be exactly 11 digits
  if (!/^\d{11}$/.test(trimmed)) {
    return "Phone number must be exactly 11 digits";
  }

  // must start with 09
  if (!trimmed.startsWith("09")) {
    return "Phone number must start with 09";
  }

  return null;
};

//SSS NUMBER VALIDATION
export const validateSSSNumber = (value: string): string | null => {
  const trimmed = value.trim();

  if (!trimmed) return null;

  const cleaned = trimmed.replace(/[-\s]/g, "");

  if (!/^\d{10}$/.test(cleaned)) {
    return "SSS number must be exactly 10 digits";
  }

  return null;
};

//PHILHEALTH NUMBER VALIDATION
export const validatePhilHealthNumber = (value: string): string | null => {
  const trimmed = value.trim();

  if (!trimmed) return null;

  const cleaned = trimmed.replace(/[-\s]/g, "");

  if (!/^\d{12}$/.test(cleaned)) {
    return "PhilHealth number must be exactly 12 digits";
  }

  return null;
};

//PAGIBIG NUMBER VALIDATION
export const validatePagIbigNumber = (value: string): string | null => {
  const trimmed = value.trim();

  if (!trimmed) return null;

  const cleaned = trimmed.replace(/[-\s]/g, "");

  if (!/^\d{12}$/.test(cleaned)) {
    return "Pag-IBIG number must be exactly 12 digits";
  }

  return null;
};

//HOURLY RATE VALIDATION
export const validateHourlyRate = (value: string): string | null => {
  const trimmed = value.trim();

  if (!trimmed) return "Hourly rate is required";

  const num = Number(trimmed);
  if (isNaN(num)) return "Invalid hourly rate";
  if (num < 0) return "Hourly rate cannot be negative";

  return null;
};

//DAILY RATE VALIDATION
export const validateDailyRate = (value: string): string | null => {
  const trimmed = value.trim();

  if (!trimmed) return "Daily rate is required";

  const num = Number(trimmed);
  if (isNaN(num)) return "Invalid daily rate";
  if (num < 0) return "Daily rate cannot be negative";

  return null;
};

//IS EMPLOYEE VALIDATION
export const validateIsEmployee = (value: string): string | null => {
  if (value !== "true" && value !== "false") {
    return "Employee status is required";
  }

  return null;
};

//IS LIVE SELLER VALIDATION
export const validateIsLiveSeller = (value: string): string | null => {
  if (value !== "true" && value !== "false") {
    return "Live seller status is required";
  }

  return null;
};
