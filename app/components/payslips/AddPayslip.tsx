"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

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
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    user_id: "",
    days_worked: "",
    overtime_hours: "",
    daily_rate: "",
    hourly_rate: "",
    total_commission: "",
    total_bonus: "",
    total_deduction: "",
    start_period: "",
    end_period: "",
  });

  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      const days = Number(form.days_worked || 0);
      const overtime = Number(form.overtime_hours || 0);
      const daily = Number(form.daily_rate || 0);
      const hourly = Number(form.hourly_rate || 0);

      const totalDailyPay = days * daily;
      const totalOvertimePay = overtime * hourly;

      const gross =
        totalDailyPay +
        totalOvertimePay +
        Number(form.total_commission || 0) +
        Number(form.total_bonus || 0);

      const net = gross - Number(form.total_deduction || 0);

      const { error } = await supabase.from("payslips").insert([
        {
          user_id: Number(form.user_id),
          days_worked: days,
          overtime_hours: overtime,
          daily_rate: daily,
          hourly_rate: hourly,
          total_daily_pay: totalDailyPay,
          total_overtime_pay: totalOvertimePay,
          total_commission: Number(form.total_commission || 0),
          total_bonus: Number(form.total_bonus || 0),
          total_deduction: Number(form.total_deduction || 0),
          gross_pay: gross,
          net_pay: net,
          start_period: form.start_period || null,
          end_period: form.end_period || null,
        },
      ]);

      if (error) {
        setError(error.message);
        return;
      }

      setForm({
        user_id: "",
        days_worked: "",
        overtime_hours: "",
        daily_rate: "",
        hourly_rate: "",
        total_commission: "",
        total_bonus: "",
        total_deduction: "",
        start_period: "",
        end_period: "",
      });

      setShow(false);
      onSuccess();
    } catch (err: any) {
      setError(err.message);
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
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content rounded-3 overflow-hidden">
              {/* HEADER */}
              <div className="modal-header bg-light">
                <h5 className="modal-title">Add Payslip</h5>
                <button className="btn-close" onClick={() => setShow(false)} />
              </div>

              {/* BODY */}
              <div className="modal-body">
                <div className="row g-2">
                  <div className="col-md-6">
                    <input
                      className="form-control"
                      placeholder="User ID"
                      value={form.user_id}
                      onChange={(e) => handleChange("user_id", e.target.value)}
                    />
                  </div>

                  <div className="col-md-6">
                    <input
                      className="form-control"
                      placeholder="Days Worked"
                      value={form.days_worked}
                      onChange={(e) =>
                        handleChange("days_worked", e.target.value)
                      }
                    />
                  </div>

                  <div className="col-md-6">
                    <input
                      className="form-control"
                      placeholder="Overtime Hours"
                      value={form.overtime_hours}
                      onChange={(e) =>
                        handleChange("overtime_hours", e.target.value)
                      }
                    />
                  </div>

                  <div className="col-md-6">
                    <input
                      className="form-control"
                      placeholder="Daily Rate"
                      value={form.daily_rate}
                      onChange={(e) =>
                        handleChange("daily_rate", e.target.value)
                      }
                    />
                  </div>

                  <div className="col-md-6">
                    <input
                      className="form-control"
                      placeholder="Hourly Rate"
                      value={form.hourly_rate}
                      onChange={(e) =>
                        handleChange("hourly_rate", e.target.value)
                      }
                    />
                  </div>

                  <div className="col-md-6">
                    <input
                      className="form-control"
                      placeholder="Commission"
                      value={form.total_commission}
                      onChange={(e) =>
                        handleChange("total_commission", e.target.value)
                      }
                    />
                  </div>

                  <div className="col-md-6">
                    <input
                      className="form-control"
                      placeholder="Bonus"
                      value={form.total_bonus}
                      onChange={(e) =>
                        handleChange("total_bonus", e.target.value)
                      }
                    />
                  </div>

                  <div className="col-md-6">
                    <input
                      className="form-control"
                      placeholder="Deduction"
                      value={form.total_deduction}
                      onChange={(e) =>
                        handleChange("total_deduction", e.target.value)
                      }
                    />
                  </div>

                  <div className="col-md-6">
                    <input
                      type="date"
                      className="form-control"
                      value={form.start_period}
                      onChange={(e) =>
                        handleChange("start_period", e.target.value)
                      }
                    />
                  </div>

                  <div className="col-md-6">
                    <input
                      type="date"
                      className="form-control"
                      value={form.end_period}
                      onChange={(e) =>
                        handleChange("end_period", e.target.value)
                      }
                    />
                  </div>
                </div>

                {error && (
                  <small className="text-danger d-block mt-2">{error}</small>
                )}
              </div>

              {/* FOOTER */}
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShow(false)}
                >
                  Cancel
                </button>

                <button
                  className="btn btn-add"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Add"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
