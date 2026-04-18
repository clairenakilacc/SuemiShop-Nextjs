"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

interface ImportCategoryProps {
  onSuccess: () => void;
  className?: string;
  buttonText?: string;
}

export default function ImportCategory({
  onSuccess,
  className = "btn btn-import",
  buttonText = "Import",
}: ImportCategoryProps) {
  const [loading, setLoading] = useState(false);

  const handleImport = async (file: File) => {
    try {
      setLoading(true);

      const text = await file.text();
      const rows = JSON.parse(text); // assuming JSON import (adjust if CSV)

      const formatted = rows
        .map((row: any) => {
          const description = row.description?.toString().trim();
          if (!description) return null;

          let created_at: string | undefined;

          if (row.created_at) {
            const date = new Date(row.created_at);
            if (!isNaN(date.getTime())) {
              created_at = date.toISOString();
            }
          }

          return {
            description,
            ...(created_at ? { created_at } : {}),
          };
        })
        .filter(Boolean);

      if (!formatted.length) {
        toast.error("No valid data to import");
        return;
      }

      const { error } = await supabase.from("categories").insert(formatted);

      if (error) throw error;

      toast.success("Categories imported successfully!");
      onSuccess();
    } catch (err: any) {
      toast.error(err.message || "Import failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <label className={className} style={{ cursor: "pointer" }}>
        {loading ? "Importing..." : buttonText}

        <input
          type="file"
          accept=".json"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleImport(file);
          }}
        />
      </label>
    </>
  );
}
