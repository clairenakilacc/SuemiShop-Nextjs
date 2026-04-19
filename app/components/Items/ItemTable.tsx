"use client";

import React, { useState } from "react";
import ViewItem from "../../components/items/ViewItem";
import EditItem from "../../components/items/EditItem";
import DeleteItem from "../../components/items/DeleteItem";

/* =========================
   Item Type
========================= */
export interface Item {
  id: string;

  created_at?: string | null;
  updated_at?: string | null;

  created_by?: number | null;
  updated_by?: number | null;
  prepared_by?: number | null; // 👈 USER ID (IMPORTANT FIX)
  live_seller?: number | null;

  date_shipped?: string | null;
  date_returned?: string | null;

  brand?: string | null;
  order_id?: string | null;

  category?: number | null;
  mined_from?: string | null;

  shoppee_commission?: number | null;
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

  // 👇 ADD USERS (IMPORTANT)
  users: { id: number; name: string }[];

  onRefresh: () => void;
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
  selectable = true,
  categories = [],
  users = [], // 👈 FIX
}: Props) {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const getUserName = (id?: number | null) => {
    if (!id) return "-";
    return users.find((u) => u.id === id)?.name || "-";
  };

  const btnStyle: React.CSSProperties = {
    border: "1px solid #111827",
    background: "transparent",
    color: "#111827",
    padding: "4px 8px",
    borderRadius: "6px",
    cursor: "pointer",
  };

  const hover = (color: string) => ({
    background: color,
    borderColor: color,
    color: "#fff",
  });

  return (
    <div>
      {/* TABLE */}
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
              <th>Order ID</th>
              <th>Live Seller</th>
              <th>Selling Price</th>

              <th className="text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-4 text-muted">
                  No items found.
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={row.id}>
                  <td className="text-center">
                    {selectable && (
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(row.id)}
                        onChange={() => onToggleSelect(row.id)}
                      />
                    )}
                  </td>
                  {/* data */}
                  <td>{getUserName(row.prepared_by)}</td> {/* 👈 FIXED */}
                  <td>{row.brand ?? "-"}</td>
                  <td>{row.order_id ?? "-"}</td>
                  <td>{getUserName(row.live_seller)}</td>
                  <td>{row.selling_price ?? 0}</td>
                  {/* actions */}
                  <td>
                    <div className="d-flex justify-content-center gap-2">
                      <button
                        style={btnStyle}
                        onClick={() => {
                          setSelectedItem(row);
                          setViewOpen(true);
                        }}
                        onMouseOver={(e) =>
                          Object.assign(e.currentTarget.style, hover("#0d6efd"))
                        }
                        onMouseOut={(e) =>
                          Object.assign(e.currentTarget.style, btnStyle)
                        }
                      >
                        👁
                      </button>

                      <button
                        style={btnStyle}
                        onClick={() => {
                          setSelectedItem(row);
                          setEditOpen(true);
                        }}
                        onMouseOver={(e) =>
                          Object.assign(e.currentTarget.style, hover("#f59e0b"))
                        }
                        onMouseOut={(e) =>
                          Object.assign(e.currentTarget.style, btnStyle)
                        }
                      >
                        ✏️
                      </button>

                      <button
                        style={btnStyle}
                        onClick={() => {
                          setSelectedItem(row);
                          setDeleteOpen(true);
                        }}
                        onMouseOver={(e) =>
                          Object.assign(e.currentTarget.style, hover("#ef4444"))
                        }
                        onMouseOut={(e) =>
                          Object.assign(e.currentTarget.style, btnStyle)
                        }
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
      <div className="d-flex justify-content-between mt-3 flex-wrap gap-2">
        <div>
          Show{" "}
          <select
            className="form-select d-inline-block w-auto"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
          >
            {[10, 20, 50, 100].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        <div>
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .slice(Math.max(0, page - 3), Math.min(totalPages, page + 2))
            .map((p) => (
              <button
                key={p}
                className={`btn btn-sm mx-1 ${
                  p === page ? "btn-primary" : "btn-outline-secondary"
                }`}
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
    </div>
  );
}
