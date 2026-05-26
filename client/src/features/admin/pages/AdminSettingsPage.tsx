import { useMemo, useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import { Badge } from "@/shared/components/ui/badge";
import { Switch } from "@/shared/components/ui/switch";
import { Input } from "@/shared/components/ui/input";
import {
  ShieldCheck,
  Settings2,
  KeyRound,
  Bell,
  Store,
  Lock,
  Globe,
  Database,
  CircleAlert,
  CircleCheckBig,
  Sparkles,
  Users,
  CreditCard,
} from "lucide-react";

type ToggleState = {
  maintenanceMode: boolean;
  checkoutEnabled: boolean;
  guestCheckout: boolean;
  emailAlerts: boolean;
  newUserApproval: boolean;
  apiAccess: boolean;
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<ToggleState>({
    maintenanceMode: false,
    checkoutEnabled: true,
    guestCheckout: true,
    emailAlerts: true,
    newUserApproval: false,
    apiAccess: true,
  });

  const [storeName, setStoreName] = useState("Royal Store");
  const [supportEmail, setSupportEmail] = useState("support@royalstore.com");
  const [currency, setCurrency] = useState("INR");
  const [timezone, setTimezone] = useState("Asia/Kolkata");

  const statusSummary = useMemo(() => {
    const liveControls = [settings.checkoutEnabled, settings.guestCheckout, settings.emailAlerts, settings.apiAccess].filter(Boolean).length;
    const riskMode = settings.maintenanceMode ? "Attention" : "Normal";

    return {
      liveControls,
      riskMode,
      systemState: settings.maintenanceMode ? "Maintenance" : "Operational",
    };
  }, [settings]);

  const updateToggle = (key: keyof ToggleState, value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-[#111113]/95 px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-6xl space-y-6 text-left">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <Settings2 className="h-4 w-4 text-[#DB4444]" />
              Admin control center
            </div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Settings</h1>
            <p className="max-w-2xl text-sm text-zinc-400 sm:text-base">
              Configure store preferences, permissions, alerts, and system controls from one polished admin workspace.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:min-w-[560px]">
            <div className="rounded-2xl border border-white/10 bg-[#18181B] p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">System</p>
              <p className="mt-2 text-lg font-bold text-white">{statusSummary.systemState}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#18181B] p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">Mode</p>
              <p className="mt-2 text-lg font-bold text-amber-300">{statusSummary.riskMode}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#18181B] p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">Live controls</p>
              <p className="mt-2 text-lg font-bold text-white">{statusSummary.liveControls}/4</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#18181B] p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">Security</p>
              <p className="mt-2 text-lg font-bold text-emerald-300">Protected</p>
            </div>
          </div>
        </div>

        <Card className="border-white/10 bg-[#18181B] shadow-xl">
          <CardContent className="grid gap-5 p-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#DB4444]/20 bg-[#DB4444]/10 text-[#DB4444]">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">System overview</p>
                <p className="mt-1 text-sm text-zinc-400">
                  These settings control storefront availability, access permissions, notifications, and integration safety.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Badge className="justify-center border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-emerald-300 hover:bg-emerald-500/10">
                <CircleCheckBig className="mr-1 h-3.5 w-3.5" />
                Stable
              </Badge>
              <Badge className="justify-center border-blue-500/20 bg-blue-500/10 px-3 py-2 text-blue-300 hover:bg-blue-500/10">
                <Store className="mr-1 h-3.5 w-3.5" />
                Store active
              </Badge>
              <Badge className="justify-center border-amber-500/20 bg-amber-500/10 px-3 py-2 text-amber-300 hover:bg-amber-500/10">
                <Bell className="mr-1 h-3.5 w-3.5" />
                Alerts on
              </Badge>
              <Badge className="justify-center border-white/10 bg-white/5 px-3 py-2 text-zinc-300 hover:bg-white/5">
                <KeyRound className="mr-1 h-3.5 w-3.5" />
                Secure access
              </Badge>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 xl:grid-cols-2">
          <Card className="border-white/10 bg-[#18181B] text-white shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5 text-[#DB4444]" />
                Store Preferences
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Control storefront behavior and public-facing configuration.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-zinc-300">
              <div className="rounded-2xl bg-black/20 p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-white">Maintenance Mode</p>
                    <p className="mt-1 text-xs text-zinc-500">Pause storefront browsing while making updates.</p>
                  </div>
                  <Switch
                    checked={settings.maintenanceMode}
                    onCheckedChange={(checked) => updateToggle("maintenanceMode", checked)}
                  />
                </div>
                <Separator className="bg-white/10" />
                <div className="mt-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-white">Checkout Enabled</p>
                    <p className="mt-1 text-xs text-zinc-500">Allow customers to place orders.</p>
                  </div>
                  <Switch
                    checked={settings.checkoutEnabled}
                    onCheckedChange={(checked) => updateToggle("checkoutEnabled", checked)}
                  />
                </div>
                <Separator className="my-3 bg-white/10" />
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-white">Guest Checkout</p>
                    <p className="mt-1 text-xs text-zinc-500">Let customers buy without creating an account.</p>
                  </div>
                  <Switch
                    checked={settings.guestCheckout}
                    onCheckedChange={(checked) => updateToggle("guestCheckout", checked)}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs uppercase tracking-[0.16em] text-zinc-500">Store name</label>
                  <Input
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="border-white/10 bg-black/20 text-white placeholder:text-zinc-500 focus-visible:ring-[#DB4444]"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs uppercase tracking-[0.16em] text-zinc-500">Support email</label>
                  <Input
                    value={supportEmail}
                    onChange={(e) => setSupportEmail(e.target.value)}
                    className="border-white/10 bg-black/20 text-white placeholder:text-zinc-500 focus-visible:ring-[#DB4444]"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs uppercase tracking-[0.16em] text-zinc-500">Currency</label>
                  <Input
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="border-white/10 bg-black/20 text-white placeholder:text-zinc-500 focus-visible:ring-[#DB4444]"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs uppercase tracking-[0.16em] text-zinc-500">Timezone</label>
                  <Input
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="border-white/10 bg-black/20 text-white placeholder:text-zinc-500 focus-visible:ring-[#DB4444]"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <Button className="rounded-xl bg-[#DB4444] text-white hover:bg-[#c53a3a]">
                  Save Preferences
                </Button>
                <Button variant="outline" className="rounded-xl border-white/10 bg-black/20 text-white hover:bg-white/5">
                  Preview storefront
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-[#18181B] text-white shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-[#DB4444]" />
                System Access
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Manage permissions, credentials, and restricted features.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-zinc-300">
              <div className="rounded-2xl bg-black/20 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-white">Admin Roles</p>
                    <p className="mt-1 text-xs text-zinc-500">Assign store managers and staff permissions.</p>
                  </div>
                  <Button className="rounded-xl bg-[#DB4444] hover:bg-[#c53a3a] text-white">
                    Manage
                  </Button>
                </div>
              </div>

              <Separator className="bg-white/10" />

              <div className="rounded-2xl bg-black/20 p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-white">API Access</p>
                    <p className="mt-1 text-xs text-zinc-500">Enable integrations and automation tokens.</p>
                  </div>
                  <Switch
                    checked={settings.apiAccess}
                    onCheckedChange={(checked) => updateToggle("apiAccess", checked)}
                  />
                </div>
                <Separator className="bg-white/10" />
                <div className="mt-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-white">New User Approval</p>
                    <p className="mt-1 text-xs text-zinc-500">Require manual approval for new admin users.</p>
                  </div>
                  <Switch
                    checked={settings.newUserApproval}
                    onCheckedChange={(checked) => updateToggle("newUserApproval", checked)}
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="flex items-center gap-2 text-white">
                    <KeyRound className="h-4 w-4 text-[#DB4444]" />
                    API Keys
                  </div>
                  <p className="mt-2 text-xs text-zinc-500">View and rotate service keys securely.</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="flex items-center gap-2 text-white">
                    <Database className="h-4 w-4 text-[#DB4444]" />
                    Backups
                  </div>
                  <p className="mt-2 text-xs text-zinc-500">Schedule exports and restore points.</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <Button variant="outline" className="rounded-xl border-white/10 bg-black/20 text-white hover:bg-white/5">
                  View API keys
                </Button>
                <Button variant="outline" className="rounded-xl border-white/10 bg-black/20 text-white hover:bg-white/5">
                  Security audit
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <Card className="border-white/10 bg-[#18181B] text-white shadow-xl xl:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-[#DB4444]" />
                Alerts and Notifications
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Tune how your team gets notified about important store events.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-zinc-300">
              <div className="rounded-2xl bg-black/20 p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-white">Email alerts</p>
                    <p className="mt-1 text-xs text-zinc-500">Receive admin notifications by email.</p>
                  </div>
                  <Switch
                    checked={settings.emailAlerts}
                    onCheckedChange={(checked) => updateToggle("emailAlerts", checked)}
                  />
                </div>
                <Separator className="bg-white/10" />
                <div className="mt-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-white">Order approval workflow</p>
                    <p className="mt-1 text-xs text-zinc-500">Require manual review for risky orders.</p>
                  </div>
                  <Switch checked={true} onCheckedChange={() => undefined} />
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="flex items-center gap-2 text-white">
                    <CircleAlert className="h-4 w-4 text-amber-300" />
                    Risk flags
                  </div>
                  <p className="mt-2 text-xs text-zinc-500">Low stock, failed payments, and suspicious activity.</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="flex items-center gap-2 text-white">
                    <Users className="h-4 w-4 text-blue-300" />
                    Team alerts
                  </div>
                  <p className="mt-2 text-xs text-zinc-500">Notify assigned staff for operational changes.</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="flex items-center gap-2 text-white">
                    <Globe className="h-4 w-4 text-emerald-300" />
                    Locale
                  </div>
                  <p className="mt-2 text-xs text-zinc-500">Regional formatting and timing rules.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-[#18181B] text-white shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#DB4444]" />
                Health Summary
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Quick state of the admin system.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-zinc-300">
              <div className="flex items-center justify-between rounded-2xl bg-black/20 px-4 py-3">
                <span>Store status</span>
                <span className={settings.maintenanceMode ? "text-amber-300" : "text-emerald-300"}>
                  {settings.maintenanceMode ? "Maintenance" : "Live"}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-black/20 px-4 py-3">
                <span>Checkout</span>
                <span className={settings.checkoutEnabled ? "text-emerald-300" : "text-red-300"}>
                  {settings.checkoutEnabled ? "Enabled" : "Disabled"}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-black/20 px-4 py-3">
                <span>Guest checkout</span>
                <span className={settings.guestCheckout ? "text-emerald-300" : "text-zinc-400"}>
                  {settings.guestCheckout ? "On" : "Off"}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-black/20 px-4 py-3">
                <span>API access</span>
                <span className={settings.apiAccess ? "text-emerald-300" : "text-red-300"}>
                  {settings.apiAccess ? "Allowed" : "Blocked"}
                </span>
              </div>
              <div className="rounded-2xl border border-[#DB4444]/20 bg-[#DB4444]/10 p-4 text-[#ffd7d7]">
                Use these controls carefully. Changes affect the entire storefront and admin workflow.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
