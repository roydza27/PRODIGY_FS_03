import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";

const staff = [
  { name: "Anita Rao", role: "Support Lead", status: "Active" },
  { name: "Karan Mehta", role: "Inventory Manager", status: "Active" },
  { name: "Simran Kaur", role: "Operations", status: "On Leave" },
];

export default function AdminStaffPage() {
  return (
    <div className="min-h-screen bg-[#111113]/95 px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Staff</h1>
            <p className="mt-1 text-sm text-zinc-400">
              Manage operational roles, availability, and team access.
            </p>
          </div>
          <Button className="rounded-xl bg-red-500 hover:bg-red-600">Invite Staff</Button>
        </div>

        <Card className="border-white/10 bg-white/5 text-white">
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {staff.map((member) => (
              <div
                key={member.name}
                className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/20 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium">{member.name}</p>
                  <p className="mt-1 text-sm text-zinc-400">{member.role}</p>
                </div>
                <Badge className="bg-zinc-800 text-zinc-100 hover:bg-zinc-800">
                  {member.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}