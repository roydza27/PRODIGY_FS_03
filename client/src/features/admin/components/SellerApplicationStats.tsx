import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"

type SellerApplicationStatsProps = {
  total: number
  pending: number
  approved: number
  rejected: number
}

function StatCard({
  title,
  value,
  description,
  cardClassName = "border-white/10 bg-white/[0.02]",
  titleClassName = "text-[#A1A1AA]",
  valueClassName = "text-[#FAFAFA]",
}: {
  title: string
  value: string | number
  description: string
  cardClassName?: string
  titleClassName?: string
  valueClassName?: string
}) {
  return (
    <Card className={`shadow-none ${cardClassName}`}>
      <CardHeader className="space-y-2 p-5">
        <CardDescription className={titleClassName}>{title}</CardDescription>
        <CardTitle className={`text-3xl ${valueClassName}`}>{value}</CardTitle>
        <p className="text-sm text-[#A1A1AA]">{description}</p>
      </CardHeader>
    </Card>
  )
}

export function SellerApplicationStats({ 
  total, 
  pending, 
  approved, 
  rejected 
}: SellerApplicationStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Total Applications"
        value={total}
        description="All seller requests received."
      />
      <StatCard
        title="Pending Review"
        value={pending}
        description="Awaiting admin approval."
        cardClassName="border-yellow-500/20 bg-yellow-500/5"
        titleClassName="text-yellow-500/80"
        valueClassName="text-yellow-400"
      />
      <StatCard
        title="Approved"
        value={approved}
        description="Active marketplace sellers."
        cardClassName="border-green-500/20 bg-green-500/5"
        titleClassName="text-green-500/80"
        valueClassName="text-green-400"
      />
      <StatCard
        title="Rejected"
        value={rejected}
        description="Declined applications."
        cardClassName="border-red-500/20 bg-red-500/5"
        titleClassName="text-red-500/80"
        valueClassName="text-red-400"
      />
    </div>
  )
}