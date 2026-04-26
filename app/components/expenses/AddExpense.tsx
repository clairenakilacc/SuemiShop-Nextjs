"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

import {
  validateDescription,
  validateAmount,
} from "@/utils/validators/expense";

interface AddExpenseProps {
  onSuccess: () => void;
  className?: string;
  buttonText?: string;
}

export default function AddExpense({
  onSuccess,
  className = "btn btn-add",
  buttonText = "Add Expense",
}: AddExpenseProps) {
  const [showModal, setShowModal] = useState(false);

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);

  const handleSubmit = async () => {
    setTouched(true);

    const descError = await validateDescription(description);
    const amountError = validateAmount(amount);

    const validationError = descError || amountError;

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.from("expenses").insert([
        {
          description: description.trim(),
          amount: Number(amount),
        },
      ]);

      if (error) {
        setError(error.message);
        return;
      }

      // reset
      setDescription("");
      setAmount("");
      setError(null);
      setTouched(false);
      setShowModal(false);

      onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to add expense");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* BUTTON */}
      <button
        className={className}
        onClick={() => setShowModal(true)}
        disabled={loading}
      >
        {buttonText}
      </button>

      {/* MODAL */}
      {showModal && (
        <div
          className="modal fade show d-block"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-3 overflow-hidden">
              {/* HEADER */}
              <div className="modal-header bg-light">
                <h5 className="modal-title">Add Expense</h5>
                <button
                  className="btn-close"
                  onClick={() => {
                    setShowModal(false);
                    setError(null);
                    setDescription("");
                    setAmount("");
                    setTouched(false);
                  }}
                />
              </div>

              {/* BODY */}
              <div className="modal-body">
                {/* LABEL */}
                <label className="form-label fw-bold mb-2">
                  Expense Information
                </label>

                {/* DESCRIPTION */}
                <input
                  type="text"
                  className={`form-control mb-3 ${
                    error && touched ? "is-invalid" : ""
                  }`}
                  placeholder="Enter description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onBlur={() => setTouched(true)}
                />

                {/* AMOUNT */}
                <input
                  type="number"
                  className={`form-control ${
                    error && touched ? "is-invalid" : ""
                  }`}
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  onBlur={() => setTouched(true)}
                />

                {/* ERROR */}
                {error && touched && (
                  <small className="text-danger d-block mt-2">{error}</small>
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
                    setAmount("");
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
                  {loading ? "Saving..." : "Add"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
