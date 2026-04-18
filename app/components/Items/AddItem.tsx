"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

interface AddItemProps {
  onSuccess: () => void;
  className?: string;
  buttonText?: string;
}

export default function AddItem({
  onSuccess,
  className = "btn btn-add",
  buttonText = "Add Item",
}: AddItemProps) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    prepared_by: "",
    brand: "",
    order_id: "",
    category: "",
    mined_from: "",
    live_seller: "",

    selling_price: "",
    capital: "",
    quantity: "",
    discount: "",
    shoppee_commission: "",
    commission_rate: "",

    is_returned: "false",
  });

  /* =========================
     HANDLE CHANGE
  ========================= */
  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  /* =========================
     SUBMIT
  ========================= */
  const handleSubmit = async () => {
    try {
      setLoading(true);

      const payload = {
        ...form,

        // convert to double precision
        selling_price: Number(form.selling_price || 0),
        capital: Number(form.capital || 0),
        quantity: Number(form.quantity || 0),
        discount: Number(form.discount || 0),
        shoppee_commission: Number(form.shoppee_commission || 0),
        commission_rate: Number(form.commission_rate || 0),
      };

      const { error } = await supabase.from("items").insert([payload]);

      if (error) {
        setError(error.message);
        return;
      }

      // reset
      setForm({
        prepared_by: "",
        brand: "",
        order_id: "",
        category: "",
        mined_from: "",
        live_seller: "",
        selling_price: "",
        capital: "",
        quantity: "",
        discount: "",
        shoppee_commission: "",
        commission_rate: "",
        is_returned: "false",
      });

      setError(null);
      setShowModal(false);
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to add item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* BUTTON */}
      <button
        className={className}
        onClick={() => setShowModal(true)}
        disabled={loading}
      >
        {buttonText}
      </button>

      {/* MODAL */}
      {showModal && (
        <div
          className="modal fade show d-block"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content rounded-3 overflow-hidden">
              {/* HEADER */}
              <div className="modal-header bg-light">
                <h5 className="modal-title">Add Item</h5>
                <button
                  className="btn-close"
                  onClick={() => {
                    setShowModal(false);
                    setError(null);
                  }}
                />
              </div>

              {/* BODY */}
              <div className="modal-body">
                {/* ERROR */}
                {error && (
                  <div className="alert alert-danger py-2">{error}</div>
                )}

                {/* ================= BASIC ================= */}
                <label className="form-label fw-bold">Basic Info</label>
                <div className="row g-2 mb-3">
                  <div className="col-md-6">
                    <input
                      className="form-control"
                      placeholder="Prepared By"
                      value={form.prepared_by}
                      onChange={(e) =>
                        handleChange("prepared_by", e.target.value)
                      }
                    />
                  </div>

                  <div className="col-md-6">
                    <input
                      className="form-control"
                      placeholder="Brand"
                      value={form.brand}
                      onChange={(e) => handleChange("brand", e.target.value)}
                    />
                  </div>

                  <div className="col-md-6">
                    <input
                      className="form-control"
                      placeholder="Order ID"
                      value={form.order_id}
                      onChange={(e) => handleChange("order_id", e.target.value)}
                    />
                  </div>

                  <div className="col-md-6">
                    <input
                      className="form-control"
                      placeholder="Live Seller"
                      value={form.live_seller}
                      onChange={(e) =>
                        handleChange("live_seller", e.target.value)
                      }
                    />
                  </div>
                </div>

                {/* ================= CLASSIFICATION ================= */}
                <label className="form-label fw-bold">Classification</label>
                <div className="row g-2 mb-3">
                  <div className="col-md-6">
                    <input
                      className="form-control"
                      placeholder="Category"
                      value={form.category}
                      onChange={(e) => handleChange("category", e.target.value)}
                    />
                  </div>

                  <div className="col-md-6">
                    <select
                      className="form-select"
                      value={form.mined_from}
                      onChange={(e) =>
                        handleChange("mined_from", e.target.value)
                      }
                    >
                      <option value="">Mined From</option>
                      <option value="Shoppee">Shoppee</option>
                      <option value="Facebook">Facebook</option>
                    </select>
                  </div>
                </div>

                {/* ================= FINANCE ================= */}
                <label className="form-label fw-bold">Finance</label>
                <div className="row g-2 mb-3">
                  <div className="col-md-4">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Selling Price"
                      value={form.selling_price}
                      onChange={(e) =>
                        handleChange("selling_price", e.target.value)
                      }
                    />
                  </div>

                  <div className="col-md-4">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Capital"
                      value={form.capital}
                      onChange={(e) => handleChange("capital", e.target.value)}
                    />
                  </div>

                  <div className="col-md-4">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Quantity"
                      value={form.quantity}
                      onChange={(e) => handleChange("quantity", e.target.value)}
                    />
                  </div>

                  <div className="col-md-4">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Discount"
                      value={form.discount}
                      onChange={(e) => handleChange("discount", e.target.value)}
                    />
                  </div>

                  <div className="col-md-4">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Shoppee Commission"
                      value={form.shoppee_commission}
                      onChange={(e) =>
                        handleChange("shoppee_commission", e.target.value)
                      }
                    />
                  </div>

                  <div className="col-md-4">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Commission Rate"
                      value={form.commission_rate}
                      onChange={(e) =>
                        handleChange("commission_rate", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>

              {/* FOOTER */}
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                  disabled={loading}
                >
                  Cancel
                </button>

                <button
                  className="btn btn-add"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
