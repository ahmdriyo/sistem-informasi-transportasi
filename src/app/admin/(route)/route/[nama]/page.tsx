'use client'
import ComponentCard from '@/components/common/ComponentCard'
import axios from 'axios'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import TableRoute from './TableRoute'
interface RouteType {
  id: string
  deskripsi: string
  tipeTransportasiId: string
  asalKota: { namaKota: string }
  tujuanKota: { namaKota: string }
  operator: { nama: string }
  tipeTransportasi: { nama: string }
}

const RoutePage = () => {
  const router = useRouter()
  const params = useParams()
  const nama = params?.nama as string
  const handleCreate = () => {
    router.push('/admin/add-route')
  }
  const [data, setData] = useState<RouteType[]>([])
  useEffect(() => {
    async function fetchData() {
      try {
        const ruteRes = await axios.get('/api/route')
        const filteredData = ruteRes.data.filter(
          (dataRute: RouteType) => dataRute.tipeTransportasi?.nama?.replace(/\s+/g, '-') === nama,
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
      head: [['No', 'Asal Kota', 'Tujuan Kota', 'Operator', 'Deskripsi']],
      body: data.map((item, index) => [
        index + 1,
        item.asalKota.namaKota,
        item.tujuanKota.namaKota,
        item.operator.nama,
        item.deskripsi,
      ]),
    })
    doc.save(`laporan_rute_transportasi_${nama}.pdf`)
  }
  return (
    <ComponentCard title="Daftar Rute Transportasi" report={() => handlePrintPDF()} create={() => handleCreate()}>
      <TableRoute />
    </ComponentCard>
  )
}

export default RoutePage
