"use client";

import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { supabase } from "@/lib/supabase";

import ImportInventory from "../../components/inventory/ImportInventory";
import SearchBar from "../../components/SearchBar";
import ConfirmDelete from "../../components/ConfirmDelete";
import ImportButton from "../../components/ImportButton";
import ExportButton from "../../components/ExportButton";
import AddInventory from "../../components/inventory/AddInventory";
import DeleteSelected from "../../components/DeleteSelected";

import InventoryTable from "../../components/inventory/InventoryTable";

import { dateNoTimezone } from "../../utils/validator";

/* ================= TYPES ================= */

interface Inventory {
  id?: string;
  created_at?: string;
  date_arrived?: string;
  box_number?: string;
  supplier?: string;
  category?: string;
  quantity?: string;
  price?: string;
  total?: string;
  quantity_left?: string;
  total_left?: string;
}

interface User {
  name: string;
  role?: {
    name: string;
  };
}

/* ================= PAGE ================= */

export default function InventoriesPage() {
  const [items, setItems] = useState<Inventory[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [totalCount, setTotalCount] = useState(0);

  /* ================= FETCH USER ================= */

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/me");
        const json = await res.json();
        setUser(json.user);
      } catch {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  /* ================= FETCH INVENTORIES ================= */

  const fetchItems = async () => {
    if (!user) return;

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from("inventories")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (searchTerm.trim()) {
      const term = `%${searchTerm.trim()}%`;
      query = query.or(
        `box_number.ilike.${term},supplier.ilike.${term},category.ilike.${term}`,
      );
    }

    const { data, error, count } = await query;

    if (error) {
      toast.error(error.message);
      return;
    }

    const mapped = (data || []).map((i) => ({
      ...i,
      created_at: i.created_at ? dateNoTimezone(i.created_at) : "",
      date_arrived: i.date_arrived ? dateNoTimezone(i.date_arrived) : "",
    }));

    setItems(mapped);
    setTotalCount(count || 0);
  };

  /* ================= SELECT ================= */

  const toggleSelectItem = (id: string) =>
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const toggleSelectAll = (checked: boolean) =>
    setSelectedItems(checked ? items.map((i) => i.id!) : []);

  /* ================= RENDER ================= */

  return (
    <div className="container my-5">
      <Toaster />

      <h3 className="mb-4">Inventories</h3>

      {/* TOOLBAR */}
      <div className="mb-3 d-flex flex-wrap justify-content-between gap-2">
        <div className="d-flex flex-wrap gap-2">
          <AddInventory onSuccess={fetchItems} />

          {user?.role?.name === "Superadmin" && (
            <>
              <ImportInventory onSuccess={fetchItems} />

              <ExportButton
                data={items}
                filename="inventories.csv"
                headersMap={{
                  "Created At": "created_at",
                  "Date Arrived": "date_arrived",
                  "Box Number": "box_number",
                  Supplier: "supplier",
                  Category: "category",
                }}
              />

              <DeleteSelected
                selectedCount={selectedItems.length}
                confirmMessage={
                  selectedItems.length === 0
                    ? "Select record first"
                    : "Delete selected inventories?"
                }
                onConfirm={async () => {
                  if (selectedItems.length === 0) {
                    throw new Error("Select record first");
                  }

                  const { error } = await supabase
                    .from("inventories")
                    .delete()
                    .in("id", selectedItems);

                  if (error) throw new Error(error.message);

                  setSelectedItems([]);
                  fetchItems();
                }}
              />
            </>
          )}
        </div>

        <div className="d-flex gap-2">
          <SearchBar
            placeholder="Search inventories..."
            value={searchTerm}
            onChange={setSearchTerm}
          />
        </div>
      </div>

      {/* TABLE */}
      {/* <InventoryTable
        data={items}
        selectedIds={selectedItems}
        onToggleSelect={toggleSelectItem}
        onToggleSelectAll={toggleSelectAll}
        page={page}
        pageSize={pageSize}
        totalCount={totalCount}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        onRefresh={fetchItems}
        isSuperAdmin={user?.role?.name === "Superadmin"}
      /> */}
    </div>
  );
}
