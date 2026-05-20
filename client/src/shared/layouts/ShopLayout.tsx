import { Outlet } from "react-router-dom";

export default function ShopLayout() {
  return (
    <div className="min-h-screen bg-[#111113]/95 text-white">
      <header className="border-b border-white/10 bg-black/20">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-lg font-semibold tracking-tight">LocalStore</p>
            <p className="text-xs text-zinc-500">Premium storefront</p>
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
              Fast delivery
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
              Secure checkout
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <Outlet />
      </main>
    </div>
  );
}