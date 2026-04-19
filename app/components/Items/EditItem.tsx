"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { computeItemFinance } from "@/utils/helpers/finance";

import {
  validateBrand,
  validateOrderId,
  validateLiveSeller,
  validateCategory,
  validateMinedFrom,
  validateSellingPrice,
  validateCapital,
  validateQuantity,
} from "@/utils/validators/items";

/* =========================
   TYPES
========================= */
type FormType = {
  brand: string;
  order_id: string;
  category: string;
  mined_from: string;
  live_seller: string;
  selling_price: string;
  capital: string;
  quantity: string;
  discount: string;
  shopee_commission: string;
  commission_rate: string;
};

type ErrorsType = Partial<Record<keyof FormType, string | null>>;

type ValidatorFn =
  | ((value: string) => string | null)
  | ((value: string) => Promise<string | null>);

type ValidatorsType = Partial<Record<keyof FormType, ValidatorFn>>;

interface Props {
  show: boolean;
  item: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditItem({ show, item, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);

  /* =========================
     STATE
  ========================= */
  const [form, setForm] = useState<FormType>({
    brand: "",
    order_id: "",
    category: "",
    mined_from: "",
    live_seller: "",
    selling_price: "",
    capital: "",
    quantity: "",
    discount: "",
    shopee_commission: "",
    commission_rate: "",
  });

  const [errors, setErrors] = useState<ErrorsType>({});

  const [categories, setCategories] = useState<
    { id: number; description: string }[]
  >([]);

  const [livesellers, setLivesellers] = useState<
    { id: number; name: string }[]
  >([]);

  /* =========================
     VALIDATORS
  ========================= */
  const validators: ValidatorsType = {
    brand: validateBrand,
    order_id: validateOrderId,
    live_seller: validateLiveSeller,
    category: validateCategory,
    mined_from: validateMinedFrom,
    selling_price: validateSellingPrice,
    capital: validateCapital,
    quantity: validateQuantity,
  };

  /* =========================
     LOAD ITEM
  ========================= */
  useEffect(() => {
    if (item) {
      setForm({
        brand: item.brand ?? "",
        order_id: item.order_id ?? "",
        category: String(item.category ?? ""),
        mined_from: item.mined_from ?? "",
        live_seller: String(item.live_seller ?? ""),
        selling_price: String(item.selling_price ?? ""),
        capital: String(item.capital ?? ""),
        quantity: String(item.quantity ?? ""),
        discount: String(item.discount ?? ""),
        shopee_commission: String(item.shopee_commission ?? ""),
        commission_rate: String(item.commission_rate ?? ""),
      });

      setErrors({});
    }
  }, [item]);

  /* =========================
     FETCH DATA
  ========================= */
  useEffect(() => {
    const fetchData = async () => {
      const { data: cat } = await supabase
        .from("categories")
        .select("id, description");

      const { data: sellers } = await supabase
        .from("users")
        .select("id, name")
        .eq("is_live_seller", "Yes");

      setCategories(cat || []);
      setLivesellers(sellers || []);
    };

    fetchData();
  }, []);

  if (!show || !item) return null;

  /* =========================
     HANDLE CHANGE
  ========================= */
  const handleChange = async (key: keyof FormType, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));

    const validator = validators[key];
    if (!validator) return;

    const error = await validator(value);

