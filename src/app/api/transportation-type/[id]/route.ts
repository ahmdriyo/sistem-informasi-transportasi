import {NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const transportationType = await prisma.transportationType.findUnique({
      where: { id },
    })

    if (!transportationType) {
      return NextResponse.json({ error: 'Data tidak ditemukan' }, { status: 404 })
    }

    return NextResponse.json(transportationType)
  } catch (error) {
    console.error('Gagal ambil data:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json({ error: 'ID transportasi wajib diisi.' }, { status: 400 })
    }

    const deletedTransportationType = await prisma.transportationType.delete({
      where: { id },
    })

    return NextResponse.json(deletedTransportationType)
  } catch (error) {
    console.error('Terjadi error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const { nama, jenis } = await req.json()
    if (!id || !nama || !jenis) {
      return NextResponse.json({ error: 'Semua field wajib diisi.' }, { status: 400 })
    }
    const updatedTransportationType = await prisma.transportationType.update({
      where: { id },
      data: {
        nama,
        jenis,
      },
    })

    return NextResponse.json(updatedTransportationType)
  } catch (error) {
    console.error('Terjadi error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan' }, { status: 500 })
  }
}
