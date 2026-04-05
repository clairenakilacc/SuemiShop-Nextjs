"use client";

import React, { ReactNode, useMemo, useState } from "react";

export type Column<T> = {
  header: string;
  accessor: keyof T | ((row: T) => ReactNode);
  center?: boolean;
};

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  selectable?: boolean;
  selectedIds?: string[];
  onToggleSelect?: (id: string) => void;
  onToggleSelectAll?: (checked: boolean) => void;
  rowKey: keyof T;
  page: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;

  /* Edit functionality */
  showEdit?: boolean;
  onEditRow?: (row: T) => void;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  selectable = false,
  selectedIds = [],
  onToggleSelect,
  onToggleSelectAll,
  rowKey,
  page,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
  showEdit = false,
  onEditRow,
}: DataTableProps<T>) {
  /* =========================
     Column Filters
  ========================== */
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>(
    {},
  );

  const handleFilterChange = (key: string, value: string) => {
    setColumnFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setColumnFilters({});
  };

  /* =========================
     Sorting
  ========================== */
  const sortedData = useMemo(() => {
    if (!data?.length) return [];

    if ("created_at" in data[0]) {
      return [...data].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
    }

    if ("timestamp" in data[0]) {
      return [...data].sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      );
    }

    return data;
  }, [data]);

  /* =========================
     Filtering
  ========================== */
  const filteredData = useMemo(() => {
    return sortedData.filter((row) =>
      columns.every((col) => {
        const filterValue = columnFilters[col.header];
        if (!filterValue) return true;

        const rawValue =
          typeof col.accessor === "function"
            ? col.accessor(row)
            : row[col.accessor];

        return String(rawValue ?? "")
          .toLowerCase()
          .includes(filterValue.toLowerCase());
      }),
    );
  }, [sortedData, columnFilters, columns]);

  const rowsToRender = filteredData;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  /* =========================
     Render
  ========================== */
  return (
    <div>
      {/* Toolbar */}
      <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
        {selectable && selectedIds.length > 0 && (
          <div className="text-muted small">
            {selectedIds.length} row{selectedIds.length > 1 ? "s" : ""} selected
          </div>
        )}

        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={resetFilters}
        >
          Reset Filters
        </button>
      </div>

      {/* Table */}
      <div className="table-responsive" style={{ maxHeight: "70vh" }}>
        <table className="table table-bordered table-striped">
          <thead className="table-light sticky-top">
            {/* Header row */}
            <tr>
              {selectable && (
                <th className="text-center">
                  <input
                    type="checkbox"
                    checked={
                      rowsToRender.length > 0 &&
                      selectedIds.length === rowsToRender.length
                    }
                    onChange={(e) => onToggleSelectAll?.(e.target.checked)}
                  />
                </th>
              )}

              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={`${col.center ? "text-center" : ""} fw-semibold`}
                >
                  {col.header}
                </th>
              ))}

              {showEdit && <th className="text-center">Edit</th>}
            </tr>

            {/* Filter row */}
            <tr>
              {selectable && <th />}

              {columns.map((col, idx) => (
                <th key={idx}>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Filter..."
                    value={columnFilters[col.header] || ""}
                    onChange={(e) =>
                      handleFilterChange(col.header, e.target.value)
                    }
                  />
                </th>
              ))}

              {showEdit && <th />}
            </tr>
          </thead>

          <tbody>
            {rowsToRender.length === 0 ? (
              <tr>
                <td
                  colSpan={
                    columns.length + (selectable ? 1 : 0) + (showEdit ? 1 : 0)
                  }
                  className="text-center py-4 text-secondary"
                >
                  No records found.
                </td>
              </tr>
            ) : (
              rowsToRender.map((row) => (
                <tr key={row[rowKey]}>
                  {selectable && (
                    <td className="text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(row[rowKey])}
                        onChange={() => onToggleSelect?.(row[rowKey])}
                      />
                    </td>
                  )}

                  {columns.map((col, idx) => {
                    const value =
                      typeof col.accessor === "function"
                        ? col.accessor(row)
                        : row[col.accessor];

                    return (
                      <td key={idx} className={col.center ? "text-center" : ""}>
                        {value}
                      </td>
                    );
                  })}

                  {showEdit && (
                    <td className="text-center">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => onEditRow?.(row)}
                      >
                        Edit
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2">
        <div>
          Show{" "}
          <select
            className="form-select d-inline-block w-auto"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
          >
            {[100, 500, 700, 1000].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>{" "}
          entries
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

        <div className="text-muted small">
          Showing {(page - 1) * pageSize + 1}–
          {Math.min(page * pageSize, totalCount)} of {totalCount} entries
        </div>
      </div>
    </div>
  );
}
