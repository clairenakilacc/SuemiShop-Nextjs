"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface User {
  id: number;
  name: string;
  daily_rate?: number | null;
  hourly_rate?: number | null;
}

interface Props {
  onSuccess: () => void;
  className?: string;
  buttonText?: string;
}

export default function AddPayslip({
  onSuccess,
  className = "btn btn-add",
  buttonText = "Add Payslip",
}: Props) {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  const [form, setForm] = useState({
    start_period: "",
    end_period: "",
    days_worked: "",
    overtime_hours: "",
  });

  useEffect(() => {
    if (!show) return;

    const loadUsers = async () => {
      const { data } = await supabase
        .from("users")
        .select("id, name, daily_rate, hourly_rate")
        .eq("is_employee", true);

      setUsers(data || []);
    };

    loadUsers();
  }, [show]);

  const toggleUser = (id: number) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((u) => u !== id) : [...prev, id],
    );
  };

  const selectAll = () => setSelectedUsers(users.map((u) => u.id));
  const clearAll = () => setSelectedUsers([]);

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const daysWorked = Number(form.days_worked || 0);
      const overtimeHours = Number(form.overtime_hours || 0);

      const inserts = selectedUsers.map((userId) => {
        const user = users.find((u) => u.id === userId);

        const daily = user?.daily_rate || 0;
        const hourly = user?.hourly_rate || 0;

        const total_daily_pay = daysWorked * daily;
        const total_overtime_pay = overtimeHours * hourly;

        const gross_pay = total_daily_pay + total_overtime_pay;

        return {
          user_id: userId,
          start_period: form.start_period,
          end_period: form.end_period,
          days_worked: daysWorked,
          overtime_hours: overtimeHours,

          total_daily_pay,
          total_overtime_pay,

          gross_pay,
          net_pay: gross_pay,
        };
      });

      const { error } = await supabase.from("payslips").insert(inserts);
      if (error) throw error;

      setShow(false);
      setStep(1);
      setSelectedUsers([]);
      setForm({
        start_period: "",
        end_period: "",
        days_worked: "",
        overtime_hours: "",
      });

      onSuccess();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button className={className} onClick={() => setShow(true)}>
        {buttonText}
      </button>

      {show && (
        <div
          className="modal fade show d-block"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content rounded-3 overflow-hidden">
              <div className="modal-header bg-light">
                <h5 className="modal-title">Add Payslip</h5>
                <button className="btn-close" onClick={() => setShow(false)} />
              </div>

              <div className="modal-body">
                {step === 1 && (
                  <>
                    <label className="form-label fw-bold">Payroll Period</label>

                    <input
                      type="date"
                      className="form-control mb-2"
                      value={form.start_period}
                      onChange={(e) =>
                        setForm({ ...form, start_period: e.target.value })
                      }
                    />

                    <input
                      type="date"
                      className="form-control"
                      value={form.end_period}
                      onChange={(e) =>
                        setForm({ ...form, end_period: e.target.value })
                      }
                    />
                  </>
                )}

                {step === 2 && (
                  <>
                    <div className="d-flex justify-content-between mb-2">
                      <label className="form-label fw-bold">
                        Select Employees
                      </label>

                      <div>
                        <button
                          className="btn btn-sm btn-light me-1"
                          onClick={selectAll}
                        >
                          Select All
                        </button>
                        <button
                          className="btn btn-sm btn-light"
                          onClick={clearAll}
                        >
                          Clear
                        </button>
                      </div>
                    </div>

                    {users.map((u) => (
                      <div
                        key={u.id}
                        className="d-flex justify-content-between border rounded p-2 mb-2"
                      >
                        <span>{u.name}</span>
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(u.id)}
                          onChange={() => toggleUser(u.id)}
                        />
                      </div>
                    ))}
                  </>
                )}

                {step === 3 && (
                  <>
                    <label className="form-label fw-bold">Work Summary</label>

                    <input
                      type="number"
                      placeholder="Total Days Worked"
                      className="form-control mb-2"
                      value={form.days_worked}
                      onChange={(e) =>
                        setForm({ ...form, days_worked: e.target.value })
                      }
                    />

                    <input
                      type="number"
                      placeholder="Total Overtime Hours"
                      className="form-control"
                      value={form.overtime_hours}
                      onChange={(e) =>
                        setForm({ ...form, overtime_hours: e.target.value })
                      }
                    />
                  </>
                )}
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() =>
                    step === 1 ? setShow(false) : setStep(step - 1)
                  }
                >
                  Back
                </button>

                {step < 3 ? (
                  <button
                    className="btn btn-add"
                    onClick={() => setStep(step + 1)}
                  >
                    Next
                  </button>
                ) : (
                  <button
                    className="btn btn-add"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    Submit
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
