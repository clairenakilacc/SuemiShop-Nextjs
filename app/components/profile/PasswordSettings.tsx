"use client";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import ChangePasswordModal from "../../components/profile/ChangePasswordModal";

interface PasswordSettingsProps {
  user: any;
}

export default function PasswordSettings({ user }: PasswordSettingsProps) {
  const [isPassOpen, setIsPassOpen] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  return (
    <div>
      <h5 className="fw-bold mb-3 text-dark">Password Settings</h5>

      <div
        className="card position-relative"
        style={{
          borderRadius: 15,
          border: "none",
          boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
          paddingBottom: "80px",
        }}
      >
        <div className="card-body p-4">
          <label className="form-label">Old Password</label>
          <input
            type="password"
            disabled
            className="form-control mb-3"
            placeholder="***********"
            style={{ backgroundColor: "#f8f9fa" }}
          />

          <label className="form-label">New Password</label>
          <div className="input-group mb-3">
            <input
              type={showNewPass ? "text" : "password"}
              className="form-control"
              disabled
              placeholder="***********"
              style={{ borderRight: "none", backgroundColor: "#f8f9fa" }}
            />
            <span
              className="input-group-text bg-white"
              style={{
                cursor: "pointer",
                borderLeft: "none",
                borderColor: "#ced4da",
              }}
              onClick={() => setShowNewPass(!showNewPass)}
            >
              {showNewPass ? (
                <EyeOff size={18} className="text-muted" />
              ) : (
                <Eye size={18} className="text-muted" />
              )}
            </span>
          </div>

          {/* Edit Button */}
          <button
            onClick={() => setIsPassOpen(true)}
            className="btn btn-edit position-absolute"
            style={{
              bottom: "20px",
              right: "20px",
            }}
          >
            Edit
          </button>
        </div>
      </div>

      {/* Modal */}
      <ChangePasswordModal
        isOpen={isPassOpen}
        onClose={() => setIsPassOpen(false)}
      />
    </div>
  );
}
