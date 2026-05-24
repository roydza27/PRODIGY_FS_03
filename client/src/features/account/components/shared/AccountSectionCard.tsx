import type { ReactNode } from "react";
import { Card, CardContent } from "@/shared/components/ui/card";

type Props = {
  children: ReactNode;
  className?: string;
};

export default function AccountSectionCard({ children, className }: Props) {
  return (
    <Card
      className={[
        "border-white/10 bg-[#111113] text-white shadow-2xl shadow-black/20",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <CardContent className="p-5 sm:p-6">{children}</CardContent>
    </Card>
  );
}