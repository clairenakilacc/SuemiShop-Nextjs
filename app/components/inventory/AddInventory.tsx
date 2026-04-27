"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

import {
  validateBoxNumber,
  validateQuantity,
  validatePrice,
  validateSupplier,
  validateCategory,
} from "@/utils/validators/inventory";

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

  const [errors, setErrors] = useState<Record<string, string | null>>({});
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

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));

    // live validation per field
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

  const validateAll = () => {
    return {
      box_number: validateBoxNumber(form.box_number),
      quantity: validateQuantity(form.quantity),
      price: validatePrice(form.price),
      supplier_id: validateSupplier(form.supplier_id),
      category_id: validateCategory(form.category_id),
    };
  };

  const resetForm = () => {
    setForm({
      date_arrived: "",
      box_number: "",
      supplier_id: "",
      category_id: "",
      quantity: "",
      price: "",
    });
    setErrors({});
    setTouched(false);
  };

  const handleSubmit = async () => {
    setTouched(true);
    setLoading(true);

    const validation = validateAll();
    setErrors(validation);

    const hasError = Object.values(validation).some((e) => e !== null);
    if (hasError) {
      setLoading(false);
      return;
    }

    const quantity = Number(form.quantity);
    const price = Number(form.price);
    const total = quantity * price;

    const payload = {
      date_arrived: form.date_arrived || null,
      box_number: form.box_number || null,
      supplier_id: Number(form.supplier_id),
      category_id: Number(form.category_id),
      quantity,
      price,
      total,
      quantity_left: quantity,
      total_left: total,
    };

    const { error } = await supabase.from("inventories").insert([payload]);

    if (error) {
      setLoading(false);
      return;
    }

    resetForm();
    setShow(false);
    setLoading(false);
    onSuccess();
  };

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

              {/* ================= FORM ================= */}
              <div className="modal-body">
                <div className="row g-2">
                  {/* DATE */}
                  <div className="col-md-6">
                    <input
                      type="datetime-local"
                      className="form-control"
                      value={form.date_arrived}
                      onChange={(e) =>
                        handleChange("date_arrived", e.target.value)
                      }
                    />
                  </div>

                  {/* BOX NUMBER */}
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Box Number"
                      value={form.box_number}
                      onChange={(e) =>
                        handleChange("box_number", e.target.value)
                      }
                    />
                    {errors.box_number && (
                      <small className="text-danger">{errors.box_number}</small>
                    )}
                  </div>

                  {/* SUPPLIER */}
                  <div className="col-md-6">
                    <select
                      className="form-select"
                      value={form.supplier_id}
                      onChange={(e) =>
                        handleChange("supplier_id", e.target.value)
                      }
                    >
                      <option value="">Select Supplier</option>
                      {suppliers.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                    {errors.supplier_id && (
                      <small className="text-danger">
                        {errors.supplier_id}
                      </small>
                    )}
                  </div>

                  {/* CATEGORY */}
                  <div className="col-md-6">
                    <select
                      className="form-select"
                      value={form.category_id}
                      onChange={(e) =>
                        handleChange("category_id", e.target.value)
                      }
                    >
                      <option value="">Select Category</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.description}
                        </option>
                      ))}
                    </select>
                    {errors.category_id && (
                      <small className="text-danger">
                        {errors.category_id}
                      </small>
                    )}
                  </div>

                  {/* QUANTITY */}
                  <div className="col-md-6">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Quantity"
                      value={form.quantity}
                      onChange={(e) => handleChange("quantity", e.target.value)}
                    />
                    {errors.quantity && (
                      <small className="text-danger">{errors.quantity}</small>
                    )}
                  </div>

                  {/* PRICE */}
                  <div className="col-md-6">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Price"
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
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setShow(false);
                    resetForm();
                  }}
                >
                  Cancel
                </button>

                <button
                  className="btn btn-add"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Add"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
