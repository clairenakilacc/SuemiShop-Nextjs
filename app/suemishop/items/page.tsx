"use client";

import { useEffect, useState, useCallback } from "react";
import toast, { Toaster } from "react-hot-toast";
import { supabase } from "@/lib/supabase";

import AddItem from "../../components/items/AddItem";
import ImportItem from "../../components/items/ImportItem";
import ExportButton from "../../components/ExportButton";

import SearchBar from "../../components/SearchBar";
import Filter from "../../components/Filter";
import DeleteSelected from "../../components/DeleteSelected";
import ItemTable from "../../components/items/ItemTable";
import BulkEdit from "../../components/BulkEdit";
import DateRangePicker from "../../components/DateRangePicker";

import ImportButton from "../../components/ImportButton";

import { dateNoTimezone } from "../../utils/validator";

/* =========================
   TYPES
========================= */
interface Item {
  id: string;

  created_at: string | null;
  updated_at: string | null;

  prepared_by: number | null;
  live_seller: number | null;

  brand: string | null;
  order_id: string | null;

  category: number | null;

  selling_price: number | null;
  capital: number | null;
  quantity: number | null;

  date_shipped: string | null;
  date_returned: string | null;

  is_returned: boolean | null;

  /* JOINED DATA */
  prepared_user?: { id: number; name: string } | null;
  seller_user?: { id: number; name: string } | null;
  category_data?: { id: number; description: string } | null;
}

interface User {
  id: number;
  name: string;
}

interface Category {
  id: string;
  description: string;
}

