"use client";

import { useEffect, useState } from "react";
import Modal from "../../components/profile/Modal";
import Swal from "sweetalert2";
import toast, { Toaster } from "react-hot-toast";
import { supabase } from "@/lib/supabase";

interface EditProfileProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

const hasInvalidConsecutiveText = (text: string) => {
  const value = text.toLowerCase();
  const vowels = /[aeiou]{4,}/;
  const consonants = /[bcdfghjklmnpqrstvwxyz]{4,}/;
  return vowels.test(value) || consonants.test(value);
};

export default function EditProfileModal({
  isOpen,
  onClose,
  user,
}: EditProfileProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    address: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone_number: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);

  // Initialize form when modal opens
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone_number: user.phone_number || "",
        address: user.address || "",
      });
      setErrors({
        name: "",
        email: "",
        phone_number: "",
        address: "",
      });
    }
  }, [user, isOpen]);

  const validateField = (name: string, value: string) => {
    let error = "";

    if (name === "name") {
      if (hasInvalidConsecutiveText(value)) {
        error = "Name cannot contain 4 consecutive vowels or consonants";
      }
    }

    if (name === "email") {
      if (!value.endsWith("@gmail.com")) {
        error = "Email must end with @gmail.com";
      } else if (hasInvalidConsecutiveText(value)) {
        error = "Email cannot contain 4 consecutive vowels or consonants";
      }
    }

    if (name === "phone_number") {
      if (!value.startsWith("09") || value.length !== 11) {
        error = "Phone must start with 09 and be 11 digits";
      }
    }

    if (name === "address") {
      if (hasInvalidConsecutiveText(value)) {
        error = "Address cannot contain 4 consecutive vowels or consonants";
      }
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
    return error === "";
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleSave = async () => {
    // Validate all fields before saving
    let valid = true;
    Object.entries(formData).forEach(([key, value]) => {
      if (!validateField(key, value)) valid = false;
    });

    if (!valid) {
      toast.error("Please fix the errors before saving!");
      return;
    }

    const result = await Swal.fire({
      title: "Confirm Changes?",
      text: "Are you sure you want to save these profile updates?",
      icon: "info",
      iconColor: "#FFB6C1",
      showCancelButton: true,
      confirmButtonColor: "#FFB6C1",
      cancelButtonColor: "#D3D3D3",
      confirmButtonText: "Yes, save it!",
      cancelButtonText: "No, cancel",
      reverseButtons: true,
      customClass: {
        confirmButton: "text-dark px-4",
        cancelButton: "text-dark px-4",
        popup: "rounded-4",
      },
    });

    if (!result.isConfirmed) return;

    setLoading(true);

    toast.promise(
      (async () => {
        const { data, error } = await supabase
          .from("users")
          .update({
            name: formData.name,
            email: formData.email,
            phone_number: formData.phone_number,
            address: formData.address,
          })
          .eq("id", user.id)
          .select()
          .single();

        if (error) throw error;

        localStorage.setItem("user", JSON.stringify(data));

        setLoading(false);
        onClose();
        return "Profile updated successfully! 🚀";
      })(),
      {
        loading: "Saving changes...",
        success: (msg) => <b>{msg}</b>,
        error: (err) => <b>{err.message}</b>,
      },
    );
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />

      <Modal isOpen={isOpen} onClose={onClose} title="Edit Profile">
        <div className="row g-3">
          {/* Name */}
          <div className="col-md-6">
            <label className="form-label fw-medium text-dark">Name</label>
            <input
              type="text"
              name="name"
              className={`form-control ${errors.name ? "is-invalid" : ""}`}
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && (
              <div className="text-danger small">{errors.name}</div>
            )}
          </div>

          {/* Email */}
          <div className="col-md-6">
            <label className="form-label fw-medium text-dark">Email</label>
            <input
              type="email"
              name="email"
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && (
              <div className="text-danger small">{errors.email}</div>
            )}
          </div>

          {/* Phone */}
          <div className="col-md-6">
            <label className="form-label fw-medium text-dark">
              Phone Number
            </label>
            <input
              type="text"
              name="phone_number"
              className={`form-control ${
                errors.phone_number ? "is-invalid" : ""
              }`}
              value={formData.phone_number}
              onChange={handleChange}
            />
            {errors.phone_number && (
              <div className="text-danger small">{errors.phone_number}</div>
            )}
          </div>

          {/* Address */}
          <div className="col-md-6">
            <label className="form-label fw-medium text-dark">Address</label>
            <textarea
              name="address"
              className={`form-control ${errors.address ? "is-invalid" : ""}`}
              rows={4}
              value={formData.address}
              onChange={handleChange}
            />
            {errors.address && (
              <div className="text-danger small">{errors.address}</div>
            )}
          </div>
        </div>

        <div className="d-flex justify-content-end gap-2 mt-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="btn px-4"
            style={{ backgroundColor: "lightgrey", borderRadius: "6px" }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="btn text-black px-4"
            style={{
              backgroundColor: "#FFB6C1",
              borderRadius: "6px",
              fontWeight: "500",
            }}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </Modal>
    </>
  );
}
