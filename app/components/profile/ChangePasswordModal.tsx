"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import Modal from "./Modal";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChangePasswordModal({
  isOpen,
  onClose,
}: ChangePasswordModalProps) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleUpdate = async () => {
    if (!newPassword || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/profile/changepassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        toast.error(data?.error || `Server error: ${res.status}`);
      } else {
        toast.success(data?.message || "Password updated successfully!");
        setNewPassword("");
        setConfirmPassword("");
        onClose();
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Change Password">
      <div className="d-flex flex-column gap-3">
        {/* New Password */}
        <div>
          <label className="form-label fw-medium text-dark small">
            New Password
          </label>

          <div className="input-group">
            <input
              type={showNew ? "text" : "password"}
              className="form-control"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />

            <span
              className="input-group-text"
              style={{ cursor: "pointer" }}
              onClick={() => setShowNew((prev) => !prev)}
            >
              <i className={`bi ${showNew ? "bi-eye-slash" : "bi-eye"}`} />
            </span>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="form-label fw-medium text-dark small">
            Confirm New Password
          </label>

          <div className="input-group">
            <input
              type={showConfirm ? "text" : "password"}
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
            />

            <span
              className="input-group-text"
              style={{ cursor: "pointer" }}
              onClick={() => setShowConfirm((prev) => !prev)}
            >
              <i className={`bi ${showConfirm ? "bi-eye-slash" : "bi-eye"}`} />
            </span>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="d-flex justify-content-end gap-2 mt-4 pt-3">
        <button
          onClick={onClose}
          className="btn px-4 small"
          style={{ backgroundColor: "lightgrey", borderRadius: "6px" }}
          disabled={loading}
        >
          Cancel
        </button>

        <button
          onClick={handleUpdate}
          disabled={loading}
          className="btn btn-edit px-4 small"
        >
          {loading ? "Processing..." : "Update Password"}
        </button>
      </div>
    </Modal>
  );
}
