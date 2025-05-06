'use client'
import React from 'react'
import TableTypeTransportasi from './TableTypeTransportation'
import ComponentCard from '@/components/common/ComponentCard'
import { useRouter } from 'next/navigation'

const TypeTransportationPage = () => {
  const router = useRouter()
  const handleCreate = () => {
    router.push('/admin/add-type-transportation')
  }
  return (
    <ComponentCard title="Tipe Transportasi" create={() => handleCreate()}>
      <TableTypeTransportasi />
    </ComponentCard>
  )
}

export default TypeTransportationPage
