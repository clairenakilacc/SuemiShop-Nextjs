"use client";

import { Role } from "@/app/types/role";

interface Props {
  show: boolean;
  role: Role | null;
  onClose: () => void;
}

export default function ViewRole({ show, role, onClose }: Props) {
  if (!show || !role) return null;

  return (
    <div
      className="modal fade show d-block"
      style={{ background: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content rounded-3 overflow-hidden">
          {/* HEADER */}
          <div className="modal-header bg-light">
            <h5 className="modal-title">View Role</h5>
            <button className="btn-close" onClick={onClose} />
          </div>

          {/* BODY */}
          <div className="modal-body">
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
                    <th colSpan={2}>Role Information</th>
                  </tr>

                  <tr>
                    <th>Role Name</th>
                    <td className="text-capitalize">{role.name}</td>
                  </tr>

                  <tr>
                    <th>Created At</th>
                    <td>
                      {role.created_at
                        ? new Date(role.created_at).toLocaleDateString("en-CA")
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
