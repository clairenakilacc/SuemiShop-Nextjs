"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabase";

import ViewItem from "../../components/items/ViewItem";
import EditItem from "../../components/items/EditItem";
import DeleteItem from "../../components/items/DeleteItem";

/* =========================
   Inventory Type
========================= */
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

interface Props {
  data: Inventory[];

  selectedIds: number[];
  onToggleSelect: (id: number) => void;
  onToggleSelectAll: (checked: boolean) => void;
  loading: boolean;

  page: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;

  categories: { id: number; description: string }[];

  onRefresh: (page?: number) => void;
  selectable?: boolean;
}

/* =========================
   Component
========================= */
export default function InventoryTable({
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
}: Props) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const getCategoryName = (id?: number | null) =>
    categories.find((c) => c.id === id)?.description || "-";

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

              <th>Date Arrived</th>
              <th>Box #</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total</th>
              <th>Qty Left</th>
              <th>Total Left</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center py-4 text-muted">
                  No inventory found.
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={row.id}>
                  {/* SELECT */}
                  <td className="text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(row.id)}
                      onChange={() => onToggleSelect(row.id)}
                    />
                  </td>

                  <td>
                    {row.date_arrived
                      ? new Date(row.date_arrived).toLocaleDateString("en-CA")
                      : "-"}
                  </td>

                  <td>{row.box_number ?? "-"}</td>
                  <td>{getCategoryName(row.category)}</td>

                  <td>{row.quantity}</td>
                  <td>{row.price}</td>
                  <td>{row.total}</td>

                  <td>{row.quantity_left}</td>
                  <td>{row.total_left}</td>

                  <td>{row.status}</td>
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
            {[10, 20, 30].map((n) => (
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
    </div>
  );
}
