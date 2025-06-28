'use client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Table, Button, Spin } from 'antd'
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table'
import './ReportHandGestureRecognition.css'
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
  const [currentPages, setCurrentPages] = useState<number[]>(Array(9).fill(1))
  const pageSize = 10

  const handleTableChange = (index: number) => (pagination: TablePaginationConfig) => {
    if (pagination.current) {
      const newPages = [...currentPages]
      newPages[index] = pagination.current
      setCurrentPages(newPages)
    }
  }
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
    {
      title: 'No',
      render: (_: LogGestureNavigationType, __: LogGestureNavigationType, index: number) =>
        (currentPages[0] - 1) * pageSize + index + 1,
      width: 60,
      align: 'center' as const,
    },
    {
      title: 'Waktu',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (val: string) => new Date(val).toLocaleString(),
      width: 180,
    },
    { title: 'Gesture', dataIndex: 'gestureType', key: 'gestureType', width: 140 },
    { title: 'Halaman Tujuan', dataIndex: 'actionTarget', key: 'actionTarget', ellipsis: true, width: 200 },
    {
      title: 'Confidence',
      dataIndex: 'confidence',
      key: 'confidence',
      align: 'center' as const,
      render: (val: string) => `${Math.round(parseFloat(val) * 100)}%`,
      width: 120,
    },
    { title: 'Status', dataIndex: 'status', key: 'status', align: 'center' as const, width: 100 },
  ]

  // Laporan 2: Gesture Berhasil
  const data2 = data.filter((d) => d.status.toLowerCase() === 'berhasil')
  const columns2: ColumnsType<LogGestureNavigationType> = [
    {
      title: 'No',
      render: (_: LogGestureNavigationType, __: LogGestureNavigationType, index: number) =>
        (currentPages[1] - 1) * pageSize + index + 1,
      width: 60,
      align: 'center' as const,
    },
    {
      title: 'Waktu',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (val: string) => new Date(val).toLocaleString(),
      width: 180,
    },
    { title: 'Gesture', dataIndex: 'gestureType', key: 'gestureType', width: 140 },
    { title: 'Halaman Tujuan', dataIndex: 'actionTarget', key: 'actionTarget', ellipsis: true, width: 200 },
    {
      title: 'Confidence',
      dataIndex: 'confidence',
      key: 'confidence',
      align: 'center' as const,
      render: (val: string) => `${Math.round(parseFloat(val) * 100)}%`,
      width: 120,
    },
  ]

  // Laporan 3: Gesture Gagal
  const data3 = data.filter((d) => d.status.toLowerCase() === 'gagal')
  const columns3 = columns2

  // Laporan 4: Jumlah Gesture per Hari
  const groupByDate: Record<string, number> = {}
  data.forEach((d) => {
    const date = getDateString(d.timestamp)
    groupByDate[date] = (groupByDate[date] || 0) + 1
  })
  const data4 = Object.entries(groupByDate).map(([date, total]) => ({ date, total }))
  const columns4: ColumnsType<{ date: string; total: number }> = [
    { title: 'Tanggal', dataIndex: 'date', key: 'date', width: 140 },
    { title: 'Total Gesture', dataIndex: 'total', key: 'total', align: 'center' as const, width: 140 },
  ]

  // Laporan 5: Gesture Terpopuler
  const groupByGesture: Record<string, number> = {}
  data.forEach((d) => {
    groupByGesture[d.gestureType] = (groupByGesture[d.gestureType] || 0) + 1
  })
  const data5 = Object.entries(groupByGesture).map(([gesture, total]) => ({ gesture, total }))
  const columns5: ColumnsType<{ gesture: string; total: number }> = [
    {
      title: 'No',
      render: (_: string, __: { gesture: string; total: number }, index: number) =>
        (currentPages[4] - 1) * pageSize + index + 1,
      width: 60,
      align: 'center' as const,
    },
    { title: 'Gesture', dataIndex: 'gesture', key: 'gesture', width: 140 },
    { title: 'Jumlah Penggunaan', dataIndex: 'total', key: 'total', align: 'center' as const, width: 140 },
  ]

  // Laporan 6: Gesture per Halaman
  const groupByPageGesture: Record<string, Record<string, number>> = {}
  data.forEach((d) => {
    const page = d.actionTarget
    const gesture = d.gestureType
    if (!groupByPageGesture[page]) groupByPageGesture[page] = {}
    groupByPageGesture[page][gesture] = (groupByPageGesture[page][gesture] || 0) + 1
  })
  const data6: { page: string; gesture: string; total: number }[] = []
  Object.entries(groupByPageGesture).forEach(([page, gestures]) => {
    Object.entries(gestures).forEach(([gesture, total]) => {
      data6.push({ page, gesture, total })
    })
  })
  const columns6: ColumnsType<{ page: string; gesture: string; total: number }> = [
    {
      title: 'No',
      render: (_: string, __: { page: string; gesture: string; total: number }, index: number) =>
        (currentPages[5] - 1) * pageSize + index + 1,
      width: 60,
      align: 'center' as const,
    },
    { title: 'Halaman', dataIndex: 'page', key: 'page', width: 200 },
    { title: 'Gesture', dataIndex: 'gesture', key: 'gesture', width: 140 },
    { title: 'Jumlah', dataIndex: 'total', key: 'total', align: 'center' as const, width: 100 },
  ]

  // Laporan 7: Rata-rata Confidence per Hari
  const groupConfidence: Record<string, number[]> = {}
  data.forEach((d) => {
    const date = getDateString(d.timestamp)
    if (!groupConfidence[date]) groupConfidence[date] = []
    groupConfidence[date].push(parseFloat(d.confidence))
  })
  const data7 = Object.entries(groupConfidence).map(([date, arr]) => ({
    date,
    avg: (arr.reduce((a, b) => a + b, 0) / arr.length) * 100,
  }))
  const columns7: ColumnsType<{ date: string; avg: number }> = [
    {
      title: 'No',
      render: (_: string, __: { date: string; avg: number }, index: number) =>
        (currentPages[6] - 1) * pageSize + index + 1,
      width: 60,
      align: 'center' as const,
    },
    { title: 'Tanggal', dataIndex: 'date', key: 'date', width: 140 },
    {
      title: 'Rata-rata Confidence',
      dataIndex: 'avg',
      key: 'avg',
      align: 'center' as const,
      width: 180,
      render: (val: number) => `${val.toFixed(2)} %`,
    },
  ]

  // Laporan 8: Aktivitas User
  const groupByUser: Record<string, { total: number; last: string }> = {}
  data.forEach((d) => {
    const name = d.userAgent
    if (!groupByUser[name]) groupByUser[name] = { total: 0, last: d.timestamp }
    groupByUser[name].total += 1
    if (new Date(d.timestamp) > new Date(groupByUser[name].last)) groupByUser[name].last = d.timestamp
  })
  const data8 = Object.entries(groupByUser).map(([name, { total, last }]) => ({ name, total, last }))
  const columns8: ColumnsType<{ name: string; total: number; last: string }> = [
    {
      title: 'No',
      render: (_: string, __: { name: string; total: number; last: string }, index: number) =>
        (currentPages[7] - 1) * pageSize + index + 1,
      width: 60,
      align: 'center' as const,
    },
    { title: 'Nama Pengguna', dataIndex: 'name', key: 'name', width: 180 },
    { title: 'Total Gesture', dataIndex: 'total', key: 'total', align: 'center' as const, width: 140 },
    {
      title: 'Terakhir Aktif',
      dataIndex: 'last',
      key: 'last',
      render: (val: string) => new Date(val).toLocaleString(),
      width: 180,
    },
  ]

  // Laporan 9: Laporan Confidence (Gesture dan Rata-rata Confidence)
  const groupByGestureConfidence: Record<string, number[]> = {}
  data.forEach((d) => {
    if (!groupByGestureConfidence[d.gestureType]) groupByGestureConfidence[d.gestureType] = []
    groupByGestureConfidence[d.gestureType].push(parseFloat(d.confidence))
  })
  const data9 = Object.entries(groupByGestureConfidence).map(([gesture, arr]) => ({
    gesture,
    avgConfidence: (arr.reduce((a, b) => a + b, 0) / arr.length) * 100,
  }))
  const columns9: ColumnsType<{ gesture: string; avgConfidence: number }> = [
    {
      title: 'No',
      render: (_: string, __: { gesture: string; avgConfidence: number }, index: number) =>
        (currentPages[8] - 1) * pageSize + index + 1,
      width: 60,
      align: 'center' as const,
    },
    { title: 'Gesture', dataIndex: 'gesture', key: 'gesture', width: 140 },
    {
      title: 'Rata-rata Confidence (%)',
      dataIndex: 'avgConfidence',
      key: 'avgConfidence',
      align: 'center' as const,
      width: 180,
      render: (val: number) => val.toFixed(2),
    },
  ]

  // Helper untuk pagination: jika data > 10, aktifkan pagination
  function getPagination<T>(dataArr: T[]): false | { pageSize: number } {
    // Jika sedang print, pagination false (tampilkan semua data)
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('print').matches) {
      return false
    }
    return dataArr.length > 10 ? { pageSize: 10 } : false
  }

  const printTable = (id: string) => {
    const el = document.querySelector(`#${id} .print-only`)
    if (!el) return

    const printWindow = window.open('', '', 'width=900,height=650')
    if (!printWindow) return

    printWindow.document.write('<html><head><title>Cetak Laporan</title>')
    printWindow.document.write(`
    <style>
      @media print {
        body { font-family: sans-serif; margin: 16px; }
        table { width: 100%; border-collapse: collapse; page-break-inside: auto; }
        th, td { border: 1px solid #ccc; padding: 6px; }
        tr { page-break-inside: avoid; page-break-after: auto; }
        thead { display: table-header-group; }
        tfoot { display: table-footer-group; }
        h3 { text-align: center; margin-bottom: 16px; }
      }
    </style>
  `)
    printWindow.document.write('</head><body>')
    printWindow.document.write(el.innerHTML)
    printWindow.document.write('</body></html>')
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
    printWindow.close()
  }

  return (
    <div
      style={{
        margin: '40px auto',
        background: '#fff',
        padding: 24,
        borderRadius: 8,
        boxShadow: '0 2px 8px #f0f1f2',
      }}
    >
      <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Report Hand Gesture Recognition</h2>
      {loading ? (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <Spin size="large" />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
          <div>
            <div id="laporan1">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <h3>Laporan 1: Laporan Log Gesture</h3>
                <Button type="primary" onClick={() => printTable('laporan1')}>
                  Cetak Laporan Ini
                </Button>
              </div>
              <div className="screen-only">
                <Table
                  columns={columns1}
                  dataSource={data}
                  rowKey="id"
                  onChange={handleTableChange(0)}
                  pagination={getPagination(data)}
                  bordered
                  size="small"
                  scroll={{ x: true }}
                />
              </div>
              <div className="print-only">
                <Table columns={columns1} dataSource={data} rowKey="id" pagination={false} bordered size="small" />
              </div>
            </div>
          </div>
          <div>
            <div id="laporan2">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <h3>Laporan 2: Gesture Berhasil</h3>
                <Button type="primary" onClick={() => printTable('laporan2')}>
                  Cetak Laporan Ini
                </Button>
              </div>
              <div className="screen-only">
                <Table
                  columns={columns2}
                  dataSource={data2}
                  onChange={handleTableChange(1)}
                  rowKey="id"
                  pagination={getPagination(data2)}
                  bordered
                  size="small"
                  scroll={{ x: true }}
                />
              </div>
              <div className="print-only">
                <Table columns={columns2} dataSource={data2} rowKey="id" pagination={false} bordered size="small" />
              </div>
            </div>
          </div>
          <div>
            <div id="laporan3">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <h3>Laporan 3: Gesture Gagal</h3>
                <Button type="primary" onClick={() => printTable('laporan3')}>
                  Cetak Laporan Ini
                </Button>
              </div>
              <div className="screen-only">
                <Table
                  columns={columns3}
                  dataSource={data3}
                  rowKey="id"
                  pagination={getPagination(data3)}
                  bordered
                  size="small"
                  onChange={handleTableChange(2)}
                  scroll={{ x: true }}
                />
              </div>
              <div className="print-only">
                <Table columns={columns3} dataSource={data3} rowKey="id" pagination={false} bordered size="small" />
              </div>
            </div>
          </div>
          <div>
            <div id="laporan4">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <h3>Laporan 4: Jumlah Gesture per Hari</h3>
                <Button type="primary" onClick={() => printTable('laporan4')}>
                  Cetak Laporan Ini
                </Button>
              </div>
              <div className="screen-only">
                <Table
                  columns={columns4}
                  dataSource={data4}
                  rowKey="date"
                  pagination={getPagination(data4)}
                  bordered
                  onChange={handleTableChange(3)}
                  size="small"
                  scroll={{ x: true }}
                />
              </div>
              <div className="print-only">
                <Table columns={columns4} dataSource={data4} rowKey="id" pagination={false} bordered size="small" />
              </div>
            </div>
          </div>
          <div>
            <div id="laporan5">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <h3>Laporan 5: Statistik Gesture </h3>
                <Button type="primary" onClick={() => printTable('laporan5')}>
                  Cetak Laporan Ini
                </Button>
              </div>
              <div className="screen-only">
                <Table
                  columns={columns5}
                  dataSource={data5}
                  rowKey="gesture"
                  pagination={getPagination(data5)}
                  onChange={handleTableChange(4)}
                  bordered
                  size="small"
                  scroll={{ x: true }}
                />
              </div>
              <div className="print-only">
                <Table columns={columns5} dataSource={data5} rowKey="id" pagination={false} bordered size="small" />
              </div>
            </div>
          </div>
          <div>
            <div id="laporan6">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <h3>Laporan 6: Gesture per Halaman</h3>
                <Button type="primary" onClick={() => printTable('laporan6')}>
                  Cetak Laporan Ini
                </Button>
              </div>
              <div className="screen-only">
                <Table
                  columns={columns6}
                  dataSource={data6}
                  rowKey={(r) => r.page + r.gesture}
                  pagination={getPagination(data6)}
                  onChange={handleTableChange(5)}
                  bordered
                  size="small"
                  scroll={{ x: true }}
                />
              </div>
              <div className="print-only">
                <Table columns={columns6} dataSource={data6} rowKey="id" pagination={false} bordered size="small" />
              </div>
            </div>
          </div>
          <div>
            <div id="laporan7">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <h3>Laporan 7: Rata-rata Confidence per Hari</h3>
                <Button type="primary" onClick={() => printTable('laporan7')}>
                  Cetak Laporan Ini
                </Button>
              </div>
              <div className="screen-only">
                <Table
                  columns={columns7}
                  dataSource={data7}
                  rowKey="date"
                  pagination={getPagination(data7)}
                  bordered
                  onChange={handleTableChange(6)}
                  size="small"
                  scroll={{ x: true }}
                />
              </div>
              <div className="print-only">
                <Table columns={columns7} dataSource={data7} rowKey="id" pagination={false} bordered size="small" />
              </div>
            </div>
          </div>
          <div>
            <div id="laporan8">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <h3>Laporan 8: Aktivitas User</h3>
                <Button type="primary" onClick={() => printTable('laporan8')}>
                  Cetak Laporan Ini
                </Button>
              </div>
              <div className="screen-only">
                <Table
                  columns={columns8}
                  dataSource={data8}
                  rowKey="name"
                  pagination={getPagination(data8)}
                  onChange={handleTableChange(7)}
                  bordered
                  size="small"
                  scroll={{ x: true }}
                />
              </div>
              <div className="print-only">
                <Table columns={columns8} dataSource={data8} rowKey="id" pagination={false} bordered size="small" />
              </div>
            </div>
          </div>
          <div>
            <div id="laporan9">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <h3>Laporan 9: Laporan Confidence</h3>
                <Button type="primary" onClick={() => printTable('laporan9')}>
                  Cetak Laporan Ini
                </Button>
              </div>
              <div className="screen-only">
                <Table
                  columns={columns9}
                  dataSource={data9}
                  rowKey="gesture"
                  onChange={handleTableChange(8)}
                  pagination={getPagination(data9)}
                  bordered
                  size="small"
                  scroll={{ x: true }}
                />
              </div>
              <div className="print-only">
                <Table columns={columns9} dataSource={data9} rowKey="id" pagination={false} bordered size="small" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
