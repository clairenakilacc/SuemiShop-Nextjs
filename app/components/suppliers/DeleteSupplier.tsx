"use client";

import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import type { Supplier } from "@/app/types/supplier";

interface Props {
  show: boolean;
  supplier: Supplier | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function DeleteSupplier({
  show,
  supplier,
  onClose,
  onSuccess,
}: Props) {
  if (!show || !supplier) return null;

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from("suppliers")
        .delete()
        .eq("id", supplier.id);

      if (error) throw error;

      toast.success("Supplier deleted");
      onSuccess?.();
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
          <div className="modal-header bg-light">
            <h5 className="modal-title">Delete Supplier</h5>
            <button className="btn-close" onClick={onClose} />
          </div>

          <div className="modal-body">
            <p>Are you sure you want to delete:</p>

            <div className="alert alert-warning mb-0">
              <strong>{supplier.name}</strong>
            </div>
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
