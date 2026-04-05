"use client";

import { useState } from "react";

interface DateRangePickerProps {
  onChange: (range: {
    startDate: string | null;
    endDate: string | null;
  }) => void;
  className?: string;
}

export default function DateRangePicker({
  onChange,
  className = "",
}: DateRangePickerProps) {
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const handleStartChange = (value: string) => {
    setStartDate(value);
    onChange({ startDate: value, endDate });
  };

  const handleEndChange = (value: string) => {
    setEndDate(value);
    onChange({ startDate, endDate: value });
  };

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <div className="flex flex-col">
        <label className="text-sm text-gray-600 mb-1">Start Date</label>
        <input
          type="date"
          value={startDate || ""}
          onChange={(e) => handleStartChange(e.target.value)}
          className="border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:outline-none transition"
        />
      </div>

      <div className="flex flex-col">
        <label className="text-sm text-gray-600 mb-1">End Date</label>
        <input
          type="date"
          value={endDate || ""}
          onChange={(e) => handleEndChange(e.target.value)}
          className="border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:outline-none transition"
        />
      </div>
    </div>
  );
}
