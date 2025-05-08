'use client'
import React from 'react'
import ComponentCard from '@/components/common/ComponentCard'
import { useRouter } from 'next/navigation'
import TableSchedule from './TableSchedule'

const SchedulePage = () => {
  const router = useRouter()
  const handleCreate = () => {
    router.push('/admin/add-schedule')
  }
  return (
    <ComponentCard title="Daftar Jadwal" create={() => handleCreate()}>
      <TableSchedule />
    </ComponentCard>
  )
}

export default SchedulePage
