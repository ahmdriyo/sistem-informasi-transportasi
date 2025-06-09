'use client'

import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table'
import { Flex, Spin } from 'antd'
import axios from 'axios'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { IoLocation } from 'react-icons/io5'

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
    koordinat: string
  }
  tipeTransportasi: {
    nama: string
  }
}

export default function TableSchedule() {
  const [data, setData] = useState<ScheduleType[]>([])
  const [loading, setLoading] = useState(true)
  const params = useParams()
  const nama = params?.nama as string

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get('/api/schedule')
        const filtered = res.data.filter(
          (item: ScheduleType) => item.tipeTransportasi?.nama?.replace(/\s+/g, '-') === nama,
        )
        setData(filtered)
      } catch (error) {
        console.error('Gagal mengambil data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [nama])
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1000px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {['No', 'Rute', 'Waktu Berangkat', 'Waktu Tiba', 'Harga', 'Operator', 'Cek Lokasi'].map((text) => (
                  <TableCell
                    key={text}
                    className="px-5 py-3 font-medium text-start text-theme-xs text-gray-500 dark:text-gray-400"
                    isHeader
                  >
                    {text}
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10">
                    <Spin />
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10 text-gray-500 dark:text-gray-400">
                    Tidak ada jadwal untuk tipe transportasi ini.
                  </TableCell>
                </TableRow>
              ) : (
                data.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell className="px-5 py-4 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                      {index + 1}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start text-gray-500 text-theme-sm dark:text-gray-400">{`${item.rute?.asalKota?.namaKota} → ${item.rute?.tujuanKota.namaKota} `}</TableCell>
                    <TableCell className="px-5 py-4 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                      {item.jamBerangkat}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                      {item.jamTiba}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                      Rp{item.harga.toLocaleString('id-ID')}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                      {item.operator?.nama}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                      <Flex
                        className="cursor-pointer"
                        onClick={() => {
                          const url = `https://www.google.com/maps?q=${item.operator?.koordinat}`
                          window.open(url, '_blank')
                        }}
                      >
                        <IoLocation size={20} className="ml-4" />
                      </Flex>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
