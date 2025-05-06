'use client'
import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table'
import axios from 'axios'
import { Button, message, Spin, Modal } from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { useRouter } from 'next/navigation'

interface CityType {
  id: string
  namaKota: string
  createdAt: string
}

export default function TableCity() {
  const [data, setData] = useState<CityType[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get('/api/city')
        setData(res.data)
      } catch (error) {
        console.error('Gagal mengambil data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const showDeleteModal = (id: string) => {
    setDeleteId(id)
    setDeleteModalVisible(true)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleteLoading(true)
    try {
      await axios.delete(`/api/city/${deleteId}`)
      setData((prev) => prev.filter((item) => item.id !== deleteId))
      message.success('Data berhasil dihapus')
      setDeleteModalVisible(false)
    } catch (error) {
      console.error('Gagal menghapus data:', error)
      message.error('Gagal menghapus data')
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
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[800px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-start text-theme-xs text-gray-500 dark:text-gray-400"
                >
                  No
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-start text-theme-xs text-gray-500 dark:text-gray-400"
                >
                  Nama Kota/Kabupaten
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-center text-theme-xs text-gray-500 dark:text-gray-400"
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-10">
                    <Spin />
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="px-5 py-4 text-center text-gray-500 text-theme-sm dark:text-gray-400"
                  >
                    Tidak ada data.
                  </TableCell>
                </TableRow>
              ) : (
                data.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell className="px-5 py-4 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                      {index + 1}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                      {item.namaKota}
                    </TableCell>
                    <TableCell className="px-5 py-4 items-center justify-center text-center gap-4 flex">
                      <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => router.push(`/admin/edit-city/${item.id}`)}
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
        <p>Apakah Anda yakin ingin menghapus data ini?</p>
        <p>Data yang dihapus tidak dapat dikembalikan.</p>
      </Modal>
    </div>
  )
}
