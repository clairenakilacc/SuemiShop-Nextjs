"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface User {
  id: number;
  name: string;
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

  // ================= LOAD EMPLOYEES =================
  useEffect(() => {
    if (!show) return;

    const loadUsers = async () => {
      const { data } = await supabase
        .from("users")
        .select("id, name")
        .eq("is_employee", true);

      setUsers(data || []);
    };

    loadUsers();
  }, [show]);

  // ================= SELECT USERS =================
  const toggleUser = (id: number) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((u) => u !== id) : [...prev, id],
    );
  };

  const selectAll = () => setSelectedUsers(users.map((u) => u.id));
  const clearAll = () => setSelectedUsers([]);

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    setLoading(true);

    try {
      const inserts = selectedUsers.map((userId) => ({
        user_id: userId,
        start_period: form.start_period,
        end_period: form.end_period,
        days_worked: Number(form.days_worked || 0),
        overtime_hours: Number(form.overtime_hours || 0),
      }));

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

  // ================= UI =================
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
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              {/* HEADER */}
              <div className="modal-header">
                <h5>Add Payslip</h5>
                <button className="btn-close" onClick={() => setShow(false)} />
              </div>

              <div className="modal-body">
                {/* STEP 1 */}
                {step === 1 && (
                  <>
                    <h6>Payroll Period</h6>

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

                {/* STEP 2 */}
                {step === 2 && (
                  <>
                    <div className="d-flex justify-content-between mb-2">
                      <h6>Select Employees</h6>

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
                        className="d-flex justify-content-between border p-2 mb-1"
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

                {/* STEP 3 */}
                {step === 3 && (
                  <>
                    <h6>Work Summary</h6>

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

              {/* FOOTER */}
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
                    className="btn btn-primary"
                    onClick={() => setStep(step + 1)}
                  >
                    Next
                  </button>
                ) : (
                  <button
                    className="btn btn-success"
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
