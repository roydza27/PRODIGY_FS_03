import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { BellIcon, SearchIcon } from "lucide-react";

import { Separator } from "@/shared/components/ui/separator";
import { SidebarTrigger } from "@/shared/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/shared/components/ui/breadcrumb";

type BreadcrumbItemType = {
  label: string;
  href?: string;
};

function getBreadcrumbs(pathname: string): BreadcrumbItemType[] {
  const isAdmin = pathname.startsWith("/admin");
  const isAccount = pathname.startsWith("/account");
  const isShop =
    pathname.startsWith("/products") ||
    pathname.startsWith("/cart") ||
    pathname.startsWith("/checkout");

  if (pathname === "/") {
    return [{ label: "Home" }];
  }

  if (isAdmin) {
    const base = [{ label: "Admin", href: "/admin" }];

    if (pathname === "/admin") {
      return [...base, { label: "Dashboard" }];
    }
    if (pathname === "/admin/products") {
      return [...base, { label: "Products" }];
    }
    if (pathname === "/admin/orders") {
      return [...base, { label: "Orders" }];
    }
    if (pathname === "/admin/customers") {
      return [...base, { label: "Customers" }];
    }
    if (pathname === "/admin/analytics") {
      return [...base, { label: "Analytics" }];
    }
    if (pathname === "/admin/inventory") {
      return [...base, { label: "Inventory" }];
    }
    if (pathname === "/admin/reports") {
      return [...base, { label: "Reports" }];
    }
    if (pathname === "/admin/shipments") {
      return [...base, { label: "Shipments" }];
    }
    if (pathname === "/admin/settings") {
      return [...base, { label: "Settings" }];
    }
    if (pathname === "/admin/staff") {
      return [...base, { label: "Staff" }];
    }
    if (pathname === "/admin/support") {
      return [...base, { label: "Support" }];
    }

    return [...base, { label: "Overview" }];
  }

  if (isAccount) {
    const base = [{ label: "Account", href: "/account" }];

    if (pathname === "/account") {
      return [...base, { label: "Overview" }];
    }
    if (pathname === "/account/orders") {
      return [...base, { label: "Orders" }];
    }
    if (pathname === "/account/wishlist") {
      return [...base, { label: "Wishlist" }];
    }
    if (pathname === "/account/reviews") {
      return [...base, { label: "Reviews" }];
    }
    if (pathname === "/account/profile") {
      return [...base, { label: "Profile" }];
    }
    if (pathname === "/account/settings") {
      return [...base, { label: "Settings" }];
    }
    if (pathname === "/account/invoices") {
      return [...base, { label: "Invoices" }];
    }
    if (pathname === "/account/history") {
      return [...base, { label: "Purchase History" }];
    }
    if (pathname === "/account/saved") {
      return [...base, { label: "Saved Items" }];
    }
    if (pathname.startsWith("/account/orders/")) {
      return [...base, { label: "Orders", href: "/account/orders" }, { label: "Order Details" }];
    }

    return [...base, { label: "Overview" }];
  }

  if (isShop) {
    const base = [{ label: "Shop", href: "/products" }];

    if (pathname === "/products") {
      return [...base, { label: "Products" }];
    }
    if (pathname.startsWith("/products/")) {
      return [...base, { label: "Products", href: "/products" }, { label: "Product Details" }];
    }
    if (pathname === "/cart") {
      return [...base, { label: "Cart" }];
    }
    if (pathname === "/checkout") {
      return [...base, { label: "Checkout" }];
    }

    return [...base, { label: "Browse" }];
  }

  if (pathname === "/support") {
    return [{ label: "Support" }];
  }

  if (pathname === "/search") {
    return [{ label: "Search" }];
  }

  return [{ label: "Overview" }];
}

export function SiteHeader() {
  const { pathname } = useLocation();

  const breadcrumbs = useMemo(() => getBreadcrumbs(pathname), [pathname]);

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
              {breadcrumbs.map((item, index) => {
                const isLast = index === breadcrumbs.length - 1;

                return (
                  <span key={`${item.label}-${index}`} className="contents">
                    <BreadcrumbItem className={index === 0 ? "hidden md:block" : ""}>
                      {item.href && !isLast ? (
                        <BreadcrumbLink asChild className="text-[#A1A1AA] hover:text-[#FAFAFA]">
                          <Link to={item.href}>{item.label}</Link>
                        </BreadcrumbLink>
                      ) : (
                        <BreadcrumbPage className="font-heading font-semibold text-[#FAFAFA]">
                          {item.label}
                        </BreadcrumbPage>
                      )}
                    </BreadcrumbItem>

                    {!isLast ? (
                      <BreadcrumbSeparator className={index === 0 ? "hidden md:block" : ""} />
                    ) : null}
                  </span>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2 rounded-xl border border-[#27272A] bg-[#09090B] px-3 py-1.5 text-sm text-[#A1A1AA] transition-colors hover:border-[#A1A1AA]/50 md:flex">
            <SearchIcon className="size-4" />
            <span>Search...</span>
            <kbd className="ml-8 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-[#27272A] bg-[#18181B] px-1.5 font-mono text-[10px] font-medium text-[#A1A1AA]">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>

          <button className="relative text-[#A1A1AA] transition-colors hover:text-[#FAFAFA] focus:outline-none">
            <BellIcon className="size-5" />
            <span className="absolute right-0 top-0 size-2 rounded-full border-2 border-[#111113] bg-blue-500" />
          </button>
        </div>
      </div>
    </header>
  );
}