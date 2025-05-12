'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import { Button, message, Spin, TimePicker } from 'antd'
import ComponentCard from '@/components/common/ComponentCard'
import Input from '@/components/form/input/InputField'
import Select from '@/components/form/Select'
import Label from '@/components/form/Label'
import dayjs from 'dayjs'
import './EditSchedule.css'
interface Option {
  label: string
  value: string
}
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
  nama: string
   tipe: { nama: string }
}
const timeFormat = 'HH:mm'
export default function EditSchedule() {
  const { id } = useParams()
  const router = useRouter()
  const [messageApi, contextHolder] = message.useMessage()
  const [loading, setLoading] = useState(true)

  const [jamBerangkat, setJamBerangkat] = useState('')
  const [jamTiba, setJamTiba] = useState('')
  const [harga, setHarga] = useState(0)

  const [ruteId, setRuteId] = useState('')
  const [operatorId, setOperatorId] = useState('')
  const [tipeTransportasiId, setTipeTransportasiId] = useState('')

  const [ruteOptions, setRuteOptions] = useState<Option[]>([])
  const [operatorOptions, setOperatorOptions] = useState<Option[]>([])
  const [transportasiOptions, setTransportasiOptions] = useState<Option[]>([])

  useEffect(() => {
    async function fetchData() {
      try {
        const [jadwalRes, ruteRes, operatorRes, transportasiRes] = await Promise.all([
          axios.get(`/api/schedule/${id}`),
          axios.get('/api/route'),
          axios.get('/api/transport-operator'),
          axios.get('/api/transportation-type'),
        ])

        const jadwal = jadwalRes.data
        setJamBerangkat(jadwal.jamBerangkat)
        setJamTiba(jadwal.jamTiba)
        setHarga(jadwal.harga)
        setRuteId(jadwal.ruteId)
        setOperatorId(jadwal.operatorId)
        setTipeTransportasiId(jadwal.tipeTransportasiId)

        setRuteOptions(
          ruteRes.data.map((r: RouteType) => ({
            value: r.id,
            label: `${r.asalKota.namaKota} → ${r.tujuanKota.namaKota}`,
          })),
        )
        setOperatorOptions(
          operatorRes.data.map((op: TransportOperatorType) => ({
            value: op.id,
            label: `${op.nama} (${op.tipe.nama})`,
          })),
        )
        setTransportasiOptions(
          transportasiRes.data.map((t: TransportationType) => ({
            value: t.id,
            label: t.nama,
          })),
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
      await axios.put(`/api/schedule/${id}`, {
        jamBerangkat,
        jamTiba,
        harga,
        ruteId,
        operatorId,
        tipeTransportasiId,
      })
      await messageApi.success('Data jadwal berhasil diperbarui')
      router.back()
    } catch (error) {
      console.error(error)
      messageApi.error('Gagal memperbarui jadwal')
    }
  }

  return (
    <ComponentCard title="Edit Jadwal Transportasi" back={() => router.back()}>
      {contextHolder}
      {!loading ? (
        <div className="space-y-6">
          <div>
            <Label>Jam Berangkat</Label>
            <TimePicker
              format={timeFormat}
              onChange={(time) => setJamBerangkat((time ? time.format(timeFormat) : ''))}
              className="w-full h-[44px] custom-timepicker"
              value={jamBerangkat ? dayjs(jamBerangkat, timeFormat) : null}
            />
          </div>
          <div>
            <Label>Jam Tiba</Label>
            <TimePicker
              format={timeFormat}
              value={jamTiba ? dayjs(jamTiba, timeFormat) : null}
              onChange={(time) => setJamTiba((time ? time.format(timeFormat) : ''))}
              className="w-full h-[44px] custom-timepicker"
            />
          </div>
          <div>
            <Label>Harga</Label>
            <Input type="number" defaultValue={harga} onChange={(e) => setHarga(Number(e.target.value))} />
          </div>
          <div>
            <Label>Rute</Label>
            <Select defaultValue={ruteId} options={ruteOptions} onChange={setRuteId} />
          </div>
          <div>
            <Label>Operator</Label>
            <Select defaultValue={operatorId} options={operatorOptions} onChange={setOperatorId} />
          </div>
          <div>
            <Label>Tipe Transportasi</Label>
            <Select defaultValue={tipeTransportasiId} options={transportasiOptions} onChange={setTipeTransportasiId} />
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
        <div className="flex justify-center items-center">
          <Spin />
        </div>
      )}
    </ComponentCard>
  )
}
