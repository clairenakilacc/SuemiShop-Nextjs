"use client";

import { useEffect, useMemo, useState } from "react";

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (val: string) => void;
  options?: string[];
  storageKey?: string;
}

export default function SearchBar({
  placeholder = "Search...",
  value,
  onChange,
  options = [],
  storageKey,
}: SearchBarProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  const key =
    storageKey || `search_${placeholder.toLowerCase().replace(/\s+/g, "_")}`;

  /* ===== Load saved value once ===== */
  useEffect(() => {
    const saved = localStorage.getItem(key);
    if (saved && saved !== value) {
      onChange(saved);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ===== Persist value ===== */
  useEffect(() => {
    if (value) localStorage.setItem(key, value);
    else localStorage.removeItem(key);
  }, [value, key]);

  /* ===== Derived filtering (NO STATE, NO LOOP) ===== */
  const filteredOptions = useMemo(() => {
    if (!value) return [];
    return options.filter((opt) =>
      opt.toLowerCase().includes(value.toLowerCase())
    );
  }, [value, options]);

  /* ===== Dropdown visibility ===== */
  useEffect(() => {
    setShowDropdown(Boolean(value && filteredOptions.length));
  }, [value, filteredOptions.length]);

  const handleSelect = (option: string) => {
    onChange(option);
    setShowDropdown(false);
  };

  return (
    <div className="position-relative w-100" style={{ maxWidth: "300px" }}>
      <input
        type="text"
        className="form-control"
        placeholder={placeholder}
        value={value}
        autoComplete="off"
        spellCheck={false}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => {
          if (filteredOptions.length) setShowDropdown(true);
        }}
        onBlur={() => setTimeout(() => setShowDropdown(false), 100)}
      />

      {showDropdown && (
        <ul
          className="list-group position-absolute w-100"
          style={{ top: "100%", zIndex: 50 }}
        >
          {filteredOptions.map((opt, i) => (
            <li
              key={`${opt}-${i}`}
              className="list-group-item list-group-item-action"
              style={{ cursor: "pointer" }}
              onMouseDown={() => handleSelect(opt)}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
