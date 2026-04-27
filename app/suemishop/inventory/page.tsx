"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

import SearchBar from "../../components/SearchBar";
import Filter from "../../components/Filter";
import ExportButton from "../../components/ExportButton";
import DeleteSelected from "../../components/DeleteSelected";

import InventoryTable from "../../components/inventory/InventoryTable";
import AddInventory from "../../components/inventory/AddInventory";

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
      .select(
        `
    *,
    supplier:suppliers(name),
    category:categories(description)
  `,
        { count: "exact" },
      )
      .order("created_at", { ascending: false })
      .range(from, to);

    if (searchTerm) query = query.ilike("box_number", `%${searchTerm}%`);

    const { data, error, count } = await query;

    if (!error) {
      setInventories(data || []);
      setTotalCount(count || 0);
    }
  };

  useEffect(() => {
    fetchInventories();
  }, [page, pageSize, searchTerm, filters]);

  const toggleSelect = (id: number) => {
    setSelectedIds((p) =>
      p.includes(id) ? p.filter((x) => x !== id) : [...p, id],
    );
  };

  const toggleAll = (checked: boolean) => {
    setSelectedIds(checked ? inventories.map((i) => i.id) : []);
  };

  return (
    <div className="container my-5">
      <h3>Inventory Management</h3>

      {/* TOOLBAR */}
      <div className="mb-3 d-flex justify-content-between flex-wrap gap-2">
        {/* LEFT SIDE ACTIONS */}
        <div className="d-flex gap-2 flex-wrap align-items-center">
          <AddInventory onSuccess={fetchInventories} />

          <ExportButton
            data={inventories.map((i) => ({
              ...i,
              supplier: i.supplier?.name || "-",
              category: i.category?.description || "-",
            }))}
            headersMap={{
              "Box Number": "box_number",
              Supplier: "supplier",
              Category: "category",
              Quantity: "quantity",
              Price: "price",
              Total: "total",
              "Quantity Left": "quantity_left",
              "Total Left": "total_left",
            }}
            filename="inventories.csv"
          />

          <DeleteSelected
            selectedCount={selectedIds.length}
            confirmMessage={
              selectedIds.length === 0
                ? "Select record first"
                : "Delete selected inventories?"
            }
            onConfirm={async () => {
              if (!selectedIds.length) {
                throw new Error("Select record first");
              }

              const { error } = await supabase
                .from("inventories")
                .delete()
                .in("id", selectedIds);

              if (error) throw new Error(error.message);

              setSelectedIds([]);
              fetchInventories();
            }}
          />
        </div>

        {/* RIGHT SIDE SEARCH + FILTER */}
        <div className="d-flex gap-2">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search box number..."
            options={inventories.map((i) => i.box_number || "")}
          />

          <Filter
            onApply={setFilters}
            config={[
              { key: "created_start", label: "Start Date", type: "date" },
              { key: "created_end", label: "End Date", type: "date" },
            ]}
          />
        </div>
      </div>
      <InventoryTable
        data={inventories}
        selectedIds={selectedIds}
        onToggleSelect={toggleSelect}
        onToggleSelectAll={toggleAll}
        page={page}
        pageSize={pageSize}
        totalCount={totalCount}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
}
