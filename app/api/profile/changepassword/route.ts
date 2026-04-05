import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const COOKIE_SECRET = process.env.COOKIE_SECRET || "supersecretkey";

// Verify signed cookie
function verifyData(signed: string) {
  try {
    const [b64, signature] = signed.split(".");
    if (!b64 || !signature) return null;

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
  try {
    const cookie = req.cookies.get("user")?.value?.trim();
    if (!cookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = verifyData(cookie);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { newPassword } = await req.json();
    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { error: "New password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password in Supabase
    const { error: updateError } = await supabase
      .from("users")
      .update({ password: hashedPassword })
      .eq("id", user.id)
      .single(); // Ensures exactly one row updated

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Password updated successfully" });
  } catch (err: any) {
    console.error("Password change error:", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
