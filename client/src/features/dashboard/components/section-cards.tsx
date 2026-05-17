"use client"

import { Badge } from "@/shared/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"

export function SectionCards() {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:border-[#A1A1AA]/30">
        <CardHeader>
          <CardDescription className="font-mono text-[10px] uppercase tracking-widest">Total Revenue</CardDescription>
          <CardTitle className="font-mono text-3xl font-medium tracking-tight tabular-nums @[250px]/card:text-4xl text-[#FAFAFA]">
            $1,250.00
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <ArrowUpRight className="size-3.5"
              />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-1.5 font-medium text-[#FAFAFA] items-center">
            Trending up this month{" "}
            <ArrowUpRight className="size-4 text-[#A1A1AA]" />
          </div>
          <div className="text-[#A1A1AA]">
            Visitors for the last 6 months
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:border-[#A1A1AA]/30">
        <CardHeader>
          <CardDescription className="font-mono text-[10px] uppercase tracking-widest">New Customers</CardDescription>
          <CardTitle className="font-mono text-3xl font-medium tracking-tight tabular-nums @[250px]/card:text-4xl text-[#FAFAFA]">
            1,234
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <ArrowDownRight className="size-3.5"
              />
              -20%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-1.5 font-medium text-[#FAFAFA] items-center">
            Down 20% this period{" "}
            <ArrowDownRight className="size-4 text-[#A1A1AA]" />
          </div>
          <div className="text-[#A1A1AA]">
            Acquisition needs attention
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:border-[#A1A1AA]/30">
        <CardHeader>
          <CardDescription className="font-mono text-[10px] uppercase tracking-widest">Active Accounts</CardDescription>
          <CardTitle className="font-mono text-3xl font-medium tracking-tight tabular-nums @[250px]/card:text-4xl text-[#FAFAFA]">
            45,678
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <ArrowUpRight className="size-3.5"
              />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-1.5 font-medium text-[#FAFAFA] items-center">
            Strong user retention{" "}
            <ArrowUpRight className="size-4 text-[#A1A1AA]" />
          </div>
          <div className="text-[#A1A1AA]">Engagement exceed targets</div>
        </CardFooter>
      </Card>
      <Card className="@container/card transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:border-[#A1A1AA]/30">
        <CardHeader>
          <CardDescription className="font-mono text-[10px] uppercase tracking-widest">Growth Rate</CardDescription>
          <CardTitle className="font-mono text-3xl font-medium tracking-tight tabular-nums @[250px]/card:text-4xl text-[#FAFAFA]">
            4.5%
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <ArrowUpRight className="size-3.5"
              />
              +4.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-1.5 font-medium text-[#FAFAFA] items-center">
            Steady performance increase{" "}
            <ArrowUpRight className="size-4 text-[#A1A1AA]" />
          </div>
          <div className="text-[#A1A1AA]">Meets growth projections</div>
        </CardFooter>
      </Card>
    </div>
  )
}
