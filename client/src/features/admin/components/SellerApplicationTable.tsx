import type { ColumnDef } from "@tanstack/react-table"

import { GripVertical, MoreHorizontal } from "lucide-react"

import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import { Checkbox } from "@/shared/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"

import { DataTable } from "./data-table" // Import your generic DataTable here
import type { AdminSellerApplicationItem } from "@/features/seller/types/seller.types"

interface SellerApplicationTableProps {
  data: AdminSellerApplicationItem[]
  onViewApplication: (app: AdminSellerApplicationItem) => void
  onApproveApplication: (app: AdminSellerApplicationItem) => void
  onRejectApplication: (app: AdminSellerApplicationItem) => void
}

const statusStyles: Record<string, string> = {
  applied: "bg-yellow-500/15 text-yellow-300 border-yellow-500/20",
  approved: "bg-green-500/15 text-green-300 border-green-500/20",
  rejected: "bg-red-500/15 text-red-300 border-red-500/20",
}

function DragHandle() {
  return (
    <div className="flex size-7 items-center justify-center rounded-md text-[#A1A1AA] hover:bg-white/5">
      <GripVertical className="size-4" />
    </div>
  )
}

export function SellerApplicationTable({
  data,
  onViewApplication,
  onApproveApplication,
  onRejectApplication,
}: SellerApplicationTableProps) {
  
  const columns: ColumnDef<AdminSellerApplicationItem>[] = [
    {
      id: "drag",
      header: () => null,
      cell: () => <DragHandle />,
    },
    {
      id: "select",
      header: ({ table }) => (
        <div className="flex items-center justify-start pl-2">
          <Checkbox
            checked={table.getIsAllPageRowsSelected() ? true : table.getIsSomePageRowsSelected() ? "indeterminate" : false}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-start pl-2">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "shopName",
      header: "Shop Name",
      cell: ({ row }) => (
        <button
          type="button"
          onClick={() => onViewApplication(row.original)}
          className="w-full text-left font-medium text-[#FAFAFA] hover:text-[#FAFAFA]/80 hover:underline"
        >
          {row.original.sellerInfo?.shopName || "N/A"}
        </button>
      ),
    },
    {
      accessorKey: "name",
      header: "Applicant",
      cell: ({ row }) => <div className="text-left text-[#FAFAFA]">{row.original.name}</div>,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <div className="text-left text-[#A1A1AA]">{row.original.email}</div>,
    },
    {
      accessorKey: "sellerAppliedAt",
      header: "Applied On",
      cell: ({ row }) => (
        <div className="text-left text-[#A1A1AA]">
          {new Date(row.original.sellerAppliedAt).toLocaleDateString()}
        </div>
      ),
    },
    {
      accessorKey: "sellerStatus",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.sellerStatus
        return (
          <div className="text-left">
            <Badge className={`rounded-full border px-2 py-0.5 font-normal uppercase text-[10px] tracking-wider ${statusStyles[status] || ""}`}>
              {status}
            </Badge>
          </div>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex justify-start">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="flex size-8 text-[#A1A1AA] data-[state=open]:bg-[#18181B]">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 border-white/10 bg-[#111113] text-[#FAFAFA]">
              <DropdownMenuItem className="hover:bg-white/5 cursor-pointer" onClick={() => onViewApplication(row.original)}>
                View Details
              </DropdownMenuItem>
              {row.original.sellerStatus === "applied" && (
                <>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem className="text-green-400 focus:text-green-300 hover:bg-green-500/10 cursor-pointer" onClick={() => onApproveApplication(row.original)}>
                    Approve
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-400 focus:text-red-300 hover:bg-red-500/10 cursor-pointer" onClick={() => onRejectApplication(row.original)}>
                    Reject
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ]

  return <DataTable columns={columns} data={data} />
}