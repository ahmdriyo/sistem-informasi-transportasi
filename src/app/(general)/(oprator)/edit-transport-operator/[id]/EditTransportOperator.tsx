'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import { Button, message, Spin } from 'antd'
import ComponentCard from '@/components/common/ComponentCard'
import Input from '@/components/form/input/InputField'
import Select from '@/components/form/Select'
import Label from '@/components/form/Label'
interface TransportationType {
  id: string
  nama: string
}
export default function EditTransportOperator() {
  const { id } = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [messageApi, contextHolder] = message.useMessage()

  const [nama, setNama] = useState('')
  const [tipeId, setTipeId] = useState('')
  const [tipeOptions, setTipeOptions] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const operatorRes = await axios.get(`/api/transport-operator/${id}`)
        const { nama, tipeId } = operatorRes.data
        setNama(nama)
        setTipeId(tipeId)
        const tipeRes = await axios.get('/api/transportation-type')
        const options = tipeRes.data.map((item: TransportationType) => ({
          value: item.id,         
          label: item.nama,       
        }))
        setTipeOptions(options)
        setLoading(false)
      } catch (error) {
        console.error(error)
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  const handleUpdate = async () => {
    try {
      await axios.put(`/api/transport-operator/${id}`, {
        nama,
        tipeId: tipeId,
      })
      await messageApi.success('Data berhasil diperbarui')
      router.push('/admin/transport-operator')
    } catch {
      messageApi.error('Gagal memperbarui data')
    }
  }

  return (
    <ComponentCard title="Edit Transport Operator" back={() => router.back()}>
      {contextHolder}
      {!loading ? (
        <div className="space-y-6">
          <div>
            <Label>Nama Transportasi</Label>
            <Input defaultValue={nama} onChange={(e) => setNama(e.target.value)} />
          </div>
          <div>
            <Label>Tipe Transportasi</Label>
            <Select
              defaultValue={tipeId}
              options={tipeOptions}
              onChange={(value) => setTipeId(value)}
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