    setErrors((prev) => ({
      ...prev,
      [key]: error,
    }));
  };

  /* =========================
     VALIDATE ALL
  ========================= */
  const validateAll = async () => {
    const newErrors: ErrorsType = {};

    for (const key of Object.keys(validators) as (keyof FormType)[]) {
      const validator = validators[key];
      if (!validator) continue;

      const error = await validator(form[key]);

      if (error) newErrors[key] = error;
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /* =========================
     SUBMIT
  ========================= */
  const handleSubmit = async () => {
    const isValid = await validateAll();
    if (!isValid) return;

    setLoading(true);

    const finance = computeItemFinance({
      selling_price: form.selling_price,
      discount: form.discount,
      shopee_commission: form.shopee_commission,
    });

    const payload = {
      brand: form.brand,
      order_id: form.order_id,
      category: Number(form.category),
      mined_from: form.mined_from,
      live_seller: Number(form.live_seller),

      selling_price: Number(form.selling_price),
      capital: Number(form.capital),
      quantity: Number(form.quantity),
      discount: Number(form.discount || 0),

      shopee_commission: finance.shopee_commission,
      commission_rate: finance.commission_rate,
      final_price: finance.final_price,
      order_income: finance.order_income,

      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("items")
      .update(payload)
      .eq("id", item.id);

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    onSuccess();
    onClose();
  };

  /* =========================
     UI
  ========================= */
  return (
    <div
      className="modal fade show d-block"
      style={{ background: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content rounded-3 overflow-hidden">
          <div className="modal-header bg-light">
            <h5 className="modal-title">Edit Item</h5>
            <button className="btn-close" onClick={onClose} />
          </div>

          <div className="modal-body">
            {/* BASIC */}
            <label className="fw-bold">Basic Info</label>
            <div className="row g-2 mb-3">
              {/* BRAND */}
              <div className="col-md-6">
                <label className="form-label">Brand</label>
                <input
                  className={`form-control ${errors.brand ? "is-invalid" : ""}`}
                  value={form.brand}
                  onChange={(e) => handleChange("brand", e.target.value)}
                />
                {errors.brand && (
                  <div className="invalid-feedback">{errors.brand}</div>
                )}
              </div>

              {/* ORDER ID */}
              <div className="col-md-6">
                <label className="form-label">Order ID</label>
                <input
                  className={`form-control ${
                    errors.order_id ? "is-invalid" : ""
                  }`}
                  value={form.order_id}
                  onChange={(e) => handleChange("order_id", e.target.value)}
                />
                {errors.order_id && (
                  <div className="invalid-feedback">{errors.order_id}</div>
                )}
              </div>

              {/* LIVE SELLER */}
              <div className="col-md-6">
                <label className="form-label">Live Seller</label>
                <select
                  className={`form-select ${
                    errors.live_seller ? "is-invalid" : ""
                  }`}
                  value={form.live_seller}
                  onChange={(e) => handleChange("live_seller", e.target.value)}
                >
                  <option value="">Live Seller</option>
                  {livesellers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                {errors.live_seller && (
                  <div className="invalid-feedback">{errors.live_seller}</div>
                )}
              </div>
            </div>

            {/* CLASSIFICATION */}
            <label className="fw-bold">Classification</label>
            <div className="row g-2 mb-3">
              <div className="col-md-6">
                <label className="form-label">Category</label>
                <select
                  className={`form-select ${
                    errors.category ? "is-invalid" : ""
                  }`}
                  value={form.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                >
                  <option value="">Category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.description}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <div className="invalid-feedback">{errors.category}</div>
                )}
              </div>

              <div className="col-md-6">
                <label className="form-label">Mined From</label>
                <select
                  className={`form-select ${
                    errors.mined_from ? "is-invalid" : ""
                  }`}
                  value={form.mined_from}
                  onChange={(e) => handleChange("mined_from", e.target.value)}
                >
                  <option value="">Mined From</option>
                  <option value="Shopee">Shopee</option>
                  <option value="Facebook">Facebook</option>
                </select>
                {errors.mined_from && (
                  <div className="invalid-feedback">{errors.mined_from}</div>
                )}
              </div>
            </div>

            {/* FINANCE */}
            <label className="fw-bold">Finance</label>
            <div className="row g-2">
              {(
                [
                  ["capital", "Capital"],
                  ["selling_price", "Selling Price"],
                  ["quantity", "Quantity"],
                ] as [keyof FormType, string][]
              ).map(([key, label]) => (
                <div className="col-md-4" key={key}>
                  <label className="form-label">{label}</label>
                  <input
                    type="number"
                    className={`form-control ${
                      errors[key] ? "is-invalid" : ""
                    }`}
                    value={form[key]}
                    onChange={(e) => handleChange(key, e.target.value)}
                  />
                  {errors[key] && (
                    <div className="invalid-feedback">{errors[key]}</div>
                  )}
                </div>
              ))}

              <div className="col-md-4">
                <label className="form-label">Discount</label>
                <input
                  type="number"
                  className="form-control"
                  value={form.discount}
                  onChange={(e) => handleChange("discount", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>

            <button
              className="btn btn-edit"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Saving..." : "Edit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
