// app/api/updateUser/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, name, email, address, phone_number } = body;

    const { data, error } = await supabase
      .from('users')
      .update({ name, email, address, phone_number })
      .eq('id', id)
      .select(); // Use .select() to return updated row

    if (error) throw error;

    return NextResponse.json({ message: "Profile updated successfully", data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
