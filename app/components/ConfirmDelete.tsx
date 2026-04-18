"use client";

import Swal from "sweetalert2";
import toast from "react-hot-toast";

interface ConfirmDeleteProps {
  onConfirm: () => Promise<void> | void;
  children: React.ReactNode;
  confirmMessage?: string;
  className?: string;

  // 🔥 NEW: optional validation hook
  canProceed?: () => boolean;
}

export default function ConfirmDelete({
  onConfirm,
  children,
  confirmMessage = "Are you sure you want to delete this item?",
  className = "",
  canProceed,
}: ConfirmDeleteProps) {
  const handleClick = async () => {
    // ❌ BLOCK IF NOTHING SELECTED
    if (canProceed && !canProceed()) {
      toast.error("Select record first");
      return;
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: confirmMessage,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await onConfirm();
        toast.success("Deleted successfully");
      } catch (error: any) {
        toast.error(error?.message || "Failed to delete");
      }
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white shadow-md transition font-medium ${className}`}
      style={{ borderRadius: "4px" }}
    >
      {children}
    </button>
  );
}
