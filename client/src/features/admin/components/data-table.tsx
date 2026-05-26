import * as React from "react"
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type Row,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table"
import { toast } from "sonner"
import { z } from "zod"

import { useIsMobile } from "@/hooks/use-mobile"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import { Checkbox } from "@/shared/components/ui/checkbox"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/shared/components/ui/drawer"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs"
import {
  GripVerticalIcon,
  CircleCheckIcon,
  LoaderIcon,
  EllipsisVerticalIcon,
  Columns3Icon,
  ChevronDownIcon,
  PlusIcon,
  ChevronsLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsRightIcon,
  Mail,
  Building2,
  BriefcaseBusiness
} from "lucide-react"
import type { DataTableProps, Employee } from "../types/employee.types"

const RowContext = React.createContext<any>(null)

// Status Styles
const statusStyles: Record<string, string> = {
  active: "bg-emerald-500/15 text-emerald-300 border-emerald-500/20",
  inactive: "bg-zinc-500/15 text-zinc-300 border-zinc-500/20",
  on_leave: "bg-amber-500/15 text-amber-300 border-amber-500/20",
  resigned: "bg-sky-500/15 text-sky-300 border-sky-500/20",
  terminated: "bg-rose-500/15 text-rose-300 border-rose-500/20",
}

const statusLabel: Record<string, string> = {
  active: "Active",
  inactive: "Inactive",
  on_leave: "On Leave",
  resigned: "Resigned",
  terminated: "Terminated",
}

function DragHandle() {
  const { attributes, listeners } = React.useContext(RowContext)

  return (
    <div
      {...attributes}
      {...listeners}
      // Replaced <Button> with a <div> and added touch-none & cursor-grab
      className="flex size-7 cursor-grab active:cursor-grabbing items-center justify-center rounded-md text-[#A1A1AA] hover:bg-white/5 touch-none"
    >
      <GripVerticalIcon className="size-4" />
      <span className="sr-only">Drag to reorder</span>
    </div>
  )
}

