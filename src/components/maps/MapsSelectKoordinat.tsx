'use client'
import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { IoLocation } from 'react-icons/io5'
import { renderToString } from 'react-dom/server'

interface MapProps {
  onSelectLocation: (coords: { lat: number; lng: number }) => void
}

export default function MapsSelectKoordinat({ onSelectLocation }: MapProps) {
  const markerRef = useRef<L.Marker | null>(null)
  const mapRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (mapRef.current) return
    const map = L.map('map', {
      zoomControl: true,
      doubleClickZoom: false,
    }).setView([-3.3194, 114.5908], 10)
    mapRef.current = map

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
    }).addTo(map)
    const iconHTML = renderToString(<IoLocation size={32} className="text-red-500" />)
    const locationIcon = L.divIcon({
      className: '',
      html: iconHTML,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    })

    map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng])
      } else {
        markerRef.current = L.marker([lat, lng], {
          icon: locationIcon,
        }).addTo(map)
      }
      onSelectLocation({ lat, lng })
    })
  }, [onSelectLocation])

  return <div id="map" className="w-full h-[400px] sm:h-[500px] rounded-xl" style={{ minHeight: '300px' }} />
}
