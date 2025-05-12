'use client'
import React, { useEffect, useState } from 'react'
import ComponentCard from '@/components/common/ComponentCard'
import { useRouter } from 'next/navigation'
import TableCity from '../city/TableCity'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import axios from 'axios'
import { format } from 'date-fns'
interface CityType {
  id: string
  namaKota: string
  createdAt: string
}
const CityPage = () => {
  const router = useRouter()
  const handleCreate = () => {
    router.push('/admin/add-city')
  }
  const [data, setData] = useState<CityType[]>([])
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get('/api/city')
        setData(res.data)
      } catch (error) {
        console.error('Gagal mengambil data:', error)
      }
    }
    fetchData()
  }, [])
  const handlePrintPDF = () => {
    const doc = new jsPDF()
    doc.text('Laporan Data Kota/Kabupaten', 14, 15)
    const dateNow = new Date().toLocaleDateString('id-ID')
    doc.text(`Tanggal: ${dateNow}`, 14, 22)
    autoTable(doc, {
      startY: 25,
      head: [['No', 'Nama Kota/Kabupaten', 'Tanggal']],
      body: data.map((item, index) => [index + 1, item.namaKota, format(new Date(item.createdAt), 'dd MMM yyyy')]),
    })
    doc.save('laporan_kota.pdf')
  }
  return (
    <ComponentCard title="Kota/Kabupaten" report={() => handlePrintPDF()} create={() => handleCreate()}>
      <TableCity />
    </ComponentCard>
  )
}

export default CityPage
