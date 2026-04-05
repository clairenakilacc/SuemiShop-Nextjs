"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

interface EditButtonDataTableProps<T> {
  /** Table name in Supabase (e.g. "users", "roles", "items") */
  table: string;

  /** ID of the record to fetch */
  id: string;

  /** Callback once record is fetched */
  onFetched: (data: T) => void;

  /** Opens your edit modal or form */
  onOpenModal: () => void;

  /** Optional: extra CSS classes */
  className?: string;
}

/**
 * Universal Edit button for DataTables.
 * Fetches a single record by ID from Supabase and triggers the edit modal.
 */
export default function EditButtonDataTable<T>({
  table,
  id,
  onFetched,
  onOpenModal,
  className = "btn btn-warning btn-sm me-2",
}: EditButtonDataTableProps<T>) {
  const [loading, setLoading] = useState(false);

  const handleEditClick = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from(table)
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      if (!data) return toast.error("Record not found");

      onFetched(data);
      onOpenModal();
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch record");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={`${className} d-flex align-items-center gap-1`}
      onClick={handleEditClick}
      disabled={loading}
      style={{ borderRadius: "4px" }}
      title="Edit record"
    >
      <i className="bi bi-pencil-square"></i>
      {loading ? "Loading..." : "Edit"}
    </button>
  );
}
