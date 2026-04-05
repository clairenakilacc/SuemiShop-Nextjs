"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

interface FieldOption {
  label: string;
  value: string;
}

interface FieldConfig {
  key: string;
  label: string;
  type?: "text" | "number" | "float" | "select";
  options?: string[] | FieldOption[];
  placeholder?: string;
}

interface BulkEditProps {
  table: string;
  selectedIds: string[];
  fields: FieldConfig[];
  onSuccess: () => void;
  columns?: number;
}

export default function BulkEdit({
  table,
  selectedIds,
  fields,
  onSuccess,
}: BulkEditProps) {
  const [show, setShow] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedIds.length) {
      toast.error("Please select at least one record.");
      return;
    }

    // Only include filled fields
    const updateData = Object.fromEntries(
      Object.entries(form).filter(([_, v]) => v !== "" && v !== undefined)
    );

    if (Object.keys(updateData).length === 0) {
      toast.error("No fields filled to update.");
      return;
    }

    // Sanitize numeric/float fields as strings to preserve formatting
    const sanitizedData: Record<string, any> = {};
    Object.keys(updateData).forEach((key) => {
      const fieldConfig = fields.find((f) => f.key === key);
      if (!fieldConfig) return;

      if (fieldConfig.type === "number" || fieldConfig.type === "float") {
        sanitizedData[key] = updateData[key].toString(); // preserve "100.10"
      } else {
        sanitizedData[key] = updateData[key];
      }
    });

    setLoading(true);
    const { error } = await supabase
      .from(table)
      .update(sanitizedData)
      .in("id", selectedIds);

    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Bulk update successful!");
    setShow(false);
    setForm({});
    onSuccess();
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        className="px-4 py-2 text-white shadow-md transition"
        style={{
          backgroundColor: "#f59e0b", // amber-500
          borderRadius: "4px",
          fontWeight: 500,
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = "#d97706")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = "#f59e0b")
        }
        onClick={() => {
          if (!selectedIds.length)
            return toast.error("Select records to edit first.");
          setShow(true);
        }}
      >
        Edit
      </button>

      {/* Modal */}
      {show && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div
              className="modal-content overflow-hidden"
              style={{ borderRadius: "8px" }}
            >
              <div className="modal-header bg-light">
                <h5 className="modal-title">Bulk Edit</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShow(false)}
                ></button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <p className="text-muted small mb-3">
                    Only filled fields will be updated for all selected records.
                  </p>

                  {fields.map((f) => (
                    <div className="mb-3" key={f.key}>
                      <label className="form-label">{f.label}</label>
                      {f.type === "select" ? (
                        <select
                          className="form-select"
                          value={form[f.key] || ""}
                          onChange={(e) =>
                            setForm({ ...form, [f.key]: e.target.value })
                          }
                        >
                          <option value="">— No Change —</option>
                          {f.options?.map((opt) =>
                            typeof opt === "string" ? (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ) : (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            )
                          )}
                        </select>
                      ) : (
                        <input
                          type="text"
                          className="form-control"
                          placeholder={f.placeholder || ""}
                          value={form[f.key] || ""}
                          onChange={(e) =>
                            setForm({ ...form, [f.key]: e.target.value })
                          }
                        />
                      )}
                    </div>
                  ))}
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShow(false)}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="text-white shadow-md transition"
                    style={{
                      backgroundColor: "#f59e0b", // amber-500
                      borderRadius: "4px",
                      padding: "8px 16px",
                      fontWeight: 500,
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#d97706")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "#f59e0b")
                    }
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
