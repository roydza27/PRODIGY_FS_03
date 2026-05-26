import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { sellerRequirements } from "../../constants/account-become-seller.constants";

export default function BecomeSellerRequirements() {
  return (
    <Card className="border-white/10 bg-white/5 text-white">
      <CardHeader className="border-b border-white/10">
        <CardTitle className="text-lg">Requirements</CardTitle>
      </CardHeader>

      <CardContent className="pt-5">
        <ul className="space-y-3">
          {sellerRequirements.map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm text-zinc-300">
              <span className="mt-1 size-2 rounded-full bg-red-500" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}