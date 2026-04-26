"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

import {
  validateSupplierName,
  validatePhoneNumber,
} from "@/utils/validators/suppliers";

interface AddSupplierProps {
  onSuccess: () => void;
  className?: string;
  buttonText?: string;
}

export default function AddSupplier({
  onSuccess,
  className = "btn btn-add",
  buttonText = "Add Supplier",
}: AddSupplierProps) {
  const [showModal, setShowModal] = useState(false);

  const [name, setName] = useState("");
  const [contactNumber, setContactNumber] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);

  /* =========================
     LIVE VALIDATION (like Category)
  ========================= */
  const handleNameChange = async (value: string) => {
    setName(value);

    const result = await validateSupplierName(value);
    setError(result);
  };
  const handleContactChange = (value: string) => {
    setContactNumber(value);
    setError(validatePhoneNumber(value));
  };

  const handleSubmit = async () => {
    setTouched(true);

    const nameError = await validateSupplierName(name);
    const contactError = validatePhoneNumber(contactNumber);

    if (nameError) return setError(nameError);
    if (contactError) return setError(contactError);

    try {
      setLoading(true);

      const { data: existing, error: checkError } = await supabase
        .from("suppliers")
        .select("id")
        .ilike("name", name.trim());

      if (checkError) {
        setError(checkError.message);
        return;
      }

      if (existing && existing.length > 0) {
        setError("Supplier already exists");
        return;
      }

      const { error } = await supabase.from("suppliers").insert([
        {
          name: name.trim(),
          contact_number: contactNumber.trim(),
        },
      ]);

      if (error) {
        setError(error.message);
        return;
      }

      setName("");
      setContactNumber("");
      setError(null);
      setShowModal(false);
      setTouched(false);

      onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to add supplier");
    } finally {
      setLoading(false);
    }
  };

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
              <div className="modal-header bg-light">
                <h5 className="modal-title">Add Supplier</h5>
                <button
                  className="btn-close"
                  onClick={() => {
                    setShowModal(false);
                    setError(null);
                    setName("");
                    setContactNumber("");
                    setTouched(false);
                  }}
                />
              </div>

              {/* =========================
                 BODY (FIXED SPACING)
              ========================= */}
              <div className="modal-body">
                <label className="form-label fw-bold">
                  Supplier Information
                </label>

                <div className="d-flex flex-column gap-3">
                  {/* NAME */}
                  <input
                    className={`form-control ${
                      error && touched ? "is-invalid" : ""
                    }`}
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    onBlur={() => setTouched(true)}
                    placeholder="Enter supplier name"
                  />

                  {/* CONTACT */}
                  <input
                    className={`form-control ${
                      error && touched ? "is-invalid" : ""
                    }`}
                    value={contactNumber}
                    onChange={(e) => handleContactChange(e.target.value)}
                    onBlur={() => setTouched(true)}
                    placeholder="Enter contact number"
                  />
                </div>

                {error && touched && (
                  <small className="text-danger d-block mt-2">{error}</small>
                )}
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowModal(false);
                    setError(null);
                    setName("");
                    setContactNumber("");
                    setTouched(false);
                  }}
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
