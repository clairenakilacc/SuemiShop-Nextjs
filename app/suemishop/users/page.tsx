"use client";

import { useEffect, useState, useCallback } from "react";
import toast, { Toaster } from "react-hot-toast";
import { supabase } from "@/lib/supabase";

import AddUser from "@/app/components/users/AddUser";
import ExportButton from "@/app/components/ExportButton";
import DeleteSelected from "@/app/components/DeleteSelected";
import SearchBar from "@/app/components/SearchBar";

interface User {
  id: number;
  created_at: string | null;

  name: string;
  email: string | null;

  is_employee: boolean | null;
  is_live_seller: boolean | null;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [totalCount, setTotalCount] = useState(0);

  /* =========================
     FETCH USERS
  ========================= */
  const fetchUsers = useCallback(
    async (resetPage = false) => {
      const currentPage = resetPage ? 1 : page;

      const from = (currentPage - 1) * pageSize;
      const to = from + pageSize - 1;

      let query = supabase
        .from("users")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(from, to);

      if (searchTerm.trim()) {
        query = query.or(
          `name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`,
        );
      }

      const { data, error, count } = await query;

      if (error) {
        toast.error(error.message);
        return;
      }

      setUsers(data || []);
      setTotalCount(count || 0);
    },
    [page, pageSize, searchTerm],
  );

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  /* =========================
     SELECT LOGIC
  ========================= */
  const toggleSelectUser = (id: number) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const toggleSelectAll = (checked: boolean) => {
    setSelectedUsers(checked ? users.map((u) => u.id) : []);
  };

  const handleRefresh = async (resetPage = false) => {
    if (resetPage) setPage(1);
    await fetchUsers(resetPage);
  };

  /* =========================
     UI
  ========================= */
  return (
    <div className="container my-5">
      <Toaster />

      <h3 className="mb-4">Users Management</h3>

      {/* TOOLBAR */}
      <div className="mb-3 d-flex justify-content-between flex-wrap gap-2">
        <div className="d-flex gap-2 flex-wrap">
          <AddUser onSuccess={() => handleRefresh(true)} />

          <ExportButton
            data={users}
            filename="users.csv"
            headersMap={{
              Name: "name",
              Email: "email",
              Employee: (row: User) => (row.is_employee ? "Yes" : "No"),
              "Live Seller": (row: User) => (row.is_live_seller ? "Yes" : "No"),
              "Created At": (row: User) =>
                row.created_at
                  ? new Date(row.created_at).toLocaleDateString()
                  : "",
            }}
          />

          <DeleteSelected
            selectedCount={selectedUsers.length}
            confirmMessage={
              selectedUsers.length === 0
                ? "Select user first"
                : "Delete selected users?"
            }
            onConfirm={async () => {
              if (selectedUsers.length === 0) {
                throw new Error("Select user first");
              }

              const { error } = await supabase
                .from("users")
                .delete()
                .in("id", selectedUsers);

              if (error) throw new Error(error.message);

              setSelectedUsers([]);
              fetchUsers();
            }}
          />
        </div>

        <SearchBar
          placeholder="Search users..."
          value={searchTerm}
          onChange={setSearchTerm}
          options={users.map((u) => u.name)}
        />
      </div>

      {/* TABLE */}
      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={
                    users.length > 0 && selectedUsers.length === users.length
                  }
                  onChange={(e) => toggleSelectAll(e.target.checked)}
                />
              </th>
              <th>Name</th>
              <th>Email</th>
              <th>Employee</th>
              <th>Live Seller</th>
              <th>Created</th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(u.id)}
                      onChange={() => toggleSelectUser(u.id)}
                    />
                  </td>
                  <td>{u.name}</td>
                  <td>{u.email || "-"}</td>
                  <td>{u.is_employee ? "Yes" : "No"}</td>
                  <td>{u.is_live_seller ? "Yes" : "No"}</td>
                  <td>
                    {u.created_at
                      ? new Date(u.created_at).toLocaleDateString()
                      : "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="d-flex justify-content-between mt-3">
        <div>
          Page {page} / {Math.ceil(totalCount / pageSize) || 1}
        </div>

        <div className="d-flex gap-2">
          <button
            className="btn btn-secondary btn-sm"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Prev
          </button>

          <button
            className="btn btn-secondary btn-sm"
            disabled={page * pageSize >= totalCount}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
