"use client";

import { useEffect, useState } from "react";
// import html2pdf from "html2pdf.js";

type Commission = {
  description: string;
  quantity: number;
  price: number;
  total: number;
};

type Deduction = {
  description: string;
  amount: number;
};

// ----------------------
// MOCK DATA (replace later with API if needed)
// ----------------------
const user = {
  id: 1,
  name: "John Doe",
  email: "john@example.com",
  contact_number: "09123456789",
  sss_number: "123-456-789",
  philhealth_number: "987-654-321",
  pagibig_number: "555-666-777",
  daily_rate: 500,
  hourly_rate: 60,
  role: { name: "Staff" },
};

const startDate = "2026-04-01";
const endDate = "2026-04-15";

const totalDays = 10;
const totalHours = 20;

export default function PayslipPage() {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [deductions, setDeductions] = useState<Deduction[]>([]);

  const [desc, setDesc] = useState("");
  const [qty, setQty] = useState(0);
  const [price, setPrice] = useState(0);

  const [dDesc, setDDesc] = useState("");
  const [dAmount, setDAmount] = useState(0);

  const totalDailyPay = totalDays * (user.daily_rate ?? 0);
  const totalOvertimePay = totalHours * (user.hourly_rate ?? 0);

  const totalCommission = commissions.reduce((a, b) => a + b.total, 0);
  const totalDeduction = deductions.reduce((a, b) => a + b.amount, 0);

  const grossPay = totalDailyPay + totalOvertimePay + totalCommission;
  const netPay = grossPay - totalDeduction;

  const addCommission = () => {
    const total = qty * price;
    setCommissions([
      ...commissions,
      { description: desc, quantity: qty, price, total },
    ]);
    setDesc("");
    setQty(0);
    setPrice(0);
  };

  const addDeduction = () => {
    setDeductions([...deductions, { description: dDesc, amount: dAmount }]);
    setDDesc("");
    setDAmount(0);
  };

  const printPayslip = () => {
    const element = document.getElementById("payslip");
    if (!element) return;

    // html2pdf()
    //   .from(element)
    //   .set({
    //     margin: 0.2,
    //     filename: `${user.name}_payslip.pdf`,
    //     html2canvas: { scale: 2 },
    //     jsPDF: { format: "a4", orientation: "portrait" },
    //   })
    //   .save();
  };

  return (
    <div className="flex justify-center bg-white py-6">
      <div
        id="payslip"
        className="w-full max-w-[800px] bg-white p-4 space-y-4 shadow"
      >
        {/* HEADER */}
        <div className="bg-pink-200 p-3 flex justify-between">
          <div>
            <h1 className="font-bold">Suemi Online Shop</h1>
            <p className="text-xs">
              BLK 9 L5 Calliandra 2 Phase 1 Greenwoods
              <br />
              Dasmariñas Cavite | 09151772074
            </p>
          </div>
          <div className="font-bold text-xl">PAYSLIP</div>
        </div>

        {/* SUMMARY */}
        <div className="text-right text-sm space-y-1">
          <p>Gross: ₱{grossPay.toFixed(2)}</p>
          <p className="text-red-600">
            Deductions: ₱{totalDeduction.toFixed(2)}
          </p>
          <p className="font-bold text-lg">Net: ₱{netPay.toFixed(2)}</p>
        </div>

        {/* EMPLOYEE INFO */}
        <div className="grid grid-cols-2 text-xs border">
          <div className="p-2 border-r">
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
            <p>Contact: {user.contact_number}</p>
            <p>SSS: {user.sss_number}</p>
            <p>Philhealth: {user.philhealth_number}</p>
            <p>PagIBIG: {user.pagibig_number}</p>
          </div>

          <div className="p-2">
            <p>Role: {user.role.name}</p>
            <p>Start: {startDate}</p>
            <p>End: {endDate}</p>
          </div>
        </div>

        {/* EARNINGS */}
        <div className="text-xs border p-2">
          <p>Days Worked: {totalDays}</p>
          <p>Hours Worked: {totalHours}</p>
          <p>Daily Pay: ₱{totalDailyPay.toFixed(2)}</p>
          <p>Overtime Pay: ₱{totalOvertimePay.toFixed(2)}</p>

          <p className="mt-2 font-bold">Commissions:</p>
          {commissions.length ? (
            commissions.map((c, i) => (
              <p key={i}>
                {c.quantity} {c.description} = ₱{c.total.toFixed(2)}
              </p>
            ))
          ) : (
            <p>N/A</p>
          )}
        </div>

        {/* DEDUCTIONS */}
        <div className="text-xs border p-2">
          <p className="font-bold">Deductions:</p>
          {deductions.length ? (
            deductions.map((d, i) => (
              <p key={i}>
                {d.description} = ₱{d.amount.toFixed(2)}
              </p>
            ))
          ) : (
            <p>N/A</p>
          )}
        </div>

        {/* CONTROLS */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="border p-2">
            <p className="font-bold">Add Commission</p>
            <input
              className="border w-full p-1"
              placeholder="desc"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
            <input
              className="border w-full p-1 mt-1"
              placeholder="qty"
              type="number"
              onChange={(e) => setQty(+e.target.value)}
            />
            <input
              className="border w-full p-1 mt-1"
              placeholder="price"
              type="number"
              onChange={(e) => setPrice(+e.target.value)}
            />
            <button
              className="bg-amber-500 text-white w-full mt-2"
              onClick={addCommission}
            >
              Add
            </button>
          </div>

          <div className="border p-2">
            <p className="font-bold">Add Deduction</p>
            <input
              className="border w-full p-1"
              value={dDesc}
              onChange={(e) => setDDesc(e.target.value)}
            />
            <input
              className="border w-full p-1 mt-1"
              type="number"
              onChange={(e) => setDAmount(+e.target.value)}
            />
            <button
              className="bg-red-500 text-white w-full mt-2"
              onClick={addDeduction}
            >
              Add
            </button>
          </div>
        </div>

        {/* PRINT */}
        <button
          onClick={printPayslip}
          className="fixed top-5 right-5 bg-green-500 text-white px-4 py-2 rounded"
        >
          Print PDF
        </button>
      </div>
    </div>
  );
}
