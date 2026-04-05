"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { calculateInventoryTotal, validateRequired } from "../utils/validator";

export interface Inventory {
  id?: string;
  date_arrived?: string | null;
  box_number?: string;
  supplier?: string;
  quantity?: string;
  price?: string;
  total?: string;
  category?: string;
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
  const [suppliers, setSuppliers] = useState<{ name: string }[]>([]);
  const [categories, setCategories] = useState<{ description: string }[]>([]);
  const [inventory, setInventory] = useState<Inventory>({
    date_arrived: new Date().toISOString(),
    box_number: "",
    supplier: "",
    quantity: "0",
    price: "0",
    total: "0",
    category: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchSuppliers = async () => {
      const { data } = await supabase.from("suppliers").select("name");
      if (data) setSuppliers(data);
    };
    const fetchCategories = async () => {
      const { data } = await supabase.from("categories").select("description");
      if (data) setCategories(data);
    };
    if (isOpen) {
      fetchSuppliers();
      fetchCategories();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (key: keyof Inventory, value: string) => {
    const updated = { ...inventory, [key]: value };
    if (key === "quantity" || key === "price") {
      updated.total = calculateInventoryTotal(
        updated.quantity || "0",
        updated.price || "0"
      );
    }
    setInventory(updated);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    [
      "date_arrived",
      "box_number",
      "supplier",
      "category",
      "quantity",
      "price",
    ].forEach((key) => {
      const err = validateRequired(
        inventory[key as keyof Inventory] as string,
        key
      );
      if (err) newErrors[key] = err;
    });
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    const { error } = await supabase.from("inventories").insert([inventory]);
    setLoading(false);
    if (error) return toast.error(error.message);

    toast.success("Inventory added!");
    onClose();
    onSuccess();
  };

  return (
    <div
      className="modal fade show d-block"
      tabIndex={-1}
      style={{ background: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header bg-light">
            <h5 className="modal-title">Add Inventory</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>

          <form onSubmit={handleSave}>
            <div className="modal-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label>Date Arrived</label>
                  <DatePicker
                    selected={
                      inventory.date_arrived
                        ? new Date(inventory.date_arrived)
                        : null
                    }
                    onChange={(date) =>
                      setInventory({
                        ...inventory,
                        date_arrived: date?.toISOString() || null,
                      })
                    }
                    className="form-control"
                  />
                  {errors.date_arrived && (
                    <div className="text-danger">{errors.date_arrived}</div>
                  )}
                </div>

                <div className="col-md-6">
                  <label>Box Number</label>
                  <input
                    type="text"
                    className="form-control"
                    value={inventory.box_number}
                    onChange={(e) => handleChange("box_number", e.target.value)}
                  />
                  {errors.box_number && (
                    <div className="text-danger">{errors.box_number}</div>
                  )}
                </div>

                <div className="col-md-6">
                  <label>Supplier</label>
                  <select
                    className="form-select"
                    value={inventory.supplier}
                    onChange={(e) => handleChange("supplier", e.target.value)}
                  >
                    <option value="">— Select —</option>
                    {suppliers.map((s) => (
                      <option key={s.name} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                  {errors.supplier && (
                    <div className="text-danger">{errors.supplier}</div>
                  )}
                </div>

                <div className="col-md-6">
                  <label>Category</label>
                  <select
                    className="form-select"
                    value={inventory.category}
                    onChange={(e) => handleChange("category", e.target.value)}
                  >
                    <option value="">— Select —</option>
                    {categories.map((c) => (
                      <option key={c.description} value={c.description}>
                        {c.description}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <div className="text-danger">{errors.category}</div>
                  )}
                </div>

                <div className="col-md-4">
                  <label>Quantity</label>
                  <input
                    type="number"
                    className="form-control"
                    value={inventory.quantity}
                    onChange={(e) => handleChange("quantity", e.target.value)}
                  />
                  {errors.quantity && (
                    <div className="text-danger">{errors.quantity}</div>
                  )}
                </div>

                <div className="col-md-4">
                  <label>Price</label>
                  <input
                    type="number"
                    className="form-control"
                    value={inventory.price}
                    onChange={(e) => handleChange("price", e.target.value)}
                  />
                  {errors.price && (
                    <div className="text-danger">{errors.price}</div>
                  )}
                </div>

                <div className="col-md-4">
                  <label>Total</label>
                  <input
                    type="text"
                    className="form-control"
                    value={inventory.total}
                    readOnly
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-warning"
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
