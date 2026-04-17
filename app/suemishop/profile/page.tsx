"use client";

import { useEffect, useState } from "react";
import ProfileCard from "../../components/profile/ProfileCard";
import ProfileSettings from "../../components/profile/ProfileSettings";
import PasswordSettings from "../../components/profile/PasswordSettings";

export default function ProfilePage() {
  const [userData, setUserData] = useState<any | null>(null);

  useEffect(() => {
    async function loadProfile() {
      const stored = localStorage.getItem("user");
      const localUser = stored ? JSON.parse(stored) : null;

      try {
        const res = await fetch("/api/me");
        const data = await res.json();

        if (res.ok && data.user) {
          const freshUser = {
            ...localUser,
            ...data.user,
            address: data.user?.address
              ? String(data.user.address).replace(/\s+/g, " ").trim()
              : localUser?.address || "",
            phone_number:
              data.user?.phone_number || localUser?.phone_number || "",
          };

          setUserData(freshUser);
        } else {
          setUserData(localUser || false);
        }
      } catch {
        setUserData(localUser || false);
      }
    }

    loadProfile();
  }, []);

  if (userData === null) {
    return (
      <div className="text-center mt-10 text-gray-500">Loading profile...</div>
    );
  }

  if (userData === false) {
    return (
      <div className="text-center mt-10 text-gray-500">
        You are not logged in.
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#fff9f9] flex justify-center">
      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-4 lg:gap-6 p-3 sm:p-4 lg:p-6">
        <ProfileCard user={userData} />

        <div className="flex flex-col gap-4 lg:gap-6 flex-1 min-w-0">
          <ProfileSettings user={userData} />
          <PasswordSettings user={userData} />
        </div>
      </div>
    </div>
  );
}
