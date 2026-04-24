"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import toast, { Toaster } from "react-hot-toast";

import AddUser from "@/app/components/users/AddUser";

/* =========================
   TYPES
========================= */
interface User {
  id: number;

  created_at: string | null;

  name: string;
  email: string;
  password: string;
  sss_number: string | null;
  philhealth_number: string | null;
  pag_ibig_number: string | null;
  address: string | null;
  phone_number: string | null;

  hourly_rate: number | null;
  daily_rate: number | null;

  is_employee: boolean | null;
  is_live_seller: boolean | null;

  role?: { id: number; name: string } | null;
}

interface Role {
  id: number;
  name: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);

  /* =========================
     FETCH USERS
  ========================= */
  const fetchUsers = useCallback(async () => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error(error.message);
      return;
    }

    setUsers(data || []);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  /* =========================
     UI
  ========================= */
  return (
    <div className="container my-5">
      <Toaster />

      <h3 className="mb-3">Users</h3>

      {/* TOOLBAR */}
      <div className="mb-3">
        <AddUser onSuccess={fetchUsers} />
      </div>

      {/* TABLE */}
      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Employee</th>
              <th>Live Seller</th>
              <th>Created</th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email || "-"}</td>
                  <td>{u.is_employee ? "Yes" : "No"}</td>
                  <td>{u.is_live_seller ? "Yes" : "No"}</td>
                  <td>
                    {u.created_at
                      ? new Date(u.created_at).toLocaleDateString()
                      : "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
