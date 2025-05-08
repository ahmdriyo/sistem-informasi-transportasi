'use client'

import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table'
import axios from 'axios'
import { Button, message, Spin, Modal } from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { useRouter, useParams } from 'next/navigation'

interface RouteType {
  id: string
  deskripsi: string
  tipeTransportasiId: string
  asalKota: { namaKota: string }
  tujuanKota: { namaKota: string }
  operator: { nama: string }
  tipeTransportasi: { nama: string }
}

export default function TableSchedule() {
  const [data, setData] = useState<RouteType[]>([])
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
        const ruteRes = await axios.get('/api/route')
        const filteredData = ruteRes.data.filter(
          (dataRute: RouteType) => dataRute.tipeTransportasi?.nama?.replace(/\s+/g, '-') === nama,
        )
        setData(filteredData)
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
      await axios.delete(`/api/route/${deleteId}`)
      setData((prev) => prev.filter((item) => item.id !== deleteId))
      await messageApi.success('Rute berhasil dihapus')
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
        <div className="min-w-[800px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  className="px-5 py-3 font-medium text-start text-theme-xs text-gray-500 dark:text-gray-400"
                  isHeader
                >
                  No
                </TableCell>
                <TableCell
                  className="px-5 py-3 font-medium text-start text-theme-xs text-gray-500 dark:text-gray-400"
                  isHeader
                >
                  Asal Kota
                </TableCell>
                <TableCell
                  className="px-5 py-3 font-medium text-start text-theme-xs text-gray-500 dark:text-gray-400"
                  isHeader
                >
                  Tujuan Kota
                </TableCell>
                <TableCell
                  className="px-5 py-3 font-medium text-start text-theme-xs text-gray-500 dark:text-gray-400"
                  isHeader
                >
                  Operator
                </TableCell>
                <TableCell
                  className="px-5 py-3 font-medium text-start text-theme-xs text-gray-500 dark:text-gray-400"
                  isHeader
                >
                  Deskripsi
                </TableCell>
                <TableCell
                  className="px-5 py-3 font-medium text-center text-theme-xs text-gray-500 dark:text-gray-400"
                  isHeader
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    <Spin />
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="px-5 py-4 text-center text-gray-500 text-theme-sm dark:text-gray-400"
                  >
                    Tidak ada data untuk tipe transportasi ini.
                  </TableCell>
                </TableRow>
              ) : (
                data.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell className="px-5 py-4 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                      {index + 1}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                      {item.asalKota?.namaKota}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                      {item.tujuanKota?.namaKota}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                      {item.operator?.nama}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                      {item.deskripsi}
                    </TableCell>
                    <TableCell className="px-5 py-4 items-center justify-center text-center gap-4 flex">
                      <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => router.push(`/admin/edit-rute/${item.id}`)}
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
        <p>Apakah Anda yakin ingin menghapus rute ini?</p>
        <p>Data yang dihapus tidak dapat dikembalikan.</p>
      </Modal>
    </div>
  )
}
