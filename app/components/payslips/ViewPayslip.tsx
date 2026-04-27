"use client";

import type { Payslip } from "@/app/types/payslip";

interface Props {
  show: boolean;
  payslip: Payslip | null;
  onClose: () => void;
}

export default function ViewPayslip({ show, payslip, onClose }: Props) {
  if (!show || !payslip) return null;

  return (
    <div
      className="modal fade show d-block"
      style={{ background: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content rounded-3 overflow-hidden">
          {/* HEADER (LIKE CATEGORY) */}
          <div className="modal-header bg-light">
            <h5 className="modal-title">View Payslip</h5>
            <button className="btn-close" onClick={onClose} />
          </div>

          {/* BODY (TABLE STYLE LIKE CATEGORY) */}
          <div
            className="modal-body"
            style={{ maxHeight: "70vh", overflowY: "auto" }}
          >
            <div className="table-responsive">
              <table
                className="table table-bordered mb-0"
                style={{
                  borderCollapse: "separate",
                  borderSpacing: "0 8px",
                }}
              >
                <tbody>
                  <tr className="table-dark">
                    <th colSpan={2}>Payslip Information</th>
                  </tr>

                  <tr>
                    <th>Employee</th>
                    <td className="text-capitalize">{payslip.user?.name}</td>
                  </tr>

                  <tr>
                    <th>Period</th>
                    <td>
                      {payslip.start_period} - {payslip.end_period}
                    </td>
                  </tr>

                  <tr>
                    <th>Days Worked</th>
                    <td>{payslip.days_worked}</td>
                  </tr>

                  <tr>
                    <th>Overtime Hours</th>
                    <td>{payslip.overtime_hours}</td>
                  </tr>

                  <tr>
                    <th>Total Daily Pay</th>
                    <td>₱{payslip.total_daily_pay}</td>
                  </tr>

                  <tr>
                    <th>Total Overtime Pay</th>
                    <td>₱{payslip.total_overtime_pay}</td>
                  </tr>

                  <tr>
                    <th>Gross Pay</th>
                    <td>₱{payslip.gross_pay}</td>
                  </tr>

                  <tr>
                    <th>Net Pay</th>
                    <td className="fw-bold ">₱{payslip.net_pay}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* FOOTER */}
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Close
            </button>

            <button
              className="btn btn-add"
              onClick={() => {
                window.open(`/payslips/print?id=${payslip.id}`, "_blank");
              }}
            >
              Print
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
