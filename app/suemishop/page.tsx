"use client";

import { useState } from "react";
import StatWidget from "../components/widgets/StatWidget";

export default function DashboardHome() {
  const [loading] = useState(false);

  if (loading) return <p className="text-center mt-5">Loading dashboard...</p>;

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Dashboard</h2>
      </div>

      <div className="row g-3">
        <div className="col-md-3">
          <StatWidget
            type="shipped-today"
            label="Shipped Today"
            color="#6f42c1"
          />
        </div>

        <div className="col-md-3">
          <StatWidget
            type="total-quantity"
            label="Total Quantity"
            color="#0d6efd"
          />
        </div>
      </div>
    </div>
  );
}
