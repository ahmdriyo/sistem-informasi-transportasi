'use client'

import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { ApexOptions } from 'apexcharts'
import axios from 'axios'

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

interface ScheduleType {
  id: string
  tipeTransportasi: {
    nama: string
  }
}

export default function ScheduleStats() {
  const [series, setSeries] = useState<number[]>([])
  const [labels, setLabels] = useState<string[]>([])

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get('/api/schedule')
        const data: ScheduleType[] = res.data

        const countByTipe: Record<string, number> = {}
        for (const item of data) {
          const namaTipe = item.tipeTransportasi?.nama
          if (namaTipe) {
            countByTipe[namaTipe] = (countByTipe[namaTipe] || 0) + 1
          }
        }

        setLabels(Object.keys(countByTipe))
        setSeries(Object.values(countByTipe))
      } catch (error) {
        console.error('Gagal mengambil data schedule:', error)
      }
    }

    fetchData()
  }, [])

  const options: ApexOptions = {
    chart: {
      type: 'bar',
      height: 300,
      toolbar: { show: false },
      fontFamily: 'Outfit, sans-serif',
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        columnWidth: '40%',
      },
    },
    colors: ['#F59E0B', '#3AC1F3', '#7C3AED', '#22C55E', '#465FFF'],
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: labels,
      labels: {
        style: {
          fontSize: '14px',
          colors: '#6B7280',
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: '12px',
          colors: '#6B7280',
        },
      },
    },
    grid: {
      yaxis: { lines: { show: true } },
      xaxis: { lines: { show: false } },
    },
    tooltip: {
      enabled: true,
    },
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Statistik Jadwal Transportasi
        </h3>
        <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
          Jumlah jadwal berdasarkan tipe transportasi
        </p>
      </div>

      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[400px]">
          <ReactApexChart
            options={options}
            series={[{ name: 'Jumlah Jadwal', data: series }]}
            type="bar"
            height={300}
          />
        </div>
      </div>
    </div>
  )
}
