"use client";

import { useState } from "react";
import EditProfileModal from "../../components/profile/EditProfileModal";

interface ProfileSettingsProps {
  user: any;
}

export default function ProfileSettings({ user }: ProfileSettingsProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <div className="w-full">
      <h5 className="fw-bold mb-3 text-dark">Profile Settings</h5>

      <div className="bg-white rounded-xl shadow-md p-4 sm:p-5">
        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* NAME */}
          <div>
            <label className="form-label">Name</label>
            <input className="form-control" value={user?.name || ""} readOnly />
          </div>

          {/* EMAIL */}
          <div>
            <label className="form-label">Email</label>
            <input
              className="form-control"
              value={user?.email || ""}
              readOnly
            />
          </div>

          {/* PHONE */}
          <div>
            <label className="form-label">Phone Number</label>
            <input
              className="form-control"
              value={user?.phone_number || ""}
              readOnly
            />
          </div>

          {/* ADDRESS */}
          <div>
            <label className="form-label">Address</label>
            <input
              className="form-control"
              value={user?.address || ""}
              readOnly
            />
          </div>
        </div>

        {/* EDIT BUTTON (RIGHT + WITH SPACING) */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => setIsEditOpen(true)}
            className="btn"
            style={{
              backgroundColor: "#FFB6C1",
              border: "none",
              padding: "8px 24px",
              color: "#333",
              borderRadius: "6px",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#ff9eb3";
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow =
                "0 6px 16px rgba(255, 182, 193, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#FFB6C1";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
            }}
          >
            Edit
          </button>
        </div>
      </div>

      <EditProfileModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        user={user}
      />
    </div>
  );
}
