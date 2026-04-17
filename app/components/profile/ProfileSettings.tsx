"use client";
import { useEffect, useState } from "react";
import EditProfileModal from "../../components/profile/EditProfileModal";
import { supabase } from "@/lib/supabase";

// 1. I-declare ang interface para sa user prop
interface ProfileSettingsProps {
  user: any;
}

// 2. Tanggapin ang { user } sa function arguments
export default function ProfileSettings({ user }: ProfileSettingsProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <div>
      <h5 className="fw-bold mb-3 text-dark">Profile Settings</h5>
      <div
        className="card position-relative"
        style={{
          borderRadius: 15,
          border: "none",
          boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
        }}
      >
        <div className="card-body p-3 pb-5">
          <div className="row g-4">
            {/* LEFT COLUMN */}
            <div className="col-md-6">
              <label className="form-label">Name</label>
              {/* Gamitin ang nickname base sa database mo */}
              <input
                className="form-control"
                value={user?.name || ""}
                readOnly
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Email</label>
              <input
                className="form-control"
                value={user?.email || ""}
                readOnly
              />
            </div>
            <div className="col-md-6 my-5">
              <label className="form-label">Phone Number</label>
              <input
                className="form-control"
                value={user?.phone_number || ""}
                readOnly
              />
            </div>

            {/* RIGHT COLUMN */}
            <div className="col-md-6">
              <label className="form-label">Address</label>
              <textarea
                className="form-control"
                rows={3}
                value={user?.address || ""}
                readOnly
              />
            </div>
          </div>

          <button
            className="btn position-absolute "
            onClick={() => setIsEditOpen(true)}
            style={{
              bottom: 20,
              right: 20,
              backgroundColor: "#FFB6C1", // Original pink color
              border: "none",
              padding: "8px 24px",
              color: "#333",
              borderRadius: "6px",
              transition: "all 0.3s ease", // Ito ang sikreto para smooth ang transition
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              fontWeight: "500",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#ff9eb3"; // Mag-da-darken ng konti
              e.currentTarget.style.transform = "translateY(-3px)"; // Aangat ng konti
              e.currentTarget.style.boxShadow =
                "0 6px 15px rgba(255, 182, 193, 0.4)"; // Lalakas ang glow
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#FFB6C1"; // Balik sa dati
              e.currentTarget.style.transform = "translateY(0)"; // Balik sa pwesto
              e.currentTarget.style.boxShadow = "0 2px 5px rgba(0,0,0,0.1)"; // Balik ang anino
            }}
          >
            Edit
          </button>
        </div>
      </div>

      {/* 3. Ipasa ang user sa Modal */}
      <EditProfileModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        user={user} // Dito nanggagaling ang error sa Line 63
      />
    </div>
  );
}
