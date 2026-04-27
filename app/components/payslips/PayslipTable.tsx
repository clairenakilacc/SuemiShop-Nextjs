"use client";

import { useState } from "react";
import type { Payslip } from "@/app/types/payslip";

import ViewPayslip from "@/app/components/payslips/ViewPayslip";
import EditPayslip from "@/app/components/payslips/EditPayslip";
import DeletePayslip from "@/app/components/payslips/DeletePayslip";

/* =========================
   TYPES (BIGINT SAFE)
========================= */
type ID = number;

interface Props {
  data: Payslip[];

  selectedIds: ID[];
  onToggleSelect: (id: ID) => void;
  onToggleSelectAll: (checked: boolean) => void;

  page: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;

  onRefresh: () => void;
}

/* =========================
   COMPONENT
========================= */
export default function PayslipTable({
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
  const [selectedPayslip, setSelectedPayslip] = useState<Payslip | null>(null);

  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const openModal = (type: "view" | "edit" | "delete", row: Payslip) => {
    setSelectedPayslip(row);

    if (type === "view") setViewOpen(true);
    if (type === "edit") setEditOpen(true);
    if (type === "delete") setDeleteOpen(true);
  };

  return (
    <div>
      {/* TABLE */}
      <div className="table-responsive" style={{ maxHeight: "70vh" }}>
        <table className="table table-bordered table-striped text-capitalize">
          {/* HEADER */}
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

              <th>Period</th>
              <th>Employee</th>

              <th>Days Worked</th>
              <th>Overtime Hours</th>

              <th>Total Daily Pay</th>
              <th>Total Overtime Pay</th>

              <th className="text-center">Actions</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-4 text-muted">
                  No payslips found.
                </td>
              </tr>
            ) : (
              data.map((row) => {
                const id = Number(row.id); // 🔥 IMPORTANT BIGINT FIX

                return (
                  <tr key={id}>
                    {/* CHECKBOX */}
                    <td className="text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(id)}
                        onChange={() => onToggleSelect(id)}
                      />
                    </td>

                    {/* PERIOD */}
                    <td>
                      {row.start_period && row.end_period
                        ? `${new Date(row.start_period).toLocaleDateString()} - ${new Date(row.end_period).toLocaleDateString()}`
                        : "-"}
                    </td>

                    {/* EMPLOYEE */}
                    <td>{row.user?.name || "Unknown"}</td>

                    {/* WORK */}
                    <td>{row.days_worked ?? 0}</td>
                    <td>{row.overtime_hours ?? 0}</td>

                    {/* PAY */}
                    <td>
                      ₱{Number(row.total_daily_pay || 0).toLocaleString()}
                    </td>
                    <td>
                      ₱{Number(row.total_overtime_pay || 0).toLocaleString()}
                    </td>

                    {/* ACTIONS */}
                    <td className="text-center">
                      <div className="d-flex justify-content-center gap-2">
                        <button
                          className="action-btn view"
                          onClick={() => openModal("view", row)}
                        >
                          👁
                        </button>

                        <button
                          className="action-btn edit"
                          onClick={() => openModal("edit", row)}
                        >
                          ✏️
                        </button>

                        <button
                          className="action-btn delete"
                          onClick={() => openModal("delete", row)}
                        >
                          🗑
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
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
      {selectedPayslip && (
        <>
          <ViewPayslip
            show={viewOpen}
            payslip={selectedPayslip}
            onClose={() => setViewOpen(false)}
          />

          <EditPayslip
            show={editOpen}
            payslip={selectedPayslip}
            onClose={() => setEditOpen(false)}
            onSuccess={onRefresh}
          />

          <DeletePayslip
            show={deleteOpen}
            payslip={selectedPayslip}
            onClose={() => setDeleteOpen(false)}
            onSuccess={onRefresh}
          />
        </>
      )}
    </div>
  );
}
