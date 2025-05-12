'use client'

import ComponentCard from '@/components/common/ComponentCard'
import Input from '@/components/form/input/InputField'
import Label from '@/components/form/Label'
import { Button, message } from 'antd'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function AddCity() {
  const router = useRouter()
  const [namaKota, setNamaKota] = useState('')
  const [messageApi, contextHolder] = message.useMessage()
  const handleBack = () => {
    router.back()
  }
  const handleSubmit = async () => {
    if (!namaKota ) {
      messageApi.warning('Semua field wajib diisi.')
      return
    }
    try {
      await axios.post('/api/city', {
        namaKota,
      })
      await messageApi.success('Kota berhasil ditambahkan!')
      router.back()
    } catch (error) {
      console.error(error)
      messageApi.error('Gagal menyimpan data.')
    }
  }

  return (
    <ComponentCard back={handleBack} title="Input Kota/Kabupaten">
      {contextHolder}
      <div className="space-y-6">
        <div>
          <Label>Nama Kota/Kabupaten</Label>
          <Input type="text" defaultValue={namaKota} onChange={(e) => setNamaKota(e.target.value)} />
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
