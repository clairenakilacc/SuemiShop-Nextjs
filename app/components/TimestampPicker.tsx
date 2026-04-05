"use client";

import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface TimestampPickerProps {
  value?: string;
  onChange: (val: string) => void;
}

export default function TimestampPicker({
  value,
  onChange,
}: TimestampPickerProps) {
  const selectedDate = value ? new Date(value) : new Date();

  return (
    <DatePicker
      selected={selectedDate}
      onChange={(date) => onChange(date!.toISOString())}
      showTimeSelect
      dateFormat="Pp"
      className="form-control"
    />
  );
}
