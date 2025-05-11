'use client'
import ComponentCard from '@/components/common/ComponentCard'
import TableSchedule from './TableSchedule'
import { useState } from 'react'
import ScheduleStats from './ScheduleStats'

const SchedulePage = () => {
  const [selectedTab, setSelectedTab] = useState<'Table' | 'Statistik'>('Table')
  return (
    <ComponentCard title="Daftar Jadwal" radio selected={selectedTab} onSelect={setSelectedTab}>
      {selectedTab === 'Table' ? <TableSchedule /> : <ScheduleStats />}
    </ComponentCard>
  )
}

export default SchedulePage
