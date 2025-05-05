import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const POST = async (req: NextRequest) => {
  try {
    const { email, password, createdAt,name } = await req.json()
    const hashedPassword = await bcrypt.hash(password, 10)
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })
    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }
    const user = authData.user
    const userCreatedAt = createdAt || new Date().toISOString()
    const userData = await prisma.users.create({
      data: {
        id: user?.id ?? undefined,
        email,
        name,
        role :'USER',
        password: hashedPassword,
        createdAt: new Date(userCreatedAt),
      },
    })
    console.log("userData",userData)

    return NextResponse.json(
      { message: 'users created', userData },
      { status: 201 }
    )
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Hello,sss!' });
}