'use client'

import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table'
import axios from 'axios'
import { Button, message, Spin, Modal } from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { useRouter, useParams } from 'next/navigation'

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

export default function TableSchedule() {
  const [data, setData] = useState<ScheduleType[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const router = useRouter()
  const params = useParams()
  const nama = params?.nama as string
  const [messageApi, contextHolder] = message.useMessage()

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

  const showDeleteModal = (id: string) => {
    setDeleteId(id)
    setDeleteModalVisible(true)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleteLoading(true)
    try {
      await axios.delete(`/api/schedule/${deleteId}`)
      setData((prev) => prev.filter((item) => item.id !== deleteId))
      await messageApi.success('Jadwal berhasil dihapus')
      setDeleteModalVisible(false)
    } catch (error) {
      console.error('Gagal menghapus data:', error)
      messageApi.error('Gagal menghapus data')
    } finally {
      setDeleteLoading(false)
      setDeleteId(null)
    }
  }

  const handleCancelDelete = () => {
    setDeleteModalVisible(false)
    setDeleteId(null)
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      {contextHolder}
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1000px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {['No', 'Rute', 'Waktu Berangkat', 'Waktu Tiba', 'Harga', 'Operator', 'Action'].map((text) => (
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
                    <TableCell className="px-5 py-4  text-start gap-4 flex">
                      <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => router.push(`/admin/edit-schedule/${item.id}`)}
                      />
                      <Button
                        type="primary"
                        icon={<DeleteOutlined />}
                        danger
                        onClick={() => showDeleteModal(item.id)}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Modal
        title="Konfirmasi Hapus"
        open={deleteModalVisible}
        onOk={handleDelete}
        onCancel={handleCancelDelete}
        confirmLoading={deleteLoading}
        okText="Hapus"
        cancelText="Batal"
        centered
        okButtonProps={{ danger: true }}
      >
        <p>Apakah kamu yakin ingin menghapus jadwal ini?</p>
        <p>Data yang dihapus tidak dapat dikembalikan.</p>
      </Modal>
    </div>
  )
}
