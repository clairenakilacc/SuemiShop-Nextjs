"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabase";

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
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<{ id: number; name: string }[]>([]);

  const [form, setForm] = useState({
    name: "",
    password: "",
    role: "",
    email: "",
    address: "",
    phone_number: "",

    sss_number: "",
    philhealth_number: "",
    pagibig_number: "",

    hourly_rate: "",
    daily_rate: "",

    is_live_seller: false,
    is_employee: false,
  });

  /* =========================
     FETCH ROLES
  ========================= */
  useEffect(() => {
    const fetchRoles = async () => {
      const { data } = await supabase.from("roles").select("id, name");
      setRoles(data || []);
    };

    fetchRoles();
  }, []);

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  /* =========================
     SUBMIT
  ========================= */
  const handleSubmit = async () => {
    setLoading(true);

    if (!form.name.trim()) {
      toast.error("Name is required");
      setLoading(false);
      return;
    }

    const payload = {
      name: form.name,
      password: form.password || null,
      role: form.role ? Number(form.role) : null,

      email: form.email || null,
      address: form.address || null,
      phone_number: form.phone_number || null,

      sss_number: form.sss_number || null,
      philhealth_number: form.philhealth_number || null,
      pagibig_number: form.pagibig_number || null,

      hourly_rate: form.hourly_rate ? Number(form.hourly_rate) : null,
      daily_rate: form.daily_rate ? Number(form.daily_rate) : null,

      is_live_seller: form.is_live_seller,
      is_employee: form.is_employee,
    };

    const { error } = await supabase.from("users").insert([payload]);

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    toast.success("User created successfully!");

    setForm({
      name: "",
      password: "",
      role: "",
      email: "",
      address: "",
      phone_number: "",
      sss_number: "",
      philhealth_number: "",
      pagibig_number: "",
      hourly_rate: "",
      daily_rate: "",
      is_live_seller: false,
      is_employee: false,
    });

    setShow(false);
    onSuccess();
    setLoading(false);
  };

  /* =========================
     UI
  ========================= */
  return (
    <>
      <button className={className} onClick={() => setShow(true)}>
        {buttonText}
      </button>

      {show && (
        <div
          className="modal d-block"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content p-3 rounded-3">
              <h5 className="mb-3">Add User</h5>

              <div className="row g-2">
                <div className="col-md-6">
                  <input
                    className="form-control"
                    placeholder="Name"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                  />
                </div>

                <div className="col-md-6">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    value={form.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                  />
                </div>

                <div className="col-md-6">
                  <input
                    className="form-control"
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                </div>

                <div className="col-md-6">
                  <select
                    className="form-select"
                    value={form.role}
                    onChange={(e) => handleChange("role", e.target.value)}
                  >
                    <option value="">Role</option>
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6">
                  <input
                    className="form-control"
                    placeholder="Phone Number"
                    value={form.phone_number}
                    onChange={(e) =>
                      handleChange("phone_number", e.target.value)
                    }
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

                <div className="col-md-4">
                  <input
                    className="form-control"
                    placeholder="SSS"
                    value={form.sss_number}
                    onChange={(e) => handleChange("sss_number", e.target.value)}
                  />
                </div>

                <div className="col-md-4">
                  <input
                    className="form-control"
                    placeholder="PhilHealth"
                    value={form.philhealth_number}
                    onChange={(e) =>
                      handleChange("philhealth_number", e.target.value)
                    }
                  />
                </div>

                <div className="col-md-4">
                  <input
                    className="form-control"
                    placeholder="Pag-IBIG"
                    value={form.pagibig_number}
                    onChange={(e) =>
                      handleChange("pagibig_number", e.target.value)
                    }
                  />
                </div>

                <div className="col-md-6">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Hourly Rate"
                    value={form.hourly_rate}
                    onChange={(e) =>
                      handleChange("hourly_rate", e.target.value)
                    }
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

                <div className="col-md-6 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={form.is_employee}
                    onChange={(e) =>
                      handleChange("is_employee", e.target.checked)
                    }
                  />
                  <label className="form-check-label">Employee</label>
                </div>

                <div className="col-md-6 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={form.is_live_seller}
                    onChange={(e) =>
                      handleChange("is_live_seller", e.target.checked)
                    }
                  />
                  <label className="form-check-label">Live Seller</label>
                </div>
              </div>

              <div className="mt-3 d-flex justify-content-end gap-2">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShow(false)}
                >
                  Cancel
                </button>

                <button
                  className="btn btn-add"
                  onClick={handleSubmit}
                  disabled={loading}
                >
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
