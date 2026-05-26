import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import type { AccountHomeHero } from "../../types/account-home.types";

type Props = {
  hero: AccountHomeHero;
};

export default function AccountHero({ hero }: Props) {
  return (
    <section className="text-left rounded-[28px] border border-white/10 bg-[#111113] p-6 shadow-2xl shadow-black/30 md:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <Badge className="w-fit border border-white/10 bg-white/5 text-zinc-300 hover:bg-white/5">
            {hero.badge}
          </Badge>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-[-0.04em] text-white md:text-4xl">
              {hero.title}
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-zinc-400 md:text-base">
              {hero.description}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button asChild className="rounded-2xl bg-[#DB4444] px-5 text-white hover:bg-[#c53a3a]">
            <Link to={hero.primaryAction.href}>
              {hero.primaryAction.label}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>

          <Button
            asChild
            variant="secondary"
            className="rounded-2xl border border-white/10 bg-white/5 text-white hover:bg-white/10"
          >
            <Link to={hero.secondaryAction.href}>
              {hero.secondaryAction.label}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}