'use client'
import React from 'react'
import ComponentCard from '@/components/common/ComponentCard'
import { useRouter } from 'next/navigation'
import TableTransportOperator from './TableTransportOperator'

const TransportOperatorPage = () => {
  const router = useRouter()
  const handleCreate = () => {
    router.push('/admin/add-transport-operator')
  }
  return (
    <ComponentCard title="Operator Transportasi" create={() => handleCreate()}>
      <TableTransportOperator />
    </ComponentCard>
  )
}

export default TransportOperatorPage
