"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabase";

import ViewItem from "../../components/items/ViewItem";
import EditItem from "../../components/items/EditItem";
import DeleteItem from "../../components/items/DeleteItem";
import ReturnedModal from "../../components/items/ReturnedModal";

import { computeItemFinance } from "@/utils/helpers/finance";

/* =========================
   Item Type
========================= */
export interface Item {
  id: string;

  created_at?: string | null;
  updated_at?: string | null;

  created_by?: number | null;
  updated_by?: number | null;
  prepared_by?: number | null;
  live_seller?: number | null;

  date_shipped?: string | null;
  date_returned?: string | null;

  brand?: string | null;
  order_id?: string | null;

  category?: number | null;
  mined_from?: string | null;

  shopee_commission?: number | null;
  selling_price?: number | null;
  capital?: number | null;
  order_income?: number | null;
  discount?: number | null;
  commission_rate?: number | null;
  quantity?: number | null;

  is_returned?: boolean | null;
}

/* =========================
   Props
========================= */
interface Props {
  data: Item[];

  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: (checked: boolean) => void;

  page: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;

  categories: { id: string; description: string }[];
  users: { id: number; name: string }[];

  onRefresh: (page?: number) => void;
  selectable?: boolean;
}

/* =========================
   Component
========================= */
export default function ItemTable({
  data,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  page,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
  onRefresh,
  categories = [],
  users = [],
}: Props) {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [returnItem, setReturnItem] = useState<Item | null>(null);
  const [returnOpen, setReturnOpen] = useState(false);

  const [savedMap, setSavedMap] = useState<{ [key: string]: boolean }>({});

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  /* =========================
     HELPERS
  ========================= */
  const getUserName = (id?: number | null) =>
    users.find((u) => u.id === id)?.name || "-";

  const getCategoryName = (id?: number | null) =>
    categories.find((c) => String(c.id) === String(id))?.description || "-";

  /* =========================
     RETURN TOGGLE FIX
  ========================= */
  const handleReturnToggle = async (row: Item, checked: boolean) => {
    // UNCHECK → direct update
    if (!checked) {
      const { error } = await supabase
        .from("items")
        .update({
          is_returned: false,
          date_shipped: null,
          date_returned: null,
        })
        .eq("id", row.id);

      if (!error) await onRefresh(page);
      return;
    }

    // CHECK → open modal
    setReturnItem(row);
    setReturnOpen(true);
  };

  const btnStyle: React.CSSProperties = {
    border: "1px solid #111827",
    background: "transparent",
    color: "#111827",
    padding: "4px 8px",
    borderRadius: "6px",
    cursor: "pointer",
  };

  //for saved commission
  const saveCommission = async (row: Item, value: number) => {
    const finance = computeItemFinance({
      ...row,
      shopee_commission: value,
    });

    const { error } = await supabase
      .from("items")
      .update({
        shopee_commission: value,
        order_income: finance.order_income,
        commission_rate: finance.commission_rate,
      })
      .eq("id", row.id);

    if (!error) {
      await onRefresh(page);

      setSavedMap((prev) => ({
        ...prev,
        [row.id]: true,
      }));
    } else {
      if (error) {
        console.error("Supabase error message:", error.message);
        console.error("Supabase error full:", error);
      }
    }
  };

  /* =========================
     PAGINATION
  ========================= */
  const paginatedData = data;

  return (
    <div>
      <div className="table-responsive" style={{ maxHeight: "70vh" }}>
        <table className="table table-bordered table-striped text-capitalize">
          <thead className="table-light sticky-top">
            <tr>
              <th className="text-center">
                <input
                  type="checkbox"
                  checked={
                    data.length > 0 && selectedIds.length === data.length
                  }
                  onChange={(e) => onToggleSelectAll(e.target.checked)}
                />
              </th>

              <th>Prepared By</th>
              <th>Brand</th>
              <th>Category</th>
              <th>Order ID</th>
              <th>Live Seller</th>
              <th>Selling Price</th>
              <th>Shopee Commission</th>
              <th>Returned</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center py-4 text-muted">
                  No items found.
                </td>
              </tr>
            ) : (
              paginatedData.map((row) => (
                <tr key={row.id}>
                  {/* SELECT */}
                  <td className="text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(row.id)}
                      onChange={() => onToggleSelect(row.id)}
                    />
                  </td>

                  <td>{getUserName(row.prepared_by)}</td>
                  <td>{row.brand ?? "-"}</td>
                  <td>{getCategoryName(row.category)}</td>
                  <td>{row.order_id ?? "-"}</td>
                  <td>{getUserName(row.live_seller)}</td>
                  <td>{row.selling_price ?? 0}</td>

                  {/* COMMISSION */}
                  <td>
                    <input
                      type="number"
                      defaultValue={row.shopee_commission ?? ""}
                      onChange={() => {
                        // kapag nag-edit ulit → mawala "Saved"
                        setSavedMap((prev) => ({
                          ...prev,
                          [row.id]: false,
                        }));
                      }}
                      onKeyDown={async (e) => {
                        if (e.key === "Enter") {
                          const value = Number(
                            (e.target as HTMLInputElement).value || 0,
                          );
                          await saveCommission(row, value);
                        }
                      }}
                      onBlur={async (e) => {
                        const value = Number(e.target.value || 0);
                        await saveCommission(row, value);
                      }}
                      style={{ width: "100px" }}
                    />
                    {savedMap[row.id] && (
                      <span style={{ fontSize: 12, color: "green" }}>
                        Saved
                      </span>
                    )}
                  </td>

                  {/* RETURNED (ONLY ONE COLUMN FIXED) */}
                  <td className="text-center">
                    <input
                      type="checkbox"
                      checked={!!row.is_returned}
                      onChange={(e) =>
                        handleReturnToggle(row, e.target.checked)
                      }
                    />
                  </td>

                  {/* ACTIONS */}
                  <td>
                    <div className="d-flex gap-2 justify-content-center">
                      <button
                        style={btnStyle}
                        onClick={() => {
                          setSelectedItem(row);
                          setViewOpen(true);
                        }}
                      >
                        👁
                      </button>

                      <button
                        style={btnStyle}
                        onClick={() => {
                          setSelectedItem(row);
                          setEditOpen(true);
                        }}
                      >
                        ✏️
                      </button>

                      <button
                        style={btnStyle}
                        onClick={() => {
                          setSelectedItem(row);
                          setDeleteOpen(true);
                        }}
                      >
                        🗑
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="d-flex justify-content-between mt-3">
        <div>
          Show
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
          >
            {[10, 20, 30].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        <div>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              className={`btn btn-sm mx-1 ${p === page ? "btn-primary" : "btn-outline-secondary"}`}
              onClick={() => onPageChange(p)}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* MODALS */}
      <ViewItem
        show={viewOpen}
        item={selectedItem}
        categories={categories}
        users={users}
        onClose={() => setViewOpen(false)}
      />

      <EditItem
        show={editOpen}
        item={selectedItem}
        onClose={() => setEditOpen(false)}
        onSuccess={onRefresh}
      />

      <DeleteItem
        show={deleteOpen}
        item={selectedItem}
        onClose={() => setDeleteOpen(false)}
        onSuccess={onRefresh}
      />

      <ReturnedModal
        show={returnOpen}
        item={returnItem}
        onClose={() => {
          setReturnOpen(false);
          setReturnItem(null);
        }}
        onSuccess={onRefresh}
      />
    </div>
  );
}
