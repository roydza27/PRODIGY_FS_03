import * as React from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "./data-table" 

interface TableDataProps<TData> {
  data: TData[]
  columns: ColumnDef<TData>[]
  children?: React.ReactNode // Slot to hold feature-specific panels (Drawers, Modals)
}

export function TableData<TData extends { id?: string; _id?: string }>({
  data,
  columns,
  children,
}: TableDataProps<TData>) {
  // Map standard MongoDB _id to fallback id so your unchanged DataTable dnd-kit context doesn't break
  const sanitizedData = React.useMemo(() => {
    return data.map(item => ({
      ...item,
      id: item.id || item._id || "",
    }))
  }, [data])

  return (
    <div className="w-full relative">
      {/* Dynamic Data Presentation Layer */}
      <DataTable columns={columns} data={sanitizedData} />

      {/* Feature Panel Layer (Application Details, Product Sheet, etc.) */}
      {children}
    </div>
  )
}

export default TableData