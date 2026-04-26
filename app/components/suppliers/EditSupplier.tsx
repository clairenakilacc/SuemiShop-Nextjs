"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Supplier } from "@/app/types/supplier";

import {
  validateSupplierName,
  validatePhoneNumber,
} from "@/utils/validators/suppliers";

interface Props {
  show: boolean;
  supplier: Supplier | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function EditSupplier({
  show,
  supplier,
  onClose,
  onSuccess,
}: Props) {
  const [name, setName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (supplier) {
      setName(supplier.name || "");
      setContactNumber(supplier.contact_number || "");
      setError(null);
    }
  }, [supplier]);

  useEffect(() => {
    if (!supplier) return;

    const runValidation = async () => {
      const nameError = await validateSupplierName(name);
      const contactError = validatePhoneNumber(contactNumber);

      setError(nameError || contactError);
    };

    runValidation();
  }, [name, contactNumber, supplier]);

  if (!show || !supplier) return null;

  const isValid = error === null;

  const handleUpdate = async () => {
    const nameError = await validateSupplierName(name);
    const contactError = validatePhoneNumber(contactNumber);

    const finalError = nameError || contactError;
    setError(finalError);

    if (finalError) return;

    try {
      setLoading(true);

      const { error: dbError } = await supabase
        .from("suppliers")
        .update({
          name: name.trim(),
          contact_number: contactNumber.trim(),
        })
        .eq("id", supplier.id);

      if (dbError) {
        setError(dbError.message);
        return;
      }

      onSuccess?.();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal fade show d-block"
      style={{ background: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content rounded-3 overflow-hidden">
          <div className="modal-header bg-light">
            <h5 className="modal-title">Edit Supplier</h5>
            <button className="btn-close" onClick={onClose} />
          </div>

          <div className="modal-body">
            <div className="d-flex flex-column gap-3">
              <div>
                <label className="form-label">Name</label>
                <input
                  className={`form-control ${error ? "is-invalid" : ""}`}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter supplier name"
                />
              </div>

              <div>
                <label className="form-label">Contact Number</label>
                <input
                  className={`form-control ${error ? "is-invalid" : ""}`}
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  placeholder="Enter contact number"
                />
              </div>
            </div>

            {error && (
              <small className="text-danger d-block mt-2">{error}</small>
            )}
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>

            <button
              className="btn btn-edit"
              onClick={handleUpdate}
              disabled={loading || !isValid}
            >
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
