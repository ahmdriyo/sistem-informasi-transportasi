import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id
    const city = await prisma.city.findUnique({
      where: { id },
    })
    if (!city) {
      return NextResponse.json({ error: 'Kota tidak ditemukan' }, { status: 404 })
    }
    return NextResponse.json(city)
  } catch (error) {
    console.error('GET by ID City Error:', error)
    return NextResponse.json({ error: 'Gagal mengambil kota' }, { status: 500 })
  }
}
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id
    const { namaKota } = await req.json()
    if (!namaKota) {
      return NextResponse.json({ error: 'Nama kota wajib diisi' }, { status: 400 })
    }
    const updatedCity = await prisma.city.update({
      where: { id },
      data: { namaKota },
    })
    return NextResponse.json(updatedCity)
  } catch (error) {
    console.error('PUT City Error:', error)
    return NextResponse.json({ error: 'Gagal memperbarui kota' }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id
    const deletedCity = await prisma.city.delete({
      where: { id },
    })
    return NextResponse.json(deletedCity)
  } catch (error) {
    console.error('DELETE City Error:', error)
    return NextResponse.json({ error: 'Gagal menghapus kota' }, { status: 500 })
  }
}
