// import { NextRequest, NextResponse } from "next/server";
// import { supabase } from "@/lib/supabase";

// export async function GET(req: NextRequest) {
//   const cookie = req.cookies.get("user");
//   if (!cookie) {
//     return NextResponse.json({ user: null }, { status: 200 });
//   }

//   try {
//     const user = JSON.parse(cookie.value);

//     // Fetch role info from Supabase
//     const { data: roleData, error } = await supabase
//       .from("roles")
//       .select("name")
//       .eq("id", user.role_id)
//       .single();

//     if (error) {
//       console.error("Supabase role fetch error:", error.message);
//       return NextResponse.json({ user: { ...user, role: null } });
//     }

//     return NextResponse.json({
//       user: { ...user, role: roleData ? { name: roleData.name } : null },
//     });
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ user: null }, { status: 200 });
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import crypto from "crypto";

const COOKIE_SECRET = process.env.COOKIE_SECRET || "supersecretkey";

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

export async function GET(req: NextRequest) {
  const cookie = req.cookies.get("user");
  if (!cookie) return NextResponse.json({ user: null }, { status: 200 });

  const decodedUser = verifyData(cookie.value);
  if (!decodedUser) return NextResponse.json({ user: null }, { status: 200 });

  try {
    // ✅ FIXED: Changed "profiles" to "users"
    const { data: userData, error: userError } = await supabase
      .from("users")  // ← CHANGED FROM "profiles" TO "users"
      .select("id, name, email, address, phone_number, role_id") 
      .eq("id", decodedUser.id)
      .single();

    if (userError || !userData) {
      console.error("❌ Error fetching user data:", userError);
      return NextResponse.json({ user: decodedUser }, { status: 200 });
    }

    console.log("✅ User data fetched:", userData);

    // KUKUHA NG ROLE NAME
    const { data: roleData } = await supabase
      .from("roles")
      .select("name")
      .eq("id", userData.role_id)
      .single();

    // PAGSAMAHIN PARA LUMABAS ANG ADDRESS AT PHONE SA SCREEN
    return NextResponse.json({
      user: { 
        ...decodedUser, 
        ...userData, 
        role: roleData ? { name: roleData.name } : null 
      },
    });
  } catch (err) {
    console.error("❌ Unexpected error:", err);
    return NextResponse.json({ user: decodedUser }, { status: 200 });
  }
}