"use client";

import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { supabase } from "@/lib/supabase";

import AddPayslip from "../../components/payslips/AddPayslip";
import ExportButton from "../../components/ExportButton";
import DeleteSelected from "../../components/DeleteSelected";
import SearchBar from "../../components/SearchBar";
import Filter from "../../components/Filter";
import PayslipTable from "../../components/payslips/PayslipTable";

import type { Payslip } from "@/app/types/payslip";

type ID = number;

export default function PayslipsPage() {
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  const [selectedIds, setSelectedIds] = useState<ID[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const [filters, setFilters] = useState<any>({});

  const fetchPayslips = async () => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from("payslips")
      .select(
        `
        *,
        user:users(id, name)
      `,
        { count: "exact" },
      )
      .order("created_at", { ascending: false })
      .range(from, to);

    if (filters.created_start) {
      const start = new Date(filters.created_start);
      const end = filters.created_end
        ? new Date(filters.created_end)
        : new Date(filters.created_start);

      end.setHours(23, 59, 59, 999);

      query = query
        .gte("created_at", start.toISOString())
        .lte("created_at", end.toISOString());
    }

    const { data, error, count } = await query;

    if (error) {
      toast.error(error.message);
      return;
    }

    let filtered = data || [];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((p: any) =>
        p.user?.name?.toLowerCase().includes(term),
      );
    }

    setPayslips(filtered);
    setTotalCount(count || 0);
  };

  useEffect(() => {
    fetchPayslips();
  }, [page, pageSize, searchTerm, filters]);

  const toggleSelect = (id: ID) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const toggleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? payslips.map((p) => Number(p.id)) : []);
  };

  return (
    <div className="container my-5">
      <Toaster />

      <h3 className="mb-4">Payslips Management</h3>

      <div className="mb-3 d-flex justify-content-between flex-wrap gap-2">
        <div className="d-flex gap-2 flex-wrap">
          <AddPayslip onSuccess={fetchPayslips} />

          <ExportButton
            data={payslips}
            headersMap={{
              Employee: (row: any) => row.user?.name,
              "Start Period": "start_period",
              "End Period": "end_period",
              "Net Pay": "net_pay",
            }}
            filename="payslips.csv"
          />

          <DeleteSelected
            selectedCount={selectedIds.length}
            confirmMessage={
              selectedIds.length === 0
                ? "Select record first"
                : "Delete selected payslips?"
            }
            onConfirm={async () => {
              const { error } = await supabase
                .from("payslips")
                .delete()
                .in("id", selectedIds);

              if (error) throw new Error(error.message);

              setSelectedIds([]);
              fetchPayslips();
            }}
          />
        </div>

        <div className="d-flex gap-2">
          <SearchBar
            placeholder="Search employee..."
            value={searchTerm}
            onChange={setSearchTerm}
            options={payslips.map((p) => p.user?.name || "")}
          />

          <Filter
            onApply={(f) => setFilters(f)}
            config={[
              { key: "created_start", label: "Start Date", type: "date" },
              { key: "created_end", label: "End Date", type: "date" },
            ]}
          />
        </div>
      </div>

      <PayslipTable
        data={payslips}
        selectedIds={selectedIds}
        onToggleSelect={toggleSelect}
        onToggleSelectAll={toggleSelectAll}
        page={page}
        pageSize={pageSize}
        totalCount={totalCount}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        onRefresh={fetchPayslips}
      />
    </div>
  );
}
