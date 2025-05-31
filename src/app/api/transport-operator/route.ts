import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function GET() {
  try {
    const operators = await prisma.transportOperator.findMany({
      include: {
        tipe: true,
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(operators)
  } catch (error) {
    console.error('Terjadi error:', error)
    return NextResponse.json({ error: 'Gagal mengambil data' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { nama, tipeId, koordinat } = await req.json()

    if (!nama || !tipeId || !koordinat) {
      return NextResponse.json({ error: 'Field nama, koordinat dan tipeId wajib diisi' }, { status: 400 })
    }

    const newOperator = await prisma.transportOperator.create({
      data: {
        nama,
        koordinat,
        tipeId,
      },
    })

    return NextResponse.json(newOperator)
  } catch (error) {
    console.error('Terjadi error:', error)
    return NextResponse.json({ error: 'Gagal menyimpan data' }, { status: 500 })
  }
}
