import { ChartAreaInteractive } from "@/features/dashboard/components/chart-area-interactive"
import { DataTable } from "@/features/dashboard/components/data-table"
import { SectionCards } from "@/features/dashboard/components/section-cards"

import data from "@/features/dashboard/data/data.json"

export default function DashboardPage() {
  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6 pt-4 pb-2">
          <h2 className="font-heading text-2xl font-bold tracking-tight text-[#FAFAFA]">Platform Overview</h2>
          <p className="text-sm text-[#A1A1AA] mt-1">Welcome back, John. Here's what's happening across your workspaces today.</p>
        </div>
        <SectionCards />
        <div className="px-4 lg:px-6">
          <ChartAreaInteractive />
        </div>
        <DataTable data={data} />
      </div>
    </div>
  )
}