import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function GET() {
  try {
    const routes = await prisma.route.findMany({
      include: {
        asalKota: true,
        tujuanKota: true,
        tipeTransportasi: true,
        operator: true,
        schedules: true,
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(routes)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Gagal mengambil data rute' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const {
      asalKotaId,
      tujuanKotaId,
      tipeTransportasiId,
      operatorId,
      deskripsi,
    } = await req.json()

    const newRoute = await prisma.route.create({
      data: {
        asalKotaId,
        tujuanKotaId,
        tipeTransportasiId,
        operatorId,
        deskripsi,
      },
    })

    return NextResponse.json(newRoute)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Gagal membuat rute baru' }, { status: 500 })
  }
}
