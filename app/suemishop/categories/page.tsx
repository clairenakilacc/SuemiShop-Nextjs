"use client";

import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { supabase } from "@/lib/supabase";

import AddCategory from "../../components/categories/AddCategory";
import ImportCategory from "../../components/categories/ImportCategory";
import ExportButton from "../../components/ExportButton";
import DeleteSelected from "../../components/DeleteSelected";
import SearchBar from "../../components/SearchBar";
import CategoryTable from "../../components/categories/CategoryTable";

export default function CategoriesListPage() {
  /* =========================
     Local Type (NO IMPORTS)
  ========================= */
  interface Category {
    id: string;
    description: string;
    created_at: string | null;
    updated_at: string | null;
  }

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const handleRefresh = async (resetPage = false) => {
    if (resetPage) setPage(1);
    await fetchCategories(resetPage);
  };

  const fetchCategories = async (resetPage = false) => {
    const currentPage = resetPage ? 1 : page;

    const from = (currentPage - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from("categories")
      .select("*", { count: "exact" })
      .order("updated_at", { ascending: false })
      .range(from, to);

    if (searchTerm.trim()) {
      query = query.ilike("description", `%${searchTerm.trim()}%`);
    }

    const { data, error, count } = await query;

    if (error) {
      toast.error(error.message);
      return;
    }

    setCategories(data || []);
    setTotalCount(count || 0);
  };

  //
  useEffect(() => {
    fetchCategories();
  }, [page, pageSize, searchTerm]);

  const toggleSelectCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const toggleSelectAll = (checked: boolean) => {
    setSelectedCategories(checked ? categories.map((c) => c.id) : []);
  };

  return (
    <div className="container my-5">
      <Toaster />

      <h3 className="mb-4">Categories Management</h3>

      {/* TOOLBAR */}
      <div className="mb-3 d-flex justify-content-between flex-wrap gap-2">
        <div className="d-flex gap-2 flex-wrap">
          <AddCategory onSuccess={() => handleRefresh(true)} />

          {/* <ImportCategory onSuccess={() => handleRefresh(true)} /> */}

          <ExportButton
            data={categories}
            headersMap={{
              "Created At": (row: any) => {
                if (!row.created_at) return "";
                const d = new Date(row.created_at);
                return `${(d.getMonth() + 1).toString().padStart(2, "0")}-${d
                  .getDate()
                  .toString()
                  .padStart(2, "0")}-${d.getFullYear().toString().slice(-2)}`;
              },
              Description: "description",
            }}
            filename="categories.csv"
          />

          <DeleteSelected
            selectedCount={selectedCategories.length}
            confirmMessage={
              selectedCategories.length === 0
                ? "Select record first"
                : "Delete selected categories?"
            }
            onConfirm={async () => {
              if (selectedCategories.length === 0) {
                throw new Error("Select record first");
              }

              const { error } = await supabase
                .from("categories")
                .delete()
                .in("id", selectedCategories);

              if (error) throw new Error(error.message);

              setSelectedCategories([]);
              fetchCategories();
            }}
          />
        </div>

        <SearchBar
          placeholder="Search categories..."
          value={searchTerm}
          onChange={setSearchTerm}
          options={categories.map((c) => c.description)}
        />
      </div>

      <CategoryTable
        data={categories}
        selectedIds={selectedCategories}
        onToggleSelect={toggleSelectCategory}
        onToggleSelectAll={toggleSelectAll}
        page={page}
        pageSize={pageSize}
        totalCount={totalCount}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        onRefresh={fetchCategories}
      />
    </div>
  );
}
