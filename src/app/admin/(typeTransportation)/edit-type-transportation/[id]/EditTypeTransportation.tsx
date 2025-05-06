'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import { Button, message, Spin } from 'antd'
import ComponentCard from '@/components/common/ComponentCard'
import Input from '@/components/form/input/InputField'
import Select from '@/components/form/Select'
import DatePicker from '@/components/form/date-picker'
import Label from '@/components/form/Label'

export default function EditTypeTransportasi() {
  const { id } = useParams()
  const router = useRouter()
  const [formData, setFormData] = useState({ nama: '', jenis: '', createdAt: new Date() })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(`/api/transportation-type/${id}`).then((res) => {
      const { nama, jenis, createdAt } = res.data
      setFormData({ nama, jenis, createdAt: new Date(createdAt) })
      setLoading(false)
    })
  }, [id])

  const handleUpdate = async () => {
    try {
      await axios.put(`/api/transportation-type/${id}`, formData)
      message.success('Data berhasil diperbarui')
      router.push('/admin/type-transportasi')
    } catch {
      message.error('Gagal memperbarui data')
    }
  }

  return (
    <ComponentCard title="Edit Tipe Transportasi" back={() => router.back()}>
      {!loading ? (
        <div className="space-y-6">
          <div>
            <Label>Nama Transportasi</Label>
            <Input
              defaultValue={formData.nama}
              onChange={(e) => setFormData((prev) => ({ ...prev, nama: e.target.value }))}
            />
          </div>
          <div>
            <Label>Jenis Transportasi</Label>
            <Select
              defaultValue={formData.jenis}
              options={[
                { value: 'DARAT', label: 'DARAT' },
                { value: 'LAUT', label: 'LAUT' },
                { value: 'UDARA', label: 'UDARA' },
              ]}
              onChange={(value) => setFormData((prev) => ({ ...prev, jenis: value }))}
            />
          </div>
          <div>
            <Label>Created At</Label>
            <DatePicker
              id="edit-created-at"
              defaultDate={formData.createdAt}
              onChange={(date) => {
                if (Array.isArray(date)) return
                setFormData((prev) => ({ ...prev, createdAt: date }))
              }}
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
