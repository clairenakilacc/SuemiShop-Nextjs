"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { Inventory } from "@/app/types/inventory";

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
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);

  // unified error state (same style as Category)
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (inventory) {
      setQuantity(String(inventory.quantity));
      setPrice(String(inventory.price));
      setError(null);
    }
  }, [inventory]);

  if (!show || !inventory) return null;

  const isValid =
    quantity !== "" &&
    price !== "" &&
    !isNaN(Number(quantity)) &&
    !isNaN(Number(price));

  const handleUpdate = async () => {
    if (!isValid) {
      setError("Quantity and Price must be valid numbers");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { error: dbError } = await supabase
        .from("inventories")
        .update({
          quantity: Number(quantity),
          price: Number(price),
          total: Number(quantity) * Number(price),
        })
        .eq("id", inventory.id);

      if (dbError) {
        setError(dbError.message);
        return;
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message);
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
          {/* HEADER (same as category) */}
          <div className="modal-header bg-light">
            <h5 className="modal-title">Edit Inventory</h5>
            <button className="btn-close" onClick={onClose} />
          </div>

          {/* BODY (same structure style) */}
          <div className="modal-body">
            {/* Quantity */}
            <label className="form-label">Quantity</label>
            <input
              type="number"
              className={`form-control ${error ? "is-invalid" : ""}`}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Enter quantity..."
            />

            {/* Price */}
            <label className="form-label mt-2">Price</label>
            <input
              type="number"
              className={`form-control ${error ? "is-invalid" : ""}`}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter price..."
            />

            {/* ERROR (same as category style) */}
            {error && (
              <small className="text-danger d-block mt-2">{error}</small>
            )}
          </div>

          {/* FOOTER */}
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>

            <button
              className="btn btn-edit"
              onClick={handleUpdate}
              disabled={loading || !isValid}
            >
              {loading ? "Saving..." : "Edit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
