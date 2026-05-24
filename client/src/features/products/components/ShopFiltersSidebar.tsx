import { Sidebar } from "@/shared/components/ui/sidebar";
import ShopFiltersContent from "./ShopFiltersContent";

export default function ShopFiltersSidebar() {
  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-white/8 bg-[#0f0f10]"
    >
      <div className="px-3 py-4">
        <ShopFiltersContent />
      </div>
    </Sidebar>
  );
}