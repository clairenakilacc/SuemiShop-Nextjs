"use client";

import React from "react";
import type { User } from "@/app/types/user";

interface Props {
  show: boolean;
  user: User | null;
  onClose: () => void;
  roles: { id: number; name: string }[];
}

export default function ViewUser({ show, user, onClose, roles }: Props) {
  if (!show || !user) return null;

  // same pattern as ItemView helpers
  const getRoleName = (id?: number | null) => {
    if (!id) return "-";

    return roles?.find((r) => r.id === id)?.name || "-";
  };

  return (
    <div
      className="modal fade show d-block"
      style={{ background: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content rounded-3 overflow-hidden">
          {/* HEADER */}
          <div className="modal-header bg-light">
            <h5 className="modal-title">View User</h5>
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
                  {/* BASIC INFO */}
                  <tr className="table-dark">
                    <th colSpan={2}>Basic Information</th>
                  </tr>

                  <tr>
                    <th className="py-2 px-3">Name</th>
                    <td className="py-2 px-3">{user.name || "-"}</td>
                  </tr>

                  <tr>
                    <th className="py-2 px-3">Email</th>
                    <td className="py-2 px-3">{user.email || "-"}</td>
                  </tr>

                  <tr>
                    <th className="py-2 px-3">Phone Number</th>
                    <td className="py-2 px-3">{user.phone_number || "-"}</td>
                  </tr>

                  <tr>
                    <th className="py-2 px-3">Address</th>
                    <td className="py-2 px-3">{user.address || "-"}</td>
                  </tr>

                  {/* CLASSIFICATION */}
                  <tr className="table-dark">
                    <th colSpan={2}>Classification</th>
                  </tr>

                  <tr>
                    <th className="py-2 px-3">Role</th>
                    <td className="py-2 px-3">{getRoleName(user.role)}</td>
                  </tr>

                  <tr>
                    <th className="py-2 px-3">Employee</th>
                    <td className="py-2 px-3">
                      {user.is_employee ? "Yes" : "No"}
                    </td>
                  </tr>

                  <tr>
                    <th className="py-2 px-3">Live Seller</th>
                    <td className="py-2 px-3">
                      {user.is_live_seller ? "Yes" : "No"}
                    </td>
                  </tr>

                  {/* GOVERNMENT IDS */}
                  <tr className="table-dark">
                    <th colSpan={2}>Government IDs</th>
                  </tr>

                  <tr>
                    <th className="py-2 px-3">SSS Number</th>
                    <td className="py-2 px-3">{user.sss_number || "-"}</td>
                  </tr>

                  <tr>
                    <th className="py-2 px-3">PhilHealth Number</th>
                    <td className="py-2 px-3">
                      {user.philhealth_number || "-"}
                    </td>
                  </tr>

                  <tr>
                    <th className="py-2 px-3">Pag-IBIG Number</th>
                    <td className="py-2 px-3">{user.pagibig_number || "-"}</td>
                  </tr>

                  {/* RATES */}
                  <tr className="table-dark">
                    <th colSpan={2}>Rates</th>
                  </tr>

                  <tr>
                    <th className="py-2 px-3">Hourly Rate</th>
                    <td className="py-2 px-3">{user.hourly_rate ?? 0}</td>
                  </tr>

                  <tr>
                    <th className="py-2 px-3">Daily Rate</th>
                    <td className="py-2 px-3">{user.daily_rate ?? 0}</td>
                  </tr>

                  {/* SYSTEM */}
                  <tr className="table-dark">
                    <th colSpan={2}>System</th>
                  </tr>

                  <tr>
                    <th className="py-2 px-3">Created At</th>
                    <td className="py-2 px-3">
                      {user.created_at
                        ? new Date(user.created_at).toLocaleDateString(
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
