"use client";

import { useState, useEffect, useRef } from "react";
import { Column } from "./DataTable";

interface ToggleColumnsProps<T> {
  columns: Column<T>[];
  onChange: (visibleColumns: Column<T>[]) => void;
}

export default function ToggleColumns<T>({
  columns,
  onChange,
}: ToggleColumnsProps<T>) {
  const [visibleCols, setVisibleCols] = useState<string[]>(
    columns.map((col) => col.header)
  );
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleToggle = (header: string) => {
    const newVisible = visibleCols.includes(header)
      ? visibleCols.filter((h) => h !== header)
      : [...visibleCols, header];

    setVisibleCols(newVisible);
    onChange(columns.filter((col) => newVisible.includes(col.header)));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="position-relative d-inline-block" ref={ref}>
      <button
        className="btn btn-light border shadow-sm"
        style={{ width: 42, height: 42 }}
        onClick={() => setOpen(!open)}
        title="Toggle columns"
      >
        <i className="bi bi-columns-gap fs-5 text-secondary"></i>
      </button>

      {open && (
        <div
          className="dropdown-menu show p-2 shadow"
          style={{
            minWidth: "200px",
            top: "100%",
            right: 0,
            left: "auto",
            zIndex: 1050,
          }}
        >
          <h6 className="dropdown-header">Toggle Columns</h6>
          {columns.map((col) => (
            <div key={col.header} className="form-check ms-2 mb-1">
              <input
                type="checkbox"
                className="form-check-input"
                checked={visibleCols.includes(col.header)}
                onChange={() => handleToggle(col.header)}
                id={`toggle-col-${col.header}`}
                style={{ accentColor: "var(--bs-rose)" }} // <--- rose color checkmark
              />
              <label
                className="form-check-label"
                htmlFor={`toggle-col-${col.header}`}
              >
                {col.header}
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
