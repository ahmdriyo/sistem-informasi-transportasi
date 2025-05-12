'use client'
import React, { useState } from 'react'
import ComponentCard from '@/components/common/ComponentCard'
import TableTransportOperator from './TableTransportOperator'
import TransportOperatorStats from './StatistikTransportOperator'

const TransportOperatorPage = () => {
   const [selectedTab, setSelectedTab] = useState<'Table' | 'Statistik'>('Table')
  return (
    <ComponentCard
      title="Operator Transportasi"
      radio
      selected={selectedTab}
      onSelect={setSelectedTab}
    >
      {selectedTab === 'Table' ? <TableTransportOperator /> : <TransportOperatorStats />}
    </ComponentCard>
  )
}

export default TransportOperatorPage
