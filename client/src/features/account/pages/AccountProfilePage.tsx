import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Separator } from "@/shared/components/ui/separator";

export default function AccountProfilePage() {
  return (
    <div className="min-h-screen bg-[#111113]/95 px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Profile</h1>
          <p className="mt-1 text-sm text-zinc-400">
            View and update your account information.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="border-white/10 bg-white/5 text-white">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm text-zinc-400">Full Name</label>
                  <Input defaultValue="Royal D Souza" className="border-white/10 bg-black/20 text-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-zinc-400">Email</label>
                  <Input defaultValue="royal@example.com" className="border-white/10 bg-black/20 text-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-zinc-400">Phone</label>
                  <Input defaultValue="+91 9876543210" className="border-white/10 bg-black/20 text-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-zinc-400">Location</label>
                  <Input defaultValue="Bengaluru, India" className="border-white/10 bg-black/20 text-white" />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button className="rounded-xl bg-red-500 hover:bg-red-600">Save changes</Button>
                <Button variant="outline" className="rounded-xl border-white/10 bg-transparent text-white hover:bg-white/5">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5 text-white">
            <CardHeader>
              <CardTitle>Account Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-zinc-400">
              <div className="flex items-center justify-between">
                <span>Status</span>
                <span className="text-emerald-400">Active</span>
              </div>
              <Separator className="bg-white/10" />
              <div className="flex items-center justify-between">
                <span>Member since</span>
                <span>May 2026</span>
              </div>
              <Separator className="bg-white/10" />
              <div className="flex items-center justify-between">
                <span>Orders placed</span>
                <span>12</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}