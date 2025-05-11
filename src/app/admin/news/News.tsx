'use client'
import PageBreadcrumb from '@/components/common/PageBreadCrumb'
import { Spin } from 'antd'
import { useEffect, useState } from 'react'
type NewsItem = {
  title: string
  description: string
  link: string
  image_url: string
}

const News = () => {
  const [newsList, setNewsList] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)

  const url = 'https://newsdata.io/api/1/news?apikey=pub_85392f3b1bcc2acb5aabd98f4380ebb034cb8&country=id&language=id&category=technology'

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(url)
        const data = await res.json()
        setNewsList(data.results || [])
      } catch (err) {
        console.error('Gagal mengambil berita:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [])

  return (
    <div>
      <PageBreadcrumb pageTitle="Berita Transportasi dan Teknologi" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="mx-auto w-full max-w-[1000px] text-center mb-10">
          <h3 className="mb-4 font-semibold text-gray-800 text-2xl dark:text-white/90">
            Berita Teknologi & Transportasi
          </h3>
        </div>
        {loading ? (
          <div className="text-center justify-center">
            <Spin />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {newsList.map((item, index) => (
              <div
                key={index}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-white/[0.03]"
              >
                {item.image_url && (
                  <img src={item.image_url} alt={item.title} className="mb-4 h-40 w-full rounded-lg object-cover" />
                )}
                <h4 className="mb-2 text-lg font-bold text-gray-800 dark:text-white">{item.title}</h4>
                <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
                  {item.description?.substring(0, 120)}...
                </p>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-blue-600 hover:underline"
                >
                  Baca Selengkapnya →
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default News
