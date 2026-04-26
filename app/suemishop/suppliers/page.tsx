"use client";

import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { supabase } from "@/lib/supabase";
import type { Supplier } from "@/app/types/supplier";

import AddSupplier from "../../components/suppliers/AddSupplier";
import ExportButton from "../../components/ExportButton";
import DeleteSelected from "../../components/DeleteSelected";
import SearchBar from "../../components/SearchBar";
import SupplierTable from "../../components/suppliers/SupplierTable";

export default function SupplierListPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedSuppliers, setSelectedSuppliers] = useState<number[]>([]); // ✅ FIXED
  const [searchTerm, setSearchTerm] = useState("");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [totalCount, setTotalCount] = useState(0);

  const fetchSuppliers = async (resetPage = false) => {
    const currentPage = resetPage ? 1 : page;

    const from = (currentPage - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from("suppliers")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (searchTerm.trim()) {
      query = query.or(
        `name.ilike.%${searchTerm}%,contact_number.ilike.%${searchTerm}%`,
      );
    }

    const { data, error, count } = await query;

    if (error) {
      toast.error(error.message);
      return;
    }

    setSuppliers(data || []);
    setTotalCount(count || 0);
  };

  useEffect(() => {
    fetchSuppliers();
  }, [page, pageSize, searchTerm]);

  /* =========================
     SELECTION FIXED (number)
  ========================= */
  const toggleSelectSupplier = (id: number) => {
    setSelectedSuppliers((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const toggleSelectAll = (checked: boolean) => {
    setSelectedSuppliers(checked ? suppliers.map((s) => s.id) : []);
  };

  return (
    <div className="container my-5">
      <Toaster />

      <h3 className="mb-4">Supplier Management</h3>

      {/* TOOLBAR */}
      <div className="mb-3 d-flex justify-content-between flex-wrap gap-2">
        <div className="d-flex gap-2 flex-wrap">
          <AddSupplier onSuccess={() => fetchSuppliers(true)} />

          <ExportButton
            data={suppliers}
            headersMap={{
              "Created At": (row: Supplier) => {
                if (!row.created_at) return "";
                const d = new Date(row.created_at);
                return `${(d.getMonth() + 1).toString().padStart(2, "0")}-${d
                  .getDate()
                  .toString()
                  .padStart(2, "0")}-${d.getFullYear().toString().slice(-2)}`;
              },
              Name: "name",
              "Contact Number": "contact_number",
            }}
            filename="suppliers.csv"
          />

          <DeleteSelected
            selectedCount={selectedSuppliers.length}
            confirmMessage={
              selectedSuppliers.length === 0
                ? "Select record first"
                : "Delete selected suppliers?"
            }
            onConfirm={async () => {
              if (selectedSuppliers.length === 0) {
                throw new Error("Select record first");
              }

              const { error } = await supabase
                .from("suppliers")
                .delete()
                .in("id", selectedSuppliers); // ✅ works with number[]

              if (error) throw new Error(error.message);

              setSelectedSuppliers([]);
              fetchSuppliers();
            }}
          />
        </div>

        <SearchBar
          placeholder="Search suppliers..."
          value={searchTerm}
          onChange={setSearchTerm}
          options={suppliers.map((s) => s.name || "")} // ✅ null safe
        />
      </div>

      <SupplierTable
        data={suppliers}
        selectedIds={selectedSuppliers}
        onToggleSelect={toggleSelectSupplier}
        onToggleSelectAll={toggleSelectAll}
        page={page}
        pageSize={pageSize}
        totalCount={totalCount}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        onRefresh={() => fetchSuppliers(true)} // ✅ matches expected type
      />
    </div>
  );
}
