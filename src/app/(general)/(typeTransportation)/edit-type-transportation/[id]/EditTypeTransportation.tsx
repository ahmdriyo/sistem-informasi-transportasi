'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import { Button, message, Spin } from 'antd'
import ComponentCard from '@/components/common/ComponentCard'
import Input from '@/components/form/input/InputField'
import Select from '@/components/form/Select'
import Label from '@/components/form/Label'
export default function EditTypeTransportasi() {
  const { id } = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [messageApi, contextHolder] = message.useMessage()
  
  const [nama, setNama] = useState('')
  const [jenis, setJenis] = useState('')
  useEffect(() => {
    axios.get(`/api/transportation-type/${id}`).then((res) => {
      const { nama, jenis } = res.data
      setNama(nama)
      setJenis(jenis)
      setLoading(false)
    })
  }, [id])

  const handleUpdate = async () => {
    try {
      await axios.put(`/api/transportation-type/${id}`, {
        nama,
        jenis,
      })
      await messageApi.success('Data berhasil diperbarui')
      router.push('/admin/type-transportation')
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
            <Label>Nama Transportasi</Label>
            <Input defaultValue={nama} onChange={(e) => setNama(e.target.value)} />
          </div>
          <div>
            <Label>Jenis Transportasi</Label>
            <Select
              defaultValue={jenis}
              options={[
                { value: 'DARAT', label: 'DARAT' },
                { value: 'LAUT', label: 'LAUT' },
                { value: 'UDARA', label: 'UDARA' },
              ]}
              onChange={(value) => setJenis(value)}
            />
          </div>
          <div className="flex gap-4">
            <Button danger onClick={() => router.back()}>
              Batal
            </Button>
            <Button type="primary" onClick={() => handleUpdate()}>
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
