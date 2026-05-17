import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";

export default function AdminSettingsPage() {
  return (
    <div className="min-h-screen bg-[#111113]/95 px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Configure store preferences, permissions, and system controls.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-white/10 bg-white/5 text-white">
            <CardHeader>
              <CardTitle>Store Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-zinc-300">
              <div className="flex items-center justify-between">
                <span>Maintenance Mode</span>
                <Button variant="outline" className="rounded-xl border-white/10 bg-transparent hover:bg-white/5">
                  Off
                </Button>
              </div>
              <Separator className="bg-white/10" />
              <div className="flex items-center justify-between">
                <span>Checkout Enabled</span>
                <Button variant="outline" className="rounded-xl border-white/10 bg-transparent hover:bg-white/5">
                  On
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5 text-white">
            <CardHeader>
              <CardTitle>System Access</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-zinc-300">
              <div className="flex items-center justify-between">
                <span>Admin Roles</span>
                <Button className="rounded-xl bg-red-500 hover:bg-red-600">Manage</Button>
              </div>
              <Separator className="bg-white/10" />
              <div className="flex items-center justify-between">
                <span>API Keys</span>
                <Button variant="outline" className="rounded-xl border-white/10 bg-transparent hover:bg-white/5">
                  View
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}