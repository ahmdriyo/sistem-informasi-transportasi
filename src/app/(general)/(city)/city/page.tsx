'use client'
import React from 'react'
import ComponentCard from '@/components/common/ComponentCard'
import TableCity from '../city/TableCity'

const CityPage = () => {
  return (
    <ComponentCard title="Kota/Kabupaten">
      <TableCity />
    </ComponentCard>
  )
}

export default CityPage
