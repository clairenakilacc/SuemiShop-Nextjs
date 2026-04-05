"use client";
import { useEffect, useState, FormEvent } from "react";
import { supabase } from "@/lib/supabase";
import toast, { Toaster } from "react-hot-toast";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

interface User {
  id?: string;
  name: string;
  email: string;
  password: string;
  phone_number: string;
}

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);

  const [form, setForm] = useState<User>({
    name: "",
    email: "",
    password: "",
    phone_number: "",
  });
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  //handleformSubmit
  async function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log(form);

    if (editId) {
      // Update user
      const { error } = await supabase
        .from("users")
        .update(form)
        .eq("id", editId);

      if (error) {
        toast.error("Failed to update user");
      } else {
        toast.success("User updated successfully");
        fetchUsers();
        setEditId(null); // reset edit mode
        setForm({
          name: "",
          email: "",
          password: "",
          phone_number: "",
        });
      }
    } else {
      // Add user
      const { error } = await supabase.from("users").insert([form]);

      if (error) {
        toast.error(`Failed to create ${error.message}`);
      } else {
        toast.success("User added successfully");
        fetchUsers();
        setForm({
          name: "",
          email: "",
          password: "",
          phone_number: "",
        });
      }
    }
  }

  async function fetchUsers() {
    const { data, error } = await supabase.from("users").select("*");

    if (error) {
      toast.error(`Failed to read data ${error.message}`);
    } else {
      console.log(data);
      setUsers(data || []);
    }
  }

  //Handle User Edit
  function handleUserEdit(user: User) {
    setForm(user);
    if (user.id) {
      setEditId(user.id);
    }
  }

  //handle student delete
  async function handleUserDelete(id: string) {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      await supabase.from("users").delete().eq("id", id);
      toast.success("User deleted successfully");
      fetchUsers();
      Swal.fire({
        title: "Deleted!",
        text: "User has been deleted.",
        icon: "success",
      });
    }
  }

  return (
    <div className="container my-5">
      <Toaster />
      <h3 className="mb-4">Suemi Online Shop</h3>

      <div className="row">
        {/* Left side: User Form */}
        <div className="col-md-4 mb-4">
          <div className="card h-100">
            <div className="card-body">
              <form onSubmit={handleFormSubmit}>
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter name"
                    value={form.name}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        name: event.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter email"
                    value={form.email}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        email: event.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter password"
                    value={form.password}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        password: event.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter phone number"
                    value={form.phone_number}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        phone_number: event.target.value,
                      })
                    }
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  {editId ? "Update" : "Add"}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Right side: Users Table */}
        <div className="col-md-8">
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Password</th>
                  <th>Phone Number</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((singleUser) => (
                  <tr key={singleUser.id}>
                    <td>{singleUser.name}</td>
                    <td>{singleUser.email}</td>
                    <td>{singleUser.password}</td>
                    <td>{singleUser.phone_number}</td>
                    <td>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => handleUserEdit(singleUser)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() =>
                          singleUser.id && handleUserDelete(singleUser.id)
                        }
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
