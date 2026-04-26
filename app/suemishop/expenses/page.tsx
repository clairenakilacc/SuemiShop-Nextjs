"use client";

import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { supabase } from "@/lib/supabase";

import SearchBar from "../../components/SearchBar";
import ExportButton from "../../components/ExportButton";
import DeleteSelected from "../../components/DeleteSelected";
import Filter from "../../components/Filter";

import ExpenseTable from "../../components/expenses/ExpenseTable";
import AddExpense from "../../components/expenses/AddExpense";

import type { Expense } from "@/app/types/expense";

export default function ExpensesListPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [selectedExpenses, setSelectedExpenses] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const [filters, setFilters] = useState<any>({});

  const fetchExpenses = async () => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from("expenses")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    // 🔥 DATE FILTER (like Items page)
    const f = filters ?? {};

    if (f.created_start) {
      const start = new Date(f.created_start);
      const end = f.created_end
        ? new Date(f.created_end)
        : new Date(f.created_start);

      end.setHours(23, 59, 59, 999);

      query = query
        .gte("created_at", start.toISOString())
        .lte("created_at", end.toISOString());
    }

    // SEARCH
    if (searchTerm.trim()) {
      query = query.ilike("description", `%${searchTerm}%`);
    }

    const { data, error, count } = await query;

    if (error) {
      toast.error(error.message);
      return;
    }

    setExpenses(data || []);
    setTotalCount(count || 0);
  };

  useEffect(() => {
    fetchExpenses();
  }, [page, pageSize, searchTerm, filters]);

  const toggleSelectExpense = (id: number) => {
    setSelectedExpenses((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const toggleSelectAll = (checked: boolean) => {
    setSelectedExpenses(checked ? expenses.map((e) => e.id!) : []);
  };

  return (
    <div className="container my-5">
      <Toaster />

      <h3 className="mb-4">Expenses Management</h3>

      {/* TOOLBAR */}
      <div className="mb-3 d-flex flex-wrap justify-content-between gap-2">
        <div className="d-flex flex-wrap gap-2">
          {/* ADD */}
          <AddExpense onSuccess={fetchExpenses} />

          {/* EXPORT */}
          <ExportButton
            data={expenses}
            headersMap={{
              Description: "description",
              Amount: (row) => row.amount?.toString() || "0",
              "Created At": (row) =>
                row.created_at
                  ? new Date(row.created_at).toLocaleDateString()
                  : "",
            }}
            filename="expenses.csv"
          />

          {/* DELETE SELECTED */}
          <DeleteSelected
            selectedCount={selectedExpenses.length}
            confirmMessage={
              selectedExpenses.length === 0
                ? "Select record first"
                : "Delete selected expenses?"
            }
            onConfirm={async () => {
              if (!selectedExpenses.length) {
                throw new Error("Select record first");
              }

              const { error } = await supabase
                .from("expenses")
                .delete()
                .in("id", selectedExpenses);

              if (error) throw new Error(error.message);

              setSelectedExpenses([]);
              fetchExpenses();
            }}
          />
        </div>

        {/* SEARCH + FILTER */}
        <div className="d-flex gap-2">
          <SearchBar
            placeholder="Search expenses..."
            value={searchTerm}
            onChange={setSearchTerm}
            options={expenses.map((e) => e.description || "")}
          />

          {/* 🔥 DATE FILTER */}
          <Filter
            onApply={(f) => setFilters(f)}
            config={[
              {
                key: "created_start",
                label: "Start Date",
                type: "date",
              },
              {
                key: "created_end",
                label: "End Date",
                type: "date",
              },
            ]}
          />
        </div>
      </div>

      {/* TABLE */}
      <ExpenseTable
        data={expenses}
        selectedIds={selectedExpenses}
        onToggleSelect={toggleSelectExpense}
        onToggleSelectAll={toggleSelectAll}
        page={page}
        pageSize={pageSize}
        totalCount={totalCount}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        onRefresh={fetchExpenses}
      />
    </div>
  );
}
