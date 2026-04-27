"use client";

import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
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
    try {
      const { error } = await supabase
        .from("inventories")
        .delete()
        .eq("id", inventory.id);

      if (error) throw error;

      toast.success("Inventory deleted");
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message);
    }
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
            <h5 className="modal-title">Delete Inventory</h5>
            <button className="btn-close" onClick={onClose} />
          </div>

          {/* BODY */}
          <div className="modal-body">
            <p>Are you sure you want to delete:</p>

            <div className="alert alert-warning mb-0">
              <strong>{inventory.box_number || "Inventory item"}</strong>
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
