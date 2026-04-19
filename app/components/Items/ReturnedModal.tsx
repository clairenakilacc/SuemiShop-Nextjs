"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabase";

interface Props {
  show: boolean;
  item: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ReturnedModal({
  show,
  item,
  onClose,
  onSuccess,
}: Props) {
  const [dateShipped, setDateShipped] = useState(item?.date_shipped || "");
  const [dateReturned, setDateReturned] = useState(item?.date_returned || "");
  const [loading, setLoading] = useState(false);

  if (!show || !item) return null;

  const handleSubmit = async () => {
    setLoading(true);

    const { error } = await supabase
      .from("items")
      .update({
        is_returned: true,
        date_shipped: dateShipped || null,
        date_returned: dateReturned || null,
      })
      .eq("id", item.id);

    setLoading(false);

    if (!error) {
      onSuccess();
      onClose();
    }
  };

  return (
    <div
      className="modal show d-block"
      style={{ background: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-md modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Returned Item</h5>
            <button className="btn-close" onClick={onClose} />
          </div>

          <div className="modal-body">
            <label>Date Shipped</label>
            <input
              type="date"
              className="form-control mb-2"
              value={dateShipped}
              onChange={(e) => setDateShipped(e.target.value)}
            />

            <label>Date Returned</label>
            <input
              type="date"
              className="form-control mb-2"
              value={dateReturned}
              onChange={(e) => setDateReturned(e.target.value)}
            />

            <small className="text-muted">Both fields are optional</small>
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>

            <button
              className="btn btn-add"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Saving..." : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
