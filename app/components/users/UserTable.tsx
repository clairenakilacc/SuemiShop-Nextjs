"use client";

import React, { useState } from "react";

import type { User } from "@/app/types/user";

import ViewUser from "./ViewUser";
import EditUser from "./EditUser";
import DeleteUser from "./DeleteUser";

/* =========================
   PROPS
========================= */
interface Props {
  data: User[];

  selectedIds: number[];
  onToggleSelect: (id: number) => void;
  onToggleSelectAll: (checked: boolean) => void;

  page: number;
  pageSize: number;
  totalCount: number;

  roles: { id: number; name: string }[];

  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onSaveUser: (updatedUser: any) => void;
  onRefresh: () => void;
}

/* =========================
   COMPONENT
========================= */
export default function UserTable({
  data,
  roles,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  page,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
  onSaveUser,
  onRefresh,
}: Props) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return (
    <div>
      {/* TABLE */}
      <div className="table-responsive" style={{ maxHeight: "70vh" }}>
        <table className="table table-bordered table-striped align-middle">
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

              <th>Name</th>
              <th>Email</th>
              <th>Employee</th>
              <th>Live Seller</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4 text-muted">
                  No users found
                </td>
              </tr>
            ) : (
              data.map((u) => (
                <tr key={u.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(u.id)}
                      onChange={() => onToggleSelect(u.id)}
                    />
                  </td>

                  <td>{u.name}</td>
                  <td>{u.email ?? "-"}</td>
                  <td>{u.is_employee ? "Yes" : "No"}</td>
                  <td>{u.is_live_seller ? "Yes" : "No"}</td>

                  <td>
                    <div className="d-flex gap-2 justify-content-center">
                      <button
                        className="action-btn view"
                        onClick={() => {
                          setSelectedUser(u);
                          setViewOpen(true);
                        }}
                      >
                        👁
                      </button>

                      <button
                        className="action-btn edit"
                        onClick={() => {
                          setSelectedUser(u);
                          setEditOpen(true);
                        }}
                      >
                        ✏️
                      </button>

                      <button
                        className="action-btn delete"
                        onClick={() => {
                          setSelectedUser(u);
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

      {/* =========================
          PAGINATION (EXACT ITEM STYLE)
      ========================= */}
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
      <ViewUser
        show={viewOpen}
        user={selectedUser}
        onClose={() => setViewOpen(false)}
        roles={roles}
      />

      <EditUser
        show={editOpen}
        user={selectedUser}
        onClose={() => setEditOpen(false)}
        onSuccess={onRefresh}
        roles={roles}
        onSave={onSaveUser}
      />

      <DeleteUser
        show={deleteOpen}
        user={selectedUser}
        onClose={() => setDeleteOpen(false)}
        onSuccess={onRefresh}
      />
    </div>
  );
}
