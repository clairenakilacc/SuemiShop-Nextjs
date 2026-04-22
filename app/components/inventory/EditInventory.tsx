"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

import {
  validateBoxNumber,
  validateQuantity,
  validatePrice,
} from "@/utils/validators/inventory";

interface Inventory {
  id?: string;
  date_arrived?: string | null;
  box_number?: string | null;
  supplier?: string | null;
  category?: string | null;
  quantity?: string | null;
  price?: string | null;
  quantity_left?: string | null;
  total_left?: string | null;
  status?: string | null;
}

interface Props {
  show: boolean;
  inventory: Inventory | null;
  onClose: () => void;
  onSuccess: () => void;

  categories: { id: string; description: string }[];
  suppliers: { id: string; name: string }[];
}

export default function EditInventory({
  show,
  inventory,
  onClose,
  onSuccess,
  categories,
  suppliers,
}: Props) {
  const [loading, setLoading] = useState(false);

  const [dateArrived, setDateArrived] = useState("");
  const [boxNumber, setBoxNumber] = useState("");
  const [supplier, setSupplier] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    if (!inventory) return;

    setDateArrived(inventory.date_arrived || "");
    setBoxNumber(inventory.box_number || "");
    setSupplier(inventory.supplier || "");
    setCategory(inventory.category || "");
    setQuantity(inventory.quantity || "");
    setPrice(inventory.price || "");
  }, [inventory]);

  if (!show || !inventory) return null;

  /* ================= VALIDATE ================= */
  const validateAll = async () => {
    const v2 = validateBoxNumber(boxNumber);
    if (v2) return v2;

    const v3 = validateQuantity(quantity);
    if (v3) return v3;

    const v4 = validatePrice(price);
    if (v4) return v4;

    if (!dateArrived) return "Date arrived is required";
    if (!category) return "Category is required";

    return null;
  };

  /* ================= UPDATE ================= */
  const handleUpdate = async () => {
    setTouched(true);

    const validationError = await validateAll();
    setError(validationError);

    if (validationError) return;

    try {
      setLoading(true);

      const total = Number(quantity) * Number(price);

      const { error } = await supabase
        .from("inventories")
        .update({
          date_arrived: dateArrived,
          box_number: boxNumber.trim(),
          supplier: supplier.trim(),
          category,
          quantity,
          price,
          total: String(total),
          updated_at: new Date().toISOString(),
        })
        .eq("id", inventory.id);

      if (error) {
        setError(error.message);
        return;
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div
      className="modal fade show d-block"
      style={{ background: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content rounded-3 overflow-hidden">
          {/* HEADER */}
          <div className="modal-header bg-light">
            <h5 className="modal-title">Edit Inventory</h5>
            <button className="btn-close" onClick={onClose} />
          </div>

          {/* BODY */}
          <div className="modal-body">
            {/* DATE */}
            <label className="form-label">Date Arrived</label>
            <input
              type="date"
              className="form-control mb-2"
              value={dateArrived}
              onChange={(e) => setDateArrived(e.target.value)}
            />

            {/* BOX */}
            <label className="form-label">Box Number</label>
            <input
              className="form-control mb-2"
              value={boxNumber}
              onChange={(e) => setBoxNumber(e.target.value)}
            />

            {/* SUPPLIER */}
            <label className="form-label">Supplier</label>
            <input
              className="form-control mb-2"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
            />

            {/* CATEGORY */}
            <label className="form-label">Category</label>
            <select
              className="form-control mb-2"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.description}
                </option>
              ))}
            </select>

            {/* QUANTITY */}
            <label className="form-label">Quantity</label>
            <input
              className="form-control mb-2"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />

            {/* PRICE */}
            <label className="form-label">Price</label>
            <input
              className="form-control mb-2"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />

            {/* ERROR */}
            {error && touched && (
              <small className="text-danger d-block mt-2">{error}</small>
            )}
          </div>

          {/* FOOTER */}
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>

            <button
              className="btn btn-primary"
              onClick={handleUpdate}
              disabled={loading}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
