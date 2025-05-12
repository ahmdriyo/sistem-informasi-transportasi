'use client'
import React, { useEffect, useState } from 'react'
import TableTypeTransportasi from './TableTypeTransportation'
import ComponentCard from '@/components/common/ComponentCard'
import { useRouter } from 'next/navigation'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import axios from 'axios'
import { format } from 'date-fns'

interface TransportationType {
  id: string
  nama: string
  jenis: string
  createdAt: string
}

const TypeTransportationPage = () => {
  const router = useRouter()
  const [data, setData] = useState<TransportationType[]>([])

  const handleCreate = () => {
    router.push('/admin/add-type-transportation')
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get('/api/transportation-type')
        setData(res.data)
      } catch (error) {
        console.error('Gagal mengambil data tipe transportasi:', error)
      }
    }
    fetchData()
  }, [])

  const handlePrintPDF = () => {
    const doc = new jsPDF()
    doc.text('Laporan Data Tipe Transportasi', 14, 15)
    const dateNow = new Date().toLocaleDateString('id-ID')
    doc.text(`Tanggal: ${dateNow}`, 14, 22)
    autoTable(doc, {
      startY: 30,
      head: [['No', 'Nama Tipe Transportasi', 'Jenis Transportasi', 'Tanggal']],
      body: data.map((item, index) => [
        index + 1,
        item.nama,
        item.jenis,
        format(new Date(item.createdAt), 'dd MMM yyyy'),
      ]),
    })

    doc.save('laporan_tipe_transportasi.pdf')
  }

  return (
    <ComponentCard title="Tipe Transportasi" create={handleCreate} report={handlePrintPDF}>
      <TableTypeTransportasi />
    </ComponentCard>
  )
}

export default TypeTransportationPage
