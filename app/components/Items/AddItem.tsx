"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { validateBrand } from "@/utils/validators/items";
import { validateOrderId } from "@/utils/validators/items";

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
  const [brandError, setBrandError] = useState<string | null>(null); //brand state
  const [orderIdError, setOrderIdError] = useState<string | null>(null); //order id state
  const [livesellers, setLivesellers] = useState<
    { id: number; name: string }[]
  >([]); //live seller state

  //Prepared By Fetching
  const [user, setUser] = useState<{ name: string } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/me");
        const json = await res.json();
        setUser(json.user);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };

    fetchUser();
  }, []);

  //Form State
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

  //Auto Name for Prepared By
  useEffect(() => {
    if (user?.name) {
      setForm((prev) => ({
        ...prev,
        prepared_by: user.name,
      }));
    }
  }, [user]);

  //Brand Validation Function
  const handleBrandChange = async (value: string) => {
    handleChange("brand", value);

    const result = await validateBrand(value);
    setBrandError(result);
  };

  //Order ID Validation Function
  const handleOrderIdChange = (value: string) => {
    const upper = value.toUpperCase();
    const filtered = upper.replace(/[^A-Z0-9]/g, "");

    handleChange("order_id", filtered);

    const error = validateOrderId(filtered);
    setOrderIdError(error);
  };

  //Live Seller Function
  useEffect(() => {
    const fetchLiveSellers = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("id, name")
        .eq("is_live_seller", "Yes");

      if (error) {
        console.error(error);
        return;
      }

      setLivesellers(data || []);
    };

    fetchLiveSellers();
  }, []);

  //Handle Change
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

      /* reset */
      setForm({
        prepared_by: user?.name || "",
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
                {error && (
                  <div className="alert alert-danger py-2">{error}</div>
                )}

                {/* BASIC INFO */}
                <label className="form-label fw-bold">Basic Info</label>

                <div className="row g-2 mb-3">
                  {/* Prepared By (AUTO) */}
                  <div className="col-md-6">
                    <input
                      className="form-control"
                      value={form.prepared_by}
                      readOnly
                    />
                  </div>

                  <div className="col-md-6">
                    <input
                      className={`form-control ${brandError ? "is-invalid" : ""}`}
                      placeholder="Brand"
                      value={form.brand}
                      onChange={(e) => handleBrandChange(e.target.value)}
                    />
                    {brandError && (
                      <small className="text-danger d-block mt-1">
                        {brandError}
                      </small>
                    )}
                  </div>

                  <div className="col-md-6">
                    <input
                      className={`form-control ${orderIdError ? "is-invalid" : ""}`}
                      placeholder="ORDER ID"
                      value={form.order_id}
                      maxLength={4}
                      onChange={(e) => handleOrderIdChange(e.target.value)}
                    />
                    {orderIdError && (
                      <small className="text-danger d-block mt-1">
                        {orderIdError}
                      </small>
                    )}
                  </div>

                  <div className="col-md-6">
                    <select
                      className="form-select"
                      value={form.live_seller}
                      onChange={(e) =>
                        handleChange("live_seller", e.target.value)
                      }
                    >
                      <option value="">Select Live Seller</option>

                      {livesellers.map((seller) => (
                        <option key={seller.id} value={seller.id}>
                          {seller.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* CLASSIFICATION */}
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

                {/* FINANCE */}
                <label className="form-label fw-bold">Finance</label>

                <div className="row g-2">
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
