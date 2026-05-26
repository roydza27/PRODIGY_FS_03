import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { sellerBenefits } from "../../constants/account-become-seller.constants";

export default function BecomeSellerBenefits() {
  return (
    <Card className="border-white/10 bg-white/5 text-white">
      <CardHeader className="border-b border-white/10">
        <CardTitle className="text-lg">Why become a seller?</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 pt-5">
        {sellerBenefits.map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.title} className="flex gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/20">
                <Icon className="size-4 text-white/80" />
              </div>

              <div>
                <p className="font-medium text-white">{item.title}</p>
                <p className="text-sm text-zinc-400">{item.description}</p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}