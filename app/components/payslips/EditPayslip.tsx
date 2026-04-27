"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Payslip } from "@/app/types/payslip";

interface Props {
  show: boolean;
  payslip: Payslip | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditPayslip({
  show,
  payslip,
  onClose,
  onSuccess,
}: Props) {
  const [form, setForm] = useState({
    days_worked: 0,
    overtime_hours: 0,
  });

  useEffect(() => {
    if (payslip) {
      setForm({
        days_worked: payslip.days_worked || 0,
        overtime_hours: payslip.overtime_hours || 0,
      });
    }
  }, [payslip]);

  if (!show || !payslip) return null;

  const handleUpdate = async () => {
    await supabase
      .from("payslips")
      .update({
        days_worked: form.days_worked,
        overtime_hours: form.overtime_hours,
        updated_at: new Date().toISOString(),
      })
      .eq("id", payslip.id);

    onSuccess();
    onClose();
  };

  return (
    <div
      className="modal fade show d-block"
      style={{ background: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5>Edit Payslip</h5>
            <button className="btn-close" onClick={onClose} />
          </div>

          <div className="modal-body">
            <label>Days Worked</label>
            <input
              type="number"
              className="form-control mb-2"
              value={form.days_worked}
              onChange={(e) =>
                setForm({ ...form, days_worked: Number(e.target.value) })
              }
            />

            <label>Overtime Hours</label>
            <input
              type="number"
              className="form-control"
              value={form.overtime_hours}
              onChange={(e) =>
                setForm({ ...form, overtime_hours: Number(e.target.value) })
              }
            />
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>

            <button className="btn btn-primary" onClick={handleUpdate}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
