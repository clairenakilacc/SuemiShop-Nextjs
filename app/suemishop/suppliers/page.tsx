"use client";

import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { supabase } from "@/lib/supabase";

import SearchBar from "../../../components/SearchBar";
import ConfirmDelete from "../../../components/ConfirmDelete";
import { DataTable, Column } from "../../../components/DataTable";
import BulkEdit from "../../../components/BulkEdit";
import DateRangePicker from "../../../components/DateRangePicker";
import AddButton from "../../../components/AddButton";
import ToggleColumns from "../../../components/ToggleColumns";
import ImportButton from "../../../components/ImportButton";
import ExportButton from "../../../components/ExportButton";

interface Supplier {
  id?: string;
  created_at?: string;
  name?: string;
  phone_number?: string;
}

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState<{
    startDate: string | null;
    endDate: string | null;
  }>({ startDate: null, endDate: null });

  // Fetch suppliers
  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    const { data, error } = await supabase
      .from("suppliers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return toast.error(error.message);
    setSuppliers(data || []);
  };

  // Selection
  const toggleSelectSupplier = (id: string) =>
    setSelectedSuppliers((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  const toggleSelectAll = (checked: boolean) =>
    setSelectedSuppliers(checked ? suppliers.map((s) => s.id!) : []);

  // Filtering
  const filteredSuppliers = suppliers.filter((s) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = [s.name, s.phone_number].some((val) =>
      val?.toLowerCase().includes(term)
    );

    let matchesDateRange = true;
    if (dateRange.startDate && dateRange.endDate && s.created_at) {
      const created = new Date(s.created_at);
      const start = new Date(dateRange.startDate);
      const end = new Date(dateRange.endDate);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      matchesDateRange = created >= start && created <= end;
    }

    return matchesSearch && matchesDateRange;
  });

  // Columns
  const columns: Column<Supplier>[] = [
    {
      header: "Created At",
      accessor: (row) =>
        row.created_at ? new Date(row.created_at).toLocaleDateString() : "",
    },
    { header: "Name", accessor: "name" },
    { header: "Contact Number", accessor: "phone_number" },
    {
      header: "Action",
      accessor: (row) => (
        <ConfirmDelete
          confirmMessage={`Delete supplier ${row.name}?`}
          onConfirm={async () => {
            const { error } = await supabase
              .from("suppliers")
              .delete()
              .eq("id", row.id!);
            if (error) throw error;
            fetchSuppliers();
          }}
        >
          Delete
        </ConfirmDelete>
      ),
      center: true,
    },
  ];

  const [tableColumns, setTableColumns] = useState<Column<Supplier>[]>(columns);

  return (
    <div className="container my-5">
      <Toaster />
      <h3 className="mb-4">Suppliers Management</h3>

      {/* Toolbar */}
      <div className="mb-3 d-flex flex-wrap align-items-center justify-content-between gap-2">
        <div className="d-flex flex-wrap align-items-center gap-2">
          <AddButton
            table="suppliers"
            onSuccess={fetchSuppliers}
            fields={[
              { key: "name", label: "Supplier Name", type: "text" },
              {
                key: "phone_number",
                label: "Contact Number",
                type: "number",
                placeholder: "Must be 11 digits:09918895977",
              },
            ]}
          />
          <BulkEdit
            table="suppliers"
            selectedIds={selectedSuppliers}
            onSuccess={fetchSuppliers}
            fields={[
              { key: "name", label: "Supplier Name", type: "text" },
              {
                key: "phone_number",
                label: "Phone Number",
                type: "number",
                placeholder: "Must be 11 digits:09918895977",
              },
            ]}
          />
          <ImportButton
            table="suppliers"
            headersMap={{
              Name: "name",
              "Phone Number": "phone_number",
              "Created At": "created_at",
            }}
            onSuccess={fetchSuppliers}
          />
          <ExportButton
            data={filteredSuppliers}
            headersMap={{
              "Created At": (row) => row.created_at || "",
              Name: "name",
              "Phone Number": "phone_number",
            }}
            filename="suppliers.csv"
          />
          <ConfirmDelete
            confirmMessage="Delete selected suppliers?"
            onConfirm={async () => {
              if (!selectedSuppliers.length)
                throw new Error("No suppliers selected");
              const { error } = await supabase
                .from("suppliers")
                .delete()
                .in("id", selectedSuppliers);
              if (error) throw error;
              setSelectedSuppliers([]);
              fetchSuppliers();
            }}
          >
            Delete Selected
          </ConfirmDelete>
        </div>

        {/* Search + Calendar */}
        <div className="d-flex align-items-center gap-2">
          <SearchBar
            placeholder="Search suppliers..."
            value={searchTerm}
            onChange={setSearchTerm}
            options={suppliers.map((s) => s.name || "")}
          />
          <button
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="p-2 bg-light border rounded-3 d-flex align-items-center justify-content-center shadow-sm"
            style={{ borderRadius: "12px", width: "42px", height: "42px" }}
            title="Filter by created date"
          >
            <i className="bi bi-calendar3 fs-5 text-secondary"></i>
          </button>
          <ToggleColumns columns={columns} onChange={setTableColumns} />
        </div>
      </div>

      {showDatePicker && (
        <div className="bg-white p-3 shadow-md rounded-4 mb-3 w-fit">
          <DateRangePicker onChange={setDateRange} />
        </div>
      )}

      <DataTable<Supplier>
        data={filteredSuppliers}
        columns={tableColumns}
        selectable
        selectedIds={selectedSuppliers}
        onToggleSelect={toggleSelectSupplier}
        onToggleSelectAll={toggleSelectAll}
        rowKey="id"
        page={1}
        pageSize={50}
        totalCount={filteredSuppliers.length}
        onPageChange={() => {}}
        onPageSizeChange={() => {}}
      />
    </div>
  );
}
