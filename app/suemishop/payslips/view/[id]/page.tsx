"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

import ViewPayslip from "@/app/components/payslips/ViewPayslip";

export default function Page() {
  const { id } = useParams();
  const [payslip, setPayslip] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from("payslips")
        .select("*")
        .eq("id", id)
        .single();

      setPayslip(data);
    };

    if (id) fetchData();
  }, [id]);

  return (
    <div className="min-h-screen bg-white p-4">
      {payslip ? (
        <ViewPayslip payslip={payslip} show onClose={() => {}} />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
