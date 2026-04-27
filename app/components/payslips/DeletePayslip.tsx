"use client";

import { supabase } from "@/lib/supabase";

interface Props {
  show: boolean;
  payslip: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DeletePayslip({
  show,
  payslip,
  onClose,
  onSuccess,
}: Props) {
  if (!show || !payslip) return null;

  const handleDelete = async () => {
    await supabase.from("payslips").delete().eq("id", payslip.id);
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
            <h5>Delete Payslip</h5>
            <button className="btn-close" onClick={onClose} />
          </div>

          <div className="modal-body">
            Are you sure you want to delete this payslip?
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>

            <button className="btn btn-danger" onClick={handleDelete}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
