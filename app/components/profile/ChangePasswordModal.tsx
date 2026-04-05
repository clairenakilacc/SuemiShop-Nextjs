"use client";

<<<<<<< HEAD
type Props = {
  show: boolean;
  onClose: () => void;
};

export default function EditProfileModal({ show, onClose }: Props) {
  if (!show) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="modal-backdrop fade show" />

      <div className="modal fade show d-block" tabIndex={-1}>
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content" style={{ borderRadius: 12 }}>
            <div className="modal-header">
              <h5 className="modal-title fw-semibold">Edit Profile</h5>
              <button className="btn-close" onClick={onClose} />
            </div>

            <div className="modal-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small text-muted">
                    Real Name
                  </label>
                  <input className="form-control form-control-sm" />
                </div>

                <div className="col-md-6">
                  <label className="form-label small text-muted">
                    Username
                  </label>
                  <input className="form-control form-control-sm" />
                </div>

                <div className="col-md-12">
                  <label className="form-label small text-muted">
                    Address
                  </label>
                  <textarea className="form-control form-control-sm" />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-sm btn-secondary"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="btn btn-sm"
                style={{ backgroundColor: "#FFB6C1" }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
=======
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
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
    // Client-side validation
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

      const data = await res.json().catch(() => null); // fallback if JSON parsing fails

      if (!res.ok) {
        toast.error(data?.error || `Server error: ${res.status}`);
      } else {
        toast.success(data?.message || "Profile updated successfully! 🚀");
        setNewPassword("");
        setConfirmPassword("");
        onClose();
      }
    } catch (err: any) {
      console.error("Unexpected error:", err);
      toast.error("Something went wrong: " + (err.message || "Unknown error"));
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
          <div
            className="input-group border rounded"
            style={{ overflow: "hidden" }}
          >
            <input
              type={showNew ? "text" : "password"}
              className="form-control border-0 shadow-none"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password (min 6 characters)"
            />
            <button
              className="btn bg-white border-0"
              type="button"
              onClick={() => setShowNew(!showNew)}
            >
              {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="form-label fw-medium text-dark small">
            Confirm New Password
          </label>
          <div
            className="input-group border rounded"
            style={{ overflow: "hidden" }}
          >
            <input
              type={showConfirm ? "text" : "password"}
              className="form-control border-0 shadow-none"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
            />
            <button
              className="btn bg-white border-0"
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="d-flex justify-content-end gap-2 mt-4 pt-3">
        <button
          onClick={onClose}
          className="btn btn-light px-4 small"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          onClick={handleUpdate}
          disabled={loading}
          className="btn px-4 small"
          style={{ backgroundColor: "#FFB6C1" }}
        >
          {loading ? "Processing..." : "Update Password"}
        </button>
      </div>
    </Modal>
>>>>>>> 89c1300caeecf60ade28c4d49c7af729f3923542
  );
}
