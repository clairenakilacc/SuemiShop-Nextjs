"use client";

import toast from "react-hot-toast";
import { supabase } from "@/lib/supabase";
import { Role } from "@/app/types/role";

interface Props {
  show: boolean;
  role: Role | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function DeleteRole({ show, role, onClose, onSuccess }: Props) {
  if (!show || !role) return null;

  const handleDelete = async () => {
    try {
      const { error } = await supabase.from("roles").delete().eq("id", role.id);

      if (error) throw error;

      toast.success("Role deleted");
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
          {/* HEADER */}
          <div className="modal-header bg-light">
            <h5 className="modal-title">Delete Role</h5>
            <button className="btn-close" onClick={onClose} />
          </div>

          {/* BODY */}
          <div className="modal-body">
            <p>Are you sure you want to delete:</p>

            <div className="alert alert-warning mb-0">
              <strong>{role.name}</strong>
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
