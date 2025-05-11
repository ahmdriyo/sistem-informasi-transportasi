'use client'
import { ArrowUpIcon, BoxIconLine, ShootingStarIcon } from '@/icons'
import axios from 'axios'
import { useEffect, useState } from 'react'
import Badge from '../ui/badge/Badge'

export const EcommerceMetrics = () => {
  const [routeLength, setRouteLength] = useState('0')
  const [scheduleLength, setscheduleLength] = useState('0')

  useEffect(() => {
    async function fetchData() {
      try {
        const [ruteRes, schedule] = await Promise.all([axios.get(`/api/route`), axios.get('/api/schedule')])
        setRouteLength(ruteRes.data.length)
        setscheduleLength(schedule.data.length)
      } catch (error) {
        console.error('Gagal mengambil data:', error)
      }
    }
    fetchData()
  })

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <ShootingStarIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Rute</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">{routeLength}</h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon />
            {`${(Number(scheduleLength) - Number(2)).toFixed(0)},${scheduleLength}%`}
          </Badge>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Jadwal</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">{scheduleLength}</h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon />
            {`${(Number(routeLength) - Number(scheduleLength)).toFixed(0)},${routeLength}%`}
          </Badge>
        </div>
      </div>
    </div>
  )
}
