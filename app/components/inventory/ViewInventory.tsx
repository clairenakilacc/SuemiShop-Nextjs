"use client";

import type { Inventory } from "@/app/types/inventory";

interface Props {
  show: boolean;
  inventory: Inventory | null;
  onClose: () => void;
}

export default function ViewInventory({ show, inventory, onClose }: Props) {
  if (!show || !inventory) return null;

  return (
    <div
      className="modal fade show d-block"
      style={{ background: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
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
                  <tr className="table-dark">
                    <th colSpan={2}>Inventory Information</th>
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
                    <td>{inventory.supplier?.name || "-"}</td>
                  </tr>

                  <tr>
                    <th>Category</th>
                    <td>{inventory.category?.description || "-"}</td>
                  </tr>

                  <tr>
                    <th>Quantity</th>
                    <td>{inventory.quantity}</td>
                  </tr>

                  <tr>
                    <th>Price</th>
                    <td>{Number(inventory.price).toFixed(2)}</td>
                  </tr>

                  <tr>
                    <th>Total</th>
                    <td>{Number(inventory.total).toFixed(2)}</td>
                  </tr>

                  <tr>
                    <th>Quantity Left</th>
                    <td>{inventory.quantity_left}</td>
                  </tr>

                  <tr>
                    <th>Total Left</th>
                    <td>{Number(inventory.total_left).toFixed(2)}</td>
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
