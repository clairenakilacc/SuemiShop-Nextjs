"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import { validateCategoryDescription } from "@/utils/validators/categories";

interface BulkEditCategoryProps {
  selectedIds: string[];
  onSuccess: () => void;
}

export default function BulkEditCategory({
  selectedIds,
  onSuccess,
}: BulkEditCategoryProps) {
  const [show, setShow] = useState(false);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (value: string) => {
    setDescription(value);
    setError(validateCategoryDescription(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateCategoryDescription(description);
    setError(validationError);

    if (validationError) return;

    if (!selectedIds.length) {
      toast.error("Select categories first.");
      return;
    }

    try {
      setLoading(true);

      const value = description.trim();

      const { error } = await supabase
        .from("categories")
        .update({ description: value })
        .in("id", selectedIds);

      if (error) throw error;

      toast.success("Categories updated successfully!");

      setDescription("");
      setShow(false);
      onSuccess();
    } catch (err: any) {
      toast.error(err.message || "Failed to update categories");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        className="btn btn-warning"
        onClick={() => {
          if (!selectedIds.length) {
            toast.error("Select records first.");
            return;
          }
          setShow(true);
        }}
      >
        Edit
      </button>

      {/* Modal */}
      {show && (
        <div
          className="modal fade show d-block"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-3 overflow-hidden">
              <div className="modal-header bg-light">
                <h5 className="modal-title">Bulk Edit Categories</h5>
                <button
                  className="btn-close"
                  onClick={() => {
                    setShow(false);
                    setError(null);
                    setDescription("");
                  }}
                />
              </div>

              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <label className="form-label">New Description</label>

                  <input
                    type="text"
                    className={`form-control ${error ? "is-invalid" : ""}`}
                    placeholder="Enter new category name"
                    value={description}
                    onChange={(e) => handleChange(e.target.value)}
                  />

                  {error && (
                    <small className="text-danger d-block mt-1">{error}</small>
                  )}
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShow(false)}
                    disabled={loading}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn btn-warning"
                    disabled={loading || !!error}
                    style={{ opacity: 1 }}
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
