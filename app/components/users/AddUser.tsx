"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Eye, EyeOff } from "lucide-react";

import {
  validateName,
  validateEmail,
  validatePassword,
  validateRole,
  validatePhoneNumber,
  validateAddress,
  validateSSSNumber,
  validatePhilHealthNumber,
  validatePagIbigNumber,
  validateHourlyRate,
  validateDailyRate,
  validateIsEmployee,
  validateIsLiveSeller,
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
  const [error, setError] = useState<string | null>(null);

  // 1. PASSWORD TOGGLE (FIXED)
  const [showPassword, setShowPassword] = useState(false);

  //1. ROLE
  const [roles, setRoles] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    const fetchRoles = async () => {
      const { data } = await supabase.from("roles").select("id, name");

      setRoles(data || []);
    };

    fetchRoles();
  }, []);

  //2. FIELD ERRORS
  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [roleError, setRoleError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [sssNumberError, setSssNumberError] = useState<string | null>(null);
  const [philhealthNumberError, setPhilhealthNumberError] = useState<
    string | null
  >(null);
  const [pagibigNumberError, setPagibigNumberError] = useState<string | null>(
    null,
  );
  const [hourlyRateError, setHourlyRateError] = useState<string | null>(null);
  const [dailyRateError, setDailyRateError] = useState<string | null>(null);
  const [isEmployeeError, setIsEmployeeError] = useState<string | null>(null);
  const [isLiveSellerError, setIsLiveSellerError] = useState<string | null>(
    null,
  );

  // FORM STATE
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    phone_number: "",
    address: "",
    sss_number: "",
    philhealth_number: "",
    pagibig_number: "",
    hourly_rate: "",
    daily_rate: "",
    is_employee: "false",
    is_live_seller: "false",
  });

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    //3. ERROR FIELDS
    const errors = {
      name: validateName(form.name),
      email: validateEmail(form.email),
      password: validatePassword(form.password),
      role: validateRole(form.role),
      phone_number: validatePhoneNumber(form.phone_number),
      address: validateAddress(form.address),
      sss_number: validateSSSNumber(form.sss_number),
      philhealth_number: validatePhilHealthNumber(form.philhealth_number),
      pagibig_number: validatePagIbigNumber(form.pagibig_number),
      hourly_rate: validateHourlyRate(form.hourly_rate),
      daily_rate: validateDailyRate(form.daily_rate),
      is_employee: validateIsEmployee(form.is_employee),
      is_live_seller: validateIsLiveSeller(form.is_live_seller),
    };

    setNameError(errors.name);
    setEmailError(errors.email);
    setPasswordError(errors.password);
    setRoleError(errors.role);
    setPhoneError(errors.phone_number);
    setAddressError(errors.address);
    setSssNumberError(errors.sss_number);
    setPhilhealthNumberError(errors.philhealth_number);
    setPagibigNumberError(errors.pagibig_number);
    setHourlyRateError(errors.hourly_rate);
    setDailyRateError(errors.daily_rate);
    setIsEmployeeError(errors.is_employee);
    setIsLiveSellerError(errors.is_live_seller);

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
        address: form.address,
        sss_number: form.sss_number,
        philhealth_number: form.philhealth_number,
        pagibig_number: form.pagibig_number,
        hourly_rate: Number(form.hourly_rate || 0),
        daily_rate: Number(form.daily_rate || 0),
        is_employee: form.is_employee === "true",
        is_live_seller: form.is_live_seller === "true",
      },
    ]);

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setForm({
      name: "",
      email: "",
      password: "",
      role: "",
      phone_number: "",
      address: "",
      sss_number: "",
      philhealth_number: "",
      pagibig_number: "",
      hourly_rate: "",
      daily_rate: "",
      is_employee: "true",
      is_live_seller: "true",
    });

    setLoading(false);
    setShowModal(false);
    onSuccess();
  };

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

                <div className="row g-2">
                  <label className="form-label fw-bold">Personal Info</label>

                  {/* NAME */}
                  <div className="col-md-6">
                    <input
                      className={`form-control ${nameError ? "is-invalid" : ""}`}
                      placeholder="Name"
                      value={form.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                    />
                    <div className="invalid-feedback">{nameError}</div>
                  </div>

                  {/* EMAIL */}
                  <div className="col-md-6">
                    <input
                      className={`form-control ${emailError ? "is-invalid" : ""}`}
                      placeholder="Email"
                      value={form.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                    />
                    <div className="invalid-feedback">{emailError}</div>
                  </div>

                  {/* PASSWORD ✅ FIXED */}
                  <div className="col-md-6">
                    <div className="input-group">
                      <input
                        type={showPassword ? "text" : "password"}
                        className={`form-control ${passwordError ? "is-invalid" : ""}`}
                        placeholder="Password"
                        value={form.password}
                        onChange={(e) =>
                          handleChange("password", e.target.value)
                        }
                      />

                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                    <div className="invalid-feedback d-block">
                      {passwordError}
                    </div>
                  </div>

                  {/* ROLE */}
                  <div className="col-md-6">
                    <select
                      className={`form-select ${roleError ? "is-invalid" : ""}`}
                      value={form.role}
                      onChange={(e) => handleChange("role", e.target.value)}
                    >
                      <option value="">Select Role</option>

                      {roles.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.name}
                        </option>
                      ))}
                    </select>

                    <div className="invalid-feedback">{roleError}</div>
                  </div>

                  {/* PHONE */}
                  <div className="col-md-6">
                    <input
                      className={`form-control ${phoneError ? "is-invalid" : ""}`}
                      placeholder="Phone Number"
                      value={form.phone_number}
                      onChange={(e) =>
                        handleChange("phone_number", e.target.value)
                      }
                    />
                    <div className="invalid-feedback">{phoneError}</div>
                  </div>

                  {/* ADDRESS */}
                  <div className="col-md-6">
                    <input
                      className={`form-control ${addressError ? "is-invalid" : ""}`}
                      placeholder="Address"
                      value={form.address}
                      onChange={(e) => handleChange("address", e.target.value)}
                    />
                    <div className="invalid-feedback">{addressError}</div>
                  </div>

                  {/* SSS NUMBER */}
                  <div className="col-md-6">
                    <input
                      className={`form-control ${sssNumberError ? "is-invalid" : ""}`}
                      placeholder="SSS Number"
                      value={form.sss_number}
                      onChange={(e) =>
                        handleChange("sss_number", e.target.value)
                      }
                    />
                    <div className="invalid-feedback">{sssNumberError}</div>
                  </div>

                  {/* PHILHEALTH NUMBER */}
                  <div className="col-md-6">
                    <input
                      className={`form-control ${philhealthNumberError ? "is-invalid" : ""}`}
                      placeholder="PhilHealth Number"
                      value={form.philhealth_number}
                      onChange={(e) =>
                        handleChange("philhealth_number", e.target.value)
                      }
                    />
                    <div className="invalid-feedback">
                      {philhealthNumberError}
                    </div>
                  </div>

                  {/* PAGIBIG NUMBER */}
                  <div className="col-md-6">
                    <input
                      className={`form-control ${pagibigNumberError ? "is-invalid" : ""}`}
                      placeholder="PagIbig Number"
                      value={form.pagibig_number}
                      onChange={(e) =>
                        handleChange("pagibig_number", e.target.value)
                      }
                    />
                    <div className="invalid-feedback">{pagibigNumberError}</div>
                  </div>

                  <label className="form-label fw-bold">Rate</label>
                  {/* HOURLY RATE */}
                  <div className="col-md-6">
                    <input
                      type="number"
                      className={`form-control ${hourlyRateError ? "is-invalid" : ""}`}
                      placeholder="Hourly Rate"
                      value={form.hourly_rate}
                      onChange={(e) =>
                        handleChange("hourly_rate", e.target.value)
                      }
                    />
                    <div className="invalid-feedback">{hourlyRateError}</div>
                  </div>

                  {/* DAILY RATE */}
                  <div className="col-md-6">
                    <input
                      type="number"
                      className={`form-control ${dailyRateError ? "is-invalid" : ""}`}
                      placeholder="Daily Rate"
                      value={form.daily_rate}
                      onChange={(e) =>
                        handleChange("daily_rate", e.target.value)
                      }
                    />
                    <div className="invalid-feedback">{dailyRateError}</div>
                  </div>

                  <label className="form-label fw-bold">Classification</label>
                  {/* EMPLOYEE */}
                  <div className="col-md-6">
                    <select
                      className={`form-select ${isEmployeeError ? "is-invalid" : ""}`}
                      value={form.is_employee}
                      onChange={(e) => {
                        handleChange("is_employee", e.target.value);
                        setIsEmployeeError(null);
                      }}
                    >
                      <option value="">Select Employee Status</option>
                      <option value="true">Employee</option>
                      <option value="false">Not Employee</option>
                    </select>

                    <div className="invalid-feedback">{isEmployeeError}</div>
                  </div>

                  {/* LIVE SELLER */}
                  <div className="col-md-6">
                    <select
                      className={`form-select ${isLiveSellerError ? "is-invalid" : ""}`}
                      value={form.is_live_seller}
                      onChange={(e) => {
                        handleChange("is_live_seller", e.target.value);
                        setIsLiveSellerError(null);
                      }}
                    >
                      <option value="">Select Live Seller Status</option>
                      <option value="true">Live Seller</option>
                      <option value="false">Not Live Seller</option>
                    </select>

                    <div className="invalid-feedback">{isLiveSellerError}</div>
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
