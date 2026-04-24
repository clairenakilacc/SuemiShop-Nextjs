"use client";

import { useState } from "react";
import toast from "react-hot-toast";
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    role_id: "",
  });

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    if (!form.name.trim()) {
      setError("Name is required");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        name: form.name,
        email: form.email || null,
        role_id: form.role_id ? Number(form.role_id) : null,
      };

      const { error } = await supabase.from("users").insert([payload]);

      if (error) throw error;

      toast.success("User added");

      setForm({
        name: "",
        email: "",
        role_id: "",
      });

      setShowModal(false);
      onSuccess();
    } catch (e: any) {
      setError(e.message);
      toast.error(e.message);
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
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content rounded-3 overflow-hidden">
              <div className="modal-header bg-light">
                <h5 className="modal-title">Add User</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                />
              </div>

              <div className="modal-body">
                {error && <div className="alert alert-danger">{error}</div>}

                {/* BASIC INFO */}
                <label className="form-label fw-bold">User Info</label>

                <div className="row g-2 mb-3">
                  <div className="col-md-6">
                    <input
                      className="form-control"
                      placeholder="Name"
                      value={form.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                    />
                  </div>

                  <div className="col-md-6">
                    <input
                      className="form-control"
                      placeholder="Email"
                      value={form.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                    />
                  </div>

                  <div className="col-md-6">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Role ID"
                      value={form.role_id}
                      onChange={(e) => handleChange("role_id", e.target.value)}
                    />
                  </div>
                </div>
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
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
