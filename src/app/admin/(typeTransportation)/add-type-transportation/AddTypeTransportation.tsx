'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { ChevronDownIcon } from '@/icons'
import ComponentCard from '@/components/common/ComponentCard'
import Label from '@/components/form/Label'
import Input from '@/components/form/input/InputField'
import Select from '@/components/form/Select'
import { Button, message } from 'antd'

export default function AddTypeTransportation() {
  const router = useRouter()
  const [nama, setNama] = useState('')
  const [jenis, setJenis] = useState('')
  const [messageApi, contextHolder] = message.useMessage()
  const options = [
    { value: 'DARAT', label: 'DARAT' },
    { value: 'LAUT', label: 'LAUT' },
    { value: 'UDARA', label: 'UDARA' },
  ]

  const handleBack = () => {
    router.back()
  }

  const handleSubmit = async () => {
    if (!nama || !jenis) {
      messageApi.warning('Semua field wajib diisi.')
      return
    }

    try {
      await axios.post('/api/transportation-type', {
        nama,
        jenis,
      })
      await messageApi.success('Tipe transportasi berhasil ditambahkan!')
      router.back()
    } catch (error) {
      console.error(error)
      messageApi.error('Gagal menyimpan data.')
    }
  }

  return (
    <ComponentCard back={handleBack} title="Input Type Transportasi">
      {contextHolder}
      <div className="space-y-6">
        <div>
          <Label>Nama Transportasi</Label>
          <Input type="text" defaultValue={nama} onChange={(e) => setNama(e.target.value)} />
        </div>
        <div>
          <Label>Jenis Transportasi</Label>
          <div className="relative">
            <Select
              options={options}
              placeholder="Pilih"
              onChange={(value: string) => setJenis(value)}
              className="dark:bg-dark-900"
            />
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
