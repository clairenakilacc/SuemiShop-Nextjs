"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

import {
  validateBoxNumber,
  validateQuantity,
  validatePrice,
} from "@/utils/validators/inventory";

interface Props {
  onSuccess: () => void;
}

export default function AddInventory({ onSuccess }: Props) {
  const [show, setShow] = useState(false);

  const [boxNumber, setBoxNumber] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    const err =
      validateBoxNumber(boxNumber) ||
      validateQuantity(quantity) ||
      validatePrice(price);

    if (err) return setError(err);

    const total = Number(quantity) * Number(price);

    const { error } = await supabase.from("inventories").insert([
      {
        box_number: boxNumber,
        quantity: Number(quantity),
        price: Number(price),
        total,
        quantity_left: Number(quantity),
        total_left: total,
      },
    ]);

    if (error) return setError(error.message);

    setShow(false);
    setBoxNumber("");
    setQuantity("");
    setPrice("");
    setError(null);

    onSuccess();
  };

  return (
    <>
      <button className="btn btn-add" onClick={() => setShow(true)}>
        Add Inventory
      </button>

      {show && (
        <div
          className="modal fade show d-block"
          style={{ background: "#00000080" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content p-3">
              <h5>Add Inventory</h5>

              <input
                placeholder="Box Number"
                value={boxNumber}
                onChange={(e) => setBoxNumber(e.target.value)}
                className="form-control mb-2"
              />

              <input
                placeholder="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="form-control mb-2"
              />

              <input
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="form-control mb-2"
              />

              {error && <small className="text-danger">{error}</small>}

              <div className="d-flex justify-content-end gap-2 mt-3">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShow(false)}
                >
                  Cancel
                </button>

                <button className="btn btn-add" onClick={handleSubmit}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
