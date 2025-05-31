'use client'
import React, { useEffect, useState } from 'react'
import L from 'leaflet'
import { FaBus, FaCarSide } from 'react-icons/fa'
import 'leaflet/dist/leaflet.css'
import { renderToString } from 'react-dom/server'
import axios from 'axios'
import { MdCardTravel } from 'react-icons/md'
import { FaFerry } from 'react-icons/fa6'
import { GiAirplaneDeparture } from 'react-icons/gi'
import { IoLocation } from 'react-icons/io5'
import './maps.css'
interface TableTransportOperatorType {
  id: string
  nama: string
  koordinat: string
  tipe: {
    nama: string
  }
  createdAt: string
}
const MapsViwe = () => {
  const [data, setData] = useState<TableTransportOperatorType[]>([])
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get('/api/transport-operator')
        setData(res.data)
      } catch (error) {
        console.error('Gagal mengambil data:', error)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    const map = L.map('map').setView([-3.409132, 114.683653], 10)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
    }).addTo(map)
    const getIconComponent = (tipe: string) => {
      switch (tipe.toLowerCase()) {
        case 'angkot':
          return <FaCarSide size={20} className="dark:text-gray-500" />
        case 'travel':
          return <MdCardTravel size={20} className="dark:text-gray-500" />
        case 'fery':
          return <FaFerry size={20} className="dark:text-gray-500" />
        case 'bus':
          return <FaBus size={20} className="dark:text-gray-500" />
        case 'pesawat':
          return <GiAirplaneDeparture size={20} className="dark:text-gray-500" />
        default:
          return <IoLocation size={20} className="dark:text-gray-500" />
      }
    }

    data.forEach((item) => {
      const [latStr, lngStr] = item.koordinat.split(',')
      const lat = parseFloat(latStr)
      const lng = parseFloat(lngStr)

      if (!isNaN(lat) && !isNaN(lng)) {
        const iconHTML = renderToString(getIconComponent(item.tipe.nama))
        const icon = L.divIcon({
          className: '',
          html: iconHTML,
          iconSize: [35, 35],
          iconAnchor: [10, 2],
        })
        L.marker([lat, lng], { icon }).addTo(map).bindPopup(`
          <div class="popup-custom" style="font-size: 13px; margin-bottom: 5px;">
            <p style="margin: 0 0 6px 0;">${item.nama}</p>
            <a 
              href="https://www.google.com/maps?q=${lat},${lng}" 
              target="_blank" 
              rel="noopener noreferrer"
              style="
                display: inline-block;
                font-size: 12px;
              "
            >
              📍 Buka Google Maps
            </a>
          </div>
        `)
      }
    })

    return () => {
      map.remove()
    }
  }, [data])
  return <div id="map" className="h-full w-full rounded-2xl" style={{ minHeight: '300px' }} />
}

export default MapsViwe
