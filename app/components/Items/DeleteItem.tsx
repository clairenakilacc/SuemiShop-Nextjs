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
    <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5>Delete Item</h5>
            <button className="btn-close" onClick={onClose} />
          </div>

          <div className="modal-body">
            Are you sure you want to delete:
            <br />
            <strong>{item.brand || item.order_id || item.id}</strong>?
          </div>

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
