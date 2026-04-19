"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Item } from "./ItemTable";

interface Props {
  show: boolean;
  item: Item | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditItem({ show, item, onClose, onSuccess }: Props) {
  const [form, setForm] = useState<Item | null>(null);

  useEffect(() => {
    setForm(item);
  }, [item]);

  if (!show || !form) return null;

  const handleChange = (key: keyof Item, value: any) => {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const handleSave = async () => {
    const { error } = await supabase
      .from("items")
      .update(form)
      .eq("id", form.id);

    if (error) {
      alert(error.message);
      return;
    }

    onSuccess();
    onClose();
  };

  return (
    <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5>Edit Item</h5>
            <button className="btn-close" onClick={onClose} />
          </div>

          <div className="modal-body">
            <div className="row g-2">
              <div className="col-md-6">
                <input
                  className="form-control"
                  placeholder="Brand"
                  value={form.brand || ""}
                  onChange={(e) => handleChange("brand", e.target.value)}
                />
              </div>

              <div className="col-md-6">
                <input
                  className="form-control"
                  placeholder="Order ID"
                  value={form.order_id || ""}
                  onChange={(e) => handleChange("order_id", e.target.value)}
                />
              </div>

              <div className="col-md-6">
                <input
                  className="form-control"
                  placeholder="Selling Price"
                  type="number"
                  value={form.selling_price || 0}
                  onChange={(e) =>
                    handleChange("selling_price", Number(e.target.value))
                  }
                />
              </div>

              <div className="col-md-6">
                <input
                  className="form-control"
                  placeholder="Capital"
                  type="number"
                  value={form.capital || 0}
                  onChange={(e) =>
                    handleChange("capital", Number(e.target.value))
                  }
                />
              </div>

              <div className="col-md-6">
                <input
                  className="form-control"
                  placeholder="Discount"
                  type="number"
                  value={form.discount || 0}
                  onChange={(e) =>
                    handleChange("discount", Number(e.target.value))
                  }
                />
              </div>

              <div className="col-md-6">
                <input
                  className="form-control"
                  placeholder="Quantity"
                  type="number"
                  value={form.quantity || 0}
                  onChange={(e) =>
                    handleChange("quantity", Number(e.target.value))
                  }
                />
              </div>

              <div className="col-md-6">
                <select
                  className="form-control"
                  value={form.is_returned ? "yes" : "no"}
                  onChange={(e) =>
                    handleChange("is_returned", e.target.value === "yes")
                  }
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
