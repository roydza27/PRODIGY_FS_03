import { Badge } from "@/shared/components/ui/badge";

type Props = {
  title: string;
  description: string;
};

export default function BecomeSellerHeader({ title, description }: Props) {
  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-6 shadow-[0_20px_80px_rgba(0,0,0,0.25)] sm:p-8">
      <Badge className="mb-4 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300 hover:bg-white/5">
        Seller onboarding
      </Badge>

      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        {title}
      </h1>

      <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
        {description}
      </p>
    </div>
  );
}