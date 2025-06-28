"use client"
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Table, Button, Spin } from 'antd'
import type { ColumnsType } from 'antd/es/table'


interface LogGestureNavigationType {
  id: string
  gestureType: string
  actionTarget: string
  status: string
  confidence: string
  timestamp: string
  userAgent: string
}

function getDateString(timestamp: string) {
  return new Date(timestamp).toLocaleDateString()
}

export const ReportHandGestureRecognition = () => {
  const [data, setData] = useState<LogGestureNavigationType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get('/api/gesture-navigation')
        setData(res.data)
      } catch (error) {
        console.error('Gagal mengambil data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Laporan 1: Semua data
  const columns1: ColumnsType<LogGestureNavigationType> = [
    { title: 'No', render: (_: LogGestureNavigationType, __: LogGestureNavigationType, idx: number) => idx + 1, width: 60, align: "center" as const },
    { title: 'Waktu', dataIndex: 'timestamp', key: 'timestamp', render: (val: string) => new Date(val).toLocaleString(), width: 180 },
    { title: 'Gesture', dataIndex: 'gestureType', key: 'gestureType', width: 140 },
    { title: 'Halaman Tujuan', dataIndex: 'actionTarget', key: 'actionTarget', ellipsis: true, width: 200 },
    { title: 'Confidence', dataIndex: 'confidence', key: 'confidence', align: "center" as const, render: (val: string) => `${parseFloat(val) * 100}%`, width: 120 },
    { title: 'Status', dataIndex: 'status', key: 'status', align: "center" as const, width: 100 },
  ]

  // Laporan 2: Gesture Berhasil
  const data2 = data.filter(d => d.status.toLowerCase() === 'berhasil')
  const columns2: ColumnsType<LogGestureNavigationType> = [
    { title: 'No', render: (_: LogGestureNavigationType, __: LogGestureNavigationType, idx: number) => idx + 1, width: 60, align: "center" as const },
    { title: 'Waktu', dataIndex: 'timestamp', key: 'timestamp', render: (val: string) => new Date(val).toLocaleString(), width: 180 },
    { title: 'Gesture', dataIndex: 'gestureType', key: 'gestureType', width: 140 },
    { title: 'Halaman Tujuan', dataIndex: 'actionTarget', key: 'actionTarget', ellipsis: true, width: 200 },
    { title: 'Confidence', dataIndex: 'confidence', key: 'confidence', align: "center" as const, render: (val: string) => `${parseFloat(val) * 100}%`, width: 120 },
  ]

  // Laporan 3: Gesture Gagal
  const data3 = data.filter(d => d.status.toLowerCase() === 'gagal')
  const columns3 = columns2

  // Laporan 4: Jumlah Gesture per Hari
  const groupByDate: Record<string, number> = {}
  data.forEach(d => {
    const date = getDateString(d.timestamp)
    groupByDate[date] = (groupByDate[date] || 0) + 1
  })
  const data4 = Object.entries(groupByDate).map(([date, total]) => ({ date, total }))
  const columns4: ColumnsType<{ date: string; total: number }> = [
    { title: 'Tanggal', dataIndex: 'date', key: 'date', width: 140 },
    { title: 'Total Gesture', dataIndex: 'total', key: 'total', align: "center" as const, width: 140 },
  ]

  // Laporan 5: Gesture Terpopuler
  const groupByGesture: Record<string, number> = {}
  data.forEach(d => {
    groupByGesture[d.gestureType] = (groupByGesture[d.gestureType] || 0) + 1
  })
  const data5 = Object.entries(groupByGesture).map(([gesture, total]) => ({ gesture, total }))
  const columns5: ColumnsType<{ gesture: string; total: number }> = [
    { title: 'Gesture', dataIndex: 'gesture', key: 'gesture', width: 140 },
    { title: 'Jumlah Penggunaan', dataIndex: 'total', key: 'total', align: "center" as const, width: 140 },
  ]

  // Laporan 6: Gesture per Halaman
  const groupByPageGesture: Record<string, Record<string, number>> = {}
  data.forEach(d => {
    const page = d.actionTarget
    const gesture = d.gestureType
    if (!groupByPageGesture[page]) groupByPageGesture[page] = {}
    groupByPageGesture[page][gesture] = (groupByPageGesture[page][gesture] || 0) + 1
  })
  const data6: { page: string, gesture: string, total: number }[] = []
  Object.entries(groupByPageGesture).forEach(([page, gestures]) => {
    Object.entries(gestures).forEach(([gesture, total]) => {
      data6.push({ page, gesture, total })
    })
  })
  const columns6: ColumnsType<{ page: string; gesture: string; total: number }> = [
    { title: 'Halaman', dataIndex: 'page', key: 'page', width: 200 },
    { title: 'Gesture', dataIndex: 'gesture', key: 'gesture', width: 140 },
    { title: 'Jumlah', dataIndex: 'total', key: 'total', align: "center" as const, width: 100 },
  ]

  // Laporan 7: Rata-rata Confidence per Hari
  const groupConfidence: Record<string, number[]> = {}
  data.forEach(d => {
    const date = getDateString(d.timestamp)
    if (!groupConfidence[date]) groupConfidence[date] = []
    groupConfidence[date].push(parseFloat(d.confidence))
  })
  const data7 = Object.entries(groupConfidence).map(([date, arr]) => ({ date, avg: (arr.reduce((a, b) => a + b, 0) / arr.length) * 100 }))
  const columns7: ColumnsType<{ date: string; avg: number }> = [
    { title: 'Tanggal', dataIndex: 'date', key: 'date', width: 140 },
    { title: 'Rata-rata Confidence (%)', dataIndex: 'avg', key: 'avg', align: "center" as const, width: 180, render: (val: number) => val.toFixed(2) },
  ]

  // Laporan 8: Aktivitas User
  const groupByUser: Record<string, { total: number, last: string }> = {}
  data.forEach(d => {
    const name = d.userAgent
    if (!groupByUser[name]) groupByUser[name] = { total: 0, last: d.timestamp }
    groupByUser[name].total += 1
    if (new Date(d.timestamp) > new Date(groupByUser[name].last)) groupByUser[name].last = d.timestamp
  })
  const data8 = Object.entries(groupByUser).map(([name, { total, last }]) => ({ name, total, last }))
  const columns8: ColumnsType<{ name: string; total: number; last: string }> = [
    { title: 'Nama Pengguna', dataIndex: 'name', key: 'name', width: 180 },
    { title: 'Total Gesture', dataIndex: 'total', key: 'total', align: "center" as const, width: 140 },
    { title: 'Terakhir Aktif', dataIndex: 'last', key: 'last', render: (val: string) => new Date(val).toLocaleString(), width: 180 },
  ]

  return (
    <div style={{ maxWidth: 1400, margin: '40px auto', background: '#fff', padding: 24, borderRadius: 8, boxShadow: '0 2px 8px #f0f1f2' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Report Hand Gesture Recognition</h2>
      {loading ? (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <Spin size="large" />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <h3>Laporan 1: Laporan Log Gesture (Utama)</h3>
              <Button type="primary" onClick={() => window.print()}>Cetak Laporan Ini</Button>
            </div>
            <Table columns={columns1} dataSource={data} rowKey="id" pagination={false} bordered size="small" scroll={{ x: true }} />
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <h3>Laporan 2: Gesture Berhasil</h3>
              <Button type="primary" onClick={() => window.print()}>Cetak Laporan Ini</Button>
            </div>
            <Table columns={columns2} dataSource={data2} rowKey="id" pagination={false} bordered size="small" scroll={{ x: true }} />
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <h3>Laporan 3: Gesture Gagal</h3>
              <Button type="primary" onClick={() => window.print()}>Cetak Laporan Ini</Button>
            </div>
            <Table columns={columns3} dataSource={data3} rowKey="id" pagination={false} bordered size="small" scroll={{ x: true }} />
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <h3>Laporan 4: Jumlah Gesture per Hari</h3>
              <Button type="primary" onClick={() => window.print()}>Cetak Laporan Ini</Button>
            </div>
            <Table columns={columns4} dataSource={data4} rowKey="date" pagination={false} bordered size="small" scroll={{ x: true }} />
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <h3>Laporan 5: Statistik  Gesture </h3>
              <Button type="primary" onClick={() => window.print()}>Cetak Laporan Ini</Button>
            </div>
            <Table columns={columns5} dataSource={data5} rowKey="gesture" pagination={false} bordered size="small" scroll={{ x: true }} />
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <h3>Laporan 6: Gesture per Halaman</h3>
              <Button type="primary" onClick={() => window.print()}>Cetak Laporan Ini</Button>
            </div>
            <Table columns={columns6} dataSource={data6} rowKey={r => r.page + r.gesture} pagination={false} bordered size="small" scroll={{ x: true }} />
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <h3>Laporan 7: Rata-rata Confidence per Hari</h3>
              <Button type="primary" onClick={() => window.print()}>Cetak Laporan Ini</Button>
            </div>
            <Table columns={columns7} dataSource={data7} rowKey="date" pagination={false} bordered size="small" scroll={{ x: true }} />
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <h3>Laporan 8: Aktivitas User</h3>
              <Button type="primary" onClick={() => window.print()}>Cetak Laporan Ini</Button>
            </div>
            <Table columns={columns8} dataSource={data8} rowKey="name" pagination={false} bordered size="small" scroll={{ x: true }} />
          </div>
        </div>
      )}
    </div>
  )
}
