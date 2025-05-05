import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const GET = async (req: NextRequest) => {
  try {
    const token = req.headers.get('Authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Token tidak ditemukan' }, { status: 401 })
    }
    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (error || !user) {
      return NextResponse.json({ error: 'Token tidak valid' }, { status: 401 })
    }
    const userData = await prisma.users.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    })
    if (!userData) {
      return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 })
    }
    return NextResponse.json({ user: userData }, { status: 200 })
  } catch {
    return NextResponse.json({ error: 'Terjadi kesalahan' }, { status: 500 })
  }
}
