import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function GET() {
  try {
    const transportationTypes = await prisma.transportationType.findMany()
    return NextResponse.json(transportationTypes)
  } catch (error) {
    console.error('Terjadi error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { nama, jenis } = body
    if (!nama || !jenis) {
      return NextResponse.json({ error: 'Nama transportasi wajib diisi.' }, { status: 400 })
    }
    const newTransportationType = await prisma.transportationType.create({
      data: {
        nama,
        jenis,
      },
    })

    return NextResponse.json(newTransportationType, { status: 201 })
  } catch (error) {
    console.error('Terjadi error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan' }, { status: 500 })
  }
}


