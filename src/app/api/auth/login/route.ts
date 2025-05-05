import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({
      message: "Login berhasil",
      user: data.user,
      session: data.session, 
    });
  } catch {
    return NextResponse.json({ status: 500 });
  }
}
