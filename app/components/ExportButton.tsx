"use client";

import * as XLSX from "xlsx";
import toast from "react-hot-toast";

export interface ExportButtonProps<T> {
  data: T[];
  headersMap: Record<string, keyof T | ((row: T) => any)>;
  filename?: string;
}

export default function ExportButton<T>({
  data,
  headersMap,
  filename = "export.xlsx",
}: ExportButtonProps<T>) {
  const handleExport = () => {
    try {
      if (!data || !data.length) {
        toast.error("No data to export");
        return;
      }

      // Map data for export
      const exportData = data.map((row) => {
        const mappedRow: Record<string, any> = {};
        for (const [header, accessor] of Object.entries(headersMap)) {
          let value;
          if (typeof accessor === "function") value = accessor(row);
          else value = row[accessor];

          // Keep everything as string
          mappedRow[header] = value ?? "";
        }
        return mappedRow;
      });

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      XLSX.writeFile(workbook, filename);

      toast.success("Data exported successfully");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to export data");
    }
  };

  return (
    <button className="btn btn-success" onClick={handleExport}>
      Export
    </button>
  );
}
