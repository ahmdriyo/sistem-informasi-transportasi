'use client'
import React, { useEffect, useState } from 'react'
import ComponentCard from '@/components/common/ComponentCard'
import { useParams, useRouter } from 'next/navigation'
import TableSchedule from './TableSchedule'
import axios from 'axios'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
interface ScheduleType {
  id: string
  jamBerangkat: string
  jamTiba: string
  harga: number
  rute: {
    asalKota: { namaKota: string }
    tujuanKota: { namaKota: string }
  }
  operator: {
    nama: string
  }
  tipeTransportasi: {
    nama: string
  }
}

const SchedulePage = () => {
  const router = useRouter()
  const params = useParams()
  const nama = params?.nama as string
  const handleCreate = () => {
    router.push('/admin/add-schedule')
  }
  const [data, setData] = useState<ScheduleType[]>([])
  useEffect(() => {
    async function fetchData() {
      try {
        const scheduleRes = await axios.get('/api/schedule')
        const filteredData = scheduleRes.data.filter(
          (dataRute: ScheduleType) => dataRute.tipeTransportasi?.nama?.replace(/\s+/g, '-') === nama,
        )
        setData(filteredData)
      } catch (error) {
        console.error('Gagal mengambil data:', error)
      }
    }
    fetchData()
  }, [nama])
  const handlePrintPDF = () => {
    const doc = new jsPDF()
    doc.text('Laporan Data Rute Transportasi', 14, 15)
    const dateNow = new Date().toLocaleDateString('id-ID')
    doc.text(`Tanggal: ${dateNow}`, 14, 22)

    autoTable(doc, {
      startY: 30,
      head: [['No', 'Rute', 'Jam Berangkat', 'Jam Tiba', 'Harga', 'Operator']],
      body: data.map((item, index) => [
        index + 1,
        `${item.rute?.asalKota?.namaKota}-${item.rute?.tujuanKota.namaKota}`,
        item.jamBerangkat,
        item.jamTiba,
        item.harga,
        item.operator.nama,
      ]),
      columnStyles: {
        1: { cellWidth: 50 }, 
      },
    })
    doc.save(`laporan_rute_transportasi_${nama}.pdf`)
  }
  return (
    <ComponentCard title="Daftar Jadwal" report={() => handlePrintPDF()} create={() => handleCreate()}>
      <TableSchedule />
    </ComponentCard>
  )
}

export default SchedulePage
