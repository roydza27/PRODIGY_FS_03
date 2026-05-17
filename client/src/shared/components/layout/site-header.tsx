import { Separator } from "@/shared/components/ui/separator"
import { SidebarTrigger } from "@/shared/components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/shared/components/ui/breadcrumb"
import { BellIcon, SearchIcon } from "lucide-react"

export function SiteHeader() {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b border-[#27272A] bg-[#111113]/95 backdrop-blur supports-[backdrop-filter]:bg-[#111113]/60 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center justify-between gap-1 px-4 lg:gap-2 lg:px-6">
        <div className="flex items-center gap-1 lg:gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#" className="text-[#A1A1AA] hover:text-[#FAFAFA]">Nexus Platform</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-heading font-semibold text-[#FAFAFA]">Overview</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 text-sm text-[#A1A1AA] bg-[#09090B] border border-[#27272A] rounded-xl px-3 py-1.5 cursor-text hover:border-[#A1A1AA]/50 transition-colors">
            <SearchIcon className="size-4" />
            <span>Search...</span>
            <kbd className="ml-8 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-[#27272A] bg-[#18181B] px-1.5 font-mono text-[10px] font-medium text-[#A1A1AA]">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
          <button className="relative text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors focus:outline-none">
            <BellIcon className="size-5" />
            <span className="absolute top-0 right-0 size-2 bg-blue-500 rounded-full border-2 border-[#111113]"></span>
          </button>
        </div>
      </div>
    </header>
  )
}
