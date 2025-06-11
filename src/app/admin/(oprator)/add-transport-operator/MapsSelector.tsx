'use client'
import dynamic from 'next/dynamic'

interface MapsSelectorProps {
  onSelectLocation: ({ lat, lng }: { lat: number; lng: number }) => void
}
const DynamicMap = dynamic(() => import('@/components/maps/MapsSelectKoordinat'), {
  ssr: false,
})
export default function MapsSelector({ onSelectLocation }: MapsSelectorProps) {
  return <DynamicMap onSelectLocation={onSelectLocation} />
}
