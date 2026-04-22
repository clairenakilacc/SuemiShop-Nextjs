"use client";

import { useRef, useState, useEffect } from "react";
import Papa from "papaparse";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

interface ImportInventoryProps {
  onSuccess: () => void;
  className?: string;
  buttonText?: string;
}

/* =========================
   NORMALIZER
========================= */
const normalizeHeader = (str: string) =>
  str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9]/g, "");

/* =========================
   COLUMN MAP
========================= */
const KEY_MAP: Record<string, string> = {
  datearrived: "date_arrived",
  boxnumber: "box_number",
  supplier: "supplier",
  category: "category",
  quantity: "quantity",
  price: "price",
  total: "total",
  quantityleft: "quantity_left",
  totalleft: "total_left",
};

/* =========================
   DEFAULT INVENTORY SHAPE
========================= */
const defaultInventory = {
  date_arrived: null,
  box_number: null,
  supplier: null,
  category: null,

  quantity: 0,
  price: 0,
  total: 0,
  quantity_left: 0,
  total_left: 0,

  status: "active",

  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export default function ImportInventory({
  onSuccess,
  className = "btn btn-import",
  buttonText = "Import",
}: ImportInventoryProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const [supplierMap, setSupplierMap] = useState<Record<string, number>>({});
  const [categoryMap, setCategoryMap] = useState<Record<string, number>>({});

  /* =========================
     FETCH META (IDs ONLY)
  ========================= */
  useEffect(() => {
    const fetchMeta = async () => {
      const [{ data: suppliers }, { data: categories }] = await Promise.all([
        supabase.from("suppliers").select("id, name"),
        supabase.from("categories").select("id, description"),
      ]);

      const sMap: Record<string, number> = {};
      suppliers?.forEach((s) => {
        if (s.name) {
          sMap[s.name.toLowerCase().trim()] = Number(s.id);
        }
      });

      const cMap: Record<string, number> = {};
      categories?.forEach((c) => {
        if (c.description) {
          cMap[c.description.toLowerCase().trim()] = Number(c.id);
        }
      });

      setSupplierMap(sMap);
      setCategoryMap(cMap);
    };

    fetchMeta();
  }, []);

  /* =========================
     CSV PARSER
  ========================= */
  const parseCSV = (file: File): Promise<any[]> =>
    new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        transformHeader: normalizeHeader,
        complete: (res) => resolve(res.data as any[]),
        error: (err) => reject(err),
      });
    });

  /* =========================
     IMPORT
  ========================= */
  const handleImport = async (file: File) => {
    try {
      setLoading(true);

      const rows = await parseCSV(file);

      const unknownSuppliers = new Set<string>();
      const unknownCategories = new Set<string>();

      const formatted = rows.map((row) => {
        const supplierKey = row.supplier?.toString().toLowerCase().trim();
        const categoryKey = row.category?.toString().toLowerCase().trim();

        const supplierId = supplierKey
          ? (supplierMap[supplierKey] ?? null)
          : null;

        const categoryId = categoryKey
          ? (categoryMap[categoryKey] ?? null)
          : null;

        if (row.supplier && !supplierId) {
          unknownSuppliers.add(row.supplier);
        }

        if (row.category && !categoryId) {
          unknownCategories.add(row.category);
        }

        return {
          ...defaultInventory,

          date_arrived: row.date_arrived ?? null,
          box_number: row.box_number ?? null,

          supplier: supplierId,
          category: categoryId,

          quantity: row.quantity ?? 0,
          price: row.price ?? 0,
          total: row.total ?? 0,
          quantity_left: row.quantity_left ?? 0,
          total_left: row.total_left ?? 0,

          updated_at: new Date().toISOString(),
        };
      });

      /* =========================
         VALIDATION
      ========================= */
      if (unknownSuppliers.size || unknownCategories.size) {
        let msg = "Import cancelled:\n";

        if (unknownSuppliers.size) {
          msg += `\nUnknown Suppliers:\n- ${[...unknownSuppliers].join("\n- ")}`;
        }

        if (unknownCategories.size) {
          msg += `\n\nUnknown Categories:\n- ${[...unknownCategories].join("\n- ")}`;
        }

        toast.error(msg, { duration: 10000 });
        return;
      }

      /* =========================
         INSERT SAFE
      ========================= */
      const { error } = await supabase.from("inventories").insert(formatted);

      if (error) throw error;

      toast.success("Inventory imported successfully!");
      onSuccess();
    } catch (err: any) {
      toast.error(err.message || "Import failed");
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  /* =========================
     UI
  ========================= */
  return (
    <label className={className} style={{ cursor: "pointer" }}>
      {loading ? "Importing..." : buttonText}

      <input
        type="file"
        accept=".csv"
        hidden
        ref={fileInputRef}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleImport(file);
        }}
      />
    </label>
  );
}
