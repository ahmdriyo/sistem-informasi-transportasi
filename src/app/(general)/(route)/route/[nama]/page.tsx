'use client'
import React, { useState } from 'react'
import ComponentCard from '@/components/common/ComponentCard'
import TableRoute from './TableRoute'
import RouteStats from './RouteStats'

const RoutePage = () => {
  const [selectedTab, setSelectedTab] = useState<'Table' | 'Statistik'>('Table')
  return (
    <ComponentCard title="Daftar Rute" radio selected={selectedTab} onSelect={setSelectedTab}>
      {selectedTab === 'Table' ? <TableRoute /> : <RouteStats />}
    </ComponentCard>
  )
}

export default RoutePage
