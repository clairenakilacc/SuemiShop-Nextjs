"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  validateSupplierName,
  validatePhoneNumber,
} from "@/utils/validators/inventory";

interface AddInventoryProps {
  onSuccess: () => void;
  className?: string;
  buttonText?: string;
}

export default function AddInventory({
  onSuccess,
  className = "btn btn-add",
  buttonText = "Add Inventory",
}: AddInventoryProps) {
  const [showModal, setShowModal] = useState(false);

  const [supplier, setSupplier] = useState("");
  const [phone, setPhone] = useState("");

  const [supplierError, setSupplierError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const [touched, setTouched] = useState({
    supplier: false,
    phone: false,
  });

  const [loading, setLoading] = useState(false);

  /* ================= HANDLERS ================= */

  const handleSupplierChange = async (value: string) => {
    setSupplier(value);
    const err = await validateSupplierName(value);
    setSupplierError(err);
  };

  const handlePhoneChange = (value: string) => {
    setPhone(value);
    const err = validatePhoneNumber(value);
    setPhoneError(err);
  };

  const handleSubmit = async () => {
    setTouched({ supplier: true, phone: true });

    const supplierErr = await validateSupplierName(supplier);
    const phoneErr = validatePhoneNumber(phone);

    setSupplierError(supplierErr);
    setPhoneError(phoneErr);

    if (supplierErr || phoneErr) return;

    try {
      setLoading(true);

      const { error } = await supabase.from("inventories").insert([
        {
          supplier: supplier.trim(),
          phone_number: phone.trim(),
        },
      ]);

      if (error) {
        setSupplierError(error.message);
        return;
      }

      // reset
      setSupplier("");
      setPhone("");
      setSupplierError(null);
      setPhoneError(null);
      setTouched({ supplier: false, phone: false });

      setShowModal(false);
      onSuccess();
    } catch (err: any) {
      setSupplierError(err.message || "Failed to add inventory");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

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
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-3 overflow-hidden">
              {/* HEADER */}
              <div className="modal-header bg-light">
                <h5 className="modal-title">Add Inventory</h5>
                <button
                  className="btn-close"
                  onClick={() => {
                    setShowModal(false);
                    setSupplier("");
                    setPhone("");
                    setSupplierError(null);
                    setPhoneError(null);
                    setTouched({ supplier: false, phone: false });
                  }}
                />
              </div>

              {/* BODY */}
              <div className="modal-body">
                {/* SUPPLIER */}
                <div className="mb-3">
                  <label className="form-label">Supplier</label>

                  <input
                    type="text"
                    className={`form-control ${
                      supplierError && touched.supplier ? "is-invalid" : ""
                    }`}
                    placeholder="Enter supplier name"
                    value={supplier}
                    onChange={(e) => handleSupplierChange(e.target.value)}
                    onBlur={() =>
                      setTouched((prev) => ({
                        ...prev,
                        supplier: true,
                      }))
                    }
                  />

                  {supplierError && touched.supplier && (
                    <small className="text-danger">{supplierError}</small>
                  )}
                </div>

                {/* PHONE */}
                <div>
                  <label className="form-label">Phone Number</label>

                  <input
                    type="text"
                    className={`form-control ${
                      phoneError && touched.phone ? "is-invalid" : ""
                    }`}
                    placeholder="09XXXXXXXXX"
                    value={phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    onBlur={() =>
                      setTouched((prev) => ({
                        ...prev,
                        phone: true,
                      }))
                    }
                  />

                  {phoneError && touched.phone && (
                    <small className="text-danger">{phoneError}</small>
                  )}
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
