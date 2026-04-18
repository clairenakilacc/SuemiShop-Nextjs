"use client";

import React, { useState } from "react";

import ViewCategory from "../../components/categories/ViewCategory";
import EditCategory from "../../components/categories/EditCategory";
import DeleteCategory from "../../components/categories/DeleteCategory";

/* =========================
   Types
========================= */
export interface Category {
  id: string;
  description: string;
  created_at: string | null;
}

/* =========================
   Props
========================= */
interface Props {
  data: Category[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: (checked: boolean) => void;

  page: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;

  showView?: boolean;
  showEdit?: boolean;
  showDelete?: boolean;
}

/* =========================
   Component
========================= */
export default function CategoryTable({
  data,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  page,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
  showView = true,
  showEdit = true,
  showDelete = true,
}: Props) {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );

  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  /* =========================
     Button Style (BLACK OUTLINE)
  ========================= */
  const baseBtn: React.CSSProperties = {
    border: "1px solid #111827",
    background: "transparent",
    color: "#111827",
    padding: "4px 8px",
    borderRadius: "6px",
    transition: "0.2s",
    cursor: "pointer",
  };

  const hoverStyle = (color: string) => ({
    background: color,
    borderColor: color,
    color: "#fff",
  });

  return (
    <div>
      {/* TABLE */}
      <div className="table-responsive" style={{ maxHeight: "70vh" }}>
        <table className="table table-bordered table-striped">
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
              <th className="text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-4 text-muted">
                  No categories found.
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

                  {/* ACTIONS */}
                  <td className="text-center">
                    <div className="d-flex justify-content-center gap-2">
                      {/* VIEW */}
                      {showView && (
                        <button
                          style={baseBtn}
                          onMouseOver={(e) =>
                            Object.assign(
                              e.currentTarget.style,
                              hoverStyle("#d40d56"),
                            )
                          }
                          onMouseOut={(e) =>
                            Object.assign(e.currentTarget.style, baseBtn)
                          }
                          onClick={() => {
                            setSelectedCategory(row);
                            setViewOpen(true);
                          }}
                        >
                          👁
                        </button>
                      )}

                      {/* EDIT */}
                      {showEdit && (
                        <button
                          style={baseBtn}
                          onMouseOver={(e) =>
                            Object.assign(
                              e.currentTarget.style,
                              hoverStyle("#f472b6"),
                            )
                          }
                          onMouseOut={(e) =>
                            Object.assign(e.currentTarget.style, baseBtn)
                          }
                          onClick={() => {
                            setSelectedCategory(row);
                            setEditOpen(true);
                          }}
                        >
                          ✏️
                        </button>
                      )}

                      {/* DELETE */}
                      {showDelete && (
                        <button
                          style={baseBtn}
                          onMouseOver={(e) =>
                            Object.assign(
                              e.currentTarget.style,
                              hoverStyle("#ef4444"),
                            )
                          }
                          onMouseOut={(e) =>
                            Object.assign(e.currentTarget.style, baseBtn)
                          }
                          onClick={() => {
                            setSelectedCategory(row);
                            setDeleteOpen(true);
                          }}
                        >
                          🗑
                        </button>
                      )}
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
            {[50, 100, 500].map((n) => (
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
      <ViewCategory
        show={viewOpen}
        category={selectedCategory}
        onClose={() => setViewOpen(false)}
      />

      <EditCategory
        show={editOpen}
        category={selectedCategory}
        onClose={() => setEditOpen(false)}
      />

      <DeleteCategory
        show={deleteOpen}
        category={selectedCategory}
        onClose={() => setDeleteOpen(false)}
      />
    </div>
  );
}
