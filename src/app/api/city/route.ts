import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function GET() {
  try {
    const cities = await prisma.city.findMany()
    return NextResponse.json(cities)
  } catch (error) {
    console.error('GET City Error:', error)
    return NextResponse.json({ error: 'Gagal mengambil data kota' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { namaKota } = await req.json()
    if (!namaKota) {
      return NextResponse.json({ error: 'Nama kota wajib diisi' }, { status: 400 })
    }
    const createdCity = await prisma.city.create({
      data: {
        namaKota,
      },
    })

    return NextResponse.json(createdCity)
  } catch (error) {
    console.error('POST City Error:', error)
    return NextResponse.json({ error: 'Gagal menambahkan kota' }, { status: 500 })
  }
}
