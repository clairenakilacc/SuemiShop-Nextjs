"use client";

import React from "react";

interface Inventory {
  id?: string;
  created_at?: string | null;
  updated_at?: string | null;
  date_arrived?: string | null;

  box_number?: string;
  supplier?: string; // name (already resolved before passing OR fallback)
  category?: string; // description (same idea)

  quantity?: string;
  price?: string;
  total?: string;

  quantity_left?: string;
  total_left?: string;

  status?: string;
}

interface Props {
  show: boolean;
  inventory: Inventory | null;
  onClose: () => void;
}

export default function ViewInventory({ show, inventory, onClose }: Props) {
  if (!show || !inventory) return null;

  const status = inventory.status || "instock";

  const isRestock = status.toLowerCase() === "restock";

  return (
    <div
      className="modal fade show d-block"
      style={{ background: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content rounded-3 overflow-hidden">
          {/* HEADER */}
          <div className="modal-header bg-light">
            <h5 className="modal-title">View Inventory</h5>
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
                  {/* ================= BASIC INFO ================= */}
                  <tr className="table-dark">
                    <th colSpan={2}>Basic Information</th>
                  </tr>

                  <tr>
                    <th>Date Arrived</th>
                    <td>
                      {inventory.date_arrived
                        ? new Date(inventory.date_arrived).toLocaleDateString(
                            "en-CA",
                            { timeZone: "Asia/Manila" },
                          )
                        : "-"}
                    </td>
                  </tr>

                  <tr>
                    <th>Box Number</th>
                    <td>{inventory.box_number || "-"}</td>
                  </tr>

                  <tr>
                    <th>Supplier</th>
                    <td className="text-capitalize">
                      {inventory.supplier || "-"}
                    </td>
                  </tr>

                  <tr>
                    <th>Category</th>
                    <td className="text-capitalize">
                      {inventory.category || "-"}
                    </td>
                  </tr>

                  {/* ================= STOCK INFO ================= */}
                  <tr className="table-dark">
                    <th colSpan={2}>Stock Information</th>
                  </tr>

                  <tr>
                    <th>Quantity</th>
                    <td>{inventory.quantity || "0"}</td>
                  </tr>

                  <tr>
                    <th>Price</th>
                    <td>{inventory.price || "0"}</td>
                  </tr>

                  <tr>
                    <th>Total</th>
                    <td>{inventory.total || "0"}</td>
                  </tr>

                  <tr>
                    <th>Quantity Left</th>
                    <td>{inventory.quantity_left || "0"}</td>
                  </tr>

                  <tr>
                    <th>Total Left</th>
                    <td>{inventory.total_left || "0"}</td>
                  </tr>

                  {/* ================= STATUS ================= */}
                  <tr className="table-dark">
                    <th colSpan={2}>Status</th>
                  </tr>

                  <tr>
                    <th>Status</th>
                    <td>
                      {isRestock ? (
                        <span
                          className="badge"
                          style={{
                            backgroundColor: "rgba(255,0,0,0.12)",
                            color: "#dc3545",
                            fontWeight: 600,
                          }}
                        >
                          RESTOCK
                        </span>
                      ) : (
                        <span className="badge bg-success">INSTOCK</span>
                      )}
                    </td>
                  </tr>

                  {/* ================= SYSTEM ================= */}
                  <tr className="table-dark">
                    <th colSpan={2}>System</th>
                  </tr>

                  <tr>
                    <th>Created At</th>
                    <td>
                      {inventory.created_at
                        ? new Date(inventory.created_at).toLocaleDateString(
                            "en-CA",
                            { timeZone: "Asia/Manila" },
                          )
                        : "-"}
                    </td>
                  </tr>

                  <tr>
                    <th>Updated At</th>
                    <td>
                      {inventory.updated_at
                        ? new Date(inventory.updated_at).toLocaleDateString(
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
