"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

export default function Loader() {
  const [loading, setLoading] = useState(true);

  // Hide loader once page fully loaded (not after fixed time)
  useEffect(() => {
    const handleLoad = () => setLoading(false);

    // If page already loaded from cache
    if (document.readyState === "complete") {
      setLoading(false);
    } else {
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
  }, []);

  if (!loading) return null;

  return (
    <div className="loader-container">
      <Image
        src="/images/logo2.png"
        alt="Loading..."
        width={120}
        height={120}
        className="img-fluid loader-image"
        priority
      />
    </div>
  );
}
