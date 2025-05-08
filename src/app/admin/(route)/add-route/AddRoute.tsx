'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, message } from 'antd'
import axios from 'axios'
import ComponentCard from '@/components/common/ComponentCard'
import Input from '@/components/form/input/InputField'
import Label from '@/components/form/Label'
import Select from '@/components/form/Select'
interface CityType {
  id: string
  namaKota: string
}
interface TransportationType {
  id: string
  nama: string
}
interface TransportOperatorType {
  id: string
  nama: string
}
export default function AddRoute() {
  const router = useRouter()
  const [asalKotaId, setAsalKotaId] = useState('')
  const [tujuanKotaId, setTujuanKotaId] = useState('')
  const [tipeTransportasiId, setTipeTransportasiId] = useState('')
  const [operatorId, setOperatorId] = useState('')
  const [deskripsi, setDeskripsi] = useState('')
  const [messageApi, contextHolder] = message.useMessage()
  const [cityOptions, setCityOptions] = useState([])
  const [transportTypeOptions, setTransportTypeOptions] = useState([])
  const [operatorOptions, setOperatorOptions] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cities, transportTypes, operators] = await Promise.all([
          axios.get('/api/city'),
          axios.get('/api/transportation-type'),
          axios.get('/api/transport-operator'),
        ])

        setCityOptions(
          cities.data.map((city: CityType) => ({ value: city.id, label: city.namaKota }))
        )
        setTransportTypeOptions(
          transportTypes.data.map((type: TransportationType) => ({
            value: type.id,
            label: type.nama,
          }))
        )
        setOperatorOptions(
          operators.data.map((op: TransportOperatorType) => ({
            value: op.id,
            label: op.nama,
          }))
        )
      } catch {
        console.error('Gagal mengambil data dropdown.')
      }
    }
    fetchData()
  }, [])

  const handleSubmit = async () => {
    if (!asalKotaId || !tujuanKotaId || !tipeTransportasiId || !operatorId) {
      messageApi.warning('Semua field wajib diisi.')
      return
    }
    try {
      await axios.post('/api/route', {
        asalKotaId,
        tujuanKotaId,
        tipeTransportasiId,
        operatorId,
        deskripsi,
      })
      await messageApi.success('Rute berhasil ditambahkan!')
      router.back()
    } catch (error) {
      console.error(error)
      messageApi.error('Gagal menyimpan data.')
    }
  }

  return (
    <ComponentCard title="Input Rute" back={() => router.back()}>
      {contextHolder}
      <div className="space-y-6">
        <div>
          <Label>Asal Kota</Label>
          <Select options={cityOptions} onChange={(val) => setAsalKotaId(val)} />
        </div>
        <div>
          <Label>Tujuan Kota</Label>
          <Select options={cityOptions} onChange={(val) => setTujuanKotaId(val)} />
        </div>
        <div>
          <Label>Tipe Transportasi</Label>
          <Select options={transportTypeOptions} onChange={(val) => setTipeTransportasiId(val)} />
        </div>
        <div>
          <Label>Operator</Label>
          <Select options={operatorOptions} onChange={(val) => setOperatorId(val)} />
        </div>
        <div>
          <Label>Deskripsi</Label>
          <Input defaultValue={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} />
        </div>
        <div className="flex gap-4 mt-6">
          <Button danger onClick={() => router.back()}>
            Batal
          </Button>
          <Button type="primary" onClick={handleSubmit}>
            Simpan
          </Button>
        </div>
      </div>
    </ComponentCard>
  )
}