/* =========================
   PAGE
========================= */
export default function SoldItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState<{
    startDate: string | null;
    endDate: string | null;
  }>({ startDate: null, endDate: null });

  const [filters, setFilters] = useState<any>({});
  /* =========================
     FETCH USERS + CATEGORIES
  ========================= */
  useEffect(() => {
    const fetchMeta = async () => {
      const [{ data: usersData }, { data: catData }] = await Promise.all([
        supabase.from("users").select("id, name"),
        supabase.from("categories").select("id, description"),
      ]);

      setUsers(usersData || []);
      setCategories(catData || []);
    };

    fetchMeta();
  }, []);

  /* =========================
     FETCH ITEMS
  ========================= */
  const fetchItems = useCallback(
    async (overridePage?: number) => {
      const currentPage = overridePage ?? page;

      const from = (currentPage - 1) * pageSize;
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
          { count: "exact" },
        )
        .order("updated_at", { ascending: false })
        .range(from, to);

      /* DATE FILTER */
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

      if (f.prepared_by) query = query.eq("prepared_by", f.prepared_by);
      if (f.live_seller) query = query.eq("live_seller", f.live_seller);
      if (f.category) query = query.eq("category", f.category);
      if (f.is_returned !== undefined) {
        query = query.eq("is_returned", f.is_returned);
      }

      /* SEARCH SAFE */
      if (searchTerm.trim()) {
        const term = `%${searchTerm}%`;

        const { data: userMatches } = await supabase
          .from("users")
          .select("id")
          .ilike("name", `%${searchTerm}%`);

        const { data: categoryMatches } = await supabase
          .from("categories")
          .select("id")
          .ilike("description", `%${searchTerm}%`);

        const userIds = userMatches?.map((u) => u.id) || [];
        const categoryIds = categoryMatches?.map((c) => c.id) || [];

        query = query.or(
          [
            `brand.ilike.${term}`,
            `order_id.ilike.${term}`,
            `mined_from.ilike.${term}`,

            userIds.length ? `prepared_by.in.(${userIds.join(",")})` : null,

            userIds.length ? `live_seller.in.(${userIds.join(",")})` : null,

            categoryIds.length
              ? `category.in.(${categoryIds.join(",")})`
              : null,
          ]
            .filter(Boolean)
            .join(","),
        );
      }

      //
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
    },
    [page, pageSize, searchTerm, filters],
  );

  useEffect(() => {
    fetchItems(page);
  }, [page, pageSize, searchTerm, filters]);

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
          <ImportItem
            onSuccess={() => {
              fetchItems();
              toast.success("List refreshed");
            }}
          />{" "}
          {/* <BulkEdit
            table="items"
            selectedIds={selectedItems}
            onSuccess={fetchItems}
            columns={2}
          /> */}
          <ExportButton
            data={items}
            table="items"
            headersMap={{
              "Created At": (row: any) => {
                if (!row.created_at) return "";
                const d = new Date(row.created_at);
                return `${(d.getMonth() + 1).toString().padStart(2, "0")}-${d
                  .getDate()
                  .toString()
                  .padStart(2, "0")}-${d.getFullYear().toString().slice(-2)}`;
              },

              "Updated At": (row: any) => {
                if (!row.updated_at) return "";
                const d = new Date(row.updated_at);
                return `${(d.getMonth() + 1).toString().padStart(2, "0")}-${d
                  .getDate()
                  .toString()
                  .padStart(2, "0")}-${d.getFullYear().toString().slice(-2)}`;
              },

              "Created By": (row: any) =>
                users.find((u) => u.id === row.created_by)?.name || "",

              "Updated By": (row: any) =>
                users.find((u) => u.id === row.updated_by)?.name || "",

              "Prepared By": (row: any) =>
                users.find((u) => u.id === row.prepared_by)?.name || "",

              "Live Seller": (row: any) =>
                users.find((u) => u.id === row.live_seller)?.name || "",

              "Date Shipped": (row: any) =>
                row.date_shipped
                  ? new Date(row.date_shipped).toLocaleDateString()
                  : "",

              "Date Returned": (row: any) =>
                row.date_returned
                  ? new Date(row.date_returned).toLocaleDateString()
                  : "",

              Brand: "brand",
              "Order ID": "order_id",

              Category: (row: any) =>
                categories.find((c) => String(c.id) === String(row.category))
                  ?.description || "",

              "Mined From": "mined_from",

              "Shopee Commission": "shopee_commission",
              "Selling Price": "selling_price",
              Capital: "capital",
              "Order Income": "order_income",
              Discount: "discount",
              "Commission Rate": "commission_rate",
              Quantity: "quantity",
              "Final Price": "final_price",

              "Is Returned": (row: any) => (row.is_returned ? "Yes" : "No"),
            }}
            filename="items.csv"
          />
          <DeleteSelected
            selectedCount={selectedItems.length}
            confirmMessage={
              selectedItems.length === 0
                ? "Select record first"
                : "Delete selected items?"
            }
            onConfirm={async () => {
              if (selectedItems.length === 0) {
                throw new Error("Select record first");
              }

              const { error } = await supabase
                .from("items")
                .delete()
                .in("id", selectedItems);

              if (error) throw new Error(error.message);

              setSelectedItems([]);
              fetchItems();
            }}
          />
        </div>

        <div className="d-flex gap-2">
          <SearchBar
            placeholder="Search items..."
            value={searchTerm}
            onChange={setSearchTerm}
            options={items.map((i) => i.brand || "")}
          />
          {/* 
          <button
            className="btn btn-light"
            onClick={() => setShowDatePicker((p) => !p)}
          >
            📅
          </button> */}

          <Filter
            onApply={(f) => setFilters(f)}
            config={[
              {
                key: "created_start",
                label: "Start Date",
                type: "date",
              },
              {
                key: "created_end",
                label: "End Date",
                type: "date",
              },
              {
                key: "prepared_by",
                label: "Prepared By",
                type: "select",
                options: users.map((u) => ({
                  label: u.name,
                  value: u.id,
                })),
              },
              {
                key: "live_seller",
                label: "Live Seller",
                type: "select",
                options: users.map((u) => ({
                  label: u.name,
                  value: u.id,
                })),
              },
              {
                key: "category",
                label: "Category",
                type: "select",
                options: categories.map((c) => ({
                  label: c.description,
                  value: c.id,
                })),
              },
              {
                key: "is_returned",
                label: "Returned",
                type: "boolean",
              },
            ]}
          />
        </div>
      </div>

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
        onRefresh={async () => {
          await fetchItems();
        }}
        users={users}
        categories={categories}
      />
    </div>
  );
}
