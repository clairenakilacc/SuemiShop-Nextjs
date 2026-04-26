"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@/app/types/user";

interface Props {
  show: boolean;
  user: User | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditUser({ show, user, onClose, onSuccess }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email || "");
    }
  }, [user]);

  if (!show || !user) return null;

  const handleSave = async () => {
    const { error } = await supabase
      .from("users")
      .update({ name, email })
      .eq("id", user.id);

    if (error) return alert(error.message);

    onSuccess();
    onClose();
  };

  return (
    <div
      className="modal fade show d-block"
      style={{ background: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5>Edit User</h5>
            <button className="btn-close" onClick={onClose} />
          </div>

          <div className="modal-body">
            <input
              className="form-control mb-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
