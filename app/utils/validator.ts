import toast from "react-hot-toast";
import { Role } from "../types";
import { supabase } from "@/lib/supabase";

/**
 * Map role name to ID
 */
export const mapRoleNameToId = (
  roles: Role[],
  roleName: string
): string | undefined => {
  const role = roles.find((r) => r.name === roleName);
  if (!role) {
    toast.error(`Role not created: "${roleName}"`);
    return undefined;
  }
  return role.id;
};

/**
 * Remove commas and parse string/number to float
 */
export const parseNumber = (
  val: string | number | null | undefined
): number => {
  if (val === null || val === undefined) return 0;
  if (typeof val === "number") return val;
  return parseFloat(val.replace(/,/g, "")) || 0;
};

/**
 * Format number as string with fixed decimals
 */
export const formatNumberForText = (val: any, decimals = 2): string | null => {
  if (val === null || val === undefined) return null;
  if (typeof val === "number") return val.toFixed(decimals);
  if (!isNaN(Number(val))) return Number(val).toFixed(decimals);
  return String(val);
};

/**
 * Format ISO date string to MM-DD-YYYY
 */
export const formatDate = (dateStr?: string): string => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${mm}-${dd}-${yyyy}`;
};

/**
 * Apply discount to selling price
 */
export const applyDiscount = (
  selling_price: string,
  discount: string
): string => {
  const sp = parseNumber(selling_price);
  const dc = parseNumber(discount);
  return (sp - dc).toFixed(2);
};

/**
 * Calculate order income
 */
export const calculateOrderIncome = (
  selling_price: string,
  shoppee_commission: string
): string => {
  const sp = parseNumber(selling_price);
  const sc = parseNumber(shoppee_commission);
  return (sp - sc).toFixed(2);
};

/**
 * Calculate commission rate %
 */
export const calculateCommissionRate = (
  selling_price: string,
  shoppee_commission: string
): string => {
  const sp = parseNumber(selling_price);
  const sc = parseNumber(shoppee_commission);
  if (sp === 0) return "0.00";
  return ((sc / sp) * 100).toFixed(2); // e.g., 60 / 1000 => 6.00
};

/**
 * Parse Excel date (number, Date object, or string) to ISO string
 */
export const parseExcelDate = (value: any): string | undefined => {
  if (!value) return undefined;

  // Excel serial number
  if (typeof value === "number") {
    const date = new Date(Math.round((value - 25569) * 86400 * 1000));
    return date.toISOString();
  }

  // Already a Date object
  if (value instanceof Date) return value.toISOString();

  // String parsing
  if (typeof value === "string") {
    let parsed = new Date(value);
    if (!isNaN(parsed.getTime())) return parsed.toISOString();

    // fallback: dd-mm-yyyy or dd/mm/yyyy
    const match = value.match(/(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
    if (match) {
      const [_, day, month, year] = match;
      parsed = new Date(`${year}-${month}-${day}`);
      if (!isNaN(parsed.getTime())) return parsed.toISOString();
    }
  }

  console.warn("Unrecognized date format:", value);
  return undefined;
};

/**
 * Save calculated fields to Supabase for a single item
 */
export const saveCalculatedFields = async (item: {
  id: string;
  selling_price: string;
  shoppee_commission: string;
}) => {
  const order_income = calculateOrderIncome(
    item.selling_price,
    item.shoppee_commission
  );
  const commission_rate = calculateCommissionRate(
    item.selling_price,
    item.shoppee_commission
  );

  const { error } = await supabase
    .from("items")
    .update({ order_income, commission_rate })
    .eq("id", item.id);

  if (error) toast.error(error.message);
};

/**
 * Format ISO date string to MM-DD-YY, it will show dates without timezone in table
 */
export const formatDateShort = (dateStr?: string): string => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yy = String(d.getFullYear()).slice(-2); // last 2 digits
  return `${mm}-${dd}-${yy}`;
};

/**
 * Format timestamp string to MM-DD-YY text (no timezone). to be used in date filter cause supa is timestampz
 */
export const dateNoTimezone = (timestamp?: string) => {
  if (!timestamp) return "";
  const d = new Date(timestamp);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yy = String(d.getFullYear()).slice(-2); // last 2 digits
  return `${mm}-${dd}-${yy}`;
};

//the text are parsed to number, in dashboard statwidget
export const textToNumber = (
  val: string | number | null | undefined
): number => {
  if (val === null || val === undefined) return 0;
  if (typeof val === "number") return val;

  // Clean string: remove commas, trim spaces
  const cleaned = String(val).replace(/,/g, "").trim();

  // Convert to number
  const n = parseFloat(cleaned);

  return isNaN(n) ? 0 : n;
};

/**
 * Convert a text value with commas into a number safely.
 */
export const myNumber = (value: string | number | undefined | null): number => {
  if (!value) return 0;
  return Number(String(value).replace(/,/g, "")) || 0;
};

/**
 * Sum the 'quantity' column in a list of items.
 */
export const sumQuantity = (items: { quantity?: string }[]): number => {
  return items.reduce((sum, item) => sum + myNumber(item.quantity), 0);
};

/**
 * Checks if a required field is empty.
 */
export const validateRequired = (
  value: string | null | undefined,
  fieldName: string
): string => {
  if (!value || value.trim() === "") {
    return `${fieldName} is required`;
  }
  return "";
};

/**
 * Validates all required fields in a form and shows a toast for the first missing one.
 * Returns true if all required fields are filled.
 */
export const validateItemForm = (
  item: Record<string, any>,
  fields: { key: string; label: string; required?: boolean }[]
): boolean => {
  for (const f of fields) {
    if (!f.required) continue;
    const error = validateRequired(f.label, item[f.key]);
    if (error) {
      toast.error(error);
      return false;
    }
  }
  return true;
};

/**
 * Calculate total = quantity * price
 */
export const calculateInventoryTotal = (
  quantity: string,
  price: string
): string => {
  const q = parseNumber(quantity);
  const p = parseNumber(price);
  return (q * p).toFixed(2);
};
