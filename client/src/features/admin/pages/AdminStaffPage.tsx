import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import {
  ShieldCheck,
  Users,
  UserPlus,
  Clock3,
  BriefcaseBusiness,
} from "lucide-react";

const staff = [
  { name: "Anita Rao", role: "Support Lead", status: "Active" },
  { name: "Karan Mehta", role: "Inventory Manager", status: "Active" },
  { name: "Simran Kaur", role: "Operations", status: "On Leave" },
] as const;

function getStatusClass(status: string) {
  switch (status) {
    case "Active":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";
    case "On Leave":
      return "border-amber-500/20 bg-amber-500/10 text-amber-300";
    default:
      return "border-white/10 bg-white/5 text-zinc-300";
  }
}

export default function AdminStaffPage() {
  const activeCount = staff.filter((member) => member.status === "Active").length;
  const onLeaveCount = staff.filter((member) => member.status === "On Leave").length;

  return (
    <div className="min-h-screen bg-[#111113]/95 px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <Users className="h-4 w-4 text-[#DB4444]" />
              Team management
            </div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Staff</h1>
            <p className="max-w-2xl text-sm text-zinc-400 sm:text-base">
              Manage operational roles, availability, and team access from one clean admin screen.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:min-w-[560px]">
            <div className="rounded-2xl border border-white/10 bg-[#18181B] p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">Members</p>
              <p className="mt-2 text-2xl font-bold text-white">{staff.length}</p>
            </div>
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-emerald-200/80">Active</p>
              <p className="mt-2 text-2xl font-bold text-emerald-300">{activeCount}</p>
            </div>
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-amber-200/80">On leave</p>
              <p className="mt-2 text-2xl font-bold text-amber-300">{onLeaveCount}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#18181B] p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">Roles</p>
              <p className="mt-2 text-2xl font-bold text-white">3</p>
            </div>
          </div>
        </div>

        <Card className="border-white/10 bg-[#18181B] text-white shadow-xl">
          <CardContent className="grid gap-5 p-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#DB4444]/20 bg-[#DB4444]/10 text-[#DB4444]">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Team overview</p>
                <p className="mt-1 text-sm text-zinc-400">
                  Keep support, inventory, and operations aligned with clear staff ownership.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Badge className="justify-center border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-emerald-300 hover:bg-emerald-500/10">
                <Clock3 className="mr-1 h-3.5 w-3.5" />
                Scheduled
              </Badge>
              <Badge className="justify-center border-blue-500/20 bg-blue-500/10 px-3 py-2 text-blue-300 hover:bg-blue-500/10">
                <BriefcaseBusiness className="mr-1 h-3.5 w-3.5" />
                Operational
              </Badge>
              <Badge className="justify-center border-white/10 bg-white/5 px-3 py-2 text-zinc-300 hover:bg-white/5">
                <Users className="mr-1 h-3.5 w-3.5" />
                Team active
              </Badge>
              <Badge className="justify-center border-[#DB4444]/20 bg-[#DB4444]/10 px-3 py-2 text-[#ffd7d7] hover:bg-[#DB4444]/10">
                <UserPlus className="mr-1 h-3.5 w-3.5" />
                Invite ready
              </Badge>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
          <Card className="border-white/10 bg-[#18181B] text-white shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <div>
                <CardTitle>Team Members</CardTitle>
                <CardDescription className="text-zinc-400">
                  View roles and availability for each staff member.
                </CardDescription>
              </div>
              <Button className="rounded-xl bg-[#DB4444] hover:bg-[#c53a3a] text-white">
                <UserPlus className="mr-2 h-4 w-4" />
                Invite Staff
              </Button>
            </CardHeader>

            <CardContent className="space-y-4">
              {staff.map((member) => (
                <div
                  key={member.name}
                  className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/20 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-white">{member.name}</p>
                    <p className="mt-1 text-sm text-zinc-400">{member.role}</p>
                  </div>

                  <Badge className={`w-fit border px-3 py-1 ${getStatusClass(member.status)}`}>
                    {member.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-[#18181B] text-white shadow-xl">
            <CardHeader>
              <CardTitle>Staff Summary</CardTitle>
              <CardDescription className="text-zinc-400">
                Quick operational snapshot.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-zinc-300">
              <div className="flex items-center justify-between rounded-2xl bg-black/20 px-4 py-3">
                <span>Total members</span>
                <span className="text-white">{staff.length}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-black/20 px-4 py-3">
                <span>Active staff</span>
                <span className="text-emerald-300">{activeCount}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-black/20 px-4 py-3">
                <span>On leave</span>
                <span className="text-amber-300">{onLeaveCount}</span>
              </div>
              <div className="rounded-2xl border border-[#DB4444]/20 bg-[#DB4444]/10 p-4 text-[#ffd7d7]">
                Use staff roles to keep support, operations, and inventory responsibilities clear.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}