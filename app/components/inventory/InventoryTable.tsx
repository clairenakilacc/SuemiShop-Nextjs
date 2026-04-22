"use client";

import React, { useState } from "react";
import ConfirmDelete from "../ConfirmDelete";
import { supabase } from "@/lib/supabase";

import ViewInventory from "./ViewInventory";
import EditInventory from "./EditInventory";

interface Inventory {
  id?: string;
  created_at?: string | null;
  date_arrived?: string | null;
  box_number?: string;
  supplier?: string;
  category?: string;
  quantity?: string;
  price?: string;
  total?: string;
  quantity_left?: string;
  total_left?: string;
  status?: string;
}

interface Props {
  data: Inventory[];
  selectedIds: string[];

  onToggleSelect: (id: string) => void;
  onToggleSelectAll: (checked: boolean) => void;

  page: number;
  pageSize: number;
  totalCount: number;

  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;

  onRefresh: () => void;

  categories: { id: string; description: string }[];
  suppliers: { id: string; name: string }[];

  isSuperAdmin?: boolean;
}

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
  categories,
  suppliers,
  isSuperAdmin = false,
}: Props) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const [selectedInventory, setSelectedInventory] = useState<Inventory | null>(
    null,
  );

  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const getStatusBadge = (status?: string) => {
    const s = status?.toLowerCase() || "instock";

    if (s === "restock") {
      return (
        <span
          className="badge"
          style={{
            backgroundColor: "rgba(255,0,0,0.12)",
            color: "#dc3545",
            fontWeight: 600,
          }}
        >
          RESTOCK
        </span>
      );
    }

    return <span className="badge bg-success">INSTOCK</span>;
  };

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

              <th>Created</th>
              <th>Date Arrived</th>
              <th>Box</th>
              <th>Supplier</th>
              <th>Category</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
              <th>Qty Left</th>
              <th>Total Left</th>
              <th>Status</th>

              {isSuperAdmin && <th className="text-center">Action</th>}
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={12} className="text-center py-4 text-muted">
                  No inventories found.
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={row.id}>
                  <td className="text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(row.id!)}
                      onChange={() => onToggleSelect(row.id!)}
                    />
                  </td>

                  <td>{row.created_at || ""}</td>
                  <td>{row.date_arrived || ""}</td>
                  <td>{row.box_number}</td>
                  <td>{row.supplier}</td>
                  <td>{row.category}</td>
                  <td>{row.quantity}</td>
                  <td>{row.price}</td>
                  <td>{row.total}</td>
                  <td>{row.quantity_left}</td>
                  <td>{row.total_left}</td>

                  <td>{getStatusBadge(row.status)}</td>

                  {isSuperAdmin && (
                    <td>
                      <div className="d-flex justify-content-center gap-2">
                        {/* VIEW */}
                        <button
                          className="action-btn view"
                          onClick={() => {
                            setSelectedInventory(row);
                            setViewOpen(true);
                          }}
                        >
                          👁
                        </button>

                        {/* EDIT */}
                        <button
                          className="action-btn edit"
                          onClick={() => {
                            setSelectedInventory(row);
                            setEditOpen(true);
                          }}
                        >
                          ✏️
                        </button>

                        {/* DELETE */}
                        <ConfirmDelete
                          confirmMessage={`Delete inventory ${row.id}?`}
                          onConfirm={async () => {
                            const { error } = await supabase
                              .from("inventories")
                              .delete()
                              .eq("id", row.id!);

                            if (error) throw error;

                            onRefresh();
                          }}
                        >
                          <span className="action-btn delete">🗑</span>
                        </ConfirmDelete>
                      </div>
                    </td>
                  )}
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
            {[20, 50, 100].map((n) => (
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
      <ViewInventory
        show={viewOpen}
        inventory={selectedInventory}
        onClose={() => setViewOpen(false)}
      />

      <EditInventory
        show={editOpen}
        inventory={selectedInventory}
        onClose={() => setEditOpen(false)}
        onSuccess={onRefresh}
        categories={categories}
        suppliers={suppliers}
      />
    </div>
  );
}
