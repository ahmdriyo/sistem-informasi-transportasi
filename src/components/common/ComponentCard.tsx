import { ArrowRightIcon, FileIcon } from '@/icons'
import { PlusOutlined } from '@ant-design/icons'
import { Button, Radio } from 'antd'
import React from 'react'

interface ComponentCardProps {
  title: string
  children: React.ReactNode
  className?: string 
  desc?: string
  create?: () => void
  report?: () => void
  back?: () => void
  radio?: boolean
  selected?: 'Table' | 'Statistik'
  onSelect?: (value: 'Table' | 'Statistik') => void
}

const ComponentCard: React.FC<ComponentCardProps> = ({
  title,
  children,
  back,
  className = '',
  desc = '',
  create,
  report,
  radio,
  onSelect,
  selected,
}) => {
  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] ${className}`}
    >
      <div className="px-6 py-5 flex flex-row justify-between">
        <div className="flex items-center text-center flex-row gap-4">
          {back && (
            <div className="text-black dark:text-white rotate-180 cursor-pointer" onClick={back}>
              <ArrowRightIcon />
            </div>
          )}
          <h3 className="text-base font-medium text-gray-800 dark:text-white/90">{title}</h3>
        </div>
        <div className="flex gap-4">
          {report && (
            <Button color="purple" variant="filled" icon={<FileIcon />} iconPosition={'end'} onClick={report}>
              Cetak Report
            </Button>
          )}
          {create && (
            <Button color="purple" variant="filled" icon={<PlusOutlined />} iconPosition={'end'} onClick={create}>
              Tambah
            </Button>
          )}
        </div>
        {radio && selected && onSelect && (
          <Radio.Group value={selected} onChange={(e) => onSelect(e.target.value)} className="radio-button ">
            <Radio.Button value="Table">Table</Radio.Button>
            <Radio.Button value="Statistik">Statistik</Radio.Button>
          </Radio.Group>
        )}
        {desc && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{desc}</p>}
      </div>
      <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  )
}

export default ComponentCard
