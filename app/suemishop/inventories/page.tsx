"use client";

import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { supabase } from "@/lib/supabase";

import SearchBar from "../../components/SearchBar";
import ConfirmDelete from "../../components/ConfirmDelete";
import { DataTable, Column } from "../../components/DataTable";
import BulkEdit from "../../components/BulkEdit";
import DateRangePicker from "../../components/DateRangePicker";
import ToggleColumns from "../../components/ToggleColumns";
import ImportButton from "../../components/ImportButton";
import ExportButton from "../../components/ExportButton";
import AddInventoryModal from "../../components/AddInventoryModal";
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
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState<{
    startDate: string | null;
    endDate: string | null;
  }>({ startDate: null, endDate: null });

  const [showAddModal, setShowAddModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [totalCount, setTotalCount] = useState(0);

  const [tableColumns, setTableColumns] = useState<Column<Inventory>[]>([]);

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

  useEffect(() => {
    if (user) fetchItems();
  }, [user, page, pageSize, searchTerm, dateRange]);

  const fetchItems = async () => {
    if (!user) return;

    try {
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      let query = supabase
        .from("inventories")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(from, to);

      // Date filter (date_arrived)
      if (dateRange.startDate && dateRange.endDate) {
        const start = new Date(dateRange.startDate);
        const end = new Date(dateRange.endDate);
        end.setHours(23, 59, 59, 999);

        query = query
          .gte("date_arrived", start.toISOString())
          .lte("date_arrived", end.toISOString());
      }

      // Search filter
      if (searchTerm.trim()) {
        const term = `%${searchTerm.trim()}%`;
        query = query.or(
          `box_number.ilike.${term},supplier.ilike.${term},category.ilike.${term}`,
        );
      }

      const { data, error, count } = await query;

      if (error) {
        toast.error(error.message || "Failed to fetch inventories");
        return;
      }

      const mapped = (data || []).map((i) => ({
        ...i,
        created_at: i.created_at ? dateNoTimezone(i.created_at) : null,
        date_arrived: i.date_arrived ? dateNoTimezone(i.date_arrived) : null,
      }));

      setItems(mapped);
      setTotalCount(count || 0);
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch inventories");
    }
  };

  /* ================= COLUMNS (INIT ONCE) ================= */

  useEffect(() => {
    if (!user || tableColumns.length) return;

    const cols: Column<Inventory>[] = [
      { header: "Created At", accessor: (r) => dateNoTimezone(r.created_at) },
      {
        header: "Date Arrived",
        accessor: (r) => dateNoTimezone(r.date_arrived),
      },
      { header: "Box Number", accessor: "box_number" },
      { header: "Supplier", accessor: "supplier" },
      { header: "Category", accessor: "category" },
      { header: "Quantity", accessor: "quantity" },
      { header: "Price", accessor: "price" },
      { header: "Total", accessor: "total" },
      { header: "Quantity Left", accessor: "quantity_left" },
      { header: "Total Left", accessor: "total_left" },
    ];

    if (user.role?.name === "Superadmin") {
      cols.push({
        header: "Action",
        accessor: (row) => (
          <ConfirmDelete
            confirmMessage={`Are you sure you want to delete inventory ${row.id}?`}
            onConfirm={async () => {
              const { error } = await supabase
                .from("inventories")
                .delete()
                .eq("id", row.id!);
              if (error) throw error;
              fetchItems();
            }}
          >
            Delete
          </ConfirmDelete>
        ),
        center: true,
      });
    }

    setTableColumns(cols);
  }, [user, tableColumns.length]);

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

      {/* Toolbar */}
      <div className="mb-3 d-flex flex-wrap align-items-center justify-content-between gap-2">
        <div className="d-flex flex-wrap align-items-center gap-2">
          <button
            className="btn btn-success"
            onClick={() => setShowAddModal(true)}
          >
            Add Inventory
          </button>

          <AddInventoryModal
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            onSuccess={fetchItems}
          />

          {user?.role?.name === "Superadmin" && (
            <BulkEdit
              table="inventories"
              selectedIds={selectedItems}
              onSuccess={fetchItems}
              columns={2}
              fields={[
                { key: "box_number", label: "Box Number", type: "text" },
                { key: "supplier", label: "Supplier", type: "text" },
                { key: "category", label: "Category", type: "text" },
                { key: "quantity", label: "Quantity", type: "number" },
                { key: "price", label: "Price", type: "number" },
                { key: "total", label: "Total", type: "number" },
                {
                  key: "quantity_left",
                  label: "Quantity Left",
                  type: "number",
                },
                { key: "total_left", label: "Total Left", type: "number" },
                {
                  key: "date_arrived",
                  label: "Date Arrived",
                  type: "text",
                  placeholder: "MM-DD-YY",
                },
              ]}
            />
          )}

          {user?.role?.name === "Superadmin" && (
            <ImportButton
              table="inventories"
              headersMap={{
                "Date Arrived": "date_arrived",
                "Box Number": "box_number",
                Supplier: "supplier",
                Category: "category",
                Quantity: "quantity",
                Price: "price",
                Total: "total",
                "Quantity Left": "quantity_left",
                "Total Left": "total_left",
              }}
              onSuccess={fetchItems}
            />
          )}

          {user?.role?.name === "Superadmin" && (
            <ExportButton
              data={items}
              filename="inventories.csv"
              headersMap={{
                "Created At": (row) => row.created_at || "",
                "Date Arrived": "date_arrived",
                "Box Number": "box_number",
                Supplier: "supplier",
                Category: "category",
                Quantity: "quantity",
                Price: "price",
                Total: "total",
                "Quantity Left": "quantity_left",
                "Total Left": "total_left",
              }}
            />
          )}

          {user?.role?.name === "Superadmin" && (
            <ConfirmDelete
              confirmMessage="Are you sure you want to delete selected inventories?"
              onConfirm={async () => {
                if (!selectedItems.length)
                  throw new Error("No inventories selected");
                const { error } = await supabase
                  .from("inventories")
                  .delete()
                  .in("id", selectedItems);
                if (error) throw error;
                setSelectedItems([]);
                fetchItems();
              }}
            >
              Delete Selected
            </ConfirmDelete>
          )}
        </div>

        <div className="d-flex align-items-center gap-2">
          <SearchBar
            placeholder="Search inventories..."
            value={searchTerm}
            onChange={setSearchTerm}
            storageKey="inventories_search"
          />

          <button
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="p-2 bg-light border rounded-3 shadow-sm"
            style={{ width: "42px", height: "42px" }}
          >
            <i className="bi bi-calendar3 fs-5 text-secondary"></i>
          </button>

          <ToggleColumns columns={tableColumns} onChange={setTableColumns} />
        </div>
      </div>

      {showDatePicker && (
        <div className="bg-white p-3 shadow-md rounded-4 mb-3 w-fit">
          <DateRangePicker onChange={setDateRange} />
        </div>
      )}

      <DataTable
        data={items}
        columns={tableColumns}
        selectable
        selectedIds={selectedItems}
        onToggleSelect={toggleSelectItem}
        onToggleSelectAll={toggleSelectAll}
        rowKey="id"
        page={page}
        pageSize={pageSize}
        totalCount={totalCount}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
}
