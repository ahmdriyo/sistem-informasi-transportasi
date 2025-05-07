import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const operator = await prisma.transportOperator.findUnique({
      where: { id: params.id },
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

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { nama, tipeId } = await req.json()

    if (!nama || !tipeId) {
      return NextResponse.json({ error: 'Field nama dan tipeId wajib diisi' }, { status: 400 })
    }

    const updatedOperator = await prisma.transportOperator.update({
      where: { id: params.id },
      data: {
        nama,
        tipeId,
      },
    })

    return NextResponse.json(updatedOperator)
  } catch (error) {
    console.error('Terjadi error:', error)
    return NextResponse.json({ error: 'Gagal memperbarui data' }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.transportOperator.delete({
      where: { id: params.id },
    })
    return NextResponse.json({ message: 'Data berhasil dihapus' })
  } catch (error) {
    console.error('Terjadi error:', error)
    return NextResponse.json({ error: 'Gagal menghapus data' }, { status: 500 })
  }
}
