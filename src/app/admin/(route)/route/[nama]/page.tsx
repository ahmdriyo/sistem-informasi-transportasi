'use client'
import React from 'react'
import ComponentCard from '@/components/common/ComponentCard'
import { useRouter } from 'next/navigation'
import TableRoute from './TableRoute'

const RoutePage = () => {
  const router = useRouter()
  const handleCreate = () => {
    router.push('/admin/add-route')
  }
  return (
    <ComponentCard title="Daftar Rute" create={() => handleCreate()}>
      <TableRoute />
    </ComponentCard>
  )
}

export default RoutePage
