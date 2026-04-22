"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

import {
  validateDateArrived,
  validateBoxNumber,
  validateQuantity,
  validatePrice,
} from "@/utils/validators/inventory";

interface Props {
  onSuccess: () => void;
  className?: string;
  buttonText?: string;
}

export default function AddInventory({
  onSuccess,
  className = "btn btn-add",
  buttonText = "Add Inventory",
}: Props) {
  const [showModal, setShowModal] = useState(false);

  /* ================= STATES ================= */

  const [dateArrived, setDateArrived] = useState("");
  const [boxNumber, setBoxNumber] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");

  const total = Number(quantity || 0) * Number(price || 0);

  /* ================= DROPDOWN ================= */

  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetchDropdowns();
  }, []);

  const fetchDropdowns = async () => {
    const { data: s } = await supabase.from("suppliers").select("*");
    const { data: c } = await supabase.from("categories").select("*");

    setSuppliers(s || []);
    setCategories(c || []);
  };

  /* ================= ERRORS ================= */

  const [dateError, setDateError] = useState<string | null>(null);
  const [boxError, setBoxError] = useState<string | null>(null);
  const [supplierError, setSupplierError] = useState<string | null>(null);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [quantityError, setQuantityError] = useState<string | null>(null);
  const [priceError, setPriceError] = useState<string | null>(null);

  /* ================= TOUCHED ================= */

  const [touched, setTouched] = useState({
    date: false,
    box: false,
    supplier: false,
    category: false,
    quantity: false,
    price: false,
  });

  /* ================= HANDLERS ================= */

  const handleDate = (value: string) => {
    setDateArrived(value);
    setDateError(validateDateArrived(value));
  };

  const handleBox = (value: string) => {
    setBoxNumber(value);
    setBoxError(validateBoxNumber(value));
  };

  const handleQuantity = (value: string) => {
    setQuantity(value);
    setQuantityError(validateQuantity(value));
  };

  const handlePrice = (value: string) => {
    setPrice(value);
    setPriceError(validatePrice(value));
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async () => {
    setTouched({
      date: true,
      box: true,
      supplier: true,
      category: true,
      quantity: true,
      price: true,
    });

    const dErr = validateDateArrived(dateArrived);
    const bErr = validateBoxNumber(boxNumber);
    const qErr = validateQuantity(quantity);
    const pErr = validatePrice(price);

    const sErr = !supplierId ? "Supplier is required" : null;
    const cErr = !categoryId ? "Category is required" : null;

    setDateError(dErr);
    setBoxError(bErr);
    setQuantityError(qErr);
    setPriceError(pErr);
    setSupplierError(sErr);
    setCategoryError(cErr);

    if (dErr || bErr || qErr || pErr || sErr || cErr) return;

    try {
      const { error } = await supabase.from("inventories").insert([
        {
          date_arrived: dateArrived,
          box_number: boxNumber,
          supplier: supplierId,
          category: categoryId,
          quantity,
          price,
          total,
          quantity_left: quantity,
          total_left: total,
          status: "instock",
        },
      ]);

      if (error) throw error;

      // RESET (same as AddCategory style)
      setDateArrived("");
      setBoxNumber("");
      setSupplierId("");
      setCategoryId("");
      setQuantity("");
      setPrice("");

      setDateError(null);
      setBoxError(null);
      setSupplierError(null);
      setCategoryError(null);
      setQuantityError(null);
      setPriceError(null);

      setTouched({
        date: false,
        box: false,
        supplier: false,
        category: false,
        quantity: false,
        price: false,
      });

      setShowModal(false);
      onSuccess();
    } catch (err: any) {
      setBoxError(err.message || "Failed to add inventory");
    }
  };

  /* ================= UI ================= */

  return (
    <>
      <button className={className} onClick={() => setShowModal(true)}>
        {buttonText}
      </button>

      {showModal && (
        <div
          className="modal fade show d-block"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-3 overflow-hidden">
              <div className="modal-header bg-light">
                <h5 className="modal-title">Add Inventory</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                />
              </div>

              <div className="modal-body">
                {/* DATE */}
                <label className="form-label">Date Arrived</label>
                <input
                  type="date"
                  className={`form-control ${dateError && touched.date ? "is-invalid" : ""}`}
                  value={dateArrived}
                  onChange={(e) => handleDate(e.target.value)}
                  onBlur={() => setTouched((p) => ({ ...p, date: true }))}
                />
                {dateError && touched.date && (
                  <small className="text-danger d-block mt-1">
                    {dateError}
                  </small>
                )}

                {/* BOX */}
                <label className="form-label mt-3">Box Number</label>
                <input
                  className={`form-control ${boxError && touched.box ? "is-invalid" : ""}`}
                  value={boxNumber}
                  onChange={(e) => handleBox(e.target.value)}
                  onBlur={() => setTouched((p) => ({ ...p, box: true }))}
                />
                {boxError && touched.box && (
                  <small className="text-danger d-block mt-1">{boxError}</small>
                )}

                {/* SUPPLIER */}
                <label className="form-label mt-3">Supplier</label>
                <select
                  className={`form-control ${supplierError && touched.supplier ? "is-invalid" : ""}`}
                  value={supplierId}
                  onChange={(e) => setSupplierId(e.target.value)}
                  onBlur={() => setTouched((p) => ({ ...p, supplier: true }))}
                >
                  <option value="">Select Supplier</option>
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                {supplierError && touched.supplier && (
                  <small className="text-danger d-block mt-1">
                    {supplierError}
                  </small>
                )}

                {/* CATEGORY */}
                <label className="form-label mt-3">Category</label>
                <select
                  className={`form-control ${categoryError && touched.category ? "is-invalid" : ""}`}
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  onBlur={() => setTouched((p) => ({ ...p, category: true }))}
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.description}
                    </option>
                  ))}
                </select>
                {categoryError && touched.category && (
                  <small className="text-danger d-block mt-1">
                    {categoryError}
                  </small>
                )}

                {/* QUANTITY */}
                <label className="form-label mt-3">Quantity</label>
                <input
                  className={`form-control ${quantityError && touched.quantity ? "is-invalid" : ""}`}
                  value={quantity}
                  onChange={(e) => handleQuantity(e.target.value)}
                  onBlur={() => setTouched((p) => ({ ...p, quantity: true }))}
                />
                {quantityError && touched.quantity && (
                  <small className="text-danger d-block mt-1">
                    {quantityError}
                  </small>
                )}

                {/* PRICE */}
                <label className="form-label mt-3">Price</label>
                <input
                  className={`form-control ${priceError && touched.price ? "is-invalid" : ""}`}
                  value={price}
                  onChange={(e) => handlePrice(e.target.value)}
                  onBlur={() => setTouched((p) => ({ ...p, price: true }))}
                />
                {priceError && touched.price && (
                  <small className="text-danger d-block mt-1">
                    {priceError}
                  </small>
                )}

                {/* TOTAL */}
                <label className="form-label mt-3">Total</label>
                <input className="form-control" value={total} disabled />
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button className="btn btn-add" onClick={handleSubmit}>
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
