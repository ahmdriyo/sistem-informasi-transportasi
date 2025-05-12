'use client'

import { MoreDotIcon } from '@/icons'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { FaBus, FaCarSide } from 'react-icons/fa'
import { FaFerry } from 'react-icons/fa6'
import { GiAirplaneDeparture } from 'react-icons/gi'
import { MdCardTravel } from 'react-icons/md'
import { Dropdown } from '../ui/dropdown/Dropdown'
import { DropdownItem } from '../ui/dropdown/DropdownItem'
import LeafletMap from './CountryMap'

interface RouteType {
  id: string
  deskripsi: string
  tipeTransportasiId: string
  asalKota: { namaKota: string }
  tujuanKota: { namaKota: string }
  operator: { nama: string }
  tipeTransportasi: { nama: string }
}

interface TransportItem {
  icon: React.ReactElement
  name: string
  count: number
  percentage: number
}

export default function DemographicCard() {
  const [isOpen, setIsOpen] = useState(false)
  const [transportStats, setTransportStats] = useState<TransportItem[]>([])

  const icons = {
    Angkot: <FaCarSide size={35} className="dark:text-blue-500" />,
    Travel: <MdCardTravel size={35} className="dark:text-blue-500" />,
    Fery: <FaFerry size={35} className="dark:text-blue-500" />,
    Bus: <FaBus size={35} className="dark:text-blue-500" />,
    Pesawat: <GiAirplaneDeparture size={35} className="dark:text-blue-500" />,
  }

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const res = await axios.get('/api/route')

        const counts: Record<string, number> = {}
        res.data.forEach((r: RouteType) => {
          const nama = r.tipeTransportasi.nama
          counts[nama] = (counts[nama] || 0) + 1
        })

        const total = res.data.length
        const stats: TransportItem[] = Object.entries(counts).map(([name, count]) => ({
          icon: icons[name as keyof typeof icons] ?? <FaCarSide size={35} />,
          name,
          count,
          percentage: Math.round((count / total) * 100),
        }))

        setTransportStats(stats)
      } catch (error) {
        console.error('Gagal fetch data rute:', error)
      }
    }

    fetchRoutes()
  }, [])

  const toggleDropdown = () => setIsOpen(!isOpen)
  const closeDropdown = () => setIsOpen(false)

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <div className="flex justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Transportasi Demografi</h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Jumlah rute berdasarkan Jenis Transportasi
          </p>
        </div>

        <div className="relative inline-block">
          <button onClick={toggleDropdown} className="dropdown-toggle">
            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
          </button>
          <Dropdown isOpen={isOpen} onClose={closeDropdown} className="w-40 p-2">
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              View More
            </DropdownItem>
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Delete
            </DropdownItem>
          </Dropdown>
        </div>
      </div>

      <div className="px-4 py-6 my-6 overflow-hidden border border-gray-200 rounded-2xl bg-gray-50 dark:border-gray-800 dark:bg-gray-900 sm:px-6">
        <div
          id="mapOne"
          className="mapOne map-btn -mx-4 -my-6 h-[212px] w-[252px] 2xsm:w-[307px] xsm:w-[358px] sm:-mx-6 md:w-[668px] lg:w-[634px] xl:w-[393px] 2xl:w-[554px]"
        >
          <LeafletMap />
        </div>
      </div>

      <div className="space-y-5">
        {transportStats.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="items-center w-full rounded-full max-w-8">{item.icon}</div>
              <div>
                <p className="font-semibold text-gray-800 text-theme-sm dark:text-white/90">{item.name}</p>
                <span className="block text-gray-500 text-theme-xs dark:text-gray-400">{item.count} Rute</span>
              </div>
            </div>
            <div className="flex w-full max-w-[140px] items-center gap-3">
              <div className="relative block h-2 w-full max-w-[100px] rounded-sm bg-gray-200 dark:bg-gray-800">
                <div
                  className="absolute left-0 top-0 flex h-full items-center justify-center rounded-sm bg-brand-500 text-xs font-medium text-white"
                  style={{ width: `${item.percentage}%` }}
                ></div>
              </div>
              <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">{item.percentage}%</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
