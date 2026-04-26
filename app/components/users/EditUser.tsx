"use client";

import { useEffect, useState } from "react";
import type { User } from "@/app/types/user";
import { Eye, EyeOff } from "lucide-react";
import {
  validatePhoneNumber,
  validateSSSNumber,
  validatePhilHealthNumber,
  validatePagIbigNumber,
} from "@/utils/validators/users";

interface Role {
  id: number;
  name: string;
}

interface Props {
  show: boolean;
  user: User | null;
  roles: Role[];

  onSave: (updatedUser: any) => Promise<void> | void;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditUser({
  show,
  user,
  roles,
  onSave,
  onClose,
  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
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

  /* =========================
     LOAD USER (SAFE VERSION)
  ========================= */
  useEffect(() => {
    if (!user) return;

    const roleValue = (user as any)?.role ?? (user as any)?.role?.id ?? "";

    setForm({
      name: user.name ?? "",
      password: "",

      role: roleValue ? String(roleValue) : "",

      phone_number: user.phone_number ?? "",
      address: user.address ?? "",

      sss_number: user.sss_number ?? "",
      philhealth_number: user.philhealth_number ?? "",
      pagibig_number: user.pagibig_number ?? "",

      hourly_rate: String(user.hourly_rate ?? ""),
      daily_rate: String(user.daily_rate ?? ""),

      is_employee: user.is_employee ? "true" : "false",
      is_live_seller: user.is_live_seller ? "true" : "false",
    });
  }, [user]);

  if (!show || !user) return null;

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  /* =========================
     SAVE USER (CLEAN + SAFE)
  ========================= */
  const handleSave = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const roleId = form.role ? Number(form.role) : null;

      const updatedUser = {
        id: user.id,

        // BASIC INFO
        name: form.name.trim(),

        // only update password if provided
        ...(form.password.trim() ? { password: form.password } : {}),

        role: form.role ? parseInt(form.role) : undefined,

        phone_number: form.phone_number.trim(),
        address: form.address.trim(),

        // GOVERNMENT IDS
        sss_number: form.sss_number.trim(),
        philhealth_number: form.philhealth_number.trim(),
        pagibig_number: form.pagibig_number.trim(),

        // NUMBERS SAFE CONVERSION
        hourly_rate: form.hourly_rate ? Number(form.hourly_rate) : 0,
        daily_rate: form.daily_rate ? Number(form.daily_rate) : 0,

        // BOOLEAN FIXED
        is_employee: form.is_employee === "true",
        is_live_seller: form.is_live_seller === "true",
      };

      await onSave(updatedUser);

      onSuccess();
      onClose();
    } catch (err: any) {
      alert(err.message);
    }

    setLoading(false);
  };

  return (
    <div
      className="modal fade show d-block"
      style={{ background: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content rounded-3 overflow-hidden">
          {/* HEADER */}
          <div className="modal-header bg-light">
            <h5 className="modal-title">Edit User</h5>
            <button className="btn-close" onClick={onClose} />
          </div>

          {/* BODY */}
          <div className="modal-body">
            <div className="row g-2">
              <label className="form-label fw-bold">Personal Info</label>

              <div className="col-md-6">
                <input
                  className="form-control"
                  placeholder="Name"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                />
              </div>

              <div className="col-md-6">
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    placeholder="New Password (optional)"
                    value={form.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowPassword((p) => !p)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="col-md-6">
                <input
                  className="form-control"
                  placeholder="Phone Number"
                  value={form.phone_number}
                  onChange={(e) => handleChange("phone_number", e.target.value)}
                />
              </div>

              <div className="col-md-6">
                <input
                  className="form-control"
                  placeholder="Address"
                  value={form.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                />
              </div>

              {/* ROLE */}
              <div className="col-md-6">
                <select
                  className="form-select"
                  value={form.role}
                  onChange={(e) => handleChange("role", e.target.value)}
                >
                  <option value="">Select Role</option>

                  {roles.map((r) => (
                    <option key={r.id} value={String(r.id)}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <label className="form-label fw-bold">Government IDs</label>

              <div className="col-md-6">
                <input
                  className="form-control"
                  placeholder="SSS Number"
                  value={form.sss_number}
                  onChange={(e) => handleChange("sss_number", e.target.value)}
                />
              </div>

              <div className="col-md-6">
                <input
                  className="form-control"
                  placeholder="PhilHealth Number"
                  value={form.philhealth_number}
                  onChange={(e) =>
                    handleChange("philhealth_number", e.target.value)
                  }
                />
              </div>

              <div className="col-md-6">
                <input
                  className="form-control"
                  placeholder="Pag-IBIG Number"
                  value={form.pagibig_number}
                  onChange={(e) =>
                    handleChange("pagibig_number", e.target.value)
                  }
                />
              </div>

              <label className="form-label fw-bold">Rate</label>

              <div className="col-md-6">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Hourly Rate"
                  value={form.hourly_rate}
                  onChange={(e) => handleChange("hourly_rate", e.target.value)}
                />
              </div>

              <div className="col-md-6">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Daily Rate"
                  value={form.daily_rate}
                  onChange={(e) => handleChange("daily_rate", e.target.value)}
                />
              </div>

              <label className="form-label fw-bold">Classification</label>

              <div className="col-md-6">
                <select
                  className="form-select"
                  value={form.is_employee}
                  onChange={(e) => handleChange("is_employee", e.target.value)}
                >
                  <option value="true">Employee</option>
                  <option value="false">Not Employee</option>
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
                  <option value="true">Live Seller</option>
                  <option value="false">Not Live Seller</option>
                </select>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>

            <button
              className="btn btn-edit"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
