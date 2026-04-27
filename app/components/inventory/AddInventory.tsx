"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Category {
  id: number;
  description: string;
}

interface Supplier {
  id: number;
  name: string;
}

interface AddInventoryProps {
  onSuccess: () => void;
  className?: string;
  buttonText?: string;
}

export default function AddInventory({
  onSuccess,
  className = "btn btn-add",
  buttonText = "Add Inventory",
}: AddInventoryProps) {
  const [show, setShow] = useState(false);

  const [form, setForm] = useState({
    date_arrived: "",
    box_number: "",
    supplier_id: "",
    category_id: "",
    quantity: "",
    price: "",
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    async function loadData() {
      const { data: cat } = await supabase
        .from("categories")
        .select("id, description")
        .order("description");

      const { data: sup } = await supabase
        .from("suppliers")
        .select("id, name")
        .order("name");

      if (cat) setCategories(cat);
      if (sup) setSuppliers(sup);
    }

    loadData();
  }, []);

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  /* ================= VALIDATION ================= */
  const validate = () => {
    if (!form.quantity || Number(form.quantity) <= 0)
      return "Quantity is required";
    if (!form.price || Number(form.price) <= 0) return "Price is required";
    return null;
  };

  /* ================= RESET ================= */
  const resetForm = () => {
    setForm({
      date_arrived: "",
      box_number: "",
      supplier_id: "",
      category_id: "",
      quantity: "",
      price: "",
    });
    setError(null);
    setTouched(false);
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    setTouched(true);
    setLoading(true);
    setError(null);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    const quantity = Number(form.quantity);
    const price = Number(form.price);
    const total = quantity * price;

    const payload = {
      date_arrived: form.date_arrived || null,
      box_number: form.box_number || null,
      supplier_id: form.supplier_id ? Number(form.supplier_id) : null,
      category_id: form.category_id ? Number(form.category_id) : null,
      quantity,
      price,
      total,
      quantity_left: quantity,
      total_left: total,
    };

    const { error } = await supabase.from("inventories").insert([payload]);

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    resetForm();
    setShow(false);
    setLoading(false);
    onSuccess();
  };

  /* ================= UI ================= */
  return (
    <>
      <button
        className={className}
        onClick={() => setShow(true)}
        disabled={loading}
      >
        {buttonText}
      </button>

      {show && (
        <div
          className="modal fade show d-block"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-3 overflow-hidden">
              <div className="modal-header bg-light">
                <h5 className="modal-title">Add Inventory</h5>
                <button
                  className="btn-close"
                  onClick={() => {
                    setShow(false);
                    resetForm();
                  }}
                />
              </div>

              <div className="modal-body d-flex flex-column gap-2">
                {/* DATE ARRIVED */}
                <input
                  type="datetime-local"
                  className="form-control"
                  value={form.date_arrived}
                  onChange={(e) => handleChange("date_arrived", e.target.value)}
                />

                {/* BOX NUMBER */}
                <input
                  type="text"
                  className="form-control"
                  placeholder="Box Number"
                  value={form.box_number}
                  onChange={(e) => handleChange("box_number", e.target.value)}
                />

                {/* SUPPLIER */}
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

                {/* CATEGORY */}
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

                {/* QUANTITY */}
                <input
                  type="number"
                  className={`form-control ${
                    error && touched && !form.quantity ? "is-invalid" : ""
                  }`}
                  placeholder="Quantity"
                  value={form.quantity}
                  onChange={(e) => handleChange("quantity", e.target.value)}
                  onBlur={() => setTouched(true)}
                />

                {/* PRICE */}
                <input
                  type="number"
                  className={`form-control ${
                    error && touched && !form.price ? "is-invalid" : ""
                  }`}
                  placeholder="Price"
                  value={form.price}
                  onChange={(e) => handleChange("price", e.target.value)}
                  onBlur={() => setTouched(true)}
                />

                {/* ERROR */}
                {error && touched && (
                  <small className="text-danger">{error}</small>
                )}
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setShow(false);
                    resetForm();
                  }}
                  disabled={loading}
                >
                  Cancel
                </button>

                <button
                  className="btn btn-add"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
