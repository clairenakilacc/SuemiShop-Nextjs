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

  // ✅ DISTINCT FILTER DATA
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  /* ================= LOAD FILTER OPTIONS ================= */
  useEffect(() => {
    const loadFilterOptions = async () => {
      const { data: sup } = await supabase
        .from("suppliers")
        .select("id, name")
        .order("name");

      const { data: cat } = await supabase
        .from("categories")
        .select("id, description")
        .order("description");

      setSuppliers(sup || []);
      setCategories(cat || []);
    };

    loadFilterOptions();
  }, []);

  /* ================= FETCH INVENTORIES ================= */
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

    if (searchTerm) {
      query = query.ilike("box_number", `%${searchTerm}%`);
    }

    // FILTERS
    if (filters.created_start) {
      query = query.gte("created_at", filters.created_start);
    }

    if (filters.created_end) {
      query = query.lte("created_at", filters.created_end);
    }

    if (filters.supplier_id) {
      query = query.eq("supplier_id", filters.supplier_id);
    }

    if (filters.category_id) {
      query = query.eq("category_id", filters.category_id);
    }

    const { data, error, count } = await query;

    if (!error) {
      setInventories(data || []);
      setTotalCount(count || 0);
    }
  };

  useEffect(() => {
    fetchInventories();
  }, [page, pageSize, searchTerm, filters]);

  /* ================= SELECT HANDLERS ================= */
  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
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
        {/* LEFT ACTIONS */}
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

        {/* RIGHT SIDE */}
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

              {
                key: "supplier_id",
                label: "Supplier",
                type: "select",
                options: suppliers.map((s) => ({
                  label: s.name,
                  value: s.id,
                })),
              },

              {
                key: "category_id",
                label: "Category",
                type: "select",
                options: categories.map((c) => ({
                  label: c.description,
                  value: c.id,
                })),
              },
            ]}
          />
        </div>
      </div>

      {/* TABLE */}
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
