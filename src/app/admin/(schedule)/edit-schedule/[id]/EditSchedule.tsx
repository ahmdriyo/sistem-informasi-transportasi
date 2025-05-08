'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import { Button, message, Spin } from 'antd'
import ComponentCard from '@/components/common/ComponentCard'
import Input from '@/components/form/input/InputField'
import Select from '@/components/form/Select'
import Label from '@/components/form/Label'

interface Option {
  label: string
  value: string
}
interface CityType {
  id: string
  namaKota: string
}
interface TransportOperatorType {
  id: string
  nama: string
}
export default function EditSchedule() {
  const { id } = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [messageApi, contextHolder] = message.useMessage()
  const [asalKotaId, setAsalKotaId] = useState('')
  const [tujuanKotaId, setTujuanKotaId] = useState('')
  const [operatorId, setOperatorId] = useState('')
  const [deskripsi, setDeskripsi] = useState('')

  const [kotaOptions, setKotaOptions] = useState<Option[]>([])
  const [operatorOptions, setOperatorOptions] = useState<Option[]>([])

  useEffect(() => {
    async function fetchData() {
      try {
        const [ruteRes, kotaRes, operatorRes] = await Promise.all([
          axios.get(`/api/route/${id}`),
          axios.get('/api/city'),
          axios.get('/api/transport-operator'),
        ])

        const rute = ruteRes.data
        setAsalKotaId(rute.asalKotaId)
        setTujuanKotaId(rute.tujuanKotaId)
        setOperatorId(rute.operatorId)
        setDeskripsi(rute.deskripsi)

        setKotaOptions(
          kotaRes.data.map((k: CityType) => ({
            value: k.id,
            label: k.namaKota,
          }))
        )
        setOperatorOptions(
          operatorRes.data.map((o: TransportOperatorType) => ({
            value: o.id,
            label: o.nama,
          }))
        )

        setLoading(false)
      } catch (error) {
        console.error(error)
      }
    }

    fetchData()
  }, [id])

  const handleUpdate = async () => {
    try {
      await axios.put(`/api/route/${id}`, {
        asalKotaId,
        tujuanKotaId,
        operatorId,
        deskripsi,
      })
      await messageApi.success('Data berhasil diperbarui')
      router.back()
    } catch (error) {
      console.error(error)
      messageApi.error('Gagal memperbarui data')
    }
  }

  return (
    <ComponentCard title="Edit Rute Transportasi" back={() => router.back()}>
      {contextHolder}
      {!loading ? (
        <div className="space-y-6">
          <div>
            <Label>Asal Kota</Label>
            <Select
              defaultValue={asalKotaId}
              options={kotaOptions}
              onChange={(val) => setAsalKotaId(val)}
            />
          </div>
          <div>
            <Label>Tujuan Kota</Label>
            <Select
              defaultValue={tujuanKotaId}
              options={kotaOptions}
              onChange={(val) => setTujuanKotaId(val)}
            />
          </div>
          <div>
            <Label>Operator</Label>
            <Select
              defaultValue={operatorId}
              options={operatorOptions}
              onChange={(val) => setOperatorId(val)}
            />
          </div>
          <div>
            <Label>Deskripsi</Label>
            <Input defaultValue={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} />
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
