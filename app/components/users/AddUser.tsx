"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

interface AddUserProps {
  onSuccess: () => void;
  className?: string;
  buttonText?: string;
}

export default function AddUser({
  onSuccess,
  className = "btn btn-add",
  buttonText = "Add User",
}: AddUserProps) {
  const [showModal, setShowModal] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  const handleSubmit = async () => {
    setTouched(true);

    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.from("users").insert([
        {
          name: name.trim(),
          email: email.trim() || null,
        },
      ]);

      if (error) {
        setError(error.message);
        return;
      }

      setName("");
      setEmail("");
      setError(null);
      setShowModal(false);
      setTouched(false);

      onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to add user");
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
                <h5 className="modal-title">Add User</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                />
              </div>

              <div className="modal-body">
                <label className="form-label">Name</label>
                <input
                  className="form-control mb-2"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => setTouched(true)}
                />

                <label className="form-label">Email</label>
                <input
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                {error && touched && (
                  <small className="text-danger d-block mt-2">{error}</small>
                )}
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
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
