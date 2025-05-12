"use client";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

interface NewsItem {
  title: string;
  description: string;
  link: string;
  image_url: string;
  category?: string;
  creator?: string[];
  pubDate?: string;
}

export default function RecentNews() {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  const url =
    "https://newsdata.io/api/1/news?apikey=pub_85392f3b1bcc2acb5aabd98f4380ebb034cb8&country=id&language=id&category=technology";

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(url);
        const data = await res.json();
        setNewsList(data.results || []);
      } catch (err) {
        console.error("Gagal mengambil berita:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Berita Saat Ini
          </h3>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-600 dark:text-gray-300">Loading berita...</p>
      ) : (
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
              <TableRow>
                <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Judul
                </TableCell>
                <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Deskripsi
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
              {newsList.map((news, index) => (
                <TableRow key={index}>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      {news.image_url ? (
                        <div className="h-[80px] w-[80px] overflow-hidden rounded-md">
                          <img
                            src={news.image_url}
                            className="h-[80px] w-[80px] object-cover"
                            alt={news.title}
                          />
                          
                        </div>
                      ) : (
                        <div className="h-[50px] w-[50px] bg-gray-200 dark:bg-gray-700 rounded-md" />
                      )}
                      <div>
                        <a
                          href={news.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-gray-800 dark:text-white/90 hover:underline"
                        >
                          {news.title}
                        </a>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {news.description?.slice(0, 80) || "Tidak ada deskripsi"}...
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
