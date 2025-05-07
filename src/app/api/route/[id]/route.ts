import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const route = await prisma.route.findUnique({
      where: { id: params.id },
      include: {
        asalKota: true,
        tujuanKota: true,
        tipeTransportasi: true,
        operator: true,
        schedules: true,
      },
    })
    if (!route) {
      return NextResponse.json({ error: 'Rute tidak ditemukan' }, { status: 404 })
    }
    return NextResponse.json(route)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Gagal mengambil data rute' }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const {
      asalKotaId,
      tujuanKotaId,
      tipeTransportasiId,
      operatorId,
      deskripsi,
    } = await req.json()
    const updatedRoute = await prisma.route.update({
      where: { id: params.id },
      data: {
        asalKotaId,
        tujuanKotaId,
        tipeTransportasiId,
        operatorId,
        deskripsi,
      },
    })
    return NextResponse.json(updatedRoute)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Gagal memperbarui rute' }, { status: 500 })
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.route.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Rute berhasil dihapus' })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Gagal menghapus rute' }, { status: 500 })
  }
}
