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
        <div className="modal-content">
          <div className="modal-header">
            <h5>View Payslip</h5>
            <button className="btn-close" onClick={onClose} />
          </div>

          <div className="modal-body">
            <p>
              <b>Employee:</b> {payslip.user?.name}
            </p>
            <p>
              <b>Period:</b> {payslip.start_period} - {payslip.end_period}
            </p>
            <p>
              <b>Days Worked:</b> {payslip.days_worked}
            </p>
            <p>
              <b>Overtime:</b> {payslip.overtime_hours}
            </p>
            <p>
              <b>Gross:</b> ₱{payslip.gross_pay}
            </p>
            <p>
              <b>Net:</b> ₱{payslip.net_pay}
            </p>
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
