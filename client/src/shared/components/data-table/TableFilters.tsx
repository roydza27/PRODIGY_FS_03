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

type TableFiltersProps = {
  search: string
  setSearch: React.Dispatch<React.SetStateAction<string>>
  department: string
  setDepartment: React.Dispatch<React.SetStateAction<string>>
  status: string
  setStatus: React.Dispatch<React.SetStateAction<string>>
  onApply?: () => void
}

export function TableFilters({
  search,
  setSearch,
  department,
  setDepartment,
  status,
  setStatus,
  onApply,
}: TableFiltersProps) {
  return (
    <div className="mx-6 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_180px_180px_auto]">
      <div className="relative min-w-0 md:col-span-2 xl:col-span-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A1A1AA]" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="h-10 w-full min-w-0 border-white/10 bg-transparent pl-9 text-[#FAFAFA] placeholder:text-[#71717A]"
        />
      </div>

      <Select value={department} onValueChange={setDepartment}>
        <SelectTrigger className="h-10 w-full min-w-0 border-white/10 bg-transparent text-[#FAFAFA]">
          <SelectValue placeholder="Department" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Departments</SelectItem>
          <SelectItem value="engineering">Engineering</SelectItem>
          <SelectItem value="design">Design</SelectItem>
          <SelectItem value="hr">HR</SelectItem>
        </SelectContent>
      </Select>

      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger className="h-10 w-full min-w-0 border-white/10 bg-transparent text-[#FAFAFA]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="on_leave">On Leave</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
        </SelectContent>
      </Select>

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