"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import { Category } from "./CategoryTable";

interface Props {
  show: boolean;
  category: Category | null;
  onClose: () => void;
  onSuccess?: () => void;
  onRefresh?: () => void;
}

export default function EditCategory({
  show,
  category,
  onClose,
  onSuccess,
}: Props) {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category) setDescription(category.description);
  }, [category]);

  if (!show || !category) return null;

  const handleUpdate = async () => {
    if (!description.trim()) {
      toast.error("Description is required");
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase
        .from("categories")
        .update({
          description: description.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", category.id);

      if (error) throw error;

      toast.success("Category updated");
      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast.error(err.message);
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
            <label className="form-label">Description</label>

            <input
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>

            <button
              className="btn btn-edit"
              onClick={handleUpdate}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
