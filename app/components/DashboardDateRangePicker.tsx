"use client";
import { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";

interface Props {
  onChange: (range: {
    startDate: string | null;
    endDate: string | null;
  }) => void;
}

export default function DashboardDateRangePicker({ onChange }: Props) {
  const [showPicker, setShowPicker] = useState(false);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setStartDate(value);
    onChange({ startDate: value, endDate });
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEndDate(value);
    onChange({ startDate, endDate: value });
  };

  const handleClear = () => {
    setStartDate(null);
    setEndDate(null);
    onChange({ startDate: null, endDate: null });
  };

  return (
    <div className="position-relative">
      <button
        className="btn btn-outline-secondary"
        onClick={() => setShowPicker(!showPicker)}
      >
        <i className="bi bi-calendar-date"></i>
      </button>

      {showPicker && (
        <div
          className="position-absolute bg-white border rounded p-2 mt-2"
          style={{ zIndex: 1000, minWidth: "220px" }}
        >
          <div className="mb-2">
            <label className="form-label small">Start Date</label>
            <input
              type="date"
              className="form-control"
              value={startDate || ""}
              onChange={handleStartChange}
            />
          </div>

          <div className="mb-2">
            <label className="form-label small">End Date</label>
            <input
              type="date"
              className="form-control"
              value={endDate || ""}
              onChange={handleEndChange}
            />
          </div>

          <div className="text-end">
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={handleClear}
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
