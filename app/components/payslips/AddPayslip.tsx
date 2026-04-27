"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface User {
  id: number;
  name: string;
}

interface LineItem {
  id: string;
  description: string;
  amount: number;
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
    daily_rate: "",
    hourly_rate: "",
  });

  const [commissions, setCommissions] = useState<LineItem[]>([]);
  const [bonuses, setBonuses] = useState<LineItem[]>([]);
  const [deductions, setDeductions] = useState<LineItem[]>([]);

  const [tempItem, setTempItem] = useState({ description: "", amount: "" });

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

  // ================= NAVIGATION =================
  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => s - 1);

  const toggleUser = (id: number) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((u) => u !== id) : [...prev, id],
    );
  };

  const addItem = (
    setter: React.Dispatch<React.SetStateAction<LineItem[]>>,
  ) => {
    if (!tempItem.description || !tempItem.amount) return;

    setter((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        description: tempItem.description,
        amount: Number(tempItem.amount),
      },
    ]);

    setTempItem({ description: "", amount: "" });
  };

  const removeItem = (
    setter: React.Dispatch<React.SetStateAction<LineItem[]>>,
    id: string,
  ) => {
    setter((prev) => prev.filter((i) => i.id !== id));
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    setLoading(true);

    try {
      const inserts = [];

      for (const userId of selectedUsers) {
        const totalCommission = commissions.reduce((a, b) => a + b.amount, 0);
        const totalBonus = bonuses.reduce((a, b) => a + b.amount, 0);
        const totalDeduction = deductions.reduce((a, b) => a + b.amount, 0);

        const days = Number(form.days_worked || 0);
        const overtime = Number(form.overtime_hours || 0);
        const daily = Number(form.daily_rate || 0);
        const hourly = Number(form.hourly_rate || 0);

        const totalDailyPay = days * daily;
        const totalOvertimePay = overtime * hourly;

        const gross =
          totalDailyPay + totalOvertimePay + totalCommission + totalBonus;

        const net = gross - totalDeduction;

        inserts.push({
          user_id: userId,
          start_period: form.start_period,
          end_period: form.end_period,
          days_worked: days,
          overtime_hours: overtime,
          daily_rate: daily,
          hourly_rate: hourly,
          total_daily_pay: totalDailyPay,
          total_overtime_pay: totalOvertimePay,
          total_commission: totalCommission,
          total_bonus: totalBonus,
          total_deduction: totalDeduction,
          gross_pay: gross,
          net_pay: net,
        });
      }

      const { error } = await supabase.from("payslips").insert(inserts);

      if (error) throw error;

      setShow(false);
      setStep(1);
      setSelectedUsers([]);
      setCommissions([]);
      setBonuses([]);
      setDeductions([]);

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
            <div className="modal-content rounded-3 overflow-hidden">
              {/* HEADER */}
              <div className="modal-header bg-light">
                <h5 className="modal-title">Add Payslip</h5>
                <button className="btn-close" onClick={() => setShow(false)} />
              </div>

              {/* BODY */}
              <div className="modal-body">
                {/* ================= STEP 1 ================= */}
                {step === 1 && (
                  <>
                    <h6>Select Period</h6>

                    <div className="row g-2">
                      <div className="col-md-6">
                        <input
                          type="date"
                          className="form-control"
                          value={form.start_period}
                          onChange={(e) =>
                            setForm({ ...form, start_period: e.target.value })
                          }
                        />
                      </div>

                      <div className="col-md-6">
                        <input
                          type="date"
                          className="form-control"
                          value={form.end_period}
                          onChange={(e) =>
                            setForm({ ...form, end_period: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* ================= STEP 2 ================= */}
                {step === 2 && (
                  <>
                    <h6>Select Employees</h6>

                    <div className="list-group">
                      {users.map((u) => (
                        <label
                          key={u.id}
                          className="list-group-item d-flex gap-2"
                        >
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(u.id)}
                            onChange={() => toggleUser(u.id)}
                          />
                          {u.name}
                        </label>
                      ))}
                    </div>
                  </>
                )}

                {/* ================= STEP 3 ================= */}
                {step === 3 && (
                  <>
                    <h6>Commissions / Bonuses / Deductions</h6>

                    <div className="row g-2">
                      <input
                        className="form-control col-md-6"
                        placeholder="Description"
                        value={tempItem.description}
                        onChange={(e) =>
                          setTempItem({
                            ...tempItem,
                            description: e.target.value,
                          })
                        }
                      />

                      <input
                        className="form-control col-md-4"
                        placeholder="Amount"
                        value={tempItem.amount}
                        onChange={(e) =>
                          setTempItem({ ...tempItem, amount: e.target.value })
                        }
                      />

                      <div className="col-md-2">
                        <button
                          className="btn btn-add w-100"
                          onClick={() => addItem(setCommissions)}
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    <hr />

                    <small>Commissions: {commissions.length}</small>
                    <small className="d-block">Bonuses: {bonuses.length}</small>
                    <small>Deductions: {deductions.length}</small>
                  </>
                )}

                {/* ================= STEP 4 ================= */}
                {step === 4 && (
                  <>
                    <h6>Review</h6>
                    <p>Employees: {selectedUsers.length}</p>
                    <p>Commissions: {commissions.length}</p>
                    <p>Bonuses: {bonuses.length}</p>
                    <p>Deductions: {deductions.length}</p>
                  </>
                )}
              </div>

              {/* FOOTER */}
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => (step > 1 ? back() : setShow(false))}
                >
                  {step > 1 ? "Back" : "Cancel"}
                </button>

                {step < 4 ? (
                  <button className="btn btn-primary" onClick={next}>
                    Next
                  </button>
                ) : (
                  <button
                    className="btn btn-add"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Submit"}
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
