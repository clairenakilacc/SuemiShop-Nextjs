"use client";

import { FC, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { sumQuantity } from "../../utils/validator";

interface Props {
  type: "shipped-today" | "total-quantity";
  label: string;
  color?: string;
}

const StatWidget: FC<Props> = ({ type, label, color = "#6f42c1" }) => {
  const [value, setValue] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        if (type === "shipped-today") {
          const today = new Date().toISOString().split("T")[0];

          const { count, error } = await supabase
            .from("items")
            .select("*", { count: "exact", head: true })
            .gte("date_shipped", `${today}T00:00:00`)
            .lte("date_shipped", `${today}T23:59:59`);

          if (error) throw error;
          setValue(count || 0);
        } else if (type === "total-quantity") {
          // Fetch paginated data to avoid hitting row limits
          let from = 0;
          const pageSize = 500;
          let allItems: any[] = [];

          while (true) {
            const { data: items, error } = await supabase
              .from("items")
              .select("quantity")
              .range(from, from + pageSize - 1);

            if (error) throw error;
            if (!items || items.length === 0) break;

            allItems = allItems.concat(items);
            if (items.length < pageSize) break;
            from += pageSize;
          }

          const totalQty = sumQuantity(allItems);
          setValue(totalQty);
        }
      } catch (err) {
        console.error("StatWidget fetch error:", err);
        setValue(0);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type]);

  return (
    <div
      className="p-3 rounded shadow-sm d-flex align-items-center justify-content-between"
      style={{
        backgroundColor: color,
        color: "white",
        minHeight: "100px",
      }}
    >
      <div>
        <h6 className="mb-1">{label}</h6>
        <h3 className="mb-0 fw-bold">
          {loading ? "…" : value.toLocaleString()}
        </h3>
      </div>
    </div>
  );
};

export default StatWidget;
