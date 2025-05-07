'use client'
import React from 'react'
import ComponentCard from '@/components/common/ComponentCard'
import { useRouter } from 'next/navigation'
import TableRute from './TableRute'

const RutePage = () => {
  const router = useRouter()
  const handleCreate = () => {
    router.push('/admin/rute/add-rute')
  }
  return (
    <ComponentCard title="Daftar Rute" create={() => handleCreate()}>
      <TableRute />
    </ComponentCard>
  )
}

export default RutePage
