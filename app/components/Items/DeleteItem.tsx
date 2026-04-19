"use client";

import React from "react";
import { supabase } from "@/lib/supabase";
import type { Item } from "./ItemTable";

interface Props {
  show: boolean;
  item: Item | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DeleteItem({ show, item, onClose, onSuccess }: Props) {
  if (!show || !item) return null;

  const handleDelete = async () => {
    const { error } = await supabase.from("items").delete().eq("id", item.id);

    if (error) {
      alert(error.message);
      return;
    }

    onSuccess();
    onClose();
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
            <h5 className="modal-title">Delete Item</h5>
            <button className="btn-close" onClick={onClose} />
          </div>

          {/* BODY */}
          <div className="modal-body">
            <p>Are you sure you want to delete:</p>

            <div className="alert alert-warning mb-0">
              <strong>{item.brand || item.order_id || item.id}</strong>
            </div>
          </div>

          {/* FOOTER */}
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>

            <button className="btn btn-danger" onClick={handleDelete}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
