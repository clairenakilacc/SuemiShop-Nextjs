"use client";

import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { supabase } from "@/lib/supabase";

import SearchBar from "../../components/SearchBar";
import ConfirmDelete from "../../components/ConfirmDelete";
import { DataTable, Column } from "../../components/DataTable";
import AddButton from "../../components/AddButton";
import BulkEdit from "../../components/BulkEdit";
import ImportButton from "../../components/ImportButton";
import ExportButton from "../../components/ExportButton";
import ToggleColumns from "../../components/ToggleColumns";

interface Expense {
  id?: string;
  description: string;
  amount: number;
  created_at?: string;
}

export default function ExpensesListPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [selectedExpenses, setSelectedExpenses] = useState<string[]>([]);
  const [tableColumns, setTableColumns] = useState<Column<Expense>[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [totalCount, setTotalCount] = useState(0);

  // Fetch expenses
  const fetchExpenses = async () => {
    try {
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      let query = supabase
        .from("expenses")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(from, to);

      if (searchTerm.trim()) {
        query = query.or(
          `description.ilike.%${searchTerm.trim()}%,amount.eq.${parseFloat(searchTerm.trim()) || 0}`
        );
      }

      const { data, error, count } = await query;
      if (error) {
        toast.error(error.message);
        return;
      }

      setExpenses(data || []);
      setTotalCount(count || 0);
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch expenses");
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [page, pageSize, searchTerm]);

  // Column definitions - Initialize columns
  useEffect(() => {
    // Only initialize if columns are empty
    if (tableColumns.length === 0) {
      const cols: Column<Expense>[] = [
        {
          header: "Created At",
          accessor: (row) => {
            if (!row.created_at) return "";
            const date = new Date(row.created_at);
            const month = (date.getMonth() + 1).toString().padStart(2, "0");
            const day = date.getDate().toString().padStart(2, "0");
            const year = date.getFullYear().toString().slice(-2);
            return `${month}-${day}-${year}`;
          },
        },
        { header: "Description", accessor: "description" },
        {
          header: "Amount",
          accessor: (row) => `₱${row.amount?.toFixed(2) || "0.00"}`,
        },
        {
          header: "Action",
          accessor: (row) => (
            <ConfirmDelete
              confirmMessage={`Are you sure you want to delete "${row.description}"?`}
              onConfirm={async () => {
                const { error } = await supabase
                  .from("expenses")
                  .delete()
                  .eq("id", row.id!);
                if (error) {
                  toast.error(error.message);
                  return;
                }
                toast.success("Expense deleted successfully");
                fetchExpenses();
              }}
            >
              Delete
            </ConfirmDelete>
          ),
          center: true,
        },
      ];
      setTableColumns(cols);
    }
  }, [tableColumns.length]); // Only run when length changes

  // Selection handlers
  const toggleSelectExpense = (id: string) =>
    setSelectedExpenses((prev) =>
      prev.includes(id) ? prev.filter((eid) => eid !== id) : [...prev, id]
    );

  const toggleSelectAll = (checked: boolean) =>
    setSelectedExpenses(checked ? expenses.map((e) => e.id!) : []);

  const filteredExpenses = expenses.filter(
    (e) =>
      e.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.amount?.toString().includes(searchTerm)
  );

  return (
    <div className="container my-5">
      <Toaster />
      <h3 className="mb-4">Expenses Management</h3>

      {/* Toolbar */}
      <div className="mb-3 d-flex flex-wrap align-items-center justify-content-between gap-2">
        <div className="d-flex flex-wrap align-items-center gap-2">
          <AddButton
            table="expenses"
            onSuccess={fetchExpenses}
            fields={[
              { key: "description", label: "Description", type: "text" },
              { key: "amount", label: "Amount", type: "number" },
            ]}
          />

          <BulkEdit
            table="expenses"
            selectedIds={selectedExpenses}
            onSuccess={fetchExpenses}
            fields={[
              { key: "description", label: "Description", type: "text" },
              { key: "amount", label: "Amount", type: "number" },
            ]}
          />

          <ImportButton
            table="expenses"
            headersMap={{
              "Created At": "created_at",
              Description: "description",
              Amount: "amount",
            }}
            transformRow={async (row) => {
              const description = row.Description?.toString().trim();
              const amount = parseFloat(row.Amount?.toString() || "0");
              
              if (!description) return null;

              let created_at: string | undefined;
              if (row["Created At"]) {
                const date = new Date(row["Created At"]);
                if (!isNaN(date.getTime())) created_at = date.toISOString();
              }
              
              return {
                description,
                amount,
                ...(created_at ? { created_at } : {}),
              };
            }}
            onSuccess={async () => {
              await fetchExpenses();
              toast.success("✅ Expenses imported successfully");
            }}
          />

          <ExportButton
            data={filteredExpenses}
            headersMap={{
              "Created At": (row) => {
                if (!row.created_at) return "";
                const date = new Date(row.created_at);
                const month = (date.getMonth() + 1).toString().padStart(2, "0");
                const day = date.getDate().toString().padStart(2, "0");
                const year = date.getFullYear().toString().slice(-2);
                return `${month}-${day}-${year}`;
              },
              Description: "description",
              Amount: (row) => row.amount?.toString() || "0",
            }}
            filename="expenses.csv"
          />

          <ConfirmDelete
            confirmMessage="Are you sure you want to delete selected expenses?"
            onConfirm={async () => {
              if (!selectedExpenses.length)
                throw new Error("No expenses selected");
              const { error } = await supabase
                .from("expenses")
                .delete()
                .in("id", selectedExpenses);
              if (error) {
                toast.error(error.message);
                return;
              }
              setSelectedExpenses([]);
              fetchExpenses();
            }}
          >
            Delete Selected
          </ConfirmDelete>
        </div>

        {/* Search + Toggle Columns */}
        <div className="d-flex align-items-center gap-2">
          <SearchBar
            placeholder="Search expenses..."
            value={searchTerm}
            onChange={setSearchTerm}
            options={expenses.map((e) => e.description)}
          />
          <ToggleColumns columns={tableColumns} onChange={setTableColumns} />
        </div>
      </div>

      <DataTable<Expense>
        data={filteredExpenses}
        columns={tableColumns}
        selectable
        selectedIds={selectedExpenses}
        onToggleSelect={toggleSelectExpense}
        onToggleSelectAll={toggleSelectAll}
        rowKey="id"
        page={page}
        pageSize={pageSize}
        totalCount={totalCount}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
}
//     bossing eto yung supabase table ng Expenses

//   create table public.expenses (
//   id bigint generated by default as identity not null,
//   created_at timestamp with time zone not null default now(),
//   description text null,
//   amount double precision null,
//   constraint expenses_pkey primary key (id)
// ) TABLESPACE pg_default;
