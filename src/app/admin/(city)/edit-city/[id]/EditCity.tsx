'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import { Button, message, Spin } from 'antd'
import ComponentCard from '@/components/common/ComponentCard'
import Input from '@/components/form/input/InputField'
import Label from '@/components/form/Label'

export default function EditCity() {
  const { id } = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [messageApi, contextHolder] = message.useMessage()
  const [namaKota, setNamaKota] = useState('')
  useEffect(() => {
    axios.get(`/api/city/${id}`).then((res) => {
      const { namaKota } = res.data
      setNamaKota(namaKota)
      setLoading(false)
    })
  }, [id])

  const handleUpdate = async () => {
    try {
      await axios.put(`/api/city/${id}`, {
        namaKota,
      })
      await messageApi.success('Data berhasil diperbarui')
      router.push('/admin/city')
    } catch {
      messageApi.error('Gagal memperbarui data')
    }
  }

  return (
    <ComponentCard title="Edit Tipe Transportasi" back={() => router.back()}>
      {contextHolder}
      {!loading ? (
        <div className="space-y-6">
          <div>
            <Label>Nama Kota/Kabupaten</Label>
            <Input
              defaultValue={namaKota}
              onChange={(e) => setNamaKota(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <Button danger onClick={() => router.back()}>
              Batal
            </Button>
            <Button type="primary" onClick={handleUpdate}>
              Simpan
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <Spin />
        </div>
      )}
    </ComponentCard>
  )
}
