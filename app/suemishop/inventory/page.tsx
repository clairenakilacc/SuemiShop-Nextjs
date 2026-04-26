"use client";

import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { supabase } from "@/lib/supabase";

import SearchBar from "../../components/SearchBar";
import Filter from "../../components/Filter";
import ExportButton from "../../components/ExportButton";

import InventoryTable from "../../components/inventory/InventoryTable";

import type { Inventory } from "@/app/types/inventory";

export default function InventoriesPage() {
  const [inventories, setInventories] = useState<Inventory[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const [filters, setFilters] = useState<any>({});

  const fetchInventories = async () => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from("inventories")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    // DATE FILTER
    const f = filters ?? {};

    if (f.created_start) {
      const start = new Date(f.created_start);
      const end = f.created_end
        ? new Date(f.created_end)
        : new Date(f.created_start);

      end.setHours(23, 59, 59, 999);

      query = query
        .gte("created_at", start.toISOString())
        .lte("created_at", end.toISOString());
    }

    // SEARCH
    if (searchTerm.trim()) {
      query = query.ilike("box_number", `%${searchTerm}%`);
    }

    const { data, error, count } = await query;

    if (error) {
      toast.error(error.message);
      return;
    }

    setInventories(data || []);
    setTotalCount(count || 0);
  };

  useEffect(() => {
    fetchInventories();
  }, [page, pageSize, searchTerm, filters]);

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const toggleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? inventories.map((i) => i.id) : []);
  };

  return (
    <div className="container my-5">
      <Toaster />

      <h3 className="mb-4">Inventory Management</h3>

      {/* TOOLBAR */}
      <div className="mb-3 d-flex justify-content-between flex-wrap gap-2">
        <div className="d-flex gap-2 flex-wrap">
          <ExportButton
            data={inventories}
            headersMap={{
              "Box Number": "box_number",
              Quantity: "quantity",
              Price: "price",
              Total: "total",
              "Quantity Left": "quantity_left",
              "Total Left": "total_left",
            }}
            filename="inventories.csv"
          />
        </div>

        {/* SEARCH + FILTER */}
        <div className="d-flex gap-2">
          <SearchBar
            placeholder="Search box number..."
            value={searchTerm}
            onChange={setSearchTerm}
            options={inventories.map((i) => i.box_number || "")}
          />

          <Filter
            onApply={(f) => setFilters(f)}
            config={[
              { key: "created_start", label: "Start Date", type: "date" },
              { key: "created_end", label: "End Date", type: "date" },
            ]}
          />
        </div>
      </div>

      {/* TABLE */}
      <InventoryTable
        data={inventories}
        selectedIds={selectedIds}
        onToggleSelect={toggleSelect}
        onToggleSelectAll={toggleSelectAll}
        page={page}
        pageSize={pageSize}
        totalCount={totalCount}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
}
