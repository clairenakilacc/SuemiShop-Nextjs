"use client";

import { useEffect } from "react";
import { Archivo_Black } from "next/font/google";

// ✅ MUST be outside component (Next.js rule)
const archivoBlack = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
});

export default function PrintPayslipPage() {
  // ======================
  // STATIC DATA
  // ======================
  const payslip = {
    user: {
      name: "Juan Dela Cruz",
      email: "juan@email.com",
      contact_number: "09123456789",
      hourly_rate: 120,
      daily_rate: 500,
    },
    start_period: "2026-04-01",
    end_period: "2026-04-15",
    days_worked: 10,
    overtime_hours: 5,
    total_deduction: 300,
    total_daily_pay: 5000,
    total_overtime_pay: 600,
    gross_pay: 5600,
    net_pay: 5300,
  };

  const formatDate = (date?: string) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString();
  };

  // auto print
  useEffect(() => {
    window.print();
  }, []);

  return (
    <div className="bg-white flex justify-center items-start py-5">
      <div className="bg-white w-full max-w-[800px] p-2 shadow-lg space-y-4">
        {/* ================= PAYSLIP CARD ================= */}
        <div className="border border-gray-300 p-2 md:p-4 flex flex-col text-xs md:text-sm">
          {/* HEADER */}
          <div className="bg-pink-200 p-2 flex justify-between items-end">
            <div>
              <h5
                className={`${archivoBlack.className} text-sm mt-1 md:text-base font-bold text-gray-800 m-0 leading-none`}
              >
                Suemi Online Shop
              </h5>

              <p className="text-[9px] md:text-xs text-gray-600 leading-tight mt-0">
                BLK 9 L5 Calliandra 2 Phase 1 Greenwoods
                <br />
                Executive Village Paliparan 1 Dasmariñas Cavite
                <br />
                facebook.com/suemishop | 09151772074
              </p>
            </div>

            <div className="text-lg md:text-xl font-bold tracking-wider text-gray-800">
              P A Y S L I P
            </div>
          </div>

          {/* LINE */}
          <div className="h-0.5 bg-gray-800 my-1" />

          {/* ================= TOP SUMMARY ================= */}
          <div className="text-right space-y-1 mr-1">
            <p className="font-semibold">
              Gross Pay: ₱{payslip.gross_pay.toLocaleString()}
            </p>

            <p className="font-semibold text-red-600">
              Deductions: ₱{payslip.total_deduction.toLocaleString()}
            </p>

            <p className="font-bold text-lg">
              NET Pay: ₱{payslip.net_pay.toLocaleString()}
            </p>
          </div>

          {/* ================= EMPLOYEE INFO ================= */}
          <div className="flex flex-col md:flex-row gap-2 mt-2">
            {/* LEFT */}
            <div className="grid grid-cols-2 border border-gray-200 text-xs w-full md:w-3/4">
              <div className="bg-gray-100 px-1 py-0.5 border-b">Name:</div>
              <div className="px-1 py-0.5 border-b">{payslip.user.name}</div>

              <div className="bg-gray-100 px-1 py-0.5 border-b">Email:</div>
              <div className="px-1 py-0.5 border-b">{payslip.user.email}</div>

              <div className="bg-gray-100 px-1 py-0.5 border-b">Contact:</div>
              <div className="px-1 py-0.5 border-b">
                {payslip.user.contact_number}
              </div>
            </div>

            {/* RIGHT */}
            <div className="grid grid-cols-2 border border-gray-200 text-xs w-full md:w-1/4">
              <div className="bg-gray-100 px-1 py-0.5 border-b">Start:</div>
              <div className="px-1 py-0.5 border-b">
                {formatDate(payslip.start_period)}
              </div>

              <div className="bg-gray-100 px-1 py-0.5 border-b">End:</div>
              <div className="px-1 py-0.5 border-b">
                {formatDate(payslip.end_period)}
              </div>
            </div>
          </div>

          {/* ================= TABLE ================= */}
          <div className="flex flex-col md:flex-row gap-2 mt-1">
            {/* EARNINGS */}
            <div className="w-full md:w-1/2">
              <table className="w-full border border-gray-300 text-xs">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-1">HOURS</th>
                    <th className="border px-1">DAYS</th>
                    <th className="border px-1">HOURLY</th>
                    <th className="border px-1">DAILY</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td className="border text-center">
                      {payslip.overtime_hours}
                    </td>
                    <td className="border text-center">
                      {payslip.days_worked}
                    </td>
                    <td className="border text-center">
                      ₱{payslip.user.hourly_rate}
                    </td>
                    <td className="border text-center">
                      ₱{payslip.user.daily_rate}
                    </td>
                  </tr>

                  <tr>
                    <td colSpan={4} className="border px-1 py-1 text-xs">
                      Total Daily Pay = ₱{payslip.total_daily_pay}
                      <br />
                      Total Overtime Pay = ₱{payslip.total_overtime_pay}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* DEDUCTIONS */}
            <div className="w-full md:w-1/2">
              <table className="w-full border border-gray-300 text-xs">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-1 text-left">DEDUCTIONS</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td className="border px-1 py-1">
                      ₱{payslip.total_deduction}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* ================= SIGNATURES ================= */}
          <div className="grid grid-cols-3 mt-3 text-center text-xs">
            <div>
              <div className="h-10" />
              <p className="font-bold underline">{payslip.user.name}</p>
              <p>Employee</p>
            </div>

            <div>
              <div className="h-10" />
              <p className="font-bold underline">SUE LAPIDEZ</p>
              <p>Prepared By</p>
            </div>

            <div>
              <div className="h-10" />
              <p className="font-bold underline">MICHAEL LAPIDEZ</p>
              <p>Employer</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
