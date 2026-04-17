"use client";

import { useEffect, useState } from "react";

interface User {
  name?: string;
  email?: string;
  address?: string;
  gender?: string;
  role?: any; // important: can be object
}

interface ProfileCardProps {
  user: User | null;
}

export default function ProfileCard({ user }: ProfileCardProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) setLoading(false);
  }, [user]);

  const isFemale =
    user?.gender === "female" || user?.email === "superadmin@gmail.com";

  // ✅ SAFE ROLE HANDLING
  const roleName =
    typeof user?.role === "object" ? user?.role?.name : user?.role;

  return (
    <div className="w-full lg:w-[340px] flex justify-center lg:justify-start shrink-0">
      <div className="w-full max-w-sm sm:max-w-md lg:max-w-sm bg-white rounded-xl shadow-md text-center p-4 sm:p-5 lg:p-6 min-w-0">
        {/* AVATAR */}
        <div
          className="mx-auto mb-4 flex items-center justify-center rounded-full"
          style={{
            width: "clamp(90px, 20vw, 130px)",
            height: "clamp(90px, 20vw, 130px)",
            fontSize: "clamp(36px, 6vw, 52px)",
            backgroundColor: "#FFB6C1",
          }}
        >
          {loading ? "⏳" : isFemale ? "👧🏻" : "👦🏻"}
        </div>

        {/* NAME */}
        <p className="font-bold text-base sm:text-lg capitalize truncate w-full px-2">
          {user?.name || "Loading..."}
        </p>
        {/* EMAIL */}
        <p className="text-gray-500 text-sm sm:text-base truncate px-2 mt-1">
          {user?.email || "email@example.com"}
        </p>

        {/* ADDRESS */}
        <p className="text-gray-500 text-sm sm:text-base truncate mt-2 px-2">
          {user?.address || "No address provided."}
        </p>

        {/* ROLE (FIXED) */}
        <p className="text-gray-500 text-sm sm:text-base truncate mt-2 px-2">
          Role: {roleName || "No role assigned"}
        </p>
      </div>
    </div>
  );
}
