"use client";

import { useState } from "react";
import toast from "react-hot-toast";

interface DeleteSelectedProps {
  selectedCount: number;
  onConfirm: () => Promise<void> | void;
  buttonText?: string;
  confirmMessage?: string;
  className?: string;
}

export default function DeleteSelected({
  selectedCount,
  onConfirm,
  buttonText = "Delete Selected",
  confirmMessage = "Are you sure you want to delete the selected items?",
  className = "btn btn-danger",
}: DeleteSelectedProps) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOpen = () => {
    if (selectedCount === 0) {
      toast.error("Select record first");
      return;
    }
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await onConfirm();
      toast.success("Deleted successfully");
      setShowModal(false);
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button className={className} onClick={handleOpen} disabled={loading}>
        {buttonText}
      </button>

      {/* Modal */}
      {showModal && (
        <div
          className="modal fade show d-block"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-3 overflow-hidden">
              {/* Header */}
              <div className="modal-header bg-light">
                <h5 className="modal-title">Confirm Delete</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                />
              </div>

              {/* Body */}
              <div className="modal-body">
                <p>{confirmMessage}</p>

                {/* 🔥 Selected count */}
                <div className="alert alert-warning py-2 mb-0">
                  <strong>{selectedCount}</strong> item
                  {selectedCount > 1 ? "s" : ""} selected
                </div>
              </div>

              {/* Footer */}
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                  disabled={loading}
                >
                  Cancel
                </button>

                <button
                  className="btn btn-danger"
                  onClick={handleDelete}
                  disabled={loading}
                >
                  {loading ? "Deleting..." : "Yes, Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
