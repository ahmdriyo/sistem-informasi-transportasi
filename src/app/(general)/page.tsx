import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import RecentOrders from "@/components/ecommerce/RecentOrders";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Next.js Dashboard | Admin - Next.js Dashboard Template",
  description: "This is Next.js Home for Admin Dashboard Template",
};

export default function Ecommerce() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 ">
        <EcommerceMetrics />
      </div>
      <div className="col-span-12">
        <StatisticsChart />
      </div>
      <div className="col-span-12">
        <RecentOrders />
      </div>
    </div>
  );
}
