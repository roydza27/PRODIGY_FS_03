import { Link } from "react-router-dom";
import { Menu, Search, ShoppingCart, Store } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/components/ui/sheet";

export default function Navbar() {
  const navLinkClass =
    "rounded-md text-sm font-medium text-zinc-300 transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#DB4444]/60";

  const mobileLinkClass =
    "rounded-md py-1 text-base font-medium text-zinc-300 transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#DB4444]/60";

  return (
    <nav
      className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-[#111113]/90 px-4 py-3 backdrop-blur-xl md:px-8"
      aria-label="Main navigation"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <Link
          to="/"
          className="flex items-center gap-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#DB4444]/60"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
            <Store className="h-5 w-5 text-[#DB4444]" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold tracking-tight text-white">
              LocalStore
            </p>
            <p className="text-xs text-zinc-500">E-commerce platform</p>
          </div>
        </Link>

        <div className="hidden items-center gap-7 lg:flex">
          <a href="#hero" className={navLinkClass}>
            Home
          </a>
          <a href="#categories" className={navLinkClass}>
            Categories
          </a>
          <a href="#featured-products" className={navLinkClass}>
            Products
          </a>
          <a href="#promo-banner" className={navLinkClass}>
            Deals
          </a>
          <a href="#highlights" className={navLinkClass}>
            Highlights
          </a>
          <a href="#cta" className={navLinkClass}>
            Support
          </a>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="hidden rounded-2xl border border-white/10 bg-white/[0.03] text-zinc-200 hover:bg-white/[0.06] lg:inline-flex"
            aria-label="Search products"
          >
            <Search className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-2xl border border-white/10 bg-white/[0.03] text-zinc-200 hover:bg-white/[0.06]"
            aria-label="Cart"
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>

          <Link
            to="/login"
            className="hidden rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-medium text-zinc-100 transition-colors hover:bg-white/[0.06] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#DB4444]/60 sm:inline-flex"
          >
            Log in
          </Link>

          <Link
            to="/register"
            className="hidden rounded-2xl bg-[#DB4444] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#c53a3a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#DB4444]/60 sm:inline-flex"
          >
            Sign up
          </Link>

          <Sheet>
            <SheetTrigger asChild>
              <button
                type="button"
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-2 text-zinc-100 transition-colors hover:bg-white/[0.06] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#DB4444]/60 lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-[300px] border-white/10 bg-[#111113] p-0 text-white"
            >
              <SheetHeader className="sr-only">
                <SheetTitle>Main navigation</SheetTitle>
                <SheetDescription>
                  Mobile navigation menu for the e-commerce website.
                </SheetDescription>
              </SheetHeader>

              <div className="flex h-16 items-center border-b border-white/10 px-4">
                <Link
                  to="/"
                  className="flex items-center gap-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#DB4444]/60"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
                    <Store className="h-4.5 w-4.5 text-[#DB4444]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold tracking-tight text-white">
                      LocalStore
                    </p>
                  </div>
                </Link>
              </div>

              <div className="flex flex-col gap-5 px-4 py-6">
                <a href="#hero" className={mobileLinkClass}>
                  Home
                </a>
                <a href="#categories" className={mobileLinkClass}>
                  Categories
                </a>
                <a href="#featured-products" className={mobileLinkClass}>
                  Products
                </a>
                <a href="#promo-banner" className={mobileLinkClass}>
                  Deals
                </a>
                <a href="#highlights" className={mobileLinkClass}>
                  Highlights
                </a>
                <a href="#cta" className={mobileLinkClass}>
                  Support
                </a>

                <div className="mt-4 flex flex-col gap-3 border-t border-white/10 pt-4">
                  <Link
                    to="/login"
                    className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-medium text-zinc-100 transition-colors hover:bg-white/[0.06]"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    className="rounded-2xl bg-[#DB4444] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#c53a3a]"
                  >
                    Sign up
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}