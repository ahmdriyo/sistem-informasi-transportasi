import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id
  const schedule = await prisma.schedule.findUnique({
    where: { id },
    include: {
      rute: true,
      operator: true,
    },
  })

  return NextResponse.json(schedule)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id
  const body = await req.json()
  const { jamBerangkat, jamTiba, harga, ruteId, operatorId, tipeTransportasiId } = body
  const updatedSchedule = await prisma.schedule.update({
    where: { id },
    data: {
      jamBerangkat,
      jamTiba,
      harga,
      ruteId,
      operatorId,
      tipeTransportasiId,
    },
  })

  return NextResponse.json(updatedSchedule)
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id
  await prisma.schedule.delete({
    where: { id },
  })
  return NextResponse.json({ message: 'Jadwal berhasil dihapus' })
}
