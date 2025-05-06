'use client'
import React from 'react'
import ComponentCard from '@/components/common/ComponentCard'
import { useRouter } from 'next/navigation'
import TableCity from '../city/TableCity'

const CityPage = () => {
  const router = useRouter()
  const handleCreate = () => {
    router.push('/admin/add-city')
  }
  return (
    <ComponentCard title="Kota/Kabupaten" create={() => handleCreate()}>
      <TableCity />
    </ComponentCard>
  )
}

export default CityPage
