"use client";

import React from "react";
import type { Item } from "./ItemTable";
import { computeItemFinance } from "@/utils/helpers/finance";

interface Props {
  show: boolean;
  item: Item | null;
  categories: { id: string; description: string }[];
  users: { id: number; name: string }[];

  onClose: () => void;
}

export default function ViewItem({
  show,
  item,
  users,
  categories,
  onClose,
}: Props) {
  if (!show || !item) return null;

  //finance computation
  const finance = computeItemFinance(item);

  //category
  const getCategoryName = (id?: number | null) => {
    if (!id) return "-";
    return (
      categories.find((c) => String(c.id) === String(id))?.description || "-"
    );
  };

  //user name
  const getUserName = (id?: number | null) => {
    if (!id) return "-";
    return users.find((u) => u.id === id)?.name || "-";
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
            <h5 className="modal-title">View Item</h5>
            <button className="btn-close" onClick={onClose} />
          </div>

          {/* BODY */}
          <div className="modal-body">
            <div className="table-responsive">
              <table
                className="table table-bordered mb-0"
                style={{
                  borderCollapse: "separate",
                  borderSpacing: "0 8px", // 👈 THIS adds vertical spacing between rows
                }}
              >
                <tbody>
                  <tr className="table-dark">
                    <th colSpan={2}>Basic Information</th>
                  </tr>

                  <tr>
                    <th className="py-2 px-3">Brand</th>
                    <td className="py-2 px-3 text-capitalize">
                      {item.brand || "-"}
                    </td>
                  </tr>

                  <tr>
                    <th className="py-2 px-3">Order ID</th>
                    <td className="py-2 px-3">{item.order_id || "-"}</td>
                  </tr>

                  <tr>
                    <th className="py-2 px-3">Category</th>
                    <td className="py-2 px-3">
                      {getCategoryName(item.category)}
                    </td>
                  </tr>

                  <tr>
                    <th className="py-2 px-3">Mined From</th>
                    <td className="py-2 px-3 text-capitalize">
                      {item.mined_from || "-"}
                    </td>
                  </tr>

                  <tr className="table-dark">
                    <th colSpan={2}>People</th>
                  </tr>

                  <tr>
                    <th className="py-2 px-3">Created By</th>
                    <td className="py-2 px-3">
                      {getUserName(item.created_by)}
                    </td>
                  </tr>

                  <tr>
                    <th className="py-2 px-3">Prepared By</th>
                    <td className="py-2 px-3">
                      {getUserName(item.prepared_by)}
                    </td>
                  </tr>

                  <tr>
                    <th className="py-2 px-3">Live Seller</th>
                    <td className="py-2 px-3">
                      {getUserName(item.live_seller)}
                    </td>
                  </tr>

                  <tr className="table-dark">
                    <th colSpan={2}>Financial</th>
                  </tr>

                  <tr>
                    <th className="py-2 px-3">Quantity</th>
                    <td className="py-2 px-3">{item.quantity ?? 0}</td>
                  </tr>

                  <tr>
                    <th className="py-2 px-3">Capital</th>
                    <td className="py-2 px-3">{item.capital ?? 0}</td>
                  </tr>

                  <tr>
                    <th className="py-2 px-3">Selling Price</th>
                    <td className="py-2 px-3">{item.selling_price ?? 0}</td>
                  </tr>

                  <tr>
                    <th className="py-2 px-3">Shoppee Commission</th>
                    <td className="py-2 px-3">
                      {item.shoppee_commission ?? 0}
                    </td>
                  </tr>

                  <tr>
                    <th className="py-2 px-3">Discount</th>
                    <td className="py-2 px-3">{item.discount ?? 0}</td>
                  </tr>

                  <tr>
                    <th className="py-2 px-3">Commission Rate</th>
                    <td className="py-2 px-3">{item.commission_rate ?? 0}%</td>
                  </tr>

                  <tr>
                    <th className="py-2 px-3">Order Income</th>
                    <td>{finance.order_income}</td>
                  </tr>

                  <tr className="table-dark">
                    <th colSpan={2}>Status</th>
                  </tr>

                  <tr>
                    <th className="py-2 px-3">Returned</th>
                    <td className="py-2 px-3">
                      {item.is_returned ? "Yes" : "No"}
                    </td>
                  </tr>

                  <tr>
                    <th className="py-2 px-3">Date Shipped</th>
                    <td className="py-2 px-3">{item.date_shipped || "-"}</td>
                  </tr>

                  <tr>
                    <th className="py-2 px-3">Date Returned</th>
                    <td className="py-2 px-3">{item.date_returned || "-"}</td>
                  </tr>

                  <tr className="table-dark">
                    <th colSpan={2}>System</th>
                  </tr>

                  <tr>
                    <th className="py-2 px-3">Created At</th>
                    <td className="py-2 px-3">
                      {item.created_at
                        ? new Date(item.created_at).toLocaleString()
                        : "-"}
                    </td>
                  </tr>

                  <tr>
                    <th className="py-2 px-3">Updated At</th>
                    <td className="py-2 px-3">
                      {item.updated_at
                        ? new Date(item.updated_at).toLocaleString()
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
