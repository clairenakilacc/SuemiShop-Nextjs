import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    // table to export (e.g. "items", "users", "sales")
    const table = searchParams.get("table");
    if (!table) throw new Error("Missing table name.");

    // optional filters
    const user = searchParams.get("user");
    const role = searchParams.get("role");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const searchTerm = searchParams.get("searchTerm");

    let query = supabase.from(table).select("*");

    // 🔹 Optional filtering logic based on table type
    if (table === "items") {
      if (role !== "Superadmin" && user)
        query = query.ilike("prepared_by", `%${user.trim()}%`);

      if (startDate && endDate)
        query = query
          .gte("timestamp", new Date(startDate).toISOString())
          .lte("timestamp", new Date(endDate).toISOString());

      if (searchTerm)
        query = query.or(
          `brand.ilike.%${searchTerm}%,order_id.ilike.%${searchTerm}%,prepared_by.ilike.%${searchTerm}%`
        );

      query = query.order("timestamp", { ascending: false });
    }

    if (table === "users") {
      if (searchTerm)
        query = query.or(
          `name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,role_name.ilike.%${searchTerm}%`
        );
      query = query.order("created_at", { ascending: false });
    }

    // you can add other table-specific conditions here if needed

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ data });
  } catch (err: any) {
    console.error("EXPORT ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
