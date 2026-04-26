"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Role } from "@/app/types/role";
import { validateRoleName } from "@/utils/validators/roles";

interface Props {
  show: boolean;
  role: Role | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function EditRole({ show, role, onClose, onSuccess }: Props) {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (role) {
      setName(role.name);
      setError(null);
    }
  }, [role]);

  useEffect(() => {
    if (!role) return;

    const runValidation = async () => {
      const result = await validateRoleName(name, role.id);
      setError(result);
    };

    runValidation();
  }, [name, role]);

  if (!show || !role) return null;

  const isValid = error === null;

  const handleUpdate = async () => {
    const result = await validateRoleName(name, role.id);
    setError(result);

    if (result) return;

    try {
      setLoading(true);

      const { error: dbError } = await supabase
        .from("roles")
        .update({
          name: name.trim(),
        })
        .eq("id", role.id);

      if (dbError) {
        setError(dbError.message);
        return;
      }

      onSuccess?.();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
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
            <h5 className="modal-title">Edit Role</h5>
            <button className="btn-close" onClick={onClose} />
          </div>

          {/* BODY */}
          <div className="modal-body">
            <label className="form-label fw-bold">Role Name</label>

            <input
              className={`form-control ${error ? "is-invalid" : ""}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter role name..."
            />

            {error && (
              <small className="text-danger d-block mt-1">{error}</small>
            )}
          </div>

          {/* FOOTER */}
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>

            <button
              className="btn btn-edit"
              onClick={handleUpdate}
              disabled={loading || !isValid}
            >
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
