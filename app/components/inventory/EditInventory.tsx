"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { Inventory } from "@/app/types/inventory";

import {
  validateBoxNumber,
  validateQuantity,
  validatePrice,
  validateSupplier,
  validateCategory,
} from "@/utils/validators/inventory";

interface Supplier {
  id: number;
  name: string;
}

interface Category {
  id: number;
  description: string;
}

interface Props {
  show: boolean;
  inventory: Inventory | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditInventory({
  show,
  inventory,
  onClose,
  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(false);

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [form, setForm] = useState({
    date_arrived: "",
    box_number: "",
    supplier_id: "",
    category_id: "",
    quantity: "",
    price: "",
  });

  const [errors, setErrors] = useState<Record<string, string | null>>({});

  /* ================= LOAD DROPDOWNS ================= */
  useEffect(() => {
    async function load() {
      const { data: sup } = await supabase
        .from("suppliers")
        .select("id, name")
        .order("name");

      const { data: cat } = await supabase
        .from("categories")
        .select("id, description")
        .order("description");

      if (sup) setSuppliers(sup);
      if (cat) setCategories(cat);
    }

    load();
  }, []);

  /* ================= SET INITIAL DATA ================= */
  useEffect(() => {
    if (inventory) {
      setForm({
        date_arrived: inventory.date_arrived
          ? inventory.date_arrived.slice(0, 16)
          : "",
        box_number: inventory.box_number || "",
        supplier_id: String(inventory.supplier_id || ""),
        category_id: String(inventory.category_id || ""),
        quantity: String(inventory.quantity || ""),
        price: String(inventory.price || ""),
      });

      setErrors({});
    }
  }, [inventory]);

  if (!show || !inventory) return null;

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));

    let error: string | null = null;

    switch (field) {
      case "box_number":
        error = validateBoxNumber(value);
        break;
      case "quantity":
        error = validateQuantity(value);
        break;
      case "price":
        error = validatePrice(value);
        break;
      case "supplier_id":
        error = validateSupplier(value);
        break;
      case "category_id":
        error = validateCategory(value);
        break;
    }

    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const validateAll = () => ({
    box_number: validateBoxNumber(form.box_number),
    quantity: validateQuantity(form.quantity),
    price: validatePrice(form.price),
    supplier_id: validateSupplier(form.supplier_id),
    category_id: validateCategory(form.category_id),
  });

  /* ================= UPDATE ================= */
  const handleUpdate = async () => {
    const validation = validateAll();
    setErrors(validation);

    const hasError = Object.values(validation).some((e) => e !== null);
    if (hasError) return;

    try {
      setLoading(true);

      const quantity = Number(form.quantity);
      const price = Number(form.price);

      const { error } = await supabase
        .from("inventories")
        .update({
          date_arrived: form.date_arrived || null,
          box_number: form.box_number,
          supplier_id: Number(form.supplier_id),
          category_id: Number(form.category_id),
          quantity,
          price,
          total: quantity * price,
        })
        .eq("id", inventory.id);

      if (error) throw error;

      onSuccess();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal fade show d-block"
      style={{ background: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content rounded-3 overflow-hidden">
          {/* HEADER */}
          <div className="modal-header bg-light">
            <h5 className="modal-title">Edit Inventory</h5>
            <button className="btn-close" onClick={onClose} />
          </div>

          {/* BODY */}
          <div className="modal-body">
            <div className="row g-2">
              {/* DATE */}
              <div className="col-md-6">
                <label className="form-label">Date Arrived</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  value={form.date_arrived}
                  onChange={(e) => handleChange("date_arrived", e.target.value)}
                />
              </div>

              {/* BOX */}
              <div className="col-md-6">
                <label className="form-label">Box Number</label>
                <input
                  className="form-control"
                  value={form.box_number}
                  onChange={(e) => handleChange("box_number", e.target.value)}
                />
                {errors.box_number && (
                  <small className="text-danger">{errors.box_number}</small>
                )}
              </div>

              {/* SUPPLIER SELECT */}
              <div className="col-md-6">
                <label className="form-label">Supplier</label>
                <select
                  className="form-select"
                  value={form.supplier_id}
                  onChange={(e) => handleChange("supplier_id", e.target.value)}
                >
                  <option value="">Select Supplier</option>
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                {errors.supplier_id && (
                  <small className="text-danger">{errors.supplier_id}</small>
                )}
              </div>

              {/* CATEGORY SELECT */}
              <div className="col-md-6">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={form.category_id}
                  onChange={(e) => handleChange("category_id", e.target.value)}
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.description}
                    </option>
                  ))}
                </select>
                {errors.category_id && (
                  <small className="text-danger">{errors.category_id}</small>
                )}
              </div>

              {/* QUANTITY */}
              <div className="col-md-6">
                <label className="form-label">Quantity</label>
                <input
                  type="number"
                  className="form-control"
                  value={form.quantity}
                  onChange={(e) => handleChange("quantity", e.target.value)}
                />
                {errors.quantity && (
                  <small className="text-danger">{errors.quantity}</small>
                )}
              </div>

              {/* PRICE */}
              <div className="col-md-6">
                <label className="form-label">Price</label>
                <input
                  type="number"
                  className="form-control"
                  value={form.price}
                  onChange={(e) => handleChange("price", e.target.value)}
                />
                {errors.price && (
                  <small className="text-danger">{errors.price}</small>
                )}
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>

            <button
              className="btn btn-edit"
              onClick={handleUpdate}
              disabled={loading}
            >
              {loading ? "Saving..." : "Edit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
