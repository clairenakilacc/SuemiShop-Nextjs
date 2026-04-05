"use client";

import { useState, useEffect } from "react";

interface User {
  name?: string;
  email?: string;
  address?: string;
  gender?: string;
}

interface ProfileCardProps {
  user: User | null;
}

export default function ProfileCard({ user }: ProfileCardProps) {
  // State to track loading
  const [loading, setLoading] = useState(true);

  // Effect: consider user data "loaded" once user object exists
  useEffect(() => {
    if (user) {
      setLoading(false);
    }
  }, [user]);

  // Determine avatar emoji
  const isFemale =
    user?.gender === "female" || user?.email === "superadmin@gmail.com";
  const avatarEmoji = isFemale ? "👧🏻" : "👦🏻";

  // Safely handle missing fields
  const name = user?.name || "Loading...";
  const email = user?.email || "email@example.com";
  const address = user?.address ?? "No address provided.";

  return (
    <div
      className="card text-center"
      style={{
        width: 360,
        height: 500,
        borderRadius: 15,
        border: "none",
        boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
        position: "relative",
      }}
    >
      <div className="card-body p-4">
        {/* Avatar */}
        <div
          className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
          style={{
            width: 160,
            height: 160,
            fontSize: 60,
            backgroundColor: "#FFB6C1", //pink
          }}
        >
          {loading ? "⏳" : avatarEmoji}
        </div>

        {/* Name */}
        <h5 className="text-capitalize fw-bold mb-1 fs-4">
          {loading ? "Loading..." : name}
        </h5>

        {/* Email */}
        <p className="text-muted mb-4" style={{ fontSize: "0.95rem" }}>
          {loading ? "Loading email..." : email}
        </p>

        {/* Address */}
        <p
          className="text-muted text-capitalize"
          style={{ lineHeight: 1.6, whiteSpace: "pre-line" }}
        >
          {loading ? "Fetching address..." : address}
        </p>
      </div>
    </div>
  );
}
