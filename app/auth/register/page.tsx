"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { supabase } from "@/lib/supabase";
import { ROUTES } from "../../routes";
import Link from "next/link";
import bcrypt from "bcryptjs";

const hasInvalidConsecutiveText = (text: string) => {
  const value = text.toLowerCase();
  const vowels = /[aeiou]{4,}/;
  const consonants = /[bcdfghjklmnpqrstvwxyz]{4,}/;
  return vowels.test(value) || consonants.test(value);
};

export default function RegisterPage() {
  const [mounted, setMounted] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    phone_number: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone_number: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const capitalizeWords = (text: string) =>
    text.replace(/\b\w/g, (char) => char.toUpperCase());

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    let updatedValue = value;
    let nameError = "";
    let emailError = "";
    let phoneNumberError = "";

    if (name === "name") {
      updatedValue = value.replace(/[^a-zA-Z .-]/g, "");
      updatedValue = capitalizeWords(updatedValue);

      if (hasInvalidConsecutiveText(updatedValue)) {
        nameError = "Name cannot contain 4 consecutive vowels or consonants";
      }
    }

    if (name === "email") {
      updatedValue = value.replace(/[^a-zA-Z0-9.@]/g, "");

      if (!updatedValue.endsWith("@gmail.com")) {
        emailError = "Email must end with @gmail.com";
      } else if (hasInvalidConsecutiveText(updatedValue)) {
        emailError = "Email cannot contain 4 consecutive vowels or consonants";
      }
    }

    if (name === "address") {
      updatedValue = value.slice(0, 100);

      if (hasInvalidConsecutiveText(updatedValue)) {
        toast.dismiss();
        toast.error(
          "Address cannot contain 4 consecutive vowels or consonants"
        );
      }
    }

    if (name === "phone_number") {
      updatedValue = value.replace(/\D/g, "").slice(0, 11);

      if (!updatedValue.startsWith("09")) {
        phoneNumberError = "Phone number must start with 09";
      } else if (updatedValue.length !== 11) {
        phoneNumberError = "Phone number must be exactly 11 digits";
      }
    }

    setForm((prev) => ({
      ...prev,
      [name]: updatedValue,
    }));

    setErrors((prev) => ({
      ...prev,
      name: name === "name" ? nameError : prev.name,
      email: name === "email" ? emailError : prev.email,
      phone_number:
        name === "phone_number" ? phoneNumberError : prev.phone_number,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (errors.name || errors.email || errors.phone_number) {
      toast.error("Please fix the errors in the form");
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const { data: existingUser, error: fetchError } = await supabase
        .from("users")
        .select("id")
        .eq("email", form.email)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        toast.error(fetchError.message);
        return;
      }

      if (existingUser) {
        toast.error("Email already registered");
        return;
      }

      const hashedPassword = await bcrypt.hash(form.password, 10);

      let shopperRoleId: number;

      const { data: shopperRole } = await supabase
        .from("roles")
        .select("id")
        .eq("name", "Shopper")
        .single();

      if (shopperRole) {
        shopperRoleId = shopperRole.id;
      } else {
        const { data: newRole, error: insertRoleError } = await supabase
          .from("roles")
          .insert([{ name: "Shopper" }])
          .select()
          .single();

        if (!newRole || insertRoleError) {
          toast.error(
            insertRoleError?.message || "Failed to create Shopper role"
          );
          return;
        }

        shopperRoleId = newRole.id;
      }

      const { error: insertError } = await supabase.from("users").insert([
        {
          name: form.name,
          email: form.email,
          password: hashedPassword,
          address: form.address,
          phone_number: form.phone_number,
          role_id: shopperRoleId,
        },
      ]);

      if (insertError) {
        toast.error(insertError.message);
        return;
      }

      toast.success("Registered successfully!");
      router.push(ROUTES.LOGIN);
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="container d-flex justify-content-center align-items-start min-vh-100 bg-white py-5">
      <Toaster position="top-center" />

      <div
        className="card shadow-lg p-4"
        style={{ maxWidth: "400px", width: "100%", borderRadius: "12px" }}
      >
        <Link href={ROUTES.HOME}>
          <img
            src="/images/logo2.png"
            alt="Logo"
            className="mx-auto d-block mb-2"
            style={{ width: "120px", cursor: "pointer" }}
          />
        </Link>

        <h2 className="fw-bold text-center mb-3">Register</h2>

        <form onSubmit={handleSubmit}>
          <label className="form-label fw-semibold">Name</label>
          <input
            type="text"
            name="name"
            className={`form-control mb-1 ${errors.name ? "is-invalid" : ""}`}
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          {errors.name && (
            <div className="text-danger small mb-2">{errors.name}</div>
          )}

          <label className="form-label fw-semibold">Email address</label>
          <input
            type="email"
            name="email"
            className={`form-control mb-1 ${errors.email ? "is-invalid" : ""}`}
            placeholder="example@gmail.com"
            value={form.email}
            onChange={handleChange}
            required
          />
          {errors.email && (
            <div className="text-danger small mb-2">{errors.email}</div>
          )}

          <label className="form-label fw-semibold">Address</label>
          <textarea
            name="address"
            className="form-control mb-2"
            placeholder="Complete address"
            value={form.address}
            onChange={handleChange}
            required
            rows={3}
            maxLength={100}
          />
          <small className="text-muted d-block mb-3">
            {form.address.length}/100 characters
          </small>

          <label className="form-label fw-semibold">Phone Number</label>
          <input
            type="text"
            name="phone_number"
            className={`form-control mb-1 ${
              errors.phone_number ? "is-invalid" : ""
            }`}
            placeholder="09XXXXXXXXX"
            value={form.phone_number}
            onChange={handleChange}
            required
          />
          {errors.phone_number && (
            <div className="text-danger small mb-3">{errors.phone_number}</div>
          )}

          <label className="form-label fw-semibold">Password</label>
          <div className="input-group mb-3">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              className="form-control"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <span
              className="input-group-text"
              style={{ cursor: "pointer" }}
              onClick={() => setShowPassword((prev) => !prev)}
            >
              <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`} />
            </span>
          </div>

          <label className="form-label fw-semibold">Confirm Password</label>
          <div className="input-group mb-4">
            <input
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              className="form-control"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
            <span
              className="input-group-text"
              style={{ cursor: "pointer" }}
              onClick={() => setShowConfirm((prev) => !prev)}
            >
              <i className={`bi ${showConfirm ? "bi-eye-slash" : "bi-eye"}`} />
            </span>
          </div>

          <button
            type="submit"
            className="btn btn-rose w-100 fw-bold"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="text-center mt-3">
          <p className="mb-0">
            Already have an account?{" "}
            <Link
              href={ROUTES.LOGIN}
              className="text-danger text-decoration-none fw-semibold"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
