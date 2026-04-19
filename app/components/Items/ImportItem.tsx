"use client";

import { useRef, useState, useEffect } from "react";
import Papa from "papaparse";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

interface ImportItemProps {
  onSuccess: () => void;
  className?: string;
  buttonText?: string;
}

/* =========================
   NORMALIZER (VERY IMPORTANT)
========================= */
const normalizeHeader = (str: string) =>
  str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "") // remove spaces
    .replace(/[^a-z0-9]/g, ""); // remove symbols

/* =========================
   COLUMN MAP (ROBUST)
========================= */
const KEY_MAP: Record<string, string> = {
  brand: "brand",
  orderid: "order_id",

  preparedby: "prepared_by",
  liveseller: "live_seller",
  category: "category",

  minedfrom: "mined_from",

  sellingprice: "selling_price",
  capital: "capital",
  quantity: "quantity",
  discount: "discount",
  commissionrate: "commission_rate",
  shopeecommission: "shopee_commission",
  orderincome: "order_income",
  finalprice: "final_price",

  dateshipped: "date_shipped",
  datereturned: "date_returned",

  isreturned: "is_returned",
  createdat: "created_at",
  updatedat: "updated_at",
};

export default function ImportItem({
  onSuccess,
  className = "btn btn-import",
  buttonText = "Import Items",
}: ImportItemProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const [usersMap, setUsersMap] = useState<Record<string, number>>({});
  const [categoriesMap, setCategoriesMap] = useState<Record<string, number>>(
    {},
  );

  /* =========================
     FETCH USERS + CATEGORIES
  ========================= */
  useEffect(() => {
    const fetchMeta = async () => {
      const [{ data: users }, { data: categories }] = await Promise.all([
        supabase.from("users").select("id, name"),
        supabase.from("categories").select("id, description"),
      ]);

      const uMap: Record<string, number> = {};
      users?.forEach((u) => {
        if (u.name) uMap[u.name.toLowerCase()] = u.id;
      });

      const cMap: Record<string, number> = {};
      categories?.forEach((c) => {
        if (c.description) cMap[c.description.toLowerCase()] = Number(c.id);
      });

      setUsersMap(uMap);
      setCategoriesMap(cMap);
    };

    fetchMeta();
  }, []);

  /* =========================
     HELPERS
  ========================= */
  const resolveUser = (name: any) => {
    if (!name) return null;
    return usersMap[name.toString().toLowerCase()] ?? null;
  };

  const resolveCategory = (desc: any) => {
    if (!desc) return null;
    return categoriesMap[desc.toString().toLowerCase()] ?? null;
  };

  const parseDate = (value: any) => {
    if (!value) return null;
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d.toISOString();
  };

  const parseNumber = (value: any) => {
    if (value === null || value === undefined || value === "") return null;
    const n = Number(value);
    return isNaN(n) ? null : n;
  };

  /* =========================
     CSV PARSER (SMART MAPPING)
  ========================= */
  const parseCSV = (file: File): Promise<any[]> =>
    new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (h) => normalizeHeader(h),

        complete: (results) => {
          const rows = results.data as any[];

          const mapped = rows.map((row) => {
            const normalized: any = {};

            Object.keys(row).forEach((key) => {
              const cleanKey = normalizeHeader(key);
              const mappedKey = KEY_MAP[cleanKey];

              if (mappedKey) {
                normalized[mappedKey] = row[key];
              }
            });

            return normalized;
          });

          resolve(mapped);
        },

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

      const unknownUsers = new Set<string>();
      const unknownCategories = new Set<string>();

      const formatted = rows
        .map((row) => {
          const preparedBy = resolveUser(row.prepared_by);
          const liveSeller = resolveUser(row.live_seller);
          const categoryId = resolveCategory(row.category);

          if (row.prepared_by && !preparedBy) unknownUsers.add(row.prepared_by);

          if (row.live_seller && !liveSeller) unknownUsers.add(row.live_seller);

          if (row.category && !categoryId) unknownCategories.add(row.category);

          return {
            brand: row.brand?.toString().trim() || null,
            order_id: row.order_id ?? null,

            prepared_by: preparedBy,
            live_seller: liveSeller,
            category: categoryId,

            mined_from: row.mined_from ?? null,

            selling_price: parseNumber(row.selling_price),
            capital: parseNumber(row.capital),
            quantity: parseNumber(row.quantity),
            discount: parseNumber(row.discount),
            commission_rate: parseNumber(row.commission_rate),
            shopee_commission: parseNumber(row.shopee_commission),
            order_income: parseNumber(row.order_income),
            final_price: parseNumber(row.final_price),

            date_shipped: parseDate(row.date_shipped),
            date_returned: parseDate(row.date_returned),

            is_returned: row.is_returned === true || row.is_returned === "true",

            created_at: parseDate(row.created_at),
            updated_at: new Date().toISOString(),
          };
        })
        .filter((row) => row.brand || row.order_id);

      if (!formatted.length) {
        toast.error("No valid items to import");
        return;
      }

      /* =========================
         BLOCK IF UNKNOWN FOUND
      ========================= */
      if (unknownUsers.size || unknownCategories.size) {
        let message = "❌ Import cancelled due to unknown values:\n";

        if (unknownUsers.size) {
          message += `\nUnknown Users:\n- ${[...unknownUsers].join("\n- ")}`;
        }

        if (unknownCategories.size) {
          message += `\n\nUnknown Categories:\n- ${[...unknownCategories].join(
            "\n- ",
          )}`;
        }

        toast.error(message, { duration: 10000 });
        return;
      }

      /* =========================
         INSERT (SAFE CHUNK)
      ========================= */
      const chunkSize = 1000;

      for (let i = 0; i < formatted.length; i += chunkSize) {
        const chunk = formatted.slice(i, i + chunkSize);

        const { error } = await supabase.from("items").insert(chunk);
        if (error) throw error;
      }

      toast.success("Items imported successfully!");
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
    <>
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
    </>
  );
}
