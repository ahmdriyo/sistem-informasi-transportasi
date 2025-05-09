import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function GET() {
  const schedules = await prisma.schedule.findMany({
    include: {
      rute: {
        include: {
          asalKota: true,
          tujuanKota: true,
        },
      },
      operator: true,
      tipeTransportasi: true,
    },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(schedules)
}

export async function POST(req: Request) {
  const body = await req.json()
  const { jamBerangkat, jamTiba, harga, ruteId, operatorId, tipeTransportasiId } = body

  const newSchedule = await prisma.schedule.create({
    data: {
      jamBerangkat,
      jamTiba,
      harga: parseInt(harga),
      ruteId,
      operatorId,
      tipeTransportasiId,
    },
  })

  return NextResponse.json(newSchedule)
}
