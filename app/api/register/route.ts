import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      name,
      email,
      password,
      role,
      phone_number,
      address,
      sss_number,
      philhealth_number,
      pagibig_number,
      hourly_rate,
      daily_rate,
      is_employee,
      is_live_seller,
    } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: "Name, email, password, and role are required" },
        { status: 400 },
      );
    }

    // ✅ HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    const { error } = await supabase.from("users").insert([
      {
        name,
        email,
        password: hashedPassword,
        role,

        // ✅ ADD ALL FIELDS HERE
        phone_number: phone_number || null,
        address: address || null,
        sss_number: sss_number || null,
        philhealth_number: philhealth_number || null,
        pagibig_number: pagibig_number || null,
        hourly_rate: hourly_rate ?? 0,
        daily_rate: daily_rate ?? 0,
        is_employee: is_employee ?? false,
        is_live_seller: is_live_seller ?? false,
      },
    ]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      message: "User created successfully",
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 },
    );
  }
}
