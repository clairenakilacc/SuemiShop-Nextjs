"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Category } from "./CategoryTable";
import { validateCategoryDescription } from "@/utils/validators/categories";

interface Props {
  show: boolean;
  category: Category | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function EditCategory({
  show,
  category,
  onClose,
  onSuccess,
}: Props) {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔥 unified error state (ALL errors go here)
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (category) {
      setDescription(category.description);
      setError(null);
    }
  }, [category]);

  useEffect(() => {
    if (!category) return;

    const runValidation = async () => {
      const result = await validateCategoryDescription(
        description,
        category.id,
      );

      setError(result);
    };

    runValidation();
  }, [description, category]);

  if (!show || !category) return null;

  const isValid = error === null;

  const handleUpdate = async () => {
    const result = await validateCategoryDescription(description, category.id);

    setError(result);
    if (result) return;

    try {
      setLoading(true);

      const { error: dbError } = await supabase
        .from("categories")
        .update({
          description: description.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", category.id);

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
          <div className="modal-header bg-light">
            <h5 className="modal-title">Edit Category</h5>
            <button className="btn-close" onClick={onClose} />
          </div>

          <div className="modal-body">
            <label className="form-label ">Description</label>

            <input
              className={`form-control text-capitalize ${error ? "is-invalid" : ""}`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter category description..."
            />

            {/* 🔥 ALL ERRORS HERE (UNDER INPUT) */}
            {error && (
              <small className="text-danger d-block mt-1">{error}</small>
            )}
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>

            <button
              className="btn btn-edit"
              onClick={handleUpdate}
              disabled={loading || !isValid}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
