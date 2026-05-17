export default function SearchPage() {
  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-4">
      <div className="w-full max-w-3xl rounded-[28px] border border-white/10 bg-[#111113] p-8 text-center shadow-2xl shadow-black/30">
        <div className="mx-auto mb-4 h-12 w-12 rounded-2xl border border-white/10 bg-white/5" />
        <h1 className="text-3xl font-bold tracking-[-0.04em] text-white">
          Search
        </h1>
        <p className="mt-3 text-sm leading-7 text-zinc-400">
          Search across products, orders, and saved items.
        </p>
      </div>
    </div>
  );
}
