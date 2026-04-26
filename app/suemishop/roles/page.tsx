"use client";

import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { supabase } from "@/lib/supabase";
import AddRole from "../../components/roles/AddRole";
import ExportButton from "../../components/ExportButton";
import DeleteSelected from "../../components/DeleteSelected";
import SearchBar from "../../components/SearchBar";
import RoleTable from "../../components/roles/RoleTable";

import type { Role } from "@/app/types/role";

export default function RolesListPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const fetchRoles = async () => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from("roles")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (searchTerm.trim()) {
      query = query.ilike("name", `%${searchTerm}%`);
    }

    const { data, error, count } = await query;

    if (error) return toast.error(error.message);

    setRoles(data || []);
    setTotalCount(count || 0);
  };

  useEffect(() => {
    fetchRoles();
  }, [page, pageSize, searchTerm]);

  const toggleSelectRole = (id: number) => {
    setSelectedRoles((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const toggleSelectAll = (checked: boolean) => {
    setSelectedRoles(checked ? roles.map((r) => r.id) : []);
  };

  return (
    <div className="container my-5">
      <Toaster />
      <h3 className="mb-4">Roles Management</h3>

      {/* TOOLBAR */}
      <div className="mb-3 d-flex justify-content-between flex-wrap gap-2">
        <div className="d-flex gap-2 flex-wrap">
          <AddRole onSuccess={fetchRoles} />

          <ExportButton
            data={roles}
            headersMap={{
              "Created At": (row: Role) =>
                row.created_at
                  ? new Date(row.created_at).toLocaleDateString()
                  : "",
              "Role Name": "name",
            }}
            filename="roles.csv"
          />

          <DeleteSelected
            selectedCount={selectedRoles.length}
            confirmMessage={
              selectedRoles.length === 0
                ? "Select record first"
                : "Delete selected roles?"
            }
            onConfirm={async () => {
              if (!selectedRoles.length) throw new Error("No roles selected");

              const { error } = await supabase
                .from("roles")
                .delete()
                .in("id", selectedRoles);

              if (error) throw new Error(error.message);

              setSelectedRoles([]);
              fetchRoles();
            }}
          />
        </div>

        <SearchBar
          placeholder="Search roles..."
          value={searchTerm}
          onChange={setSearchTerm}
          options={roles.map((r) => r.name)}
        />
      </div>

      <RoleTable
        data={roles}
        selectedIds={selectedRoles}
        onToggleSelect={toggleSelectRole}
        onToggleSelectAll={toggleSelectAll}
        page={page}
        pageSize={pageSize}
        totalCount={totalCount}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        onRefresh={fetchRoles}
      />
    </div>
  );
}
