import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getIdUser } from '@/app/auth/action'

const prisma = new PrismaClient()

export const GET = async (req: NextRequest) => {
  try {
    const token = req.headers.get('Authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Token tidak ditemukan' }, { status: 401 })
    }
    const userId = await getIdUser()
    if (!userId) {
      return NextResponse.json({ error: 'Token tidak valid atau user tidak ditemukan' }, { status: 401 })
    }
    const userData = await prisma.users.findUnique({
      where: { id: userId },
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
  } catch (error) {
    console.error('Terjadi error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan' }, { status: 500 })
  }
}
