"use client";

import * as React from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  Search,
  ShoppingCart,
  Store,
  MapPin,
  Plane,
  Zap,
  UserCircle,
  ChevronDown,
  LogOut,
} from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/components/ui/sheet";

import type { SidebarData } from "@/shared/types/sidebar";

type NavbarProps = {
  navData: SidebarData;
  onLogout: () => void;
};

export default function Navbar({ navData, onLogout }: NavbarProps) {
  if (!navData) return null;

  const { brandName, navMain, navSecondary, user, userMenu } = navData;

  const isLoggedIn = Boolean(
    localStorage.getItem("token") || sessionStorage.getItem("token")
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    onLogout();
  };

  const mobileLinkClass =
    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/5 hover:text-white";

  const desktopLinkClass =
    "rounded-md text-sm font-medium text-zinc-300 transition-colors hover:text-white";

  return (
    <nav
      className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-[#111113]/90 backdrop-blur-xl"
      aria-label="Main navigation"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-3 lg:h-20">
          <div className="flex items-center gap-3 lg:gap-8">
            <Link
              to="/"
              className="flex items-center gap-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#DB4444]/60"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
                <Store className="h-5 w-5 text-[#DB4444]" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold tracking-tight text-white">
                  {brandName || "LocalStore"}
                </p>
                <p className="text-xs text-zinc-500">E-commerce platform</p>
              </div>
            </Link>

            <Link
              to="/travel"
              className="hidden items-center gap-2 text-sm font-medium text-zinc-300 transition-colors hover:text-white lg:inline-flex"
            >
              <Plane className="h-4 w-4 text-[#DB4444]" />
              <span>Travel</span>
            </Link>
          </div>

          <div className="hidden min-w-0 flex-1 max-w-2xl lg:block">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Search for products, brands and more"
                className="h-11 w-full rounded-2xl border border-white/10 bg-white/[0.04] pl-11 pr-4 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-[#DB4444]/50 focus:ring-2 focus:ring-[#DB4444]/20"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="hidden rounded-2xl border border-white/10 bg-white/[0.04] text-zinc-200 hover:bg-white/[0.07] lg:inline-flex"
              aria-label="Search products"
            >
              <Search className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="rounded-2xl border border-white/10 bg-white/[0.04] text-zinc-200 hover:bg-white/[0.07]"
              aria-label="Cart"
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>

            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="hidden items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-medium text-zinc-100 transition-colors hover:bg-white/[0.07] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#DB4444]/60 sm:inline-flex"
                    aria-label="Open account menu"
                  >
                    <UserCircle className="h-5 w-5" />
                    <span className="hidden md:inline">
                      {user?.name ? user.name.split(" ")[0] : "Account"}
                    </span>
                    <ChevronDown className="h-4 w-4 text-zinc-500" />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  className="w-56 rounded-xl border-white/10 bg-[#111113] text-white shadow-2xl"
                  align="end"
                  sideOffset={8}
                >
                  {userMenu?.map((item) => (
                    <DropdownMenuItem key={item.url} asChild>
                      <Link
                        to={item.url}
                        className="flex items-center gap-3 py-2"
                      >
                        {item.icon ? <item.icon className="h-4 w-4 text-[#DB4444]" /> : null}
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}

                  <DropdownMenuSeparator className="bg-white/10" />

                  <DropdownMenuItem
                    onSelect={handleLogout}
                    className="cursor-pointer text-red-400 hover:bg-red-500/10 hover:text-red-300"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span className="font-medium">Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                to="/login"
                className="hidden rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-zinc-100 transition-colors hover:bg-white/[0.07] sm:inline-flex"
              >
                Log in
              </Link>
            )}

            <Sheet>
              <SheetTrigger asChild>
                <button
                  type="button"
                  className="rounded-2xl border border-white/10 bg-white/[0.04] p-2 text-zinc-100 transition-colors hover:bg-white/[0.07] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#DB4444]/60 lg:hidden"
                  aria-label="Open menu"
                >
                  <Menu className="h-6 w-6" />
                </button>
              </SheetTrigger>

              <SheetContent
                side="left"
                className="flex w-[300px] flex-col border-r border-white/10 bg-[#111113] p-0 text-white"
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
                      <Store className="h-4 w-4 text-[#DB4444]" />
                    </div>
                    <div>
                      <p className="text-sm font-semiboSearchld tracking-tight text-white">
                        {brandName || "LocalStore"}
                      </p>
                    </div>
                  </Link>
                </div>

                <div className="flex flex-1 flex-col overflow-y-auto px-4 py-5">
                  {/* Main Navigation */}
                  <div className="space-y-1">
                    <p className="px-3 pb-2 text-[11px] font-medium uppercase tracking-[0.22em] text-zinc-500">
                      Navigation
                    </p>

                    <div className="flex flex-col gap-1">
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
                    </div>
                  </div>

                  {/* Secondary Navigation */}
                  <div className="mt-7 border-t border-white/10 pt-5">
                    <p className="mb-3 px-3 text-[11px] font-medium uppercase tracking-[0.22em] text-zinc-500">
                      More
                    </p>

                    <div className="flex flex-col gap-1">
                      {navSecondary?.map((item) => {
                        const Icon = item.icon;

                        return (
                          <Link
                            key={item.url}
                            to={item.url}
                            className={mobileLinkClass}
                          >
                            {Icon ? (
                              <Icon className="h-[18px] w-[18px] text-zinc-400" />
                            ) : null}

                            <span>{item.title}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="mt-auto pt-8">
                    <div className="border-t border-white/10 pt-5">
                      {isLoggedIn ? (
                        <div className="flex flex-col gap-3">
                          <Link
                            to="/account"
                            className="
                              flex items-center justify-center
                              rounded-2xl border border-white/10
                              bg-white/[0.04]
                              px-4 py-3
                              text-sm font-medium text-zinc-100
                              transition-colors
                              hover:bg-white/[0.07]
                            "
                          >
                            Account
                          </Link>

                          <button
                            type="button"
                            onClick={handleLogout}
                            className="
                              rounded-2xl
                              bg-[#DB4444]
                              px-4 py-3
                              text-sm font-semibold text-white
                              transition-colors
                              hover:bg-[#c53a3a]
                            "
                          >
                            Log out
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-3">
                          <Link
                            to="/login"
                            className="
                              flex items-center justify-center
                              rounded-2xl border border-white/10
                              bg-white/[0.04]
                              px-4 py-3
                              text-sm font-medium text-zinc-100
                              transition-colors
                              hover:bg-white/[0.07]
                            "
                          >
                            Log in
                          </Link>

                          <Link
                            to="/register"
                            className="
                              flex items-center justify-center
                              rounded-2xl
                              bg-[#DB4444]
                              px-4 py-3
                              text-sm font-semibold text-white
                              transition-colors
                              hover:bg-[#c53a3a]
                            "
                          >
                            Sign up
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="border-t border-white/10 py-3 lg:hidden">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search for products..."
              className="h-11 w-full rounded-2xl border border-white/10 bg-white/[0.04] pl-11 pr-4 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-[#DB4444]/50 focus:ring-2 focus:ring-[#DB4444]/20"
            />
          </div>
        </div>
      </div>
    </nav>
  );
}