"use client";

import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { supabase } from "@/lib/supabase";

import SearchBar from "../../components/SearchBar";
import ConfirmDelete from "../../components/ConfirmDelete";
// import { DataTable, Column } from "../../components/DataTable";
import ItemTable, { ItemColumn } from "../../components/Items/ItemTable";

import BulkEdit from "../../components/BulkEdit";
import DateRangePicker from "../../components/DateRangePicker";
import ToggleColumns from "../../components/ToggleColumns";
import ImportButton from "../../components/ImportButton";
import ExportButton from "../../components/ExportButton";
import AddItemModal from "../../components/AddItemModal";
import EditRowButton from "../../components/EditRowButton";
import {
  dateNoTimezone,
  applyDiscount,
  calculateOrderIncome,
  calculateCommissionRate,
} from "../../utils/validator";
import ViewRowButton from "@/app/components/ViewRowButton";

interface Item {
  id?: string;
  timestamp?: string;
  prepared_by?: string;
  brand?: string;
  order_id?: string;
  shoppee_commission?: string;
  selling_price?: string;
  is_returned?: string;
  quantity?: string;
  live_seller?: string;
  capital?: string;
  order_income?: string;
  category?: string;
  mined_from?: string;
  discount?: string;
  date_shipped?: string;
  date_returned?: string;
}

interface User {
  name: string;
  role?: {
    name: string;
  };
}

export default function SoldItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
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
  const [showAddModal, setShowAddModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [totalCount, setTotalCount] = useState(0);
  const [tableColumns, setTableColumns] = useState<ItemColumn<Item>[]>([]);

  /** Fetch logged-in user */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/me");
        const json = await res.json();
        setUser(json.user);
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  /** Fetch items when user or filters change */
  useEffect(() => {
    if (user) fetchItems();
  }, [user, page, pageSize, searchTerm, dateRange]);

  const fetchItems = async () => {
    if (!user) return;
    try {
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      let query = supabase
        .from("items")
        .select("*", { count: "exact" })
        .order("timestamp", { ascending: false })
        .range(from, to);

      if (user.role?.name !== "Superadmin") {
        query = query.ilike("prepared_by", user.name.trim());
      }

      if (dateRange.startDate && dateRange.endDate) {
        const start = new Date(dateRange.startDate);
        const end = new Date(dateRange.endDate);
        end.setHours(23, 59, 59, 999);
        query = query
          .gte("timestamp", start.toISOString())
          .lte("timestamp", end.toISOString());
      }

      const textColumns = [
        "prepared_by",
        "brand",
        "order_id",
        "live_seller",
        "category",
        "mined_from",
        "is_returned",
      ];
      if (searchTerm.trim()) {
        const term = `%${searchTerm.trim()}%`;
        const orString = textColumns
          .map((col) => `${col}.ilike.${term}`)
          .join(",");
        query = query.or(orString);
      }

      const { data, error, count } = await query;
      if (error) return toast.error(error.message || "Failed to fetch items");

      const mapped = (data || []).map((i) => ({
        ...i,
        timestamp: i.timestamp ? dateNoTimezone(i.timestamp) : null,
        date_shipped: i.date_shipped ? dateNoTimezone(i.date_shipped) : null,
        date_returned: i.date_returned ? dateNoTimezone(i.date_returned) : null,
      }));

      setItems(mapped);
      setTotalCount(count || 0);
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch items");
    }
  };

  /** Build table columns dynamically */
  useEffect(() => {
    if (!user) return;

    const cols: ItemColumn<Item>[] = [
      { header: "Timestamp", accessor: (row) => dateNoTimezone(row.timestamp) },
      // { header: "Mined From", accessor: "mined_from" },
      { header: "Prepared By", accessor: "prepared_by" },
      // { header: "Category", accessor: "category" },
      { header: "Brand", accessor: "brand" },
      // { header: "Quantity", accessor: "quantity" },
      { header: "Order ID", accessor: "order_id" },
      { header: "Live Seller", accessor: "live_seller" },

      // { header: "Capital", accessor: "capital" },
      {
        header: "Selling Price",
        accessor: (row) =>
          applyDiscount(row.selling_price || "0", row.discount || "0"),
      },
      // { header: "Discount", accessor: "discount" },
      // { header: "Shoppee Commission", accessor: "shoppee_commission" },
      // {
      //   header: "Order Income",
      //   accessor: (row) =>
      //     calculateOrderIncome(
      //       applyDiscount(row.selling_price || "0", row.discount || "0"),
      //       row.shoppee_commission || "0",
      //     ),
      // },
      // {
      //   header: "Commission Rate (%)",
      //   accessor: (row) =>
      //     calculateCommissionRate(
      //       applyDiscount(row.selling_price || "0", row.discount || "0"),
      //       row.shoppee_commission || "0",
      //     ),
      // },
      // { header: "Is Returned", accessor: "is_returned" },
      // {
      //   header: "Date Returned",
      //   accessor: (row) => dateNoTimezone(row.date_returned),
      // },
      // {
      //   header: "Date Shipped",
      //   accessor: (row) => dateNoTimezone(row.date_shipped),
      // },
    ];

    /** Action column (Edit + Delete) */
    if (user.role?.name === "Superadmin") {
      cols.push({
        header: "Action",
        accessor: (row) => (
          <div className="flex gap-2 justify-center">
            <ConfirmDelete
              confirmMessage={`Are you sure you want to delete item ${row.id}?`}
              onConfirm={async () => {
                const { error } = await supabase
                  .from("items")
                  .delete()
                  .eq("id", row.id!);
                if (error) throw error;
                fetchItems();
              }}
            >
              Delete
            </ConfirmDelete>
          </div>
        ),
        center: true,
      });
    }

    setTableColumns(cols);
  }, [user]);

  const toggleSelectItem = (id: string) =>
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const toggleSelectAll = (checked: boolean) =>
    setSelectedItems(checked ? items.map((i) => i.id!) : []);

  return (
    <div className="container my-5">
      <Toaster />
      <h3 className="mb-4">Sold Items</h3>

      {/* Toolbar */}
      <div className="mb-3 d-flex flex-wrap align-items-center justify-content-between gap-2">
        <div className="d-flex flex-wrap align-items-center gap-2">
          <button
            className="btn btn-success"
            onClick={() => setShowAddModal(true)}
          >
            Add Item
          </button>
          <AddItemModal
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            onSuccess={fetchItems}
          />

          {user?.role?.name === "Superadmin" && (
            <>
              <BulkEdit
                table="items"
                selectedIds={selectedItems}
                onSuccess={fetchItems}
                columns={2}
                fields={[
                  {
                    key: "mined_from",
                    label: "Mined From",
                    type: "select",
                    options: ["Shoppee", "Facebook"],
                  },
                  { key: "brand", label: "Brand", type: "text" },
                  { key: "category", label: "Category", type: "text" },
                  { key: "order_id", label: "Order ID", type: "text" },
                  {
                    key: "selling_price",
                    label: "Selling Price",
                    type: "number",
                  },
                  { key: "quantity", label: "Quantity", type: "number" },
                  { key: "capital", label: "Capital", type: "number" },
                  {
                    key: "shoppee_commission",
                    label: "Shoppee Commission",
                    type: "text",
                  },
                  { key: "discount", label: "Discount", type: "text" },
                  {
                    key: "is_returned",
                    label: "Is Returned",
                    type: "select",
                    options: ["Yes", "No"],
                  },
                  {
                    key: "date_returned",
                    label: "Date Returned",
                    type: "text",
                    placeholder: "MM-DD-YY",
                  },
                  {
                    key: "date_shipped",
                    label: "Date Shipped",
                    type: "text",
                    placeholder: "MM-DD-YY",
                  },
                ]}
              />
              <ImportButton
                table="items"
                headersMap={{
                  Timestamp: "timestamp",
                  "Prepared By": "prepared_by",
                  Brand: "brand",
                  "Order ID": "order_id",
                  "Shoppee Commission": "shoppee_commission",
                  "Selling Price": "selling_price",
                  Quantity: "quantity",
                  Capital: "capital",
                  "Order Income": "order_income",
                  Discount: "discount",
                  "Live Seller": "live_seller",
                  Category: "category",
                  "Mined From": "mined_from",
                }}
                onSuccess={fetchItems}
              />
              <ExportButton
                data={items}
                headersMap={{
                  Timestamp: (row) => row.timestamp || "",
                  "Prepared By": "prepared_by",
                  Brand: "brand",
                  "Order ID": "order_id",
                  "Shoppee Commission": "shoppee_commission",
                  "Selling Price": "selling_price",
                  Quantity: "quantity",
                  Capital: "capital",
                  "Order Income": "order_income",
                  Discount: "discount",
                  "Live Seller": "live_seller",
                  Category: "category",
                  "Mined From": "mined_from",
                }}
                filename="sold_items.csv"
              />
              <ConfirmDelete
                confirmMessage="Are you sure you want to delete selected items?"
                onConfirm={async () => {
                  if (!selectedItems.length)
                    throw new Error("No items selected");
                  const { error } = await supabase
                    .from("items")
                    .delete()
                    .in("id", selectedItems);
                  if (error) throw error;
                  setSelectedItems([]);
                  fetchItems();
                }}
              >
                Delete Selected
              </ConfirmDelete>
            </>
          )}
        </div>

        <div className="d-flex align-items-center gap-2">
          <SearchBar
            placeholder="Search items..."
            value={searchTerm}
            onChange={setSearchTerm}
            options={items.map((i) => i.brand || "")}
            storageKey="sold_items_search"
          />
          <button
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="p-2 bg-light border rounded-3 shadow-sm"
            style={{ borderRadius: "12px", width: "42px", height: "42px" }}
            title="Filter by date created"
          >
            <i className="bi bi-calendar3 fs-5 text-secondary"></i>
          </button>
          {/* <ToggleColumns columns={tableColumns} onChange={setTableColumns} /> */}
        </div>
      </div>

      {showDatePicker && (
        <div className="bg-white p-3 shadow-md rounded-4 mb-3 w-fit">
          <DateRangePicker onChange={setDateRange} />
        </div>
      )}

      {/* Summary Widget for non-Superadmin */}
      <div className="mb-4">
        <div className="bg-white shadow-sm rounded-4 p-4 border d-flex align-items-center justify-content-between">
          <div>
            <h5 className="mb-1 text-secondary">Total Cleaned Bags</h5>
            <h2 className="fw-bold mb-0 text-success">
              {items
                .filter((i) => i.prepared_by?.trim() === user?.name?.trim())
                .reduce(
                  (sum, i) => sum + (parseFloat(i.quantity || "0") || 0),
                  0,
                )
                .toLocaleString()}
            </h2>
          </div>
          <div
            className="rounded-circle bg-success bg-opacity-10 d-flex align-items-center justify-content-center"
            style={{ width: "60px", height: "60px" }}
          >
            <i className="bi bi-bag-check-fill text-success fs-3"></i>
          </div>
        </div>
      </div>

      <ItemTable
        data={items}
        columns={tableColumns}
        rowKey="id"
        selectable
        selectedIds={selectedItems}
        onToggleSelect={toggleSelectItem}
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
