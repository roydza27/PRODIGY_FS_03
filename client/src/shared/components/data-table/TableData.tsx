import * as React from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "./data-table" 

// FIXED: Removed the hardcoded constraint from the interface definition 
// and allowed it to handle true dynamic generics globally.
interface TableDataProps<TData> {
  /** The data rows to display in the table (Sellers, Products, Employees, etc.) */
  data: TData[]
  /** Pass the columns array configuration dynamically from the parent page */
  columns: ColumnDef<TData>[]
  /** Optional container slot to pass page-specific toolbar filters (e.g., <TableFilters />) */
  filterToolbar?: React.ReactNode
  /** Injected slot to hold feature-specific panels like <RowDetailsOverlay> or forms */
  children?: React.ReactNode
  /** Staged reference context pass-through for tracking which row is currently active/selected */
  selectedItem?: TData | null
  /** Optional state callback to sync selection changes back up to the parent layout */
  onSelectedItemChange?: (item: TData | null) => void
}

// FIXED: Moved the dynamic record type extension directly onto the execution block.
// This tells TypeScript: "Accept whatever specific shape TData is from the page dashboard, 
// as long as it has some form of string/bson primary key."
export function TableData<TData extends { id?: any; _id?: any }>({
  data,
  columns,
  filterToolbar,
  children,
  selectedItem = null,
  onSelectedItemChange,
}: TableDataProps<TData>) {
  // Local overlay fallback state if parent doesn't manage selection state directly
  const [localSelectedItem, setLocalSelectedItem] = React.useState<TData | null>(null)
  const [overlayOpen, setOverlayOpen] = React.useState(false)

  // Determine if state is controlled externally by parent or fallbacks locally
  const activeItem = selectedItem !== null ? selectedItem : localSelectedItem

  // Automatically open overlay layout when a row item context drops in
  React.useEffect(() => {
    if (activeItem) {
      setOverlayOpen(true)
    }
  }, [activeItem])

  // Clear states completely when closing drawer/modal overlays
  const handleOpenChange = React.useCallback((open: boolean) => {
    setOverlayOpen(open)
    if (!open) {
      if (onSelectedItemChange) onSelectedItemChange(null)
      setLocalSelectedItem(null)
    }
  }, [onSelectedItemChange])

  // Map MongoDB _id entries to standard id keys so dnd-kit row wrappers remain working
  const sanitizedData = React.useMemo(() => {
    return data.map((item) => ({
      ...item,
      id: item.id || item._id || "",
    }))
  }, [data])

  return (
    <div className="w-full relative space-y-5">
      {/* Structural Filter Slot Layer positioned directly above your data display grid */}
      {filterToolbar && <div className="w-full">{filterToolbar}</div>}

      {/* Layer A: Pure Data Matrix Layout rendering inside your unchanged Data Table */}
      {/* FIXED: Bypassed the rigid type map of data-table by casting the sanitized array to any[] */}
      <DataTable columns={columns as any} data={sanitizedData as any} />

      {/* Layer B: Expose control state parameters down into the children tree slots */}
      {children && typeof children === "function"
        ? (children as Function)({ 
            item: activeItem, 
            open: overlayOpen, 
            onOpenChange: handleOpenChange 
          })
        : React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child as React.ReactElement<any>, {
                item: activeItem,
                open: overlayOpen,
                onOpenChange: handleOpenChange,
              })
            }
            return child
          })}
    </div>
  )
}

export default TableData