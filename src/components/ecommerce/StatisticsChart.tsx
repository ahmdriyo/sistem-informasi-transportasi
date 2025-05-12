"use client";
import { ApexOptions } from "apexcharts";
import axios from "axios";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface ScheduleType {
  id: string;
  jamBerangkat: string;
  jamTiba: string;
  harga: number;
  createdAt: string;
  rute: {
    asalKota: { namaKota: string };
    tujuanKota: { namaKota: string };
  };
  operator: {
    nama: string;
  };
  tipeTransportasi: {
    nama: string;
  };
}

export default function StatisticsChart() {
  const [dataJadwal, setDataJadwal] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const fetchScheduleStats = async () => {
      try {
        const res = await axios.get<ScheduleType[]>("/api/schedule");
        const schedules = res.data;
        const monthlyCount = new Array(12).fill(0);
        schedules.forEach((schedule) => {
          const monthIndex = new Date(schedule.createdAt).getMonth(); // 0 = Jan
          monthlyCount[monthIndex]++;
        });

        setDataJadwal(monthlyCount);
      } catch (error) {
        console.error("Gagal mengambil data jadwal:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchScheduleStats();
  }, []);

  const options: ApexOptions = {
    legend: {
      show: false,
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#465FFF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "line",
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: "straight",
      width: [2],
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
    markers: {
      size: 0,
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: {
        size: 6,
      },
    },
    grid: {
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: true,
      x: {
        format: "dd MMM yyyy",
      },
    },
    xaxis: {
      type: "category",
      categories: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      ],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px",
          colors: ["#6B7280"],
        },
      },
      title: {
        text: "",
        style: {
          fontSize: "0px",
        },
      },
    },
  };

  const series = [
    {
      name: "Jumlah Jadwal",
      data: dataJadwal,
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Statistik Jadwal
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Jumlah jadwal yang dibuat per bulan
          </p>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[1000px] xl:min-w-full">
          {!loading && (
            <ReactApexChart
              options={options}
              series={series}
              type="area"
              height={310}
            />
          )}
          {loading && (
            <div className="text-center text-gray-500 dark:text-white/70">
              Memuat data jadwal...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
