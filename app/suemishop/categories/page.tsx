"use client";

import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { supabase } from "@/lib/supabase";

import AddCategory from "../../components/categories/AddCategory";
import BulkEditCategory from "../../components/categories/BulkEditCategory";
import ImportCategory from "../../components/categories/ImportCategory";
import ExportButton from "../../components/ExportButton";
import DeleteSelected from "../../components/DeleteSelected";
import SearchBar from "../../components/SearchBar";
import type { Category } from "../../components/categories/CategoryTable";
import CategoryTable from "../../components/categories/CategoryTable";

export default function CategoriesListPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [totalCount, setTotalCount] = useState(0);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      let query = supabase
        .from("categories")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(from, to);

      if (searchTerm.trim()) {
        query = query.ilike("description", `%${searchTerm.trim()}%`);
      }

      const { data, error, count } = await query;

      if (error) {
        toast.error(error.message);
        return;
      }

      setCategories((data as Category[]) || []);
      setTotalCount(count || 0);
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [page, pageSize, searchTerm]);

  // Selection handlers
  const toggleSelectCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id],
    );
  };

  const toggleSelectAll = (checked: boolean) => {
    setSelectedCategories(
      checked ? categories.map((c) => c.id).filter(Boolean) : [],
    );
  };

  return (
    <div className="container my-5">
      <Toaster />

      <h3 className="mb-4">Categories Management</h3>

      {/* Toolbar */}
      <div className="mb-3 d-flex flex-wrap align-items-center justify-content-between gap-2">
        <div className="d-flex flex-wrap align-items-center gap-2">
          <AddCategory onSuccess={fetchCategories} />

          <ImportCategory onSuccess={fetchCategories} />

          <ExportButton
            data={categories}
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
            }}
            filename="categories.csv"
          />

          <DeleteSelected
            selectedCount={selectedCategories.length}
            confirmMessage="Are you sure you want to delete selected categories?"
            onConfirm={async () => {
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

      {/* Table */}
      <CategoryTable
        data={categories}
        selectedIds={selectedCategories}
        onToggleSelect={toggleSelectCategory}
        onToggleSelectAll={toggleSelectAll}
        onDelete={async (id, description) => {
          const { error } = await supabase
            .from("categories")
            .delete()
            .eq("id", id);

          if (error) {
            toast.error(error.message);
            return;
          }

          toast.success(`Deleted "${description}"`);
          fetchCategories();
        }}
        page={page}
        pageSize={pageSize}
        totalCount={totalCount}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
}
