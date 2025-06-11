'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { ChevronDownIcon } from '@/icons'
import ComponentCard from '@/components/common/ComponentCard'
import Label from '@/components/form/Label'
import Input from '@/components/form/input/InputField'
import Select from '@/components/form/Select'
import { Button, message, Spin } from 'antd'
import MapsSelector from './MapsSelector'

interface TransportationType {
  id: string
  nama: string
  jenis: string
}

export default function AddTransportOperator() {
  const router = useRouter()
  const [nama, setNama] = useState('')
  const [tipeId, setTipeId] = useState('')
  const [koordinat, setKoordinat] = useState('')
  const [transportTypes, setTransportTypes] = useState<TransportationType[]>([])
  const [loading, setLoading] = useState(true)
  const [messageApi, contextHolder] = message.useMessage()

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get('/api/transportation-type')
        setTransportTypes(res.data)
      } catch (error) {
        console.error(error)
        message.error('Gagal mengambil data tipe transportasi.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleBack = () => {
    router.back()
  }

  const handleSubmit = async () => {
    if (!nama || !tipeId || !koordinat) {
      messageApi.warning('Semua field wajib diisi.')
      return
    }

    try {
      await axios.post('/api/transport-operator', {
        nama,
        koordinat,
        tipeId,
      })
      await messageApi.success('Operator transportasi berhasil ditambahkan!')
      router.back()
    } catch (error) {
      console.error(error)
      messageApi.error('Gagal menyimpan data.')
    }
  }

  const handleSelectLocation = ({ lat, lng }: { lat: number; lng: number }) => {
    const koordinat = `${lat.toFixed(6)}, ${lng.toFixed(6)}`
    setKoordinat(koordinat)
  }

  return (
    <ComponentCard back={handleBack} title="Input Operator Transportasi">
      {contextHolder}
      <div className="space-y-6">
        <MapsSelector onSelectLocation={handleSelectLocation} />
        <div>
          <Label>Lokasi Operator Transportasi</Label>
          <Input type="text" defaultValue={koordinat} onChange={(e) => setKoordinat(e.target.value)} disabled />
        </div>
        <div>
          <Label>Nama Operator Transportasi</Label>
          <Input type="text" defaultValue={nama} onChange={(e) => setNama(e.target.value)} />
        </div>
        <div>
          <Label>Tipe Transportasi</Label>
          <div className="relative">
            {loading ? (
              <Spin />
            ) : (
              <Select
                options={transportTypes.map((item) => ({
                  value: item.id,
                  label: item.nama,
                }))}
                placeholder="Pilih tipe transportasi"
                onChange={(value: string) => setTipeId(value)}
                className="dark:bg-dark-900"
              />
            )}
            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
              <ChevronDownIcon />
            </span>
          </div>
        </div>
      </div>
      <div className="flex gap-4 mt-6">
        <Button color="red" type="primary" onClick={handleBack} danger>
          Batal
        </Button>
        <Button type="primary" onClick={handleSubmit}>
          Simpan
        </Button>
      </div>
    </ComponentCard>
  )
}
