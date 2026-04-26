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

  onRefresh: () => void;
}

/* =========================
   COMPONENT
========================= */
export default function UserTable({
  data,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onRefresh,
}: Props) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <div>
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
                  {/* SELECT */}
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

                  {/* ACTIONS */}
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
          MODALS
      ========================= */}
      <ViewUser
        show={viewOpen}
        user={selectedUser}
        onClose={() => setViewOpen(false)}
      />

      <EditUser
        show={editOpen}
        user={selectedUser}
        onClose={() => setEditOpen(false)}
        onSuccess={onRefresh}
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
