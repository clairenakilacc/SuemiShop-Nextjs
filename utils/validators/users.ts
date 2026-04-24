export const validateName = (value: string) => {
  if (!value.trim()) return "Name is required";
  if (value.length < 2) return "Name is too short";
  return null;
};

export const validateEmail = (value: string) => {
  if (!value.trim()) return null; // optional field

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) return "Invalid email format";

  return null;
};

export const validatePassword = (value: string) => {
  if (!value) return "Password is required";
  if (value.length < 6) return "Password must be at least 6 characters";
  return null;
};

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
