import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id
    const operator = await prisma.transportOperator.findUnique({
      where: { id },
      include: { tipe: true },
    })

    if (!operator) {
      return NextResponse.json({ error: 'Data tidak ditemukan' }, { status: 404 })
    }

    return NextResponse.json(operator)
  } catch (error) {
    console.error('Terjadi error:', error)
    return NextResponse.json({ error: 'Gagal mengambil data' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id
    const { nama, tipeId ,koordinat} = await req.json()

    if (!nama || !tipeId || !koordinat) {
      return NextResponse.json({ error: 'Field nama, koordinat dan tipeId wajib diisi' }, { status: 400 })
    }

    const updatedOperator = await prisma.transportOperator.update({
      where: { id },
      data: {
        nama,
        koordinat,
        tipeId,
      },
    })

    return NextResponse.json(updatedOperator)
  } catch (error) {
    console.error('Terjadi error:', error)
    return NextResponse.json({ error: 'Gagal memperbarui data' }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id
    await prisma.transportOperator.delete({
      where: { id },
    })
    return NextResponse.json({ message: 'Data berhasil dihapus' })
  } catch (error) {
    console.error('Terjadi error:', error)
    return NextResponse.json({ error: 'Gagal menghapus data' }, { status: 500 })
  }
}
