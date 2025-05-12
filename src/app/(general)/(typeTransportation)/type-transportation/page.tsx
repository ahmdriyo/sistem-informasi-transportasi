'use client'
import React, { useState } from 'react'
import TableTypeTransportasi from './TableTypeTransportation'
import ComponentCard from '@/components/common/ComponentCard'
import TransportasiStatistik from './TypeTransportasiStatistik'

const TypeTransportationPage = () => {
  const [selectedTab, setSelectedTab] = useState<'Table' | 'Statistik'>('Table')
  return (
    <ComponentCard title="Tipe Transportasi" radio selected={selectedTab} onSelect={setSelectedTab}>
      {selectedTab === 'Table' ? <TableTypeTransportasi /> : <TransportasiStatistik />}
    </ComponentCard>
  )
}

export default TypeTransportationPage
