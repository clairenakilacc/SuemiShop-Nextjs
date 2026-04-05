"use client";

import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { supabase } from "@/lib/supabase";

import SearchBar from "../../components/SearchBar";
import ConfirmDelete from "../../components/ConfirmDelete";
import { DataTable, Column } from "../../components/DataTable";
import AddButton from "../../components/AddButton";
import BulkEdit from "../../components/BulkEdit";
import ExportButton from "../../components/ExportButton";
import ToggleColumns from "../../components/ToggleColumns";

interface Role {
  id?: string;
  name: string;
  created_at?: string;
}

export default function RolesListPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [tableColumns, setTableColumns] = useState<Column<Role>[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    const { data, error } = await supabase.from("roles").select("*");
    if (error) return toast.error(error.message);
    setRoles(data || []);
  };

  // Selection
  const toggleSelectRole = (id: string) =>
    setSelectedRoles((prev) =>
      prev.includes(id) ? prev.filter((rid) => rid !== id) : [...prev, id],
    );
  const toggleSelectAll = (checked: boolean) =>
    setSelectedRoles(checked ? roles.map((r) => r.id!) : []);

  // Filtering
  const filteredRoles = roles.filter((r) =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Columns
  const columns: Column<Role>[] = [
    {
      header: "Created At",
      accessor: (row) =>
        row.created_at ? new Date(row.created_at).toLocaleDateString() : "",
    },
    { header: "Role Name", accessor: "name" },
    {
      header: "Action",
      accessor: (row) => (
        <ConfirmDelete
          confirmMessage={`Are you sure you want to delete ${row.name}?`}
          onConfirm={async () => {
            const { error } = await supabase
              .from("roles")
              .delete()
              .eq("id", row.id!);
            if (error) {
              toast.error(error.message);
              return;
            }
            fetchRoles();
          }}
        >
          Delete
        </ConfirmDelete>
      ),
      center: true,
    },
  ];

  useEffect(() => {
    setTableColumns(columns);
  }, []);

  return (
    <div className="container my-5">
      <Toaster />
      <h3 className="mb-4">Roles Management</h3>

      {/* Toolbar */}
      <div className="mb-3 d-flex flex-wrap align-items-center justify-content-between gap-2">
        <div className="d-flex flex-wrap align-items-center gap-2">
          <AddButton
            table="roles"
            onSuccess={fetchRoles}
            fields={[{ key: "name", label: "Role Name", type: "text" }]}
          />

          {/* <BulkEdit
            table="roles"
            selectedIds={selectedRoles}
            onSuccess={fetchRoles}
            fields={[{ key: "name", label: "Role Name", type: "text" }]}
          /> */}

          <ExportButton
            data={filteredRoles}
            headersMap={{
              "Created At": (row) => row.created_at || "",
              "Role Name": "name",
            }}
            filename="roles.csv"
          />

          <ConfirmDelete
            confirmMessage="Are you sure you want to delete selected roles?"
            onConfirm={async () => {
              if (!selectedRoles.length) throw new Error("No roles selected");
              const { error } = await supabase
                .from("roles")
                .delete()
                .in("id", selectedRoles);
              if (error) {
                toast.error(error.message);
                return;
              }
              setSelectedRoles([]);
              fetchRoles();
            }}
          >
            Delete Selected
          </ConfirmDelete>
        </div>

        {/* Search + Toggle Columns */}
        <div className="d-flex align-items-center gap-2">
          <SearchBar
            placeholder="Search roles..."
            value={searchTerm}
            onChange={setSearchTerm}
            options={roles.map((r) => r.name)}
          />

          <ToggleColumns columns={columns} onChange={setTableColumns} />
        </div>
      </div>

      <DataTable<Role>
        data={filteredRoles}
        columns={tableColumns}
        selectable
        selectedIds={selectedRoles}
        onToggleSelect={toggleSelectRole}
        onToggleSelectAll={toggleSelectAll}
        rowKey="id"
        page={1}
        pageSize={50}
        totalCount={filteredRoles.length}
        onPageChange={() => {}}
        onPageSizeChange={() => {}}
      />
    </div>
  );
}
