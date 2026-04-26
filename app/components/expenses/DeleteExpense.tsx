"use client";

import { supabase } from "@/lib/supabase";
import type { Expense } from "@/app/types/expense";
import toast from "react-hot-toast";

interface Props {
  show: boolean;
  expense: Expense | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function DeleteExpense({
  show,
  expense,
  onClose,
  onSuccess,
}: Props) {
  if (!show || !expense) return null;

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from("expenses")
        .delete()
        .eq("id", expense.id);

      if (error) throw error;

      toast.success("Deleted successfully");

      onSuccess?.(); // 🔥 refresh table
      onClose();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div
      className="modal fade show d-block"
      style={{ background: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5>Delete Expense</h5>
            <button className="btn-close" onClick={onClose} />
          </div>

          <div className="modal-body">
            Are you sure you want to delete:
            <div className="alert alert-warning mt-2">
              {expense.description}
            </div>
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>

            <button className="btn btn-danger" onClick={handleDelete}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
