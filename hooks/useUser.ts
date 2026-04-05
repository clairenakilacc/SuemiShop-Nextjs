"use client";

import { useEffect, useState } from "react";

export function useUser() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
      setLoading(false);
    } else {
      fetch("/api/me")
        .then((res) => res.json())
        .then((data) => {
          setUser(data.user);
          if (data.user) {
            localStorage.setItem("user", JSON.stringify(data.user));
          }
        })
        .finally(() => setLoading(false));
    }
  }, []);

  return { user, loading };
}
