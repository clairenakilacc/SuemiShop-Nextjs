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

  useEffect(() => {
    if (inventory) {
      setQuantity(String(inventory.quantity));
      setPrice(String(inventory.price));
    }
  }, [inventory]);

  if (!show || !inventory) return null;

  const handleUpdate = async () => {
    await supabase
      .from("inventories")
      .update({
        quantity: Number(quantity),
        price: Number(price),
        total: Number(quantity) * Number(price),
      })
      .eq("id", inventory.id);

    onSuccess();
    onClose();
  };

  return (
    <div
      className="modal fade show d-block"
      style={{ background: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5>Edit Inventory</h5>
            <button className="btn-close" onClick={onClose} />
          </div>

          <div className="modal-body">
            <input
              className="form-control mb-2"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Quantity"
            />

            <input
              className="form-control"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Price"
            />
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>

            <button className="btn btn-primary" onClick={handleUpdate}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
