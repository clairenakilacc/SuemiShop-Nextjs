"use client";

import { useState } from "react";

import type { Payslip } from "@/app/types/payslip";

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
  const [selected, setSelected] = useState<Payslip | null>(null);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return (
    <div>
      {/* ================= TABLE ================= */}
      <div className="table-responsive" style={{ maxHeight: "70vh" }}>
        <table className="table table-bordered table-striped text-capitalize">
          <thead className="table-light sticky-top">
            <tr>
              {/* CHECKBOX */}
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
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-4 text-muted">
                  No payslips found.
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={row.id}>
                  {/* CHECKBOX */}
                  <td className="text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(row.id)}
                      onChange={() => onToggleSelect(row.id)}
                    />
                  </td>

                  {/* PERIOD */}
                  <td>
                    {row.start_period && row.end_period ? (
                      <>
                        {new Date(row.start_period).toLocaleDateString()} -{" "}
                        {new Date(row.end_period).toLocaleDateString()}
                      </>
                    ) : (
                      "-"
                    )}
                  </td>

                  {/* EMPLOYEE */}
                  <td>{row.user?.name || "Unknown"}</td>

                  {/* DAYS */}
                  <td>{row.days_worked}</td>

                  {/* OVERTIME */}
                  <td>{row.overtime_hours}</td>

                  {/* GROSS */}
                  <td>₱{Number(row.gross_pay || 0).toLocaleString()}</td>

                  {/* NET */}
                  <td>
                    <strong className="text-success">
                      ₱{Number(row.net_pay || 0).toLocaleString()}
                    </strong>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ================= PAGINATION ================= */}
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
