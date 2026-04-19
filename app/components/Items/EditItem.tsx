"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { computeItemFinance } from "@/utils/helpers/finance";

interface Props {
  show: boolean;
  item: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditItem({ show, item, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState<
    { id: number; description: string }[]
  >([]);

  const [livesellers, setLivesellers] = useState<
    { id: number; name: string }[]
  >([]);

  const [form, setForm] = useState({
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

  /* =========================
     LOAD ITEM DATA
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
    }
  }, [item]);

  /* =========================
     FETCH RELATIONS
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
  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  /* =========================
     SUBMIT UPDATE
  ========================= */
  const handleSubmit = async () => {
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

      // recompute finance
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
              <div className="col-md-6">
                <input
                  className="form-control"
                  value={form.brand}
                  onChange={(e) => handleChange("brand", e.target.value)}
                  placeholder="Brand"
                />
              </div>

              <div className="col-md-6">
                <input
                  className="form-control"
                  value={form.order_id}
                  onChange={(e) => handleChange("order_id", e.target.value)}
                  placeholder="Order ID"
                />
              </div>

              <div className="col-md-6">
                <select
                  className="form-select"
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
              </div>
            </div>

            {/* CLASSIFICATION */}
            <label className="fw-bold">Classification</label>
            <div className="row g-2 mb-3">
              <div className="col-md-6">
                <select
                  className="form-select"
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
              </div>

              <div className="col-md-6">
                <select
                  className="form-select"
                  value={form.mined_from}
                  onChange={(e) => handleChange("mined_from", e.target.value)}
                >
                  <option value="">Mined From</option>
                  <option value="Shopee">Shopee</option>
                  <option value="Facebook">Facebook</option>
                </select>
              </div>
            </div>

            {/* FINANCE */}
            <label className="fw-bold">Finance</label>
            <div className="row g-2">
              <div className="col-md-4">
                <input
                  type="number"
                  className="form-control"
                  value={form.capital}
                  onChange={(e) => handleChange("capital", e.target.value)}
                  placeholder="Capital"
                />
              </div>

              <div className="col-md-4">
                <input
                  type="number"
                  className="form-control"
                  value={form.selling_price}
                  onChange={(e) =>
                    handleChange("selling_price", e.target.value)
                  }
                  placeholder="Selling Price"
                />
              </div>

              <div className="col-md-4">
                <input
                  type="number"
                  className="form-control"
                  value={form.quantity}
                  onChange={(e) => handleChange("quantity", e.target.value)}
                  placeholder="Quantity"
                />
              </div>

              <div className="col-md-4">
                <input
                  type="number"
                  className="form-control"
                  value={form.discount}
                  onChange={(e) => handleChange("discount", e.target.value)}
                  placeholder="Discount"
                />
              </div>

              <div className="col-md-4">
                <input
                  type="number"
                  className="form-control"
                  value={form.shopee_commission}
                  onChange={(e) =>
                    handleChange("shopee_commission", e.target.value)
                  }
                  placeholder="Shopee Commission"
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>

            <button className="btn btn-primary" onClick={handleSubmit}>
              {loading ? "Saving..." : "Update"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
