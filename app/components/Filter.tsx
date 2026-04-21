"use client";

import { useState } from "react";

type Option = { label: string; value: any };
type FieldType = "date" | "select" | "boolean";

export interface FilterConfig {
  key: string;
  label: string;
  type: FieldType;
  options?: Option[];
}

interface Props {
  config: FilterConfig[];
  onApply: (filters: Record<string, any>) => void;
}

export default function Filter({ config, onApply }: Props) {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<Record<string, any>>({});

  const update = (key: string, value: any) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <>
      {/*Funnel button */}
      <button
        className="btn btn-outline-secondary btn-md bi bi-funnel"
        onClick={() => setOpen(true)}
      ></button>
      {/* 🧱 BACKDROP */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.3)",
            zIndex: 999,
          }}
        />
      )}

      {/* 📦 RIGHT DRAWER */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: open ? 0 : "-320px",
          width: "260px",
          maxWidth: "85vw",
          height: "100vh",
          background: "#fff",
          boxShadow: "-2px 0 10px rgba(0,0,0,0.15)",
          padding: "16px",
          transition: "0.3s",
          zIndex: 1000,
          overflowY: "auto",
        }}
      >
        <div className="d-flex justify-content-between mb-3">
          <h6 className="m-0">Filters</h6>
          <button
            className="btn btn-sm btn-light"
            onClick={() => setOpen(false)}
          >
            ✕
          </button>
        </div>

        {/* 🔧 FIELDS */}
        {config.map((f) => (
          <div key={f.key} className="mb-3">
            <label className="form-label">{f.label}</label>

            {/* DATE */}
            {f.type === "date" && (
              <input
                type="date"
                className="form-control"
                value={values[f.key] || ""}
                onChange={(e) => update(f.key, e.target.value)}
              />
            )}

            {/* SELECT */}
            {f.type === "select" && (
              <select
                className="form-control"
                value={values[f.key] || ""}
                onChange={(e) => update(f.key, e.target.value || null)}
              >
                <option value="">All</option>
                {f.options?.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            )}

            {/* BOOLEAN */}
            {f.type === "boolean" && (
              <select
                className="form-control"
                value={values[f.key] === undefined ? "" : String(values[f.key])}
                onChange={(e) => {
                  const val = e.target.value;

                  update(
                    f.key,
                    val === "" ? undefined : val === "true" ? true : false,
                  );
                }}
              >
                <option value="">All</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            )}
          </div>
        ))}

        {/* 🔘 ACTIONS */}
        <div className="d-flex gap-2 mt-4">
          <button
            className="btn btn-add w-100"
            onClick={() => {
              onApply(values);
              setOpen(false);
            }}
          >
            Apply
          </button>

          <button
            className="btn btn-light w-100"
            onClick={() => {
              setValues({});
              onApply({});
            }}
          >
            Reset
          </button>
        </div>
      </div>
    </>
  );
}
