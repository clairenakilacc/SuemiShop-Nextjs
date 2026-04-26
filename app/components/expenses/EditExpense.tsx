"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Expense } from "@/app/types/expense";

import {
  validateDescription,
  validateAmount,
} from "@/utils/validators/expense";

interface Props {
  show: boolean;
  expense: Expense | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function EditExpense({
  show,
  expense,
  onClose,
  onSuccess,
}: Props) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!expense) return;

    setDescription(expense.description ?? "");
    setAmount(expense.amount != null ? String(expense.amount) : "");
    setError(null);
  }, [expense]);

  if (!show || !expense) return null;

  const handleUpdate = async () => {
    const descError = await validateDescription(description);
    const amountError = validateAmount(amount);

    const validationError = descError || amountError;

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase
        .from("expenses")
        .update({
          description: description.trim(),
          amount: Number(amount),
        })
        .eq("id", expense.id);

      if (error) throw error;

      onSuccess?.(); // 🔥 triggers refresh
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
        <div className="modal-content">
          <div className="modal-header">
            <h5>Edit Expense</h5>
            <button className="btn-close" onClick={onClose} />
          </div>

          <div className="modal-body">
            <input
              className={`form-control mb-2 ${error ? "is-invalid" : ""}`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
            />

            <input
              type="number"
              className={`form-control ${error ? "is-invalid" : ""}`}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount"
            />

            {error && <small className="text-danger">{error}</small>}
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
              {loading ? "Saving..." : "Edit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
