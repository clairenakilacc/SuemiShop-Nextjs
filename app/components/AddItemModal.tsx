"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { validateRequired } from "../utils/validator";

export interface Item {
  id?: string;
  timestamp?: string | null;
  prepared_by?: string;
  brand?: string;
  order_id?: string;
  shoppee_commission?: string;
  selling_price?: string;
  is_returned?: string;
  quantity?: string;
  live_seller?: string;
  capital?: string;
  order_income?: string;
  category?: string;
  mined_from?: string;
  discount?: string;
  commission_rate?: string;
  date_shipped?: string | null;
  date_returned?: string | null;
}

interface FieldConfig {
  key: keyof Item;
  label: string;
  type?: "text" | "number" | "float" | "select" | "date";
  options?: string[];
  validate?: (value: string) => string;
  required?: boolean;
}

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddItemModal({
  isOpen,
  onClose,
  onSuccess,
}: AddItemModalProps) {
  const [loggedUser, setLoggedUser] = useState<string>("");
  const [categories, setCategories] = useState<string[]>([]);
  const [employees, setEmployees] = useState<{ id: string; name: string }[]>(
    []
  );
  const [liveSellers, setLiveSellers] = useState<
    { id: string; name: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const disabledFields: (keyof Item)[] = [
    "prepared_by",
    "timestamp",
    "commission_rate",
  ];

  const [item, setItem] = useState<Item>({
    timestamp: new Date().toISOString(),
    mined_from: "",
    prepared_by: "",
    category: "",
    brand: "",
    quantity: "",
    order_id: "",
    selling_price: "",
    capital: "",
    shoppee_commission: "0",
    discount: "0",
    order_income: "0",
    commission_rate: "0",
    live_seller: "",
    is_returned: "No",
    date_shipped: null,
    date_returned: null,
  });

  // Fetch logged-in user
  useEffect(() => {
    const fetchLoggedUser = async () => {
      const stored = localStorage.getItem("user");
      if (stored) {
        const user = JSON.parse(stored);
        setLoggedUser(user.name || "");
        setItem((prev) => ({ ...prev, prepared_by: user.name || "" }));
      } else {
        try {
          const res = await fetch("/api/me");
          const data = await res.json();
          if (data.user) {
            setLoggedUser(data.user.name || "");
            setItem((prev) => ({ ...prev, prepared_by: data.user.name || "" }));
            localStorage.setItem("user", JSON.stringify(data.user));
          }
        } catch (err) {
          console.error("Failed to fetch logged user", err);
        }
      }
    };
    if (isOpen) fetchLoggedUser();
  }, [isOpen]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("description");
      if (error) {
        console.error("Failed to fetch categories:", error.message);
        return;
      }
      if (data) setCategories(data.map((c: any) => c.description));
    };
    fetchCategories();
  }, []);

  // Fetch employees and live sellers
  useEffect(() => {
    const fetchData = async () => {
      const { data: empData } = await supabase
        .from("users")
        .select("id, name")
        .eq("is_employee", "Yes");
      setEmployees(empData || []);
      const { data: liveData } = await supabase
        .from("users")
        .select("id, name")
        .eq("is_live_seller", "Yes");
      setLiveSellers(liveData || []);
    };
    fetchData();
  }, []);

  const allFields: FieldConfig[] = [
    { key: "timestamp", label: "Timestamp", type: "date", required: true },
    {
      key: "mined_from",
      label: "Mined From",
      type: "select",
      options: ["Facebook", "Shoppee"],
      required: true,
    },
    {
      key: "prepared_by",
      label: "Prepared By",
      type: "select",
      options: loggedUser ? [loggedUser] : [],
      required: true,
    },
    {
      key: "category",
      label: "Category",
      type: "select",
      options: categories,
      required: true,
    },
    { key: "brand", label: "Brand", type: "text", required: true },
    {
      key: "live_seller",
      label: "Live Seller",
      type: "select",
      options: liveSellers.map((u) => u.name),
      required: true,
    },
    {
      key: "order_id",
      label: "Order ID",
      type: "text",
      validate: (v) =>
        v.length === 4 ? "" : "Order ID must be exactly 4 characters",
      required: true,
    },
    {
      key: "quantity",
      label: "Quantity",
      type: "number",
      required: true,
      validate: (v) =>
        !v || isNaN(Number(v)) || Number(v) < 1
          ? "Quantity must be a number (1 or more)"
          : "",
    },
    {
      key: "capital",
      label: "Capital",
      type: "float",
      required: true,
      validate: (v) =>
        !v || isNaN(Number(v)) || Number(v) < 1
          ? "Capital must be a number (1 or more)"
          : "",
    },
    {
      key: "selling_price",
      label: "Selling Price",
      type: "float",
      required: true,
      validate: (v) =>
        !v || isNaN(Number(v)) || Number(v) < 1
          ? "Selling must be a number (1 or more)"
          : "",
    },

    {
      key: "shoppee_commission",
      label: "Shoppee Commission",
      type: "float",
      required: true,
      validate: (v) =>
        !v || isNaN(Number(v)) || Number(v) < 0
          ? "Commission must be a number (0 or more)"
          : "",
    },
    { key: "discount", label: "Discount", type: "float", required: true },
    {
      key: "is_returned",
      label: "Is Returned?",
      type: "select",
      options: ["No", "Yes"],
    },
    { key: "date_shipped", label: "Date Shipped", type: "date" },
    { key: "date_returned", label: "Date Returned", type: "date" },
    { key: "order_income", label: "Order Income", type: "text" },
    { key: "commission_rate", label: "Commission Rate", type: "text" },
  ];

  const hiddenKeys: (keyof Item)[] = ["order_income", "commission_rate"];
  const visibleFields = allFields.filter((f) => !hiddenKeys.includes(f.key));

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    for (const field of allFields.filter((f) => f.required)) {
      const value = item[field.key] || "";
      const err = validateRequired(value as string, field.label);
      if (err) newErrors[field.key] = err;
    }
    for (const field of allFields.filter((f) => f.validate)) {
      const value = item[field.key] || "";
      const err = field.validate?.(value as string);
      if (err) newErrors[field.key] = err;
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    const { error } = await supabase.from("items").insert([item]);
    setLoading(false);
    if (error) return toast.error(error.message);

    toast.success("Item added successfully!");
    setItem({
      timestamp: new Date().toISOString(),
      mined_from: "",
      prepared_by: loggedUser,
      category: "",
      brand: "",
      quantity: "",
      order_id: "",
      selling_price: "",
      capital: "",
      shoppee_commission: "0",
      discount: "0",
      order_income: "0",
      commission_rate: "0",
      live_seller: "",
      is_returned: "No",
      date_shipped: null,
      date_returned: null,
    });
    setErrors({});
    onClose();
    onSuccess();
  };

  const renderField = (f: FieldConfig) => {
    const hasError = errors[f.key as string];
    const baseClass = `form-control ${hasError ? "is-invalid" : ""}`;
    const isDisabled = disabledFields.includes(f.key);

    if (f.type === "select")
      return (
        <>
          <select
            className={`form-select ${hasError ? "is-invalid" : ""}`}
            value={item[f.key] || ""}
            onChange={(e) =>
              !isDisabled && setItem({ ...item, [f.key]: e.target.value })
            }
            disabled={isDisabled}
          >
            <option value="">— Select —</option>
            {f.options?.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          {hasError && <div className="invalid-feedback">{hasError}</div>}
        </>
      );

    if (f.type === "date")
      return (
        <>
          <DatePicker
            selected={item[f.key] ? new Date(item[f.key]!) : null}
            onChange={(date) =>
              !isDisabled &&
              setItem({ ...item, [f.key]: date ? date.toISOString() : null })
            }
            showTimeSelect
            dateFormat="yyyy-MM-dd HH:mm"
            placeholderText={f.label}
            className={baseClass}
            wrapperClassName="w-100"
            popperClassName="react-datepicker-popper"
            disabled={isDisabled}
          />
          {hasError && <div className="invalid-feedback">{hasError}</div>}
        </>
      );

    return (
      <>
        <input
          type="text"
          className={baseClass}
          placeholder={f.label}
          value={item[f.key] || ""}
          onChange={(e) =>
            !isDisabled && setItem({ ...item, [f.key]: e.target.value })
          }
          disabled={isDisabled}
        />
        {hasError && <div className="invalid-feedback">{hasError}</div>}
      </>
    );
  };

  return (
    <div
      className="modal fade show d-block"
      tabIndex={-1}
      style={{ background: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered modal-xl">
        <div
          className="modal-content overflow-hidden"
          style={{ borderRadius: "8px" }}
        >
          <div className="modal-header bg-light">
            <h5 className="modal-title">Add New Item</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>

          <form onSubmit={handleSave} noValidate>
            <div
              className="modal-body"
              style={{ maxHeight: "70vh", overflowY: "auto" }}
            >
              <div className="row">
                {visibleFields.map((f) => (
                  <div className="col-md-6 mb-3" key={f.key}>
                    <label className="form-label">{f.label}</label>
                    {renderField(f)}
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="text-white shadow-md"
                style={{
                  backgroundColor: "#f59e0b",
                  borderRadius: "4px",
                  padding: "8px 16px",
                  fontWeight: 500,
                }}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
