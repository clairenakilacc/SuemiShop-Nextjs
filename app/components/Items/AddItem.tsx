"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  validateBrand,
  validateOrderId,
  validateCategory,
  validateLiveSeller,
  validateMinedFrom,
  validateSellingPrice,
  validateCapital,
  validateQuantity,
} from "@/utils/validators/items";

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
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [brandError, setBrandError] = useState<string | null>(null);
  const [orderIdError, setOrderIdError] = useState<string | null>(null);
  const [liveSellerError, setLiveSellerError] = useState<string | null>(null);
  const [minedFromError, setMinedFromError] = useState<string | null>(null);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [sellingPriceError, setSellingPriceError] = useState<string | null>(
    null,
  );
  const [capitalError, setCapitalError] = useState<string | null>(null);
  const [quantityError, setQuantityError] = useState<string | null>(null);

  const [livesellers, setLivesellers] = useState<
    { id: number; name: string }[]
  >([]);
  const [categories, setCategories] = useState<
    { id: number; description: string }[]
  >([]);

  const [user, setUser] = useState<{ id: number; name: string } | null>(null);

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
     FETCH USER
  ========================= */
  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/me");
      const json = await res.json();
      setUser(json.user);
    };

    fetchUser();
  }, []);

  /* prepared_by = USER ID (BIGINT SAFE) */
  useEffect(() => {
    if (user?.id) {
      setForm((prev) => ({
        ...prev,
        prepared_by: String(user.id),
      }));
    }
  }, [user]);

  /* =========================
     FETCH LIVE SELLERS
  ========================= */
  useEffect(() => {
    const fetchLiveSellers = async () => {
      const { data } = await supabase
        .from("users")
        .select("id, name")
        .eq("is_live_seller", "Yes");

      setLivesellers(data || []);
    };

    fetchLiveSellers();
  }, []);

  /* =========================
     FETCH CATEGORIES
  ========================= */
  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase
        .from("categories")
        .select("id, description");

      setCategories(data || []);
    };

    fetchCategories();
  }, []);

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
     VALIDATIONS
  ========================= */
  const handleBrandChange = async (value: string) => {
    handleChange("brand", value);
    setBrandError(await validateBrand(value));
  };

  const handleOrderIdChange = (value: string) => {
    const cleaned = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    handleChange("order_id", cleaned);
    setOrderIdError(validateOrderId(cleaned));
  };

  const handleLiveSellerChange = (value: string) => {
    handleChange("live_seller", value);
    setLiveSellerError(validateLiveSeller(value));
  };

  const handleCategoryChange = (value: string) => {
    handleChange("category", value);
    setCategoryError(validateCategory(value));
  };

  const handleMinedFromChange = (value: string) => {
    handleChange("mined_from", value);
    setMinedFromError(validateMinedFrom(value));
  };

  const handleSellingPriceChange = (value: string) => {
    handleChange("selling_price", value);
    setSellingPriceError(validateSellingPrice(value));
  };

  const handleCapitalChange = (value: string) => {
    handleChange("capital", value);
    setCapitalError(validateCapital(value));
  };

  const handleQuantityChange = (value: string) => {
    handleChange("quantity", value);
    setQuantityError(validateQuantity(value));
  };

  /* =========================
     SUBMIT
  ========================= */
  const handleSubmit = async () => {
    setSubmitted(true);

    setLoading(true);

    const requiredErrors = {
      brand: await validateBrand(form.brand),
      order_id: validateOrderId(form.order_id),
      category: validateCategory(form.category),
      mined_from: validateMinedFrom(form.mined_from),
      live_seller: validateLiveSeller(form.live_seller),
      selling_price: validateSellingPrice(form.selling_price),
      capital: validateCapital(form.capital),
      quantity: validateQuantity(form.quantity),
    };

    setBrandError(requiredErrors.brand);
    setOrderIdError(requiredErrors.order_id);
    setCategoryError(requiredErrors.category);
    setMinedFromError(requiredErrors.mined_from);
    setLiveSellerError(requiredErrors.live_seller);
    setSellingPriceError(requiredErrors.selling_price);
    setCapitalError(requiredErrors.capital);
    setQuantityError(requiredErrors.quantity);

    const hasError = Object.values(requiredErrors).some(Boolean);
    if (hasError) {
      setLoading(false);
      return;
    }

    /* =========================
       FIXED PAYLOAD (BIGINT SAFE)
    ========================= */
    const payload = {
      created_by: user?.id,
      updated_by: user?.id,
      prepared_by: Number(form.prepared_by), // user.id
      brand: form.brand,
      order_id: form.order_id,
      category: Number(form.category),
      mined_from: form.mined_from,
      live_seller: Number(form.live_seller), // user.id

      selling_price: Number(form.selling_price),
      capital: Number(form.capital),
      quantity: Number(form.quantity),
      discount: Number(form.discount || 0),
      shoppee_commission: Number(form.shoppee_commission || 0),
      commission_rate: Number(form.commission_rate || 0),

      is_returned: false,
    };

    const { error } = await supabase.from("items").insert([payload]);

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    /* RESET */
    setForm({
      prepared_by: user?.id ? String(user.id) : "",
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

    setSubmitted(false);
    setShowModal(false);
    onSuccess();
    setLoading(false);
  };

  /* =========================
     UI (RESTORED DESIGN)
  ========================= */
  return (
    <>
      <button
        className={className}
        onClick={() => setShowModal(true)}
        disabled={loading}
      >
        {buttonText}
      </button>

      {showModal && (
        <div
          className="modal fade show d-block"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content rounded-3 overflow-hidden">
              <div className="modal-header bg-light">
                <h5 className="modal-title">Add Item</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                />
              </div>

              <div className="modal-body">
                {error && <div className="alert alert-danger">{error}</div>}

                {/* BASIC INFO */}
                <label className="form-label fw-bold">Basic Info</label>

                <div className="row g-2 mb-3">
                  <div className="col-md-6">
                    <input
                      className="form-control"
                      value={user?.name || ""}
                      readOnly
                    />
                  </div>

                  <div className="col-md-6">
                    <input
                      className={`form-control ${brandError ? "is-invalid" : ""}`}
                      value={form.brand}
                      onChange={(e) => handleBrandChange(e.target.value)}
                      placeholder="Brand"
                    />
                    <div className="invalid-feedback">{brandError}</div>
                  </div>

                  <div className="col-md-6">
                    <input
                      className={`form-control ${orderIdError ? "is-invalid" : ""}`}
                      value={form.order_id}
                      onChange={(e) => handleOrderIdChange(e.target.value)}
                      placeholder="ORDER ID"
                    />
                    <div className="invalid-feedback">{orderIdError}</div>
                  </div>

                  <div className="col-md-6">
                    <select
                      className={`form-select ${liveSellerError ? "is-invalid" : ""}`}
                      value={form.live_seller}
                      onChange={(e) => handleLiveSellerChange(e.target.value)}
                    >
                      <option value="">Live Seller</option>
                      {livesellers.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                    <div className="invalid-feedback">{liveSellerError}</div>
                  </div>
                </div>

                {/* CLASSIFICATION */}
                <label className="form-label fw-bold">Classification</label>

                <div className="row g-2 mb-3">
                  <div className="col-md-6">
                    <select
                      className={`form-select ${categoryError ? "is-invalid" : ""}`}
                      value={form.category}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                    >
                      <option value="">Category</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.description}
                        </option>
                      ))}
                    </select>
                    <div className="invalid-feedback">{categoryError}</div>
                  </div>

                  <div className="col-md-6">
                    <select
                      className={`form-select ${minedFromError ? "is-invalid" : ""}`}
                      value={form.mined_from}
                      onChange={(e) => handleMinedFromChange(e.target.value)}
                    >
                      <option value="">Mined From</option>
                      <option value="Shoppee">Shoppee</option>
                      <option value="Facebook">Facebook</option>
                    </select>
                    <div className="invalid-feedback">{minedFromError}</div>
                  </div>
                </div>

                {/* FINANCE */}
                <label className="form-label fw-bold">Finance</label>

                <div className="row g-2">
                  <div className="col-md-4">
                    <input
                      type="number"
                      className={`form-control ${capitalError ? "is-invalid" : ""}`}
                      value={form.capital}
                      onChange={(e) => handleCapitalChange(e.target.value)}
                      placeholder="Capital"
                    />
                    <div className="invalid-feedback">{capitalError}</div>
                  </div>

                  <div className="col-md-4">
                    <input
                      type="number"
                      className={`form-control ${sellingPriceError ? "is-invalid" : ""}`}
                      value={form.selling_price}
                      onChange={(e) => handleSellingPriceChange(e.target.value)}
                      placeholder="Selling Price"
                    />
                    <div className="invalid-feedback">{sellingPriceError}</div>
                  </div>

                  <div className="col-md-4">
                    <input
                      type="number"
                      className={`form-control ${quantityError ? "is-invalid" : ""}`}
                      value={form.quantity}
                      onChange={(e) => handleQuantityChange(e.target.value)}
                      placeholder="Quantity"
                    />
                    <div className="invalid-feedback">{quantityError}</div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button className="btn btn-add" onClick={handleSubmit}>
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
