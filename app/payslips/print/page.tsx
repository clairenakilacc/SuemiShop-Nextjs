"use client";

import { useEffect } from "react";
import { Inter, Archivo_Black } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
});

const archivoBlack = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
});

export default function PrintPayslipPage() {
  useEffect(() => {
    window.print();
  }, []);

  return (
    <div
      className={`${inter.className} bg-white flex justify-center items-start py-5`}
    >
      <div className="bg-white w-full max-w-[800px] p-2 shadow-lg space-y-4">
        <div className="border border-gray-300 p-2 md:p-4 flex flex-col text-xs md:text-sm">
          {/* HEADER */}
          <div className="bg-pink-200 p-2 flex justify-between items-end">
            <div>
              <h5
                className={`${archivoBlack.className} text-sm mt-1 md:text-base text-gray-800 m-0 leading-none`}
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

          <div className="h-0.5 bg-gray-800 my-1" />

          {/* SUMMARY */}
          <div className="text-right space-y-1 mr-1">
            <p className="font-semibold">Gross Pay: ₱5,600</p>
            <p className="font-semibold text-red-600">Deductions: ₱300</p>
            <p className="font-bold text-lg">NET Pay: ₱5,300</p>
          </div>

          {/* EMPLOYEE INFO */}
          <div className="flex flex-col md:flex-row gap-2 mt-2">
            {/* LEFT */}
            <div className="grid grid-cols-2 border border-gray-200 text-xs w-full md:w-3/4">
              <div className="bg-gray-100 px-1 py-0.5 border-b border-gray-300">
                Name:
              </div>
              <div className="px-1 py-0.5 border-b border-gray-300 wrap-break-word whitespace-normal">
                Juan Dela Cruz
              </div>

              <div className="bg-gray-100 px-1 py-0.5 border-b border-gray-300">
                Email:
              </div>
              <div className="px-1 py-0.5 border-b border-gray-300 wrap-break-word whitespace-normal">
                juan@email.com
              </div>

              <div className="bg-gray-100 px-1 py-0.5 border-b border-gray-300">
                Contact Number:
              </div>
              <div className="px-1 py-0.5 border-b border-gray-300 wrap-break-word whitespace-normal">
                09123456789
              </div>

              <div className="bg-gray-100 px-1 py-0.5 border-b border-gray-300">
                SSS No.:
              </div>
              <div className="px-1 py-0.5 border-b border-gray-300 wrap-break-word whitespace-normal">
                12-3456789-0
              </div>

              <div className="bg-gray-100 px-1 py-0.5 border-b border-gray-300">
                PhilHealth No.:
              </div>
              <div className="px-1 py-0.5 border-b border-gray-300 wrap-break-word whitespace-normal">
                1234-5678-9012
              </div>

              <div className="bg-gray-100 px-1 py-0.5 border-b border-gray-300">
                Pag-IBIG No.:
              </div>
              <div className="px-1 py-0.5 border-b border-gray-300 wrap-break-word whitespace-normal">
                1234-5678-9012
              </div>
            </div>

            {/* RIGHT */}
            <div className="grid grid-cols-2 border border-gray-200 text-xs w-full md:w-1/4">
              <div className="bg-gray-100 px-1 py-0.5 border-b border-gray-300">
                Designation:
              </div>
              <div className="px-1 py-0.5 border-b border-gray-300 wrap-break-word whitespace-normal">
                Sales Staff
              </div>

              <div className="bg-gray-100 px-1 py-0.5 border-b border-gray-300">
                Pay Period (Start):
              </div>
              <div className="px-1 py-0.5 border-b border-gray-300">
                Apr 01, 2026
              </div>

              <div className="bg-gray-100 px-1 py-0.5 border-b border-gray-300">
                Pay Period (End):
              </div>
              <div className="px-1 py-0.5 border-b border-gray-300">
                Apr 15, 2026
              </div>
            </div>
          </div>

          {/* TABLE */}
          <div className="flex flex-col md:flex-row gap-2 mt-1">
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
                    <td className="border text-center">5</td>
                    <td className="border text-center">10</td>
                    <td className="border text-center">₱120</td>
                    <td className="border text-center">₱500</td>
                  </tr>

                  <tr>
                    <td colSpan={4} className="border px-1 py-1 text-xs">
                      Total Daily Pay = ₱5,000
                      <br />
                      Total Overtime Pay = ₱600
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="w-full md:w-1/2">
              <table className="w-full border border-gray-300 text-xs">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-1 text-left">DEDUCTIONS</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td className="border px-1 py-1">₱300</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* SIGNATURES */}
          <div className="grid grid-cols-3 mt-3 text-center text-xs">
            <div>
              <div className="h-10" />
              <p className="font-bold underline">Juan Dela Cruz</p>
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
