'use client'
import ComponentCard from '@/components/common/ComponentCard'
import Input from '@/components/form/input/InputField'
import Label from '@/components/form/Label'
import Select from '@/components/form/Select'
import { Button, DatePicker, message } from 'antd'
import axios from 'axios'
import type { Dayjs } from 'dayjs'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import './AddSchedule.css'
const dateFormat = 'YYYY-MM-DD HH:mm'
interface RouteType {
  id: string
  deskripsi: string
  asalKota: { namaKota: string }
  tujuanKota: { namaKota: string }
}
interface TransportationType {
  id: string
  nama: string
}
interface TransportOperatorType {
  id: string
  tipe: { nama: string }
  nama: string
}
export default function AddSchedule() {
  const router = useRouter()
  const [jamBerangkat, setJamBerangkat] = useState('')
  const [jamTiba, setJamTiba] = useState('')
  const [harga, setHarga] = useState('')
  const [ruteId, setRuteId] = useState('')
  const [operatorId, setOperatorId] = useState('')
  const [tipeTransportasiId, setTipeTransportasiId] = useState('')

  const [routeOptions, setRouteOptions] = useState([])
  const [operatorOptions, setOperatorOptions] = useState([])
  const [tipeTransportasiOptions, settipeTransportasiOptions] = useState([])
  const [messageApi, contextHolder] = message.useMessage()

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [ruteRes, operatorRes, tipeRes] = await Promise.all([
          axios.get('/api/route'),
          axios.get('/api/transport-operator'),
          axios.get('/api/transportation-type'),
        ])
        setRouteOptions(
          ruteRes.data.map((r: RouteType) => ({
            value: r.id,
            label: `${r.asalKota.namaKota} → ${r.tujuanKota.namaKota}`,
          })),
        )
        settipeTransportasiOptions(
          tipeRes.data.map((r: TransportationType) => ({
            value: r.id,
            label: `${r.nama}`,
          })),
        )
        setOperatorOptions(
          operatorRes.data.map((op: TransportOperatorType) => ({
            value: op.id,
            label: `${op.nama} (${op.tipe.nama})`,
          })),
        )
      } catch (error) {
        console.error(error)
      }
    }
    fetchOptions()
  }, [])

  const handleSubmit = async () => {
    if (!jamBerangkat || !jamTiba || !harga || !ruteId || !operatorId) {
      messageApi.warning('Semua field wajib diisi.')
      return
    }

    try {
      await axios.post('/api/schedule', {
        jamBerangkat,
        jamTiba,
        harga: parseInt(harga),
        ruteId,
        operatorId,
        tipeTransportasiId,
      })

      await messageApi.success('Jadwal berhasil ditambahkan!')
      router.back()
    } catch (error) {
      console.error(error)
      messageApi.error('Gagal menambahkan jadwal.')
    }
  }
  return (
    <ComponentCard title="Tambah Jadwal" back={() => router.back()}>
      {contextHolder}
      <div className="space-y-6">
        <div>
          <Label>Waktu Berangkat</Label>
          <DatePicker
            showTime
            format={dateFormat}
            onChange={(datetime: Dayjs | null) => setJamBerangkat(datetime ? datetime.format(dateFormat) : '')}
            className="w-full h-[44px] custom-timepicker"
            placeholder="select time"
          />
        </div>
        <div>
          <Label>Waktu Tiba</Label>
          <DatePicker
            showTime
            format={dateFormat}
            onChange={(datetime: Dayjs | null) => setJamTiba(datetime ? datetime.format(dateFormat) : '')}
            className="w-full h-[44px] custom-timepicker"
            placeholder="select time"
          />
        </div>
        <div>
          <Label>Harga</Label>
          <Input type="number" onChange={(e) => setHarga(e.target.value)} />
        </div>
        <div>
          <Label>Rute</Label>
          <Select options={routeOptions} onChange={(val) => setRuteId(val)} />
        </div>
        <div>
          <Label>Operator</Label>
          <Select options={operatorOptions} onChange={(val) => setOperatorId(val)} />
        </div>
        <div>
          <Label>Tipe Transportaasi</Label>
          <Select options={tipeTransportasiOptions} onChange={(val) => setTipeTransportasiId(val)} />
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
