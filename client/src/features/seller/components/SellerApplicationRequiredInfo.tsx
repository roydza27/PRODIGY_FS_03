import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

const ITEMS = [
  {
    title: "Shop Information",
    description: "Shop name, description, and category",
  },
  {
    title: "Contact Details",
    description: "Valid business email and phone number",
  },
  {
    title: "Banking Information",
    description: "Bank account details for payouts",
  },
  {
    title: "Business Documents",
    description: "Registration number and GST (if applicable)",
  },
];

export default function SellerApplicationRequiredInfo() {
  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle>Required Information</CardTitle>
        <CardDescription>
          What we need from you
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {ITEMS.map((item, index) => (
          <div key={item.title} className="flex gap-3">
            <div className="shrink-0 w-6 h-6 rounded-full bg-blue-600/20 flex items-center justify-center">
              <span className="text-xs font-semibold text-blue-200">
                {index + 1}
              </span>
            </div>

            <div>
              <p className="font-medium text-white">
                {item.title}
              </p>

              <p className="text-sm text-zinc-400">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}