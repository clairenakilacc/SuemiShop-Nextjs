"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { validateCategoryDescription } from "@/utils/validators/categories";

interface AddCategoryProps {
  onSuccess: () => void;
  className?: string;
  buttonText?: string;
}

export default function AddCategory({
  onSuccess,
  className = "btn btn-add",
  buttonText = "Add Category",
}: AddCategoryProps) {
  const [showModal, setShowModal] = useState(false);
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // ✅ LIVE VALIDATION (ASYNC SAFE)
  const handleChange = async (value: string) => {
    setDescription(value);

    const result = await validateCategoryDescription(value);
    setError(result);
  };

  // ✅ SUBMIT
  const handleSubmit = async () => {
    const validationError = await validateCategoryDescription(description);

    setError(validationError);

    if (validationError) return;

    try {
      setLoading(true);

      const value = description.trim();

      // 🔥 duplicate check
      const { data: existing, error: checkError } = await supabase
        .from("categories")
        .select("id")
        .ilike("description", value);

      if (checkError) {
        setError(checkError.message);
        return;
      }

      if (existing && existing.length > 0) {
        setError("Category already exists");
        return;
      }

      // 🔥 insert
      const { error } = await supabase
        .from("categories")
        .insert([{ description: value }]);

      if (error) {
        setError(error.message);
        return;
      }

      // reset
      setDescription("");
      setError(null);
      setShowModal(false);
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to add category");
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
              {/* HEADER */}
              <div className="modal-header bg-light">
                <h5 className="modal-title">Add Category</h5>
                <button
                  className="btn-close"
                  onClick={() => {
                    setShowModal(false);
                    setError(null);
                    setDescription("");
                  }}
                />
              </div>

              {/* BODY */}
              <div className="modal-body">
                <label className="form-label">Description</label>

                <input
                  type="text"
                  className={`form-control ${error ? "is-invalid" : ""}`}
                  placeholder="Enter category name"
                  value={description}
                  onChange={(e) => handleChange(e.target.value)}
                />

                {/* 🔥 ERROR UNDER INPUT */}
                {error && (
                  <small className="text-danger d-block mt-1">{error}</small>
                )}
              </div>

              {/* FOOTER */}
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowModal(false);
                    setError(null);
                    setDescription("");
                  }}
                  disabled={loading}
                >
                  Cancel
                </button>

                <button
                  className="btn btn-add"
                  onClick={handleSubmit}
                  disabled={loading || !!error || !description.trim()}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
