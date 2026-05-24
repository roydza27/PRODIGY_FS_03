import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";

type Props = {
  label: string;
  value: string | number;
};

export default function AccountOrdersStatCard({ label, value }: Props) {
  return (
    <Card className="border-white/10 bg-white/5 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-zinc-400">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-2xl font-semibold">{value}</CardContent>
    </Card>
  );
}