"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { FaGoogle } from "react-icons/fa";
import { ROUTES } from "./routes";

export default function HomePage() {
  const bags = [
    { id: 1, src: "/images/bag1.jpg", name: "Leather Tote" },
    { id: 2, src: "/images/bag2.jpg", name: "Backpack" },
    { id: 3, src: "/images/bag3.png", name: "Clutch" },
    { id: 4, src: "/images/bag4.png", name: "Messenger Bag" },
  ];

  const [user, setUser] = useState<any>(null);

  // Listen to auth changes
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      },
    );

    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user ?? null);
    };
    getUser();

    return () => listener.subscription.unsubscribe();
  }, []);

  // Google login
  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      console.error(err.message);
    }
  };

  return (
    <main
      className="min-h-screen flex flex-col items-center"
      style={{ background: "var(--background)", color: "var(--foreground)" }}
    >
      {/* Hero Section */}
      <section
        className="w-full flex flex-col items-center justify-center text-center py-20 px-6"
        style={{ backgroundColor: "#ffd2da" }}
      >
        <h1 className="text-5xl font-bold mb-4 text-foreground">
          Discover Your Perfect Bag
        </h1>
        <p className="text-lg mb-8 max-w-xl text-foreground">
          Stylish, durable, and perfect for every occasion. Explore our
          exclusive collection today!
        </p>

        {!user ? (
          <div className="flex flex-col items-center gap-4">
            {/* Regular Login/Register */}
            <div className="flex gap-4">
              <Link
                href={ROUTES.LOGIN}
                className="btn-rose px-6 py-3 font-semibold rounded-lg"
              >
                Login
              </Link>

              <Link
                href={ROUTES.REGISTER}
                className="px-6 py-3 font-semibold rounded-lg bg-black text-white hover:bg-gray-800 transition"
              >
                Register
              </Link>
            </div>

            {/* Google login below with white background and same edges */}
            <button
              onClick={handleGoogleLogin}
              className="flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-lg bg-white border border-gray-300 hover:bg-gray-100 transition"
            >
              <FaGoogle size={20} />
              Login with Google
            </button>
          </div>
        ) : (
          <div className="flex gap-4">
            <span className="font-semibold">Welcome, {user.email}</span>
            <button
              onClick={async () => await supabase.auth.signOut()}
              className="px-6 py-3 font-semibold rounded-lg bg-red text-white hover:bg-red-300 transition"
            >
              Logout
            </button>
          </div>
        )}
      </section>

      {/* Bag Collection */}
      <section className="max-w-7xl w-full px-6 py-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Our Collection</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {bags.map((bag) => (
            <div
              key={bag.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:scale-105 transform transition cursor-pointer"
            >
              <img
                src={bag.src}
                alt={bag.name}
                className="w-full h-60 object-cover"
              />
              <div className="p-4 text-center">
                <h3 className="font-semibold text-lg">{bag.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
