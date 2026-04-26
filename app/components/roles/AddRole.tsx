"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { validateRoleName } from "@/utils/validators/roles";

/* =========================
   Props
========================= */
interface AddRoleProps {
  onSuccess: () => void;
  className?: string;
  buttonText?: string;
}

/* =========================
   Component
========================= */
export default function AddRole({
  onSuccess,
  className = "btn btn-add",
  buttonText = "Add Role",
}: AddRoleProps) {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);

  /* =========================
     LIVE VALIDATION (NOW FROM UTILS)
  ========================= */
  const handleChange = async (value: string) => {
    setName(value);

    const result = await validateRoleName(value);
    setError(result);
  };

  /* =========================
     SUBMIT
  ========================= */
  const handleSubmit = async () => {
    setTouched(true);

    const validationError = await validateRoleName(name);
    setError(validationError);

    if (validationError) return;

    try {
      setLoading(true);

      const value = name.trim();

      const { error } = await supabase.from("roles").insert([
        {
          name: value,
        },
      ]);

      if (error) {
        setError(error.message);
        return;
      }

      setName("");
      setError(null);
      setShowModal(false);
      setTouched(false);

      onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to add role");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        className={className}
        onClick={() => setShowModal(true)}
        disabled={loading}
      >
        {buttonText}
      </button>

      {showModal && (
        <div
          className="modal fade show d-block"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-3 overflow-hidden">
              <div className="modal-header bg-light">
                <h5 className="modal-title">Add Role</h5>
                <button
                  className="btn-close"
                  onClick={() => {
                    setShowModal(false);
                    setError(null);
                    setName("");
                    setTouched(false);
                  }}
                />
              </div>

              <div className="modal-body">
                <label className="form-label fw-bold">Role Name</label>

                <input
                  type="text"
                  className={`form-control ${
                    error && touched ? "is-invalid" : ""
                  }`}
                  placeholder="Enter role name"
                  value={name}
                  onChange={(e) => handleChange(e.target.value)}
                  onBlur={() => setTouched(true)}
                />

                {error && touched && (
                  <small className="text-danger d-block mt-1">{error}</small>
                )}
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowModal(false);
                    setError(null);
                    setName("");
                    setTouched(false);
                  }}
                  disabled={loading}
                >
                  Cancel
                </button>

                <button
                  className="btn btn-add"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
