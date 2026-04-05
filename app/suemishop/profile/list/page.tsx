"use client";
import ProfileCard from "../../../components/profile/Profilecard";
import ProfileSettings from "../../../components/profile/ProfileSettings";
import PasswordSettings from "../../../components/profile/PasswordSettings";

export default function ProfilePage() {
  return (
    // Dagdagan ng w-full dito sa main container
    <div className="flex w-full gap-6 p-6 bg-[#fff9f9] min-h-screen"> 
      
      <ProfileCard />

      {/* PALITAN: 'max-w-3xl' -> 'flex-1' 
         Para kainin nito yung buong bakanteng space sa kanan 
      */}
      <div className="flex flex-col gap-6 flex-1"> 
        <ProfileSettings />
        <PasswordSettings />
      </div>

    </div>
  );
}