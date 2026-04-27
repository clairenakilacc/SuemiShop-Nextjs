"use client";

import { supabase } from "@/lib/supabase";
import type { Inventory } from "@/app/types/inventory";

interface Props {
  show: boolean;
  inventory: Inventory | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DeleteInventory({
  show,
  inventory,
  onClose,
  onSuccess,
}: Props) {
  if (!show || !inventory) return null;

  const handleDelete = async () => {
    await supabase.from("inventories").delete().eq("id", inventory.id);
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
            <h5>Delete Inventory</h5>
            <button className="btn-close" onClick={onClose} />
          </div>

          <div className="modal-body">
            Are you sure you want to delete <b>{inventory.box_number}</b>?
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
