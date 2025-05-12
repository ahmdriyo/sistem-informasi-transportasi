'use client'
import React, { useEffect, useState } from 'react'
import ComponentCard from '@/components/common/ComponentCard'
import { useRouter } from 'next/navigation'
import TableTransportOperator from './TableTransportOperator'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import axios from 'axios'
import { format } from 'date-fns'

interface TransportOperatorType {
  id: string
  nama: string
  tipe: {
    nama: string
  }
  createdAt: string
}

const TransportOperatorPage = () => {
  const router = useRouter()
  const [data, setData] = useState<TransportOperatorType[]>([])

  const handleCreate = () => {
    router.push('/admin/add-transport-operator')
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get('/api/transport-operator')
        setData(res.data)
      } catch (error) {
        console.error('Gagal mengambil data operator:', error)
      }
    }
    fetchData()
  }, [])

  const handlePrintPDF = () => {
    const doc = new jsPDF()
    doc.text('Laporan Data Operator Transportasi', 14, 15)
    const dateNow = new Date().toLocaleDateString('id-ID')
    doc.text(`Tanggal: ${dateNow}`, 14, 22)
    autoTable(doc, {
      startY: 30,
      head: [['No', 'Nama Operator', 'Tipe Transportasi', 'Tanggal']],
      body: data.map((item, index) => [
        index + 1,
        item.nama,
        item.tipe.nama,
        format(new Date(item.createdAt), 'dd MMM yyyy'),
      ]),
    })
    doc.save('laporan_operator_transportasi.pdf')
  }

  return (
    <ComponentCard title="Operator Transportasi" create={handleCreate} report={handlePrintPDF}>
      <TableTransportOperator />
    </ComponentCard>
  )
}

export default TransportOperatorPage
