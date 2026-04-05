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
  type?: "text" | "number" | "float" | "select" | "datetime";
  placeholder?: string;
  defaultValue?: any;
  options?: FieldOption[] | string[];
}

interface AddButtonProps {
  table: string;
  fields: FieldConfig[];
  onSuccess: () => void;
  className?: string;
  buttonText?: string;
}

export default function AddButton({
  table,
  fields,
  onSuccess,
  className = "btn btn-success",
  buttonText = "Add",
}: AddButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Build the row object for insertion
      const row: Record<string, any> = {};

      fields.forEach((f) => {
        const value = form[f.key] ?? f.defaultValue ?? "";

        if (f.type === "number" || f.type === "float") {
          // Store numeric fields as strings to preserve formatting like "100.10"
          row[f.key] = value.toString();
        } else if (f.type === "select") {
          row[f.key] = value;
        } else {
          row[f.key] = value;
        }
      });

      const { error } = await supabase.from(table).insert([row]);
      if (error) throw error;

      toast.success("Record added successfully!");
      setForm({});
      setShowModal(false);
      onSuccess();
    } catch (err: any) {
      toast.error(err.message || "Failed to insert record");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        className={className}
        onClick={() => setShowModal(true)}
        disabled={loading}
      >
        {buttonText}
      </button>

      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-3 overflow-hidden">
              <div className="modal-header bg-light">
                <h5 className="modal-title">Add Record</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>

              <div className="modal-body">
                {fields.map((f) => (
                  <div className="mb-3" key={f.key}>
                    <label className="form-label">{f.label}</label>

                    {f.type === "select" ? (
                      <select
                        className="form-select"
                        value={form[f.key] || ""}
                        onChange={(e) => handleChange(f.key, e.target.value)}
                      >
                        <option value="">Select {f.label}</option>
                        {f.options?.map((opt: any) =>
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
                        onChange={(e) => handleChange(f.key, e.target.value)}
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                  disabled={loading}
                  
                >
                  Cancel
                </button>
                <button
                  className="btn btn-success"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
