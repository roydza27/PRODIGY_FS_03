import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";

type Props = {
  label: string;
  value: string | number;
  description?: string;
};

export default function AnalyticsStatCard({ label, value, description }: Props) {
  return (
    <Card className="border-white/10 bg-white/5 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-zinc-400">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold">{value}</div>
        {description ? (
          <p className="mt-2 text-xs text-zinc-500">{description}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}