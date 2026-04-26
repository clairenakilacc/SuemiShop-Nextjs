"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

import ProfileCard from "../../../components/profile/ProfileCard";
import ProfileSettings from "../../../components/profile/ProfileSettings";
import PasswordSettings from "../../../components/profile/PasswordSettings";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: auth } = await supabase.auth.getUser();

      if (!auth?.user) return;

      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("id", auth.user.id)
        .single();

      setUser(data);
    };

    fetchUser();
  }, []);

  if (!user) return null;

  return (
    <div className="flex w-full gap-6 p-6 bg-[#fff9f9] min-h-screen">
      <ProfileCard user={user} />

      <div className="flex flex-col gap-6 flex-1">
        <ProfileSettings user={user} />
        <PasswordSettings user={user} />
      </div>
    </div>
  );
}
