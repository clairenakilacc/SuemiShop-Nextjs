import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";
import crypto from "crypto";

// Secret for signing cookies — put in your .env
const COOKIE_SECRET = process.env.COOKIE_SECRET || "supersecretkey";

// Sign user data into a secure cookie string
function signData(data: any) {
  const payload = JSON.stringify(data);
  const signature = crypto
    .createHmac("sha256", COOKIE_SECRET)
    .update(payload)
    .digest("hex");
  return `${Buffer.from(payload).toString("base64")}.${signature}`;
}

// Verify cookie signature and return original data
function verifyData(signed: string) {
  try {
    const [b64, signature] = signed.split(".");
    const payload = Buffer.from(b64, "base64").toString("utf8");
    const expectedSig = crypto
      .createHmac("sha256", COOKIE_SECRET)
      .update(payload)
      .digest("hex");
    if (signature !== expectedSig) return null;
    return JSON.parse(payload);
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password required" },
      { status: 400 }
    );
  }

  // Fetch user by email
  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error || !user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  // Compare hashed password
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  // Sign user data (exclude password)
  const userSafe = {
    id: user.id,
    name: user.name,
    email: user.email,
    role_id: user.role_id,
  };
  const signedData = signData(userSafe);

  // Set secure HTTP-only cookie
  const res = NextResponse.json({
    message: "Login successful",
    user: userSafe,
  });
  res.cookies.set("user", signedData, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 1 day
  });

  return res;
}
