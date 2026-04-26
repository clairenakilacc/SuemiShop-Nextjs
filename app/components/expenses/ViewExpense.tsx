"use client";

import type { Expense } from "@/app/types/expense";

interface Props {
  show: boolean;
  expense: Expense | null;
  onClose: () => void;
}

export default function ViewExpense({ show, expense, onClose }: Props) {
  if (!show || !expense) return null;

  return (
    <div
      className="modal fade show d-block"
      style={{ background: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header bg-light">
            <h5 className="modal-title">View Expense</h5>
            <button className="btn-close" onClick={onClose} />
          </div>

          <div className="modal-body">
            <table className="table">
              <tbody>
                <tr className="table-dark">
                  <th colSpan={2}>Expense Information</th>
                </tr>
                <tr>
                  <th>Description</th>
                  <td>{expense.description}</td>
                </tr>

                <tr>
                  <th>Amount</th>
                  <td>{Number(expense.amount).toFixed(2)}</td>
                </tr>

                <tr>
                  <th>Created</th>
                  <td>
                    {expense.created_at
                      ? new Date(expense.created_at).toLocaleDateString(
                          "en-CA",
                          {
                            timeZone: "Asia/Manila",
                          },
                        )
                      : "-"}
                  </td>
                </tr>
              </tbody>
            </table>
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
