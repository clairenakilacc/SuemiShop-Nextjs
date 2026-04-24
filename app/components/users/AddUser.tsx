"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

import {
  validateName,
  validateEmail,
  validatePassword,
  validateRole,
  validatePhone,
  validateHourlyRate,
} from "@/utils/validators/users";

interface AddUserProps {
  onSuccess: () => void;
  className?: string;
  buttonText?: string;
}

export default function AddUser({
  onSuccess,
  className = "btn btn-add",
  buttonText = "Add User",
}: AddUserProps) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // FIELD ERRORS
  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [roleError, setRoleError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [hourlyRateError, setHourlyRateError] = useState<string | null>(null);

  // FORM STATE
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    phone_number: "",
    hourly_rate: "",
    is_employee: "false",
    is_live_seller: "false",
  });

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  /* =========================
     FIELD HANDLERS + VALIDATION
  ========================= */

  const handleName = (value: string) => {
    handleChange("name", value);
    setNameError(validateName(value));
  };

  const handleEmail = (value: string) => {
    handleChange("email", value);
    setEmailError(validateEmail(value));
  };

  const handlePassword = (value: string) => {
    handleChange("password", value);
    setPasswordError(validatePassword(value));
  };

  const handleRole = (value: string) => {
    handleChange("role", value);
    setRoleError(validateRole(value));
  };

  const handlePhone = (value: string) => {
    handleChange("phone_number", value);
    setPhoneError(validatePhone(value));
  };

  const handleHourlyRate = (value: string) => {
    handleChange("hourly_rate", value);
    setHourlyRateError(validateHourlyRate(value));
  };

  /* =========================
     SUBMIT
  ========================= */

  const handleSubmit = async () => {
    setSubmitted(true);
    setLoading(true);

    const errors = {
      name: validateName(form.name),
      email: validateEmail(form.email),
      password: validatePassword(form.password),
      role: validateRole(form.role),
      phone_number: validatePhone(form.phone_number),
      hourly_rate: validateHourlyRate(form.hourly_rate),
    };

    setNameError(errors.name);
    setEmailError(errors.email);
    setPasswordError(errors.password);
    setRoleError(errors.role);
    setPhoneError(errors.phone_number);
    setHourlyRateError(errors.hourly_rate);

    const hasError = Object.values(errors).some(Boolean);
    if (hasError) {
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("users").insert([
      {
        name: form.name,
        email: form.email || null,
        password: form.password,
        role: Number(form.role),
        phone_number: form.phone_number,
        hourly_rate: Number(form.hourly_rate || 0),
        is_employee: form.is_employee === "true",
        is_live_seller: form.is_live_seller === "true",
      },
    ]);

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // RESET
    setForm({
      name: "",
      email: "",
      password: "",
      role: "",
      phone_number: "",
      hourly_rate: "",
      is_employee: "false",
      is_live_seller: "false",
    });

    setSubmitted(false);
    setShowModal(false);
    setLoading(false);
    onSuccess();
  };

  /* =========================
     UI
  ========================= */

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
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content rounded-3 overflow-hidden">
              <div className="modal-header bg-light">
                <h5 className="modal-title">Add User</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                />
              </div>

              <div className="modal-body">
                {error && <div className="alert alert-danger">{error}</div>}

                <label className="form-label fw-bold">User Info</label>

                <div className="row g-2 mb-3">
                  <div className="col-md-6">
                    <input
                      className={`form-control ${nameError ? "is-invalid" : ""}`}
                      placeholder="Name"
                      value={form.name}
                      onChange={(e) => handleName(e.target.value)}
                    />
                    <div className="invalid-feedback">{nameError}</div>
                  </div>

                  <div className="col-md-6">
                    <input
                      className={`form-control ${emailError ? "is-invalid" : ""}`}
                      placeholder="Email"
                      value={form.email}
                      onChange={(e) => handleEmail(e.target.value)}
                    />
                    <div className="invalid-feedback">{emailError}</div>
                  </div>

                  <div className="col-md-6">
                    <input
                      type="password"
                      className={`form-control ${passwordError ? "is-invalid" : ""}`}
                      placeholder="Password"
                      value={form.password}
                      onChange={(e) => handlePassword(e.target.value)}
                    />
                    <div className="invalid-feedback">{passwordError}</div>
                  </div>

                  <div className="col-md-6">
                    <input
                      className={`form-control ${roleError ? "is-invalid" : ""}`}
                      placeholder="Role ID"
                      value={form.role}
                      onChange={(e) => handleRole(e.target.value)}
                    />
                    <div className="invalid-feedback">{roleError}</div>
                  </div>

                  <div className="col-md-6">
                    <input
                      className={`form-control ${phoneError ? "is-invalid" : ""}`}
                      placeholder="Phone Number"
                      value={form.phone_number}
                      onChange={(e) => handlePhone(e.target.value)}
                    />
                    <div className="invalid-feedback">{phoneError}</div>
                  </div>

                  <div className="col-md-6">
                    <input
                      type="number"
                      className={`form-control ${hourlyRateError ? "is-invalid" : ""}`}
                      placeholder="Hourly Rate"
                      value={form.hourly_rate}
                      onChange={(e) => handleHourlyRate(e.target.value)}
                    />
                    <div className="invalid-feedback">{hourlyRateError}</div>
                  </div>

                  <div className="col-md-6">
                    <select
                      className="form-select"
                      value={form.is_employee}
                      onChange={(e) =>
                        handleChange("is_employee", e.target.value)
                      }
                    >
                      <option value="false">Not Employee</option>
                      <option value="true">Employee</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <select
                      className="form-select"
                      value={form.is_live_seller}
                      onChange={(e) =>
                        handleChange("is_live_seller", e.target.value)
                      }
                    >
                      <option value="false">Not Live Seller</option>
                      <option value="true">Live Seller</option>
                    </select>
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
