"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { validateRequired } from "../utils/validator";

export interface Inventory {
  id?: string;
  created_at?: string | null;
  date_arrived?: string | null;
  box_number?: string;
  supplier?: string;
  quantity?: string;
  price?: string;
  total?: string;
  category?: string;
  quantity_left?: string;
  total_left?: string;
}

interface FieldConfig {
  key: keyof Inventory;
  label: string;
  type?: "text" | "number" | "date" | "select";
  options?: string[];
  required?: boolean;
}

interface AddInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddInventoryModal({
  isOpen,
  onClose,
  onSuccess,
}: AddInventoryModalProps) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [categories, setCategories] = useState<string[]>([]);
  const [suppliers, setSuppliers] = useState<string[]>([]);
  const [inventory, setInventory] = useState<Inventory>({
    created_at: new Date().toISOString(),
    date_arrived: null,
    box_number: "",
    supplier: "",
    quantity: "",
    price: "",
    category: "",
  });

  const disabledFields: (keyof Inventory)[] = [
    "created_at",
    "total",
    "quantity_left",
    "total_left",
  ];

  // Fetch categories and suppliers from inventories table
  useEffect(() => {
    const fetchOptions = async () => {
      const { data, error } = await supabase
        .from("inventories")
        .select("category, supplier");
      if (error) {
        console.error("Failed to fetch options:", error.message);
        return;
      }
      if (data) {
        const uniqueCategories = Array.from(
          new Set(data.map((d: any) => d.category).filter(Boolean))
        );
        const uniqueSuppliers = Array.from(
          new Set(data.map((d: any) => d.supplier).filter(Boolean))
        );
        setCategories(uniqueCategories);
        setSuppliers(uniqueSuppliers);
      }
    };
    fetchOptions();
  }, []);

  const allFields: FieldConfig[] = [
    { key: "created_at", label: "Timestamp", type: "date", required: true },
    {
      key: "date_arrived",
      label: "Date Arrived",
      type: "date",
      required: true,
    },
    { key: "box_number", label: "Box Number", type: "text", required: true },
    {
      key: "supplier",
      label: "Supplier",
      type: "select",
      options: suppliers,
      required: true,
    },
    {
      key: "category",
      label: "Category",
      type: "select",
      options: categories,
      required: true,
    },
    { key: "quantity", label: "Quantity", type: "number", required: true },
    { key: "price", label: "Price", type: "number", required: true },
    { key: "total", label: "Total", type: "number" }, // auto-calculated
    { key: "quantity_left", label: "Quantity Left", type: "number" }, // derived
    { key: "total_left", label: "Total Left", type: "number" }, // derived
  ];

  const visibleFields = allFields.filter(
    (f) => !["quantity_left", "total_left"].includes(f.key)
  );

  if (!isOpen) return null;

  // Derived values
  const total = (
    parseFloat(inventory.quantity || "0") * parseFloat(inventory.price || "0")
  ).toString();
  const quantity_left = inventory.quantity || "";
  const total_left = total;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    for (const field of allFields.filter((f) => f.required)) {
      const value = inventory[field.key] || "";
      const err = validateRequired(value as string, field.label);
      if (err) newErrors[field.key] = err;
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    const { error } = await supabase.from("inventories").insert([
      {
        ...inventory,
        total,
        quantity_left,
        total_left,
      },
    ]);
    setLoading(false);
    if (error) return toast.error(error.message);

    toast.success("Inventory added successfully!");
    setInventory({
      created_at: new Date().toISOString(),
      date_arrived: null,
      box_number: "",
      supplier: "",
      quantity: "",
      price: "",
      category: "",
    });
    setErrors({});
    onClose();
    onSuccess();
  };

  const renderField = (f: FieldConfig) => {
    const hasError = errors[f.key as string];
    const baseClass = `form-control ${hasError ? "is-invalid" : ""}`;
    const isDisabled = disabledFields.includes(f.key);

    if (f.key === "total") {
      return (
        <input type="number" className={baseClass} value={total} disabled />
      );
    }

    if (f.type === "date")
      return (
        <>
          <DatePicker
            selected={inventory[f.key] ? new Date(inventory[f.key]!) : null}
            onChange={(date) =>
              !isDisabled &&
              setInventory({
                ...inventory,
                [f.key]: date ? date.toISOString() : null,
              })
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

    if (f.type === "select")
      return (
        <>
          <select
            className={baseClass}
            value={inventory[f.key] || ""}
            onChange={(e) =>
              !isDisabled &&
              setInventory({ ...inventory, [f.key]: e.target.value })
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

    return (
      <>
        <input
          type={f.type === "number" ? "number" : "text"}
          className={baseClass}
          placeholder={f.label}
          value={inventory[f.key] || ""}
          onChange={(e) =>
            !isDisabled &&
            setInventory({ ...inventory, [f.key]: e.target.value })
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
            <h5 className="modal-title">Add New Inventory</h5>
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
