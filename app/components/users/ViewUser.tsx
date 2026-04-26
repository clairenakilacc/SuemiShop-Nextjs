"use client";

import React from "react";
import type { User } from "@/app/types/user";

interface Props {
  show: boolean;
  user: User | null;
  onClose: () => void;
}

export default function ViewUser({ show, user, onClose }: Props) {
  if (!show || !user) return null;

  return (
    <div
      className="modal fade show d-block"
      style={{ background: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content rounded-3 overflow-hidden">
          <div className="modal-header bg-light">
            <h5 className="modal-title">View User</h5>
            <button className="btn-close" onClick={onClose} />
          </div>

          <div className="modal-body">
            <table className="table table-bordered">
              <tbody>
                <tr>
                  <th>Name</th>
                  <td>{user.name}</td>
                </tr>
                <tr>
                  <th>Email</th>
                  <td>{user.email || "-"}</td>
                </tr>
                <tr>
                  <th>Role</th>
                  <td>{user.role ?? "-"}</td>
                </tr>
                <tr>
                  <th>Employee</th>
                  <td>{user.is_employee ? "Yes" : "No"}</td>
                </tr>
                <tr>
                  <th>Live Seller</th>
                  <td>{user.is_live_seller ? "Yes" : "No"}</td>
                </tr>
                <tr>
                  <th>Created</th>
                  <td>
                    {user.created_at
                      ? new Date(user.created_at).toLocaleDateString()
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
