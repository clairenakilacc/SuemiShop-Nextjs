"use client";

import React, { useState } from "react";
import type { Expense } from "@/app/types/expense";

import ViewExpense from "@/app/components/expenses/ViewExpense";
import EditExpense from "@/app/components/expenses/EditExpense";
import DeleteExpense from "@/app/components/expenses/DeleteExpense";

interface Props {
  data: Expense[];
  selectedIds: number[];
  onToggleSelect: (id: number) => void;
  onToggleSelectAll: (checked: boolean) => void;

  page: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;

  onRefresh: () => void; // 🔥 REQUIRED (not optional)
}

export default function ExpenseTable({
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
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

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

              <th>Description</th>
              <th>Amount</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-4 text-muted">
                  No expenses found.
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={row.id}>
                  <td className="text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(row.id)}
                      onChange={() => onToggleSelect(row.id)}
                    />
                  </td>

                  <td>{row.description}</td>
                  <td>{Number(row.amount).toFixed(2)}</td>

                  <td className="text-center">
                    <div className="d-flex justify-content-center gap-2">
                      <button
                        className="action-btn view"
                        onClick={() => {
                          setSelectedExpense(row);
                          setViewOpen(true);
                        }}
                      >
                        👁
                      </button>

                      <button
                        className="action-btn edit"
                        onClick={() => {
                          setSelectedExpense(row);
                          setEditOpen(true);
                        }}
                      >
                        ✏️
                      </button>

                      <button
                        className="action-btn delete"
                        onClick={() => {
                          setSelectedExpense(row);
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
        <select
          className="form-select w-auto"
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
        >
          {[10, 20, 30].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>

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
      <ViewExpense
        show={viewOpen}
        expense={selectedExpense}
        onClose={() => setViewOpen(false)}
      />

      <EditExpense
        show={editOpen}
        expense={selectedExpense}
        onClose={() => setEditOpen(false)}
        onSuccess={onRefresh} // 🔥 IMPORTANT
      />

      <DeleteExpense
        show={deleteOpen}
        expense={selectedExpense}
        onClose={() => setDeleteOpen(false)}
        onSuccess={onRefresh} // 🔥 IMPORTANT
      />
    </div>
  );
}
