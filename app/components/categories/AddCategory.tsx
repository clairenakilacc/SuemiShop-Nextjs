"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
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

  // live validation handled here
  const handleChange = (value: string) => {
    setDescription(value);
    setError(validateCategoryDescription(value));
  };

  const handleSubmit = async () => {
    const validationError = validateCategoryDescription(description);

    setError(validationError);

    if (validationError) return;

    try {
      setLoading(true);

      const value = description.trim();

      // check duplicate (case-insensitive)
      const { data: existing, error: checkError } = await supabase
        .from("categories")
        .select("id")
        .ilike("description", value);

      if (checkError) throw checkError;

      if (existing && existing.length > 0) {
        setError("Category already exists");
        return;
      }

      const { error } = await supabase
        .from("categories")
        .insert([{ description: value }]);

      if (error) throw error;

      toast.success("Category added successfully!");

      setDescription("");
      setError(null);
      setShowModal(false);
      onSuccess();
    } catch (err: any) {
      toast.error(err.message || "Failed to add category");
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
                  }}
                />
              </div>

              <div className="modal-body">
                <label className="form-label">Description</label>

                <input
                  type="text"
                  className={`form-control ${error ? "is-invalid" : ""}`}
                  placeholder="Enter category name"
                  value={description}
                  onChange={(e) => handleChange(e.target.value)}
                />

                {error && (
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
                  }}
                  disabled={loading}
                >
                  Cancel
                </button>

                <button
                  className="btn btn-add"
                  onClick={handleSubmit}
                  disabled={loading || !!error || !description.trim()}
                  style={{ opacity: 1 }}
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
