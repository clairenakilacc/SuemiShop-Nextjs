"use client";

import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { supabase } from "@/lib/supabase";

import AddItem from "../../components/items/AddItem";
import SearchBar from "../../components/SearchBar";
import ConfirmDelete from "../../components/ConfirmDelete";
import ItemTable from "../../components/items/ItemTable";

import BulkEdit from "../../components/BulkEdit";
import DateRangePicker from "../../components/DateRangePicker";
import ImportButton from "../../components/ImportButton";
import ExportButton from "../../components/ExportButton";

import { dateNoTimezone } from "../../utils/validator";

/* =========================
   ITEM TYPE (DB uses IDs)
========================= */
interface Item {
  id: string;

  created_at: string | null;
  updated_at: string | null;

  prepared_by: number | null; // USER ID
  live_seller: number | null;

  brand: string | null;
  order_id: string | null;

  shoppee_commission: number | null;
  selling_price: number | null;
  capital: number | null;
  order_income: number | null;
  discount: number | null;
  commission_rate: number | null;
  quantity: number | null;

  category: number | null;
  mined_from: string | null;

  date_shipped: string | null;
  date_returned: string | null;

  is_returned: boolean | null;
}

/* =========================
   USER TYPE (FIXED)
========================= */
interface User {
  id: number;
  name: string;
}

export default function SoldItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState<{
    startDate: string | null;
    endDate: string | null;
  }>({
    startDate: null,
    endDate: null,
  });

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [totalCount, setTotalCount] = useState(0);

  /* =========================
     FETCH USERS
  ========================= */
  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await supabase.from("users").select("id, name");
      setUsers(data || []);
    };

    fetchUsers();
  }, []);

  /* =========================
     FETCH ITEMS
  ========================= */
  const fetchItems = async () => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from("items")
      .select(
        `
    *,
    prepared_user:users!items_prepared_by_fkey(id, name),
    seller_user:users!items_live_seller_fkey(id, name),
    category_data:categories!items_category_fkey(id, description)
  `,
      )
      .order("updated_at", { ascending: false })
      .range(from, to);

    if (dateRange.startDate && dateRange.endDate) {
      const start = new Date(dateRange.startDate);
      const end = new Date(dateRange.endDate);
      end.setHours(23, 59, 59, 999);

      query = query
        .gte("created_at", start.toISOString())
        .lte("created_at", end.toISOString());
    }

    if (searchTerm.trim()) {
      const term = `%${searchTerm}%`;

      query = query.or(
        `brand.ilike.${term},order_id.ilike.${term},prepared_by.ilike.${term},live_seller.ilike.${term}`,
      );
    }

    const { data, error, count } = await query;

    if (error) {
      toast.error(error.message);
      return;
    }

    const mapped: Item[] = (data || []).map((i: any) => ({
      ...i,
      created_at: i.created_at ? dateNoTimezone(i.created_at) : null,
      updated_at: i.updated_at ? dateNoTimezone(i.updated_at) : null,
      date_shipped: i.date_shipped ? dateNoTimezone(i.date_shipped) : null,
      date_returned: i.date_returned ? dateNoTimezone(i.date_returned) : null,
    }));

    setItems(mapped);
    setTotalCount(count || 0);
  };

  useEffect(() => {
    fetchItems();
  }, [page, pageSize, searchTerm, dateRange]);

  /* =========================
     SELECT LOGIC
  ========================= */
  const toggleSelectItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const toggleSelectAll = (checked: boolean) => {
    setSelectedItems(checked ? items.map((i) => i.id) : []);
  };

  /* =========================
     USER NAME RESOLVER
  ========================= */
  const getUserName = (id: number | null) => {
    if (!id) return "-";
    return users.find((u) => u.id === id)?.name || "-";
  };

  /* =========================
     UI
  ========================= */
  return (
    <div className="container my-5">
      <Toaster />
      <h3 className="mb-4">Items</h3>

      {/* TOOLBAR */}
      <div className="mb-3 d-flex flex-wrap justify-content-between gap-2">
        <div className="d-flex flex-wrap gap-2">
          <AddItem onSuccess={fetchItems} />

          <BulkEdit
            table="items"
            selectedIds={selectedItems}
            onSuccess={fetchItems}
            columns={2}
            fields={[
              { key: "brand", label: "Brand", type: "text" },
              { key: "order_id", label: "Order ID", type: "text" },
              { key: "selling_price", label: "Selling Price", type: "number" },
              { key: "quantity", label: "Quantity", type: "number" },
              { key: "capital", label: "Capital", type: "number" },
              { key: "discount", label: "Discount", type: "text" },
              {
                key: "is_returned",
                label: "Is Returned",
                type: "select",
                options: ["true", "false"],
              },
            ]}
          />

          <ImportButton
            table="items"
            onSuccess={fetchItems}
            headersMap={{
              Brand: "brand",
              "Order ID": "order_id",
              "Live Seller": "live_seller",
              "Selling Price": "selling_price",
              Quantity: "quantity",
              Capital: "capital",
              Discount: "discount",
            }}
          />

          <ExportButton
            data={items}
            filename="items.csv"
            headersMap={{
              Prepared: "prepared_by",
              Brand: "brand",
              "Order ID": "order_id",
              "Live Seller": "live_seller",
              "Selling Price": "selling_price",
            }}
          />

          <ConfirmDelete
            confirmMessage="Delete selected items?"
            onConfirm={async () => {
              await supabase.from("items").delete().in("id", selectedItems);

              setSelectedItems([]);
              fetchItems();
            }}
          >
            Delete Selected
          </ConfirmDelete>
        </div>

        <div className="d-flex gap-2">
          <SearchBar
            placeholder="Search items..."
            value={searchTerm}
            onChange={setSearchTerm}
            options={items.map((i) => i.brand || "")}
          />

          <button
            className="btn btn-light"
            onClick={() => setShowDatePicker(!showDatePicker)}
          >
            📅
          </button>
        </div>
      </div>

      {showDatePicker && <DateRangePicker onChange={setDateRange} />}

      {/* TABLE */}
      <ItemTable
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
        users={users}
        categories={[]}
      />
    </div>
  );
}
