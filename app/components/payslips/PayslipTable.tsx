"use client";

import { useState } from "react";
import type { Payslip } from "@/app/types/payslip";

import ViewPayslip from "@/app/components/payslips/ViewPayslip";
import EditPayslip from "@/app/components/payslips/EditPayslip";
import DeletePayslip from "@/app/components/payslips/DeletePayslip";

interface Props {
  data: Payslip[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: (checked: boolean) => void;

  page: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;

  onRefresh: () => void;
}

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

              <th>Period</th>
              <th>Employee</th>
              <th>Days</th>
              <th>Overtime</th>
              <th>Gross Pay</th>
              <th>Net Pay</th>

              {/* ✅ ACTIONS */}
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-4 text-muted">
                  No payslips found.
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

                  <td>
                    {row.start_period && row.end_period
                      ? `${new Date(row.start_period).toLocaleDateString()} - ${new Date(row.end_period).toLocaleDateString()}`
                      : "-"}
                  </td>

                  <td>{row.user?.name || "Unknown"}</td>
                  <td>{row.days_worked}</td>
                  <td>{row.overtime_hours}</td>

                  <td>₱{Number(row.gross_pay || 0).toLocaleString()}</td>
                  <td>
                    <strong className="text-success">
                      ₱{Number(row.net_pay || 0).toLocaleString()}
                    </strong>
                  </td>

                  {/* ✅ ACTION BUTTONS */}
                  <td className="text-center">
                    <div className="d-flex justify-content-center gap-2">
                      {/* VIEW */}
                      <button
                        className="action-btn view"
                        onClick={() => {
                          setSelectedPayslip(row);
                          setViewOpen(true);
                        }}
                      >
                        👁
                      </button>

                      {/* EDIT */}
                      <button
                        className="action-btn edit"
                        onClick={() => {
                          setSelectedPayslip(row);
                          setEditOpen(true);
                        }}
                      >
                        ✏️
                      </button>

                      {/* DELETE */}
                      <button
                        className="action-btn delete"
                        onClick={() => {
                          setSelectedPayslip(row);
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
    </div>
  );
}
