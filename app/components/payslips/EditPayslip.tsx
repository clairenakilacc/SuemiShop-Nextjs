"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Payslip } from "@/app/types/payslip";

/* =========================
   TYPES
========================= */
interface Props {
  show: boolean;
  payslip: Payslip | null;
  onClose: () => void;
  onSuccess: () => void;
}

interface Commission {
  description: string;
  quantity: number | "";
  price: number | "";
}

interface Bonus {
  description: string;
  amount: number | "";
}

interface Deduction {
  description: string;
  amount: number | "";
}

/* =========================
   COMPONENT
========================= */
export default function EditPayslip({
  show,
  payslip,
  onClose,
  onSuccess,
}: Props) {
  const [form, setForm] = useState({
    days_worked: "",
    overtime_hours: "",
  });

  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [bonuses, setBonuses] = useState<Bonus[]>([]);
  const [deductions, setDeductions] = useState<Deduction[]>([]);

  /* =========================
     LOAD DATA ON OPEN
  ========================= */
  useEffect(() => {
    if (!payslip) return;

    setForm({
      days_worked: payslip.days_worked?.toString() || "",
      overtime_hours: payslip.overtime_hours?.toString() || "",
    });

    setCommissions([]);
    setBonuses([]);
    setDeductions([]);
  }, [payslip]);

  if (!show || !payslip) return null;

  const payslipId = payslip.id;

  /* =========================
     COMMISSION
  ========================= */
  const addCommission = () => {
    setCommissions([
      ...commissions,
      { description: "", quantity: "", price: "" },
    ]);
  };

  const updateCommission = (i: number, key: keyof Commission, value: any) => {
    const updated = [...commissions];
    updated[i] = { ...updated[i], [key]: value };
    setCommissions(updated);
  };

  const removeCommission = (i: number) => {
    setCommissions(commissions.filter((_, idx) => idx !== i));
  };

  /* =========================
     BONUS
  ========================= */
  const addBonus = () => {
    setBonuses([...bonuses, { description: "", amount: "" }]);
  };

  const updateBonus = (i: number, key: keyof Bonus, value: any) => {
    const updated = [...bonuses];
    updated[i] = { ...updated[i], [key]: value };
    setBonuses(updated);
  };

  const removeBonus = (i: number) => {
    setBonuses(bonuses.filter((_, idx) => idx !== i));
  };

  /* =========================
     DEDUCTION
  ========================= */
  const addDeduction = () => {
    setDeductions([...deductions, { description: "", amount: "" }]);
  };

  const updateDeduction = (i: number, key: keyof Deduction, value: any) => {
    const updated = [...deductions];
    updated[i] = { ...updated[i], [key]: value };
    setDeductions(updated);
  };

  const removeDeduction = (i: number) => {
    setDeductions(deductions.filter((_, idx) => idx !== i));
  };

  /* =========================
     SAVE ALL
  ========================= */
  const handleSave = async () => {
    if (!payslipId) return;

    /* -------------------------
       1. UPDATE PAYSLIP
    ------------------------- */
    const { error: updateError } = await supabase
      .from("payslips")
      .update({
        days_worked: Number(form.days_worked || 0),
        overtime_hours: Number(form.overtime_hours || 0),
        updated_at: new Date().toISOString(),
      })
      .eq("id", payslipId);

    if (updateError) {
      console.error("Payslip update error:", updateError);
      return;
    }

    /* -------------------------
       2. CLEAR OLD DATA
    ------------------------- */
    await supabase
      .from("payslip_commissions")
      .delete()
      .eq("payslip_id", payslipId);
    await supabase.from("payslip_bonuses").delete().eq("payslip_id", payslipId);
    await supabase
      .from("payslip_deductions")
      .delete()
      .eq("payslip_id", payslipId);

    /* -------------------------
       3. INSERT COMMISSIONS
    ------------------------- */
    const commissionData = commissions
      .filter((c) => c.description.trim() !== "")
      .map((c) => ({
        payslip_id: payslipId,
        description: c.description,
        quantity: Number(c.quantity || 0),
        price: Number(c.price || 0),
      }));

    if (commissionData.length > 0) {
      const { error } = await supabase
        .from("payslip_commissions")
        .insert(commissionData);

      if (error) console.error("Commission insert error:", error);
    }

    /* -------------------------
       4. INSERT BONUSES
    ------------------------- */
    const bonusData = bonuses
      .filter((b) => b.description.trim() !== "")
      .map((b) => ({
        payslip_id: payslipId,
        description: b.description,
        amount: Number(b.amount || 0),
      }));

    if (bonusData.length > 0) {
      const { error } = await supabase
        .from("payslip_bonuses")
        .insert(bonusData);

      if (error) console.error("Bonus insert error:", error);
    }

    /* -------------------------
       5. INSERT DEDUCTIONS
    ------------------------- */
    const deductionData = deductions
      .filter((d) => d.description.trim() !== "")
      .map((d) => ({
        payslip_id: payslipId,
        description: d.description,
        amount: Number(d.amount || 0),
      }));

    if (deductionData.length > 0) {
      const { error } = await supabase
        .from("payslip_deductions")
        .insert(deductionData);

      if (error) console.error("Deduction insert error:", error);
    }

    console.log("SAVE SUCCESS");

    onSuccess();
    onClose();
  };

  /* =========================
     UI
  ========================= */
  return (
    <div
      className="modal fade show d-block"
      style={{ background: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5>Edit Payslip</h5>
            <button className="btn-close" onClick={onClose} />
          </div>

          <div
            className="modal-body"
            style={{ maxHeight: "70vh", overflowY: "auto" }}
          >
            {/* PAYSLIP FIELDS */}
            <input
              className="form-control mb-2"
              placeholder="Days Worked"
              value={form.days_worked}
              onChange={(e) =>
                setForm({ ...form, days_worked: e.target.value })
              }
            />

            <input
              className="form-control mb-3"
              placeholder="Overtime Hours"
              value={form.overtime_hours}
              onChange={(e) =>
                setForm({ ...form, overtime_hours: e.target.value })
              }
            />

            {/* COMMISSIONS */}
            <h6>Commission</h6>

            {commissions.map((c, i) => (
              <div key={i} className="d-flex gap-2 mb-2">
                <input
                  className="form-control"
                  placeholder="Description"
                  value={c.description}
                  onChange={(e) =>
                    updateCommission(i, "description", e.target.value)
                  }
                />

                <input
                  className="form-control"
                  placeholder="Qty"
                  value={c.quantity}
                  onChange={(e) =>
                    updateCommission(i, "quantity", e.target.value)
                  }
                />

                <input
                  className="form-control"
                  placeholder="Price"
                  value={c.price}
                  onChange={(e) => updateCommission(i, "price", e.target.value)}
                />

                <button
                  className="btn btn-danger"
                  onClick={() => removeCommission(i)}
                >
                  X
                </button>
              </div>
            ))}

            <button className="btn btn-sm btn-add mb-3" onClick={addCommission}>
              + Add Commission
            </button>

            {/* BONUS */}
            <h6>Bonus</h6>

            {bonuses.map((b, i) => (
              <div key={i} className="d-flex gap-2 mb-2">
                <input
                  className="form-control"
                  placeholder="Description"
                  value={b.description}
                  onChange={(e) =>
                    updateBonus(i, "description", e.target.value)
                  }
                />

                <input
                  className="form-control"
                  placeholder="Amount"
                  value={b.amount}
                  onChange={(e) => updateBonus(i, "amount", e.target.value)}
                />

                <button
                  className="btn btn-danger"
                  onClick={() => removeBonus(i)}
                >
                  X
                </button>
              </div>
            ))}

            <button className="btn btn-sm btn-add mb-3" onClick={addBonus}>
              + Add Bonus
            </button>

            {/* DEDUCTION */}
            <h6>Deduction</h6>

            {deductions.map((d, i) => (
              <div key={i} className="d-flex gap-2 mb-2">
                <input
                  className="form-control"
                  placeholder="Description"
                  value={d.description}
                  onChange={(e) =>
                    updateDeduction(i, "description", e.target.value)
                  }
                />

                <input
                  className="form-control"
                  placeholder="Amount"
                  value={d.amount}
                  onChange={(e) => updateDeduction(i, "amount", e.target.value)}
                />

                <button
                  className="btn btn-danger"
                  onClick={() => removeDeduction(i)}
                >
                  X
                </button>
              </div>
            ))}

            <button className="btn btn-sm btn-add" onClick={addDeduction}>
              + Add Deduction
            </button>
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
