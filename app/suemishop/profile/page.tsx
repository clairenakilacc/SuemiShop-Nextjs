"use client";

import { useEffect, useState } from "react";
import ProfileCard from "../../components/profile/Profilecard";
import ProfileSettings from "../../components/profile/ProfileSettings";
import PasswordSettings from "../../components/profile/PasswordSettings";

export default function ProfilePage() {
  const [userData, setUserData] = useState<any | null>(null);

  useEffect(() => {
    async function loadProfile() {
      // 1. Kunin ang fallback mula sa localStorage
      const stored = localStorage.getItem("user");
      const localUser = stored ? JSON.parse(stored) : null;

      try {
        // 2. Fetch fresh data mula sa API
        const res = await fetch("/api/me");
        const data = await res.json();

        if (res.ok && data.user) {
          // 3. Merge at linisin ang data (lalo na ang address na nagdo-doble)
          const freshUser = {
            ...localUser,
            ...data.user,
            // Tanggalin ang extra spaces/newlines para hindi magmukhang doble sa textarea
            address: data.user?.address
              ? String(data.user.address).replace(/\s+/g, " ").trim()
              : localUser?.address || "",
            phone_number:
              data.user?.phone_number || localUser?.phone_number || "",
          };

          // NOTE: Tinanggal ang localStorage.setItem dito para iwas infinite reload
          setUserData(freshUser);
        } else if (localUser) {
          setUserData(localUser);
        } else {
          setUserData(false);
        }
      } catch (err) {
        setUserData(localUser || false);
      }
    }

    loadProfile();
  }, []);

  if (userData === null) {
    return (
      <div className="text-center text-gray-500 mt-10">Loading profile...</div>
    );
  }

  if (userData === false) {
    return (
      <div className="text-center text-gray-500 mt-10">
        You are not logged in.
      </div>
    );
  }

  return (
    <div className="flex w-full gap-6 p-6 bg-[#fff9f9] min-h-screen">
      <ProfileCard user={userData} />
      <div className="flex flex-col gap-6 flex-1">
        <ProfileSettings user={userData} />
        <PasswordSettings user={userData} />
      </div>
    </div>
  );
}
