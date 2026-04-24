"use client";

import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { supabase } from "@/lib/supabase";

import ImportInventory from "../../components/inventory/ImportInventory";
import SearchBar from "../../components/SearchBar";
import ExportButton from "../../components/ExportButton";
import AddInventory from "../../components/inventory/AddInventory";
import DeleteSelected from "../../components/DeleteSelected";

import InventoryTable from "../../components/inventory/InventoryTable";

import { dateNoTimezone } from "../../utils/validator";

/* ================= TYPES ================= */

export interface Inventory {
  id: number;

  created_at: string;
  updated_at: string;

  date_arrived?: string | null;

  box_number?: string | null;
  supplier?: number | null;
  category?: number | null;

  quantity: number;
  price: number;
  total: number;

  quantity_left: number;
  total_left: number;

  status: string;
}

interface Category {
  id: number;
  description: string;
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
  const [categories, setCategories] = useState<Category[]>([]);

  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [user, setUser] = useState<User | null>(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
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
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from("inventories")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (searchTerm.trim()) {
      const term = `%${searchTerm.trim()}%`;

      query = query.or(`
        box_number.ilike.${term},
        status.ilike.${term}
      `);
    }

    const { data, error, count } = await query;

    if (error) {
      toast.error(error.message);
      return;
    }

    const mapped: Inventory[] = (data || []).map((i: any) => ({
      id: i.id,
      created_at: i.created_at ? dateNoTimezone(i.created_at) : "",
      updated_at: i.updated_at ? dateNoTimezone(i.updated_at) : "",

      date_arrived: i.date_arrived ? dateNoTimezone(i.date_arrived) : null,

      box_number: i.box_number ?? null,
      supplier: i.supplier ?? null,
      category: i.category ?? null,

      quantity: Number(i.quantity || 0),
      price: Number(i.price || 0),
      total: Number(i.total || 0),

      quantity_left: Number(i.quantity_left || 0),
      total_left: Number(i.total_left || 0),

      status: i.status || "",
    }));

    setItems(mapped);
    setTotalCount(count || 0);
  };

  /* ================= FETCH CATEGORIES ================= */

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from("categories")
      .select("id, description");

    if (error) {
      toast.error(error.message);
      return;
    }

    setCategories(data || []);
  };

  /* ================= AUTO FETCH ================= */

  useEffect(() => {
    if (!user) return;

    fetchItems();
    fetchCategories();
  }, [user, page, pageSize, searchTerm]);

  /* ================= SELECT ================= */

  const toggleSelectItem = (id: number) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const toggleSelectAll = (checked: boolean) => {
    setSelectedItems(checked ? items.map((i) => i.id) : []);
  };

  /* ================= DELETE ================= */

  const handleDeleteSelected = async () => {
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
  };

  /* ================= RENDER ================= */

  return (
    <div className="container my-5">
      <Toaster />

      <h3 className="mb-4">Inventories</h3>

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
                  Quantity: "quantity",
                  Price: "price",
                  Total: "total",
                  Status: "status",
                }}
              />

              <DeleteSelected
                selectedCount={selectedItems.length}
                confirmMessage={
                  selectedItems.length === 0
                    ? "Select record first"
                    : "Delete selected inventories?"
                }
                onConfirm={handleDeleteSelected}
              />
            </>
          )}
        </div>

        <SearchBar
          placeholder="Search inventories..."
          value={searchTerm}
          onChange={setSearchTerm}
        />
      </div>

      <InventoryTable
        data={items}
        selectedIds={selectedItems}
        onToggleSelect={toggleSelectItem}
        onToggleSelectAll={toggleSelectAll}
        page={page}
        pageSize={pageSize}
        totalCount={totalCount}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        categories={categories}
        onRefresh={fetchItems}
      />
    </div>
  );
}
