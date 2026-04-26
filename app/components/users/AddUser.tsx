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

type Errors = {
  name: string | null;
  email: string | null;
  password: string | null;
  role: string | null;
  phone_number: string | null;
  address: string | null;
  sss_number: string | null;
  philhealth_number: string | null;
  pagibig_number: string | null;
  hourly_rate: string | null;
  daily_rate: string | null;
  is_employee: string | null;
  is_live_seller: string | null;
};

export default function AddUser({
  onSuccess,
  className = "btn btn-add",
  buttonText = "Add User",
}: AddUserProps) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);

  const [roles, setRoles] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    const fetchRoles = async () => {
      const { data } = await supabase.from("roles").select("id, name");
      setRoles(data || []);
    };
    fetchRoles();
  }, []);

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
    is_employee: "true",
    is_live_seller: "false",
  });

  const [errors, setErrors] = useState<Errors>({
    name: null,
    email: null,
    password: null,
    role: null,
    phone_number: null,
    address: null,
    sss_number: null,
    philhealth_number: null,
    pagibig_number: null,
    hourly_rate: null,
    daily_rate: null,
    is_employee: null,
    is_live_seller: null,
  });

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: null }));
  };

  const handleSubmit = async () => {
    if (loading) return;

    setLoading(true);
    setError(null);

    const newErrors: Errors = {
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

    setErrors(newErrors);

    const hasError = Object.values(newErrors).some(Boolean);
    if (hasError) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
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
        }),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        const text = await res.text();
        console.error("Non-JSON response:", text);
        throw new Error("Server error");
      }

      if (!res.ok) {
        setError(data.error || "Something went wrong");
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
        is_employee: "false",
        is_live_seller: "false",
      });

      setShowModal(false);
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Request failed");
    }

    setLoading(false);
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

                  <div className="col-md-6">
                    <input
                      className={`form-control ${errors.name ? "is-invalid" : ""}`}
                      placeholder="Name"
                      value={form.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                    />
                    <div className="invalid-feedback">{errors.name}</div>
                  </div>

                  <div className="col-md-6">
                    <input
                      className={`form-control ${errors.email ? "is-invalid" : ""}`}
                      placeholder="Email"
                      value={form.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                    />
                    <div className="invalid-feedback">{errors.email}</div>
                  </div>

                  <div className="col-md-6">
                    <div className="input-group">
                      <input
                        type={showPassword ? "text" : "password"}
                        className={`form-control ${errors.password ? "is-invalid" : ""}`}
                        placeholder="Password"
                        value={form.password}
                        onChange={(e) =>
                          handleChange("password", e.target.value)
                        }
                      />

                      <span
                        className="input-group-text"
                        style={{ cursor: "pointer" }}
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        <i
                          className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
                        />
                      </span>
                    </div>
                    <div className="invalid-feedback d-block">
                      {errors.password}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <select
                      className={`form-select ${errors.role ? "is-invalid" : ""}`}
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
                    <div className="invalid-feedback">{errors.role}</div>
                  </div>

                  <div className="col-md-6">
                    <input
                      className={`form-control ${errors.phone_number ? "is-invalid" : ""}`}
                      placeholder="Phone Number"
                      value={form.phone_number}
                      onChange={(e) =>
                        handleChange("phone_number", e.target.value)
                      }
                    />
                    <div className="invalid-feedback">
                      {errors.phone_number}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <input
                      className={`form-control ${errors.address ? "is-invalid" : ""}`}
                      placeholder="Address"
                      value={form.address}
                      onChange={(e) => handleChange("address", e.target.value)}
                    />
                    <div className="invalid-feedback">{errors.address}</div>
                  </div>

                  <div className="col-md-6">
                    <input
                      className={`form-control ${errors.sss_number ? "is-invalid" : ""}`}
                      placeholder="SSS Number"
                      value={form.sss_number}
                      onChange={(e) =>
                        handleChange("sss_number", e.target.value)
                      }
                    />
                    <div className="invalid-feedback">{errors.sss_number}</div>
                  </div>

                  <div className="col-md-6">
                    <input
                      className={`form-control ${errors.philhealth_number ? "is-invalid" : ""}`}
                      placeholder="PhilHealth Number"
                      value={form.philhealth_number}
                      onChange={(e) =>
                        handleChange("philhealth_number", e.target.value)
                      }
                    />
                    <div className="invalid-feedback">
                      {errors.philhealth_number}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <input
                      className={`form-control ${errors.pagibig_number ? "is-invalid" : ""}`}
                      placeholder="PagIbig Number"
                      value={form.pagibig_number}
                      onChange={(e) =>
                        handleChange("pagibig_number", e.target.value)
                      }
                    />
                    <div className="invalid-feedback">
                      {errors.pagibig_number}
                    </div>
                  </div>

                  <label className="form-label fw-bold">Rate</label>

                  <div className="col-md-6">
                    <input
                      type="number"
                      className={`form-control ${errors.hourly_rate ? "is-invalid" : ""}`}
                      placeholder="Hourly Rate"
                      value={form.hourly_rate}
                      onChange={(e) =>
                        handleChange("hourly_rate", e.target.value)
                      }
                    />
                    <div className="invalid-feedback">{errors.hourly_rate}</div>
                  </div>

                  <div className="col-md-6">
                    <input
                      type="number"
                      className={`form-control ${errors.daily_rate ? "is-invalid" : ""}`}
                      placeholder="Daily Rate"
                      value={form.daily_rate}
                      onChange={(e) =>
                        handleChange("daily_rate", e.target.value)
                      }
                    />
                    <div className="invalid-feedback">{errors.daily_rate}</div>
                  </div>

                  <label className="form-label fw-bold">Classification</label>

                  <div className="col-md-6">
                    <select
                      className={`form-select ${errors.is_employee ? "is-invalid" : ""}`}
                      value={form.is_employee}
                      onChange={(e) =>
                        handleChange("is_employee", e.target.value)
                      }
                    >
                      <option value="">Select Employee Status</option>
                      <option value="true">Employee</option>
                      <option value="false">Not Employee</option>
                    </select>
                    <div className="invalid-feedback">{errors.is_employee}</div>
                  </div>

                  <div className="col-md-6">
                    <select
                      className={`form-select ${errors.is_live_seller ? "is-invalid" : ""}`}
                      value={form.is_live_seller}
                      onChange={(e) =>
                        handleChange("is_live_seller", e.target.value)
                      }
                    >
                      <option value="">Select Live Seller Status</option>
                      <option value="true">Live Seller</option>
                      <option value="false">Not Live Seller</option>
                    </select>
                    <div className="invalid-feedback">
                      {errors.is_live_seller}
                    </div>
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
                  {loading ? "Saving..." : "Add"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