// 2. Updated Columns to map to Employee fields
const columns: ColumnDef<Employee>[] = [
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
          checked={
            table.getIsAllPageRowsSelected()
              ? true
              : table.getIsSomePageRowsSelected()
                ? "indeterminate"
                : false
          }
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
    accessorKey: "fullName",
    header: "Name",
    cell: ({ row }) => {
      return (
        <div className="flex w-full justify-start text-left">
          <TableCellViewer item={row.original} />
        </div>
      )
    },
    enableHiding: false,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="text-left text-[#A1A1AA]">{row.original.email}</div>
    ),
  },
  {
    accessorKey: "department",
    header: "Department",
    cell: ({ row }) => (
      <div className="text-left text-[#FAFAFA]">{row.original.department}</div>
    ),
  },
  {
    accessorKey: "jobTitle",
    header: "Role",
    cell: ({ row }) => (
      <div className="text-left text-[#FAFAFA]">{row.original.jobTitle}</div>
    ),
  },
  {
    accessorKey: "employmentStatus",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.employmentStatus
      return (
        <div className="text-left">
          <Badge className={`px-2 py-0.5 rounded-full border font-normal ${statusStyles[status]}`}>
            {statusLabel[status]}
          </Badge>
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: () => (
      <div className="flex justify-start">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex size-8 text-[#A1A1AA] data-[state=open]:bg-[#18181B]"
              size="icon"
            >
              <EllipsisVerticalIcon />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem>View Profile</DropdownMenuItem>
            <DropdownMenuItem>Edit Employee</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
]

function DraggableRow<TData extends { id: string }>({ row }: { row: Row<TData> }) {
  const { transform, transition, setNodeRef, isDragging, listeners, attributes } = useSortable({
    id: row.original.id,
  })

  return (
    <RowContext.Provider value={{ listeners, attributes }}>
      <TableRow
        data-state={row.getIsSelected() && "selected"}
        data-dragging={isDragging}
        ref={setNodeRef}
        className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80 border-white/10 hover:bg-white/5"
        style={{
          transform: CSS.Translate.toString(transform),
          transition,
        }}
      >
        {row.getVisibleCells().map((cell) => (
          <TableCell key={cell.id} className="py-3">
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>
    </RowContext.Provider>
  )
}

export function DataTable<TData extends { id: string }>({
  columns,
  data: initialData,
}: DataTableProps<TData>) {
  const [data, setData] = React.useState(() => initialData)

  // VERY IMPORTANT: Sync the table data when the filters in EmployeePage change!
  React.useEffect(() => {
    setData(initialData)
  }, [initialData])


  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })
  
  const sortableId = React.useId()
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  )

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ id }) => id) || [],
    [data]
  )

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id)
        const newIndex = dataIds.indexOf(over.id)
        return arrayMove(data, oldIndex, newIndex)
      })
    }
  }

  return (
    <Tabs
      defaultValue="employees"
      className="w-full flex-col justify-start gap-6"
    >
      <div className="flex items-center justify-between px-4 lg:px-6">
        <Label htmlFor="view-selector" className="sr-only">
          View
        </Label>
        <Select defaultValue="employees">
          <SelectTrigger
            className="flex w-fit @4xl/main:hidden"
            size="sm"
            id="view-selector"
          >
            <SelectValue placeholder="Select a view" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="employees">All Employees</SelectItem>
              <SelectItem value="departments">Departments</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <TabsList className="hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:bg-[#A1A1AA]/30 **:data-[slot=badge]:px-1 @4xl/main:flex">
          <TabsTrigger value="employees">All Employees</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
        </TabsList>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="border-white/10 bg-transparent text-[#FAFAFA]">
                <Columns3Icon data-icon="inline-start" />
                Columns
                <ChevronDownIcon data-icon="inline-end" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide()
                )
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <TabsContent
        value="employees"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <div className="overflow-hidden rounded-2xl border border-white/10">
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
            id={sortableId}
          >
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-[#18181B] border-b border-white/10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="border-none hover:bg-transparent">
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} colSpan={header.colSpan} className="text-[#FAFAFA]">
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="**:data-[slot=table-cell]:first:w-8">
                {table.getRowModel().rows?.length ? (
                  <SortableContext
                    items={dataIds}
                    strategy={verticalListSortingStrategy}
                  >
                    {table.getRowModel().rows.map((row) => (
                      <DraggableRow key={row.id} row={row} />
                    ))}
                  </SortableContext>
                ) : (
                  <TableRow className="border-white/10">
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      <div className="flex flex-col items-center justify-center space-y-3 py-10">
                        <div className="flex size-12 items-center justify-center rounded-full bg-[#18181B]">
                          <EllipsisVerticalIcon className="size-5 text-[#A1A1AA]" />
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          <span className="font-medium text-[#FAFAFA]">No employees found</span>
                          <span className="text-sm text-[#A1A1AA]">Adjust your filters or try a different search term.</span>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>
        <div className="flex items-center justify-between px-4 pb-4">
          <div className="hidden flex-1 font-mono text-[11px] uppercase tracking-wider text-[#A1A1AA] lg:flex">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit text-[#A1A1AA]">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="font-mono text-[11px] uppercase tracking-wider">
                Rows per page
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value))
                }}
              >
                <SelectTrigger size="sm" className="w-20 border-white/10 bg-transparent" id="rows-per-page">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  <SelectGroup>
                    {[10, 20, 30, 40, 50].map((pageSize) => (
                      <SelectItem key={pageSize} value={`${pageSize}`}>
                        {pageSize}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center font-mono text-[11px] uppercase tracking-wider">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex border-white/10 bg-transparent hover:bg-white/5"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <ChevronsLeftIcon />
              </Button>
              <Button
                variant="outline"
                className="size-8 border-white/10 bg-transparent hover:bg-white/5"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeftIcon />
              </Button>
              <Button
                variant="outline"
                className="size-8 border-white/10 bg-transparent hover:bg-white/5"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRightIcon />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex border-white/10 bg-transparent hover:bg-white/5"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <ChevronsRightIcon />
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="departments" className="flex flex-col px-4 lg:px-6">
        <div className="aspect-video w-full flex-1 rounded-2xl border border-[#27272A] border-dashed flex items-center justify-center text-[#A1A1AA]">
          Department view coming soon
        </div>
      </TabsContent>
    </Tabs>
  )
}

// 3. Updated Drawer to show Employee Details instead of charts
export function TableCellViewer({ item }: { item: Employee }) {
  const isMobile = useIsMobile()

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button
          variant="link"
          className="w-fit px-0 text-left font-medium text-[#FAFAFA] hover:text-[#FAFAFA]/80"
        >
          {item.fullName}
        </Button>
      </DrawerTrigger>

      <DrawerContent className="border-white/10 bg-[#111113] text-[#FAFAFA] md:max-w-md">
        <DrawerHeader className="gap-1 border-b border-white/10 pb-5">
          <DrawerTitle className="text-2xl">{item.fullName}</DrawerTitle>
          <DrawerDescription className="text-[#A1A1AA]">
            {item.jobTitle} • {item.department}
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex flex-col gap-6 overflow-y-auto px-6 py-6 text-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs uppercase tracking-wide text-[#A1A1AA]">Email</p>
              <p className="mt-2 break-words text-sm text-[#FAFAFA]">{item.email}</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs uppercase tracking-wide text-[#A1A1AA]">Phone</p>
              <p className="mt-2 text-sm text-[#FAFAFA]">{item.phone || "—"}</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs uppercase tracking-wide text-[#A1A1AA]">Department</p>
              <p className="mt-2 text-sm text-[#FAFAFA]">{item.department}</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs uppercase tracking-wide text-[#A1A1AA]">Job Title</p>
              <p className="mt-2 text-sm text-[#FAFAFA]">{item.jobTitle}</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs uppercase tracking-wide text-[#A1A1AA]">Employment Status</p>
              <p className="mt-2 text-sm capitalize text-[#FAFAFA]">
                {item.employmentStatus.replace("_", " ")}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs uppercase tracking-wide text-[#A1A1AA]">Date of Joining</p>
              <p className="mt-2 text-sm text-[#FAFAFA]">
                {new Date(item.dateOfJoining).toLocaleDateString()}
              </p>
            </div>
          </div>

          {item.salary !== undefined && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs uppercase tracking-wide text-[#A1A1AA]">Salary</p>
              <p className="mt-2 text-sm text-[#FAFAFA]">
                ₹{item.salary.toLocaleString()}
              </p>
            </div>
          )}

          {item.address && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs uppercase tracking-wide text-[#A1A1AA]">Address</p>
              <p className="mt-2 text-sm leading-6 text-[#FAFAFA]">{item.address}</p>
            </div>
          )}
        </div>

        <DrawerFooter className="border-t border-white/10 pt-4">
          <DrawerClose asChild>
            <Button
              variant="outline"
              className="border-white/10 bg-transparent text-[#FAFAFA] hover:bg-white/5 hover:text-[#FAFAFA]"
            >
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}


