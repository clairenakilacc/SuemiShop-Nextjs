"use client";

import React, { useState } from "react";
import type { Inventory } from "@/app/types/inventory";

import ViewInventory from "../../components/inventory/ViewInventory";
import EditInventory from "../../components/inventory/EditInventory";
import DeleteInventory from "../../components/inventory/DeleteInventory";

interface Props {
  data: Inventory[];
  selectedIds: number[];
  onToggleSelect: (id: number) => void;
  onToggleSelectAll: (checked: boolean) => void;

  page: number;
  pageSize: number;
  totalCount: number;

  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;

  onRefresh: () => void;
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
}: Props) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const [selectedRow, setSelectedRow] = useState<Inventory | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <div>
      {/* TABLE */}
      <div className="table-responsive" style={{ maxHeight: "70vh" }}>
        <table className="table table-bordered table-striped text-capitalize">
          <thead className="table-light sticky-top">
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={
                    data.length > 0 && selectedIds.length === data.length
                  }
                  onChange={(e) => onToggleSelectAll(e.target.checked)}
                />
              </th>

              <th>Date Arrived</th>
              <th>Box Number</th>
              <th>Supplier</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total</th>
              <th>Qty Left</th>
              <th>Total Left</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={11} className="text-center py-4 text-muted">
                  No inventories found.
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={row.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(row.id)}
                      onChange={() => onToggleSelect(row.id)}
                    />
                  </td>

                  <td>
                    {row.date_arrived
                      ? new Date(row.date_arrived).toLocaleDateString("en-CA", {
                          timeZone: "Asia/Manila",
                        })
                      : "-"}
                  </td>

                  <td>{row.box_number || "-"}</td>
                  <td>{row.supplier?.name || "-"}</td>
                  <td>{row.category?.description || "-"}</td>
                  <td>{row.quantity}</td>
                  <td>{Number(row.price).toFixed(2)}</td>
                  <td>{Number(row.total).toFixed(2)}</td>
                  <td>{row.quantity_left}</td>
                  <td>{row.total_left}</td>

                  {/* ACTIONS */}
                  <td className="text-center">
                    <div className="d-flex justify-content-center gap-2">
                      {/* VIEW */}
                      <button
                        className="action-btn view"
                        onClick={() => {
                          setSelectedRow(row);
                          setViewOpen(true);
                        }}
                      >
                        👁
                      </button>

                      {/* EDIT */}
                      <button
                        className="action-btn edit"
                        onClick={() => {
                          setSelectedRow(row);
                          setEditOpen(true);
                        }}
                      >
                        ✏️
                      </button>

                      {/* DELETE */}
                      <button
                        className="action-btn delete"
                        onClick={() => {
                          setSelectedRow(row);
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

      {/* MODALS */}
      <ViewInventory
        show={viewOpen}
        inventory={selectedRow}
        onClose={() => setViewOpen(false)}
      />

      <EditInventory
        show={editOpen}
        inventory={selectedRow}
        onClose={() => setEditOpen(false)}
        onSuccess={onRefresh}
      />

      <DeleteInventory
        show={deleteOpen}
        inventory={selectedRow}
        onClose={() => setDeleteOpen(false)}
        onSuccess={onRefresh}
      />
    </div>
  );
}
