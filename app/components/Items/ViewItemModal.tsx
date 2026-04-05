"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

export interface Item {
  id?: string;
  timestamp?: string | null;
  prepared_by?: string;
  brand?: string;
  order_id?: string;
  shoppee_commission?: string;
  selling_price?: string;
  is_returned?: string;
  quantity?: string;
  live_seller?: string;
  capital?: string;
  order_income?: string;
  category?: string;
  mined_from?: string;
  discount?: string;
  commission_rate?: string;
  date_shipped?: string | null;
  date_returned?: string | null;
}

interface ViewItemModalProps {
  isOpen: boolean;
  itemId: string;
  onClose: () => void;
}

export default function ViewItemModal({ isOpen, itemId, onClose }: ViewItemModalProps) {
  const [item, setItem] = useState<Item | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const fetchItem = async () => {
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .eq("id", itemId)
        .single();
      if (error) return toast.error(error.message);
      setItem(data);
    };
    fetchItem();
  }, [itemId, isOpen]);

  if (!isOpen || !item) return null;

  const displayFields: { label: string; value: any }[] = [
    { label: "Timestamp", value: item.timestamp },
    { label: "Mined From", value: item.mined_from },
    { label: "Prepared By", value: item.prepared_by },
    { label: "Category", value: item.category },
    { label: "Brand", value: item.brand },
    { label: "Live Seller", value: item.live_seller },
    { label: "Order ID", value: item.order_id },
    { label: "Quantity", value: item.quantity },
    { label: "Capital", value: item.capital },
    { label: "Selling Price", value: item.selling_price },
    { label: "Shoppee Commission", value: item.shoppee_commission },
    { label: "Discount", value: item.discount },
    { label: "Is Returned?", value: item.is_returned },
    { label: "Date Shipped", value: item.date_shipped },
    { label: "Date Returned", value: item.date_returned },
    { label: "Order Income", value: item.order_income },
    { label: "Commission Rate", value: item.commission_rate },
  ];

  const formatValue = (val: any) => {
    if (!val) return "-";
    if (!isNaN(Date.parse(val))) return new Date(val).toLocaleString();
    return val;
  };

  return (
    <div
      className="modal fade show d-block"
      tabIndex={-1}
      style={{ background: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered modal-xl">
        <div
          className="modal-content"
          style={{ borderRadius: "8px" }}
        >
          <div className="modal-header bg-light">
            <h5 className="modal-title">View Item</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <div
            className="modal-body"
            style={{ maxHeight: "70vh", overflowY: "auto" }}
          >
            <table className="table table-bordered mb-0">
              <tbody>
                {displayFields.reduce<React.ReactNode[]>((acc, field, idx, arr) => {
                  // Every 2 fields → 4 columns
                  if (idx % 2 === 0) {
                    const nextField = arr[idx + 1];
                    acc.push(
                      <tr key={idx}>
                        {/* First Label */}
                        <td
                          style={{
                            backgroundColor: "#f0f0f0",
                            fontWeight: 500,
                            width: "20%",
                            textAlign: "left",
                          }}
                        >
                          {field.label}
                        </td>
                        {/* First Value */}
                        <td style={{ width: "30%", textAlign: "left" }}>
                          {formatValue(field.value)}
                        </td>

                        {nextField ? (
                          <>
                            {/* Second Label */}
                            <td
                              style={{
                                backgroundColor: "#f0f0f0",
                                fontWeight: 500,
                                width: "20%",
                                textAlign: "left",
                              }}
                            >
                              {nextField.label}
                            </td>
                            {/* Second Value */}
                            <td style={{ width: "30%", textAlign: "left" }}>
                              {formatValue(nextField.value)}
                            </td>
                          </>
                        ) : (
                          <>
                            <td style={{ width: "20%" }}></td>
                            <td style={{ width: "30%" }}></td>
                          </>
                        )}
                      </tr>
                    );
                  }
                  return acc;
                }, [])}
              </tbody>
            </table>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
