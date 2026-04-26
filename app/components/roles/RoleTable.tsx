"use client";

import React, { useState } from "react";
import type { Role } from "@/app/types/role";

import ViewRole from "../../components/roles/ViewRole";
import EditRole from "../../components/roles/EditRole";
import DeleteRole from "../../components/roles/DeleteRole";

/* =========================
   Props
========================= */
interface Props {
  data: Role[];

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

/* =========================
   Component
========================= */
export default function RoleTable({
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
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

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

              <th>Role Name</th>
              {/* <th>Created At</th> */}
              <th className="text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-4 text-muted">
                  No roles found.
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

                  <td>{row.name}</td>
                  {/* 
                  <td>
                    {row.created_at
                      ? new Date(row.created_at).toLocaleDateString("en-CA")
                      : "-"}
                  </td> */}

                  {/* ACTIONS */}
                  <td className="text-center">
                    <div className="d-flex justify-content-center gap-2">
                      {/* VIEW */}
                      <button
                        className="action-btn view"
                        onClick={() => {
                          setSelectedRole(row);
                          setViewOpen(true);
                        }}
                      >
                        👁
                      </button>

                      {/* EDIT */}
                      <button
                        className="action-btn edit"
                        onClick={() => {
                          setSelectedRole(row);
                          setEditOpen(true);
                        }}
                      >
                        ✏️
                      </button>

                      {/* DELETE */}
                      <button
                        className="action-btn delete"
                        onClick={() => {
                          setSelectedRole(row);
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
      <ViewRole
        show={viewOpen}
        role={selectedRole}
        onClose={() => setViewOpen(false)}
      />

      <EditRole
        show={editOpen}
        role={selectedRole}
        onClose={() => setEditOpen(false)}
        onSuccess={onRefresh}
      />

      <DeleteRole
        show={deleteOpen}
        role={selectedRole}
        onClose={() => setDeleteOpen(false)}
        onSuccess={onRefresh}
      />
    </div>
  );
}
