import * as React from "react"
import { useIsMobile } from "@/hooks/use-mobile"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/shared/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/shared/components/ui/drawer"

interface RowDetailsOverlayProps {
  /** Boolean state tracking if the overlay window container frame should render visible */
  open: boolean
  /** Sync visibility change state modifications directly back up to parent layouts */
  onOpenChange: (open: boolean) => void
  /** The title header context text displayed prominently at the top of the pane viewport */
  title: string
  /** Sub-header accessibility context describing the details layout panel view frame */
  description?: string
  /** Toggle visual frame appearance behavior between side pane ("drawer") and screen-center popup ("modal") */
  variant?: "drawer" | "modal"
  /** Content template layout injected straight into the viewport container canvas slot */
  children: React.ReactNode
}

export function RowDetailsOverlay({
  open,
  onOpenChange,
  title,
  description,
  variant = "drawer",
  children,
}: RowDetailsOverlayProps) {
  const isMobile = useIsMobile()

  // Pure scroll-managed wrapper content node
  const FrameCanvas = (
    <div className="flex h-full flex-col overflow-hidden text-[#FAFAFA]">
      <div className="flex-1 overflow-y-auto px-6 py-5">
        {children}
      </div>
    </div>
  )

  // Render centered Dialog framework layer
  if (variant === "modal" && !isMobile) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-xl p-0 bg-[#111113] border-white/10 overflow-hidden rounded-2xl flex flex-col max-h-[85vh]">
          <DialogHeader className="px-6 pt-5 pb-3 border-b border-white/5 shrink-0">
            <DialogTitle className="text-xl font-semibold tracking-tight text-white">{title}</DialogTitle>
            {description && <DialogDescription className="text-sm text-[#A1A1AA]">{description}</DialogDescription>}
          </DialogHeader>
          {FrameCanvas}
        </DialogContent>
      </Dialog>
    )
  }

  // Fallback default layout: Right Tiling Slide-out Panel / Mobile Bottom Sheet
  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction={isMobile ? "bottom" : "right"}>
      <DrawerContent className="border-white/10 bg-[#111113] text-[#FAFAFA] md:max-w-xl h-full md:h-screen md:rounded-l-2xl md:rounded-r-none flex flex-col overflow-hidden">
        <DrawerHeader className="px-6 pt-5 pb-3 border-b border-white/5 text-left shrink-0">
          <DrawerTitle className="text-xl font-semibold tracking-tight text-white">{title}</DrawerTitle>
          {description && <DrawerDescription className="text-sm text-[#A1A1AA]">{description}</DrawerDescription>}
        </DrawerHeader>
        {FrameCanvas}
      </DrawerContent>
    </Drawer>
  )
}