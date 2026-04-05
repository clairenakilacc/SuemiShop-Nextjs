import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const { name, email, password, role_id } = await req.json();

  if (!name || !email || !password || !role_id) {
    return NextResponse.json({ error: "All fields required" }, { status: 400 });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  const { error } = await supabase.from("users").insert([
    {
      name,
      email,
      password: hashedPassword,
      role_id,
    },
  ]);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ message: "Registration successful" });
}
