import * as React from "react"
import { Filter, Search } from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"

type SellerApplicationFiltersProps = {
  search: string
  setSearch: React.Dispatch<React.SetStateAction<string>>
  status: "all" | "applied" | "approved" | "rejected"
  setStatus: React.Dispatch<React.SetStateAction<"all" | "applied" | "approved" | "rejected">>
  onApply?: () => void
}

export function SellerApplicationFilters({
  search,
  setSearch,
  status,
  setStatus,
  onApply,
}: SellerApplicationFiltersProps) {
  return (
    <div className="mx-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_180px_auto]">
      {/* Search Input */}
      <div className="relative min-w-0 md:col-span-2 xl:col-span-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A1A1AA]" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, or shop..."
          className="h-10 w-full min-w-0 border-white/10 bg-transparent pl-9 text-[#FAFAFA] placeholder:text-[#71717A]"
        />
      </div>

      {/* Status Dropdown */}
      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger className="h-10 w-full min-w-0 border-white/10 bg-transparent text-[#FAFAFA]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Applications</SelectItem>
          <SelectItem value="applied">Pending Review</SelectItem>
          <SelectItem value="approved">Approved</SelectItem>
          <SelectItem value="rejected">Rejected</SelectItem>
        </SelectContent>
      </Select>

      {/* Apply Button */}
      <Button
        type="button"
        variant="outline"
        onClick={onApply}
        className="h-10 w-full border-white/10 bg-transparent text-[#FAFAFA] hover:bg-white/5 md:col-span-2 xl:col-span-1 xl:w-auto"
      >
        <Filter className="mr-2 h-4 w-4" />
        Apply
      </Button>
    </div>
  )
}