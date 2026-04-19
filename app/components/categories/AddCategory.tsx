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
  const [touched, setTouched] = useState(false);

  const handleChange = async (value: string) => {
    setDescription(value);

    const result = await validateCategoryDescription(value);
    setError(result);
  };

  const handleSubmit = async () => {
    setTouched(true);

    const validationError = await validateCategoryDescription(description);
    setError(validationError);

    if (validationError) return;

    try {
      setLoading(true);

      const value = description.trim();

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

      const { error } = await supabase
        .from("categories")
        .insert([{ description: value }]);

      if (error) {
        setError(error.message);
        return;
      }

      setDescription("");
      setError(null);
      setShowModal(false);
      setTouched(false);
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
              <div className="modal-header bg-light">
                <h5 className="modal-title">Add Category</h5>
                <button
                  className="btn-close"
                  onClick={() => {
                    setShowModal(false);
                    setError(null);
                    setDescription("");
                    setTouched(false);
                  }}
                />
              </div>

              <div className="modal-body">
                <label className="form-label">Description</label>

                <input
                  type="text"
                  className={`form-control ${error && touched ? "is-invalid" : ""}`}
                  placeholder="Enter category name"
                  value={description}
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
                    setDescription("");
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
