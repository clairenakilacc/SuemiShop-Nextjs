"use client";

import toast from "react-hot-toast";
import { supabase } from "@/lib/supabase";

export interface ExportButtonProps<T = any> {
  data: T[];
  headersMap: Record<string, keyof T | string | ((row: T) => any)>;
  filename?: string;

  table?: string; // 🔥 enables export ALL from DB
}

export default function ExportButton<T>({
  data,
  headersMap,
  filename = "export.csv",
  table,
}: ExportButtonProps<T>) {
  const handleExport = async () => {
    try {
      let source: T[] = data;

      // 🔥 FETCH ALL RECORDS IF TABLE PROVIDED
      if (table) {
        const { data: all, error } = await supabase.from(table).select("*");

        if (error) throw error;
        source = (all as T[]) || [];
      }

      if (!source.length) {
        toast.error("No data to export");
        return;
      }

      // 🔥 BUILD CSV ROWS
      const headers = Object.keys(headersMap);

      const escapeCSV = (value: any) => {
        if (value === null || value === undefined) return "";
        const str = String(value);
        return `"${str.replace(/"/g, '""')}"`;
      };

      const rows = source.map((row: any) =>
        headers
          .map((header) => {
            const accessor = headersMap[header];

            let value: any;

            if (typeof accessor === "function") {
              value = accessor(row);
            } else {
              value = row?.[accessor as string];
            }

            return escapeCSV(value);
          })
          .join(","),
      );

      const csvContent = [headers.join(","), ...rows].join("\n");

      // 🔥 DOWNLOAD FILE
      const blob = new Blob([csvContent], {
        type: "text/csv;charset=utf-8;",
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("CSV exported successfully");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Export failed");
    }
  };

  return (
    <button className="btn btn-export" onClick={handleExport}>
      Export CSV
    </button>
  );
}
