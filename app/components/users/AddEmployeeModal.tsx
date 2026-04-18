"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabase";

interface FieldOption {
  label: string;
  value: string;
}

interface FieldConfig {
  key: string;
  label: string;
  type?: "text" | "number" | "float" | "select";
  placeholder?: string;
  defaultValue?: any;
  options?: FieldOption[] | string[];
}

interface Props {
  table: string;
  fields: FieldConfig[];
  onSuccess: () => void;
}

export default function AddEmployeeModal({ table, fields, onSuccess }: Props) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (key: string, value: string) => {
    setForm((p) => ({ ...p, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const row: Record<string, any> = {};

      fields.forEach((f) => {
        const value = form[f.key] ?? f.defaultValue ?? "";

        if (f.type === "number" || f.type === "float") {
          row[f.key] = value.toString();
        } else {
          row[f.key] = value;
        }
      });

      const { error } = await supabase.from(table).insert([row]);
      if (error) throw error;

      toast.success("Employee added");
      setForm({});
      setOpen(false);
      onSuccess();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button className="btn btn-success" onClick={() => setOpen(true)}>
        Add Employee
      </button>

      {open && (
        <div
          className="modal d-block"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Add Employee</h5>
                <button onClick={() => setOpen(false)}>✕</button>
              </div>

              <div className="modal-body">
                {fields.map((f) => (
                  <div key={f.key} className="mb-2">
                    <label>{f.label}</label>

                    {f.type === "select" ? (
                      <select
                        className="form-control"
                        value={form[f.key] || ""}
                        onChange={(e) => handleChange(f.key, e.target.value)}
                      >
                        <option value="">Select</option>
                        {f.options?.map((o: any) => (
                          <option
                            key={typeof o === "string" ? o : o.value}
                            value={typeof o === "string" ? o : o.value}
                          >
                            {typeof o === "string" ? o : o.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        className="form-control"
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
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </button>

                <button
                  className="btn btn-success"
                  disabled={loading}
                  onClick={handleSubmit}
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
