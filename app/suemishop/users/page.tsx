"use client";

import { useEffect, useState, useCallback } from "react";
import toast, { Toaster } from "react-hot-toast";
import { supabase } from "@/lib/supabase";

import type { User } from "@/app/types/user";

import AddUser from "@/app/components/users/AddUser";
import UserTable from "@/app/components/users/UserTable";

import ExportButton from "@/app/components/ExportButton";
import DeleteSelected from "@/app/components/DeleteSelected";
import SearchBar from "@/app/components/SearchBar";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [totalCount, setTotalCount] = useState(0);

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

      setUsers((data as User[]) || []);
      setTotalCount(count || 0);
    },
    [page, pageSize, searchTerm],
  );

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

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
      <UserTable
        data={users}
        selectedIds={selectedUsers}
        onToggleSelect={toggleSelectUser}
        onToggleSelectAll={toggleSelectAll}
        onRefresh={() => fetchUsers()}
      />

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
