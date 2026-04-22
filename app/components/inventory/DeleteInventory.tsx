"use client";

import { supabase } from "@/lib/supabase";

export default function DeleteInventory({
  show,
  item,
  onClose,
  onSuccess,
}: any) {
  if (!show || !item) return null;

  const handleDelete = async () => {
    await supabase.from("inventories").delete().eq("id", item.id);
    onSuccess();
    onClose();
  };

  return (
    <div
      className="modal fade show d-block"
      style={{ background: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content rounded-3">
          <div className="modal-header bg-light">
            <h5>Delete Inventory</h5>
            <button className="btn-close" onClick={onClose} />
          </div>

          <div className="modal-body">
            Delete <b>{item.box_number}</b>?
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
