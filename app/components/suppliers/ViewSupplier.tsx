"use client";

import type { Supplier } from "@/app/types/supplier";

interface Props {
  show: boolean;
  supplier: Supplier | null;
  onClose: () => void;
}

export default function ViewSupplier({ show, supplier, onClose }: Props) {
  if (!show || !supplier) return null;

  return (
    <div
      className="modal fade show d-block"
      style={{ background: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content rounded-3 overflow-hidden">
          {/* HEADER */}
          <div className="modal-header bg-light">
            <h5 className="modal-title">View Supplier</h5>
            <button className="btn-close" onClick={onClose} />
          </div>

          {/* BODY */}
          <div className="modal-body">
            <div className="table-responsive">
              <table
                className="table table-bordered mb-0"
                style={{ borderCollapse: "separate", borderSpacing: "0 8px" }}
              >
                <tbody>
                  <tr className="table-dark">
                    <th colSpan={2}>Supplier Information</th>
                  </tr>

                  <tr>
                    <th>Name</th>
                    <td className="text-capitalize">{supplier.name ?? "-"}</td>
                  </tr>

                  <tr>
                    <th>Contact Number</th>
                    <td>{supplier.contact_number ?? "-"}</td>
                  </tr>

                  <tr>
                    <th>Created At</th>
                    <td>
                      {supplier.created_at
                        ? new Date(supplier.created_at).toLocaleDateString(
                            "en-CA",
                            { timeZone: "Asia/Manila" },
                          )
                        : "-"}
                    </td>
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
          </div>
        </div>
      </div>
    </div>
  );
}
