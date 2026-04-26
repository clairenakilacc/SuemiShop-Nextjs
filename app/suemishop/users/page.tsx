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
  const handleSaveUser = async (updatedUser: any) => {
    const { error } = await supabase
      .from("users")
      .update({
        name: updatedUser.name,
        password: updatedUser.password ?? undefined,
        role: updatedUser.role,
        phone_number: updatedUser.phone_number,
        address: updatedUser.address,

        sss_number: updatedUser.sss_number,
        philhealth_number: updatedUser.philhealth_number,
        pagibig_number: updatedUser.pagibig_number,

        hourly_rate: updatedUser.hourly_rate,
        daily_rate: updatedUser.daily_rate,

        is_employee: updatedUser.is_employee,
        is_live_seller: updatedUser.is_live_seller,
      })
      .eq("id", updatedUser.id);

    if (error) {
      throw new Error(error.message);
    }

    // refresh list AFTER saving
    await fetchUsers();
  };
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [totalCount, setTotalCount] = useState(0);

  const [roles, setRoles] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    const fetchRoles = async () => {
      const { data } = await supabase.from("roles").select("id, name");
      setRoles(data || []);
    };

    fetchRoles();
  }, []);

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
        const term = `%${searchTerm}%`;

        query = query.or(
          [
            `name.ilike.${term}`,
            `email.ilike.${term}`,
            `address.ilike.${term}`,
            `phone_number.ilike.${term}`,
            `sss_number.ilike.${term}`,
            `philhealth_number.ilike.${term}`,
            `pagibig_number.ilike.${term}`,
          ].join(","),
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
        onSaveUser={handleSaveUser}
        selectedIds={selectedUsers}
        onToggleSelect={toggleSelectUser}
        onToggleSelectAll={toggleSelectAll}
        onRefresh={() => fetchUsers()}
        page={page}
        roles={roles}
        pageSize={pageSize}
        totalCount={totalCount}
        onPageChange={(p) => setPage(p)}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
      />
    </div>
  );
}
