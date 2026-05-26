"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Badge } from "@/shared/components/ui/badge";
import { Switch } from "@/shared/components/ui/switch";
import { Separator } from "@/shared/components/ui/separator";
import {
  Bell,
  CheckCircle2,
  CreditCard,
  Globe,
  Mail,
  Megaphone,
  Package,
  ShieldCheck,
  Store,
  Truck,
  Upload,
  Users,
  Palette,
  Eye,
  Lock,
} from "lucide-react";
import { toast } from "sonner";

type NotificationState = {
  orders: boolean;
  reviews: boolean;
  payments: boolean;
  promotions: boolean;
  stock: boolean;
};

export default function SellerSettingsPage() {
  const [notifications, setNotifications] = useState<NotificationState>({
    orders: true,
    reviews: true,
    payments: true,
    promotions: false,
    stock: true,
  });

  const [shopName, setShopName] = useState("Royal Store");
  const [shopDescription, setShopDescription] = useState(
    "Modern essentials, accessories, and daily products curated for a premium shopping experience."
  );
  const [returnPolicy, setReturnPolicy] = useState(
    "Returns accepted within 7 days of delivery for unopened and unused items with original packaging."
  );
  const [shippingPolicy, setShippingPolicy] = useState(
    "Orders are processed within 24 hours. Delivery timelines vary by location and carrier availability."
  );
  const [accountName, setAccountName] = useState("Royal D Souza");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifsc, setIfsc] = useState("SBIN0001234");
  const [bankName, setBankName] = useState("State Bank of India");

  const completion = useMemo(() => {
    const score = [shopName, shopDescription, returnPolicy, shippingPolicy, accountName, ifsc, bankName].filter(Boolean).length;
    return Math.round((score / 7) * 100);
  }, [shopName, shopDescription, returnPolicy, shippingPolicy, accountName, ifsc, bankName]);

  const saveToast = (label: string) => {
    toast.success(`${label} saved successfully`);
  };

  const handleBankSave = () => {
    if (!accountName.trim() || !accountNumber.trim() || !ifsc.trim() || !bankName.trim()) {
      toast.error("Please fill in all bank details");
      return;
    }
    saveToast("Bank details");
  };

  return (
    <div className="min-h-screen bg-[#111113] px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl space-y-8 text-left px-">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <Store className="h-4 w-4 text-[#DB4444]" />
              Store settings
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Shop Settings</h1>
            <p className="max-w-2xl text-sm text-zinc-400 sm:text-base">
              Manage your storefront identity, policies, banking details, and seller notifications from one organized workspace.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:min-w-[560px]">
            <div className="rounded-2xl border border-white/10 bg-[#18181B] p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">Profile</p>
              <p className="mt-2 text-2xl font-bold text-white">94%</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#18181B] p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">Verification</p>
              <p className="mt-2 text-2xl font-bold text-emerald-300">Verified</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#18181B] p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">Orders</p>
              <p className="mt-2 text-2xl font-bold text-white">128</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#18181B] p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">Rating</p>
              <p className="mt-2 text-2xl font-bold text-[#DB4444]">4.8</p>
            </div>
          </div>
        </div>

        <Card className="border-white/10 bg-[#18181B] shadow-xl">
          <CardContent className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#DB4444]/20 bg-[#DB4444]/10 text-[#DB4444]">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Account health</p>
                <p className="mt-1 text-sm text-zinc-400">
                  Your shop is in good standing. Complete a few more fields to improve discoverability and trust.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="border-emerald-500/20 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/10">
                <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                Active Seller
              </Badge>
              <Badge className="border-white/10 bg-white/5 text-zinc-300 hover:bg-white/5">
                {completion}% profile complete
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="shop" className="space-y-6">
          <TabsList className="flex w-full gap-2 rounded-2xl border border-white/10 bg-[#18181B] p-8">
            {[
              { value: "shop", label: "Shop Profile", icon: Store },
              { value: "policies", label: "Policies", icon: Globe },
              { value: "bank", label: "Bank Account", icon: CreditCard },
              { value: "notifications", label: "Notifications", icon: Bell },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex items-center justify-center gap-2 rounded-xl py-6 px-6 text-sm data-[state=active]:bg-[#DB4444] data-[state=active]:text-white"
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="shop" className="mt-0">
            <div className="grid gap-6 xl:grid-cols-3">
              <Card className="border-white/10 bg-[#18181B] shadow-xl xl:col-span-2">
                <CardHeader>
                  <CardTitle className="text-white">Shop Profile</CardTitle>
                  <CardDescription className="text-zinc-400">
                    Control how your storefront appears to customers.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <label className="mb-2 block text-sm font-medium text-zinc-200">Shop Name</label>
                      <Input
                        value={shopName}
                        onChange={(e) => setShopName(e.target.value)}
                        placeholder="Your shop name"
                        className="border-white/10 bg-black/20 text-white placeholder:text-zinc-500 focus-visible:ring-[#DB4444]"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="mb-2 block text-sm font-medium text-zinc-200">Shop Description</label>
                      <Textarea
                        value={shopDescription}
                        onChange={(e) => setShopDescription(e.target.value)}
                        rows={5}
                        placeholder="Describe your shop"
                        className="border-white/10 bg-black/20 text-white placeholder:text-zinc-500 focus-visible:ring-[#DB4444]"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-zinc-200">Shop Logo</label>
                      <div className="flex items-center gap-3 rounded-2xl border border-dashed border-white/10 bg-black/20 p-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#DB4444]/10 text-[#DB4444]">
                          <Upload className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">Upload logo</p>
                          <p className="text-xs text-zinc-400">PNG or JPG up to 2MB</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-zinc-200">Shop Category</label>
                      <Input
                        defaultValue="General Merchandise"
                        className="border-white/10 bg-black/20 text-white placeholder:text-zinc-500 focus-visible:ring-[#DB4444]"
                      />
                    </div>
                  </div>

                  <Separator className="bg-white/10" />

                  <div className="flex flex-wrap gap-3">
                    <Button className="bg-[#DB4444] text-white hover:bg-[#c53a3a]" onClick={() => saveToast("Shop profile")}>
                      Save Shop Profile
                    </Button>
                    <Button variant="outline" className="border-white/10 bg-black/20 hover:bg-white/5">
                      Preview storefront
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-[#18181B] shadow-xl">
                <CardHeader>
                  <CardTitle className="text-white">Store Preview</CardTitle>
                  <CardDescription className="text-zinc-400">
                    A quick view of how customers see your brand.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#DB4444]/10 text-[#DB4444]">
                        <Store className="h-7 w-7" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{shopName}</h3>
                        <p className="text-sm text-zinc-400">Premium e-commerce storefront</p>
                      </div>
                    </div>

                    <p className="mt-4 text-sm leading-6 text-zinc-300">{shopDescription}</p>

                    <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                        <p className="text-zinc-500">Fulfillment</p>
                        <p className="mt-1 text-white">Fast shipping</p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                        <p className="text-zinc-500">Support</p>
                        <p className="mt-1 text-white">Mon–Sat</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-200">
                    Your store profile looks ready for public display.
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="policies" className="mt-0">
            <div className="grid gap-6 xl:grid-cols-2">
              <Card className="border-white/10 bg-[#18181B] shadow-xl">
                <CardHeader>
                  <CardTitle className="text-white">Return Policy</CardTitle>
                  <CardDescription className="text-zinc-400">Set customer expectations clearly.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    value={returnPolicy}
                    onChange={(e) => setReturnPolicy(e.target.value)}
                    rows={8}
                    placeholder="Describe your return policy"
                    className="border-white/10 bg-black/20 text-white placeholder:text-zinc-500 focus-visible:ring-[#DB4444]"
                  />
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-zinc-400">
                    Make this short, fair, and easy to understand. Clear return terms improve conversion.
                  </div>
                  <Button className="bg-[#DB4444] text-white hover:bg-[#c53a3a]" onClick={() => saveToast("Return policy")}>
                    Save Return Policy
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-[#18181B] shadow-xl">
                <CardHeader>
                  <CardTitle className="text-white">Shipping Policy</CardTitle>
                  <CardDescription className="text-zinc-400">Explain fulfillment speed and delivery rules.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    value={shippingPolicy}
                    onChange={(e) => setShippingPolicy(e.target.value)}
                    rows={8}
                    placeholder="Describe your shipping policy"
                    className="border-white/10 bg-black/20 text-white placeholder:text-zinc-500 focus-visible:ring-[#DB4444]"
                  />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <div className="flex items-center gap-2 text-sm font-medium text-white">
                        <Truck className="h-4 w-4 text-[#DB4444]" />
                        Shipping time
                      </div>
                      <p className="mt-2 text-sm text-zinc-400">Same-day or next-day dispatch where possible.</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <div className="flex items-center gap-2 text-sm font-medium text-white">
                        <Megaphone className="h-4 w-4 text-[#DB4444]" />
                        Customer notice
                      </div>
                      <p className="mt-2 text-sm text-zinc-400">Mention delays for remote areas or holidays.</p>
                    </div>
                  </div>
                  <Button className="bg-[#DB4444] text-white hover:bg-[#c53a3a]" onClick={() => saveToast("Shipping policy")}>
                    Save Shipping Policy
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="bank" className="mt-0">
            <div className="grid gap-6 xl:grid-cols-3">
              <Card className="border-white/10 bg-[#18181B] shadow-xl xl:col-span-2">
                <CardHeader>
                  <CardTitle className="text-white">Bank Account Details</CardTitle>
                  <CardDescription className="text-zinc-400">
                    Used for payouts, refunds, and settlement processing.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-zinc-200">Account Holder Name</label>
                      <Input
                        value={accountName}
                        onChange={(e) => setAccountName(e.target.value)}
                        placeholder="Account holder name"
                        className="border-white/10 bg-black/20 text-white placeholder:text-zinc-500 focus-visible:ring-[#DB4444]"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-zinc-200">Account Number</label>
                      <Input
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        type="password"
                        placeholder="Account number"
                        className="border-white/10 bg-black/20 text-white placeholder:text-zinc-500 focus-visible:ring-[#DB4444]"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-zinc-200">IFSC Code</label>
                      <Input
                        value={ifsc}
                        onChange={(e) => setIfsc(e.target.value)}
                        placeholder="Bank IFSC code"
                        className="border-white/10 bg-black/20 text-white placeholder:text-zinc-500 focus-visible:ring-[#DB4444]"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-zinc-200">Bank Name</label>
                      <Input
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        placeholder="Bank name"
                        className="border-white/10 bg-black/20 text-white placeholder:text-zinc-500 focus-visible:ring-[#DB4444]"
                      />
                    </div>
                  </div>

                  <Separator className="bg-white/10" />

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <div className="flex items-center gap-2 text-sm font-medium text-white">
                        <Lock className="h-4 w-4 text-[#DB4444]" />
                        Secure storage
                      </div>
                      <p className="mt-2 text-sm text-zinc-400">Bank data is protected and masked in the UI.</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <div className="flex items-center gap-2 text-sm font-medium text-white">
                        <CreditCard className="h-4 w-4 text-[#DB4444]" />
                        Fast payouts
                      </div>
                      <p className="mt-2 text-sm text-zinc-400">Weekly settlement and automated transfers.</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <div className="flex items-center gap-2 text-sm font-medium text-white">
                        <ShieldCheck className="h-4 w-4 text-[#DB4444]" />
                        Verification
                      </div>
                      <p className="mt-2 text-sm text-zinc-400">Matched details improve payout reliability.</p>
                    </div>
                  </div>

                  <Button className="bg-[#DB4444] text-white hover:bg-[#c53a3a]" onClick={handleBankSave}>
                    Update Bank Details
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-[#18181B] shadow-xl">
                <CardHeader>
                  <CardTitle className="text-white">Payout Preview</CardTitle>
                  <CardDescription className="text-zinc-400">
                    What buyers and finance systems expect.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Account holder</p>
                    <p className="mt-1 text-white">{accountName || "—"}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Bank</p>
                    <p className="mt-1 text-white">{bankName || "—"}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">IFSC</p>
                    <p className="mt-1 font-mono text-white">{ifsc || "—"}</p>
                  </div>
                  <div className="rounded-2xl border border-[#DB4444]/20 bg-[#DB4444]/10 p-4 text-sm text-[#ffd7d7]">
                    Use the exact account details registered with your bank to avoid payout delays.
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="mt-0">
            <div className="grid gap-6 xl:grid-cols-3">
              <Card className="border-white/10 bg-[#18181B] shadow-xl xl:col-span-2">
                <CardHeader>
                  <CardTitle className="text-white">Notification Preferences</CardTitle>
                  <CardDescription className="text-zinc-400">
                    Choose what seller events should reach you instantly.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      key: "orders",
                      label: "New order notifications",
                      description: "Get alerted when a customer places a new order.",
                      icon: Package,
                    },
                    {
                      key: "reviews",
                      label: "Product review notifications",
                      description: "Know when customers leave feedback on your products.",
                      icon: Users,
                    },
                    {
                      key: "payments",
                      label: "Payment notifications",
                      description: "Track successful payments and payout events.",
                      icon: CreditCard,
                    },
                    {
                      key: "promotions",
                      label: "Promotion updates",
                      description: "Receive platform and campaign promotion alerts.",
                      icon: Megaphone,
                    },
                    {
                      key: "stock",
                      label: "Low stock alerts",
                      description: "Get notified when inventory reaches reorder levels.",
                      icon: Bell,
                    },
                  ].map((item) => {
                    const Icon = item.icon;
                    const isEnabled = notifications[item.key as keyof NotificationState];

                    return (
                      <div
                        key={item.key}
                        className="flex items-start justify-between gap-4 rounded-2xl border border-white/10 bg-black/20 p-4"
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-[#DB4444]/10 text-[#DB4444]">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{item.label}</p>
                            <p className="mt-1 text-sm text-zinc-400">{item.description}</p>
                          </div>
                        </div>
                        <Switch
                          checked={isEnabled}
                          onCheckedChange={(checked) =>
                            setNotifications((prev) => ({
                              ...prev,
                              [item.key]: checked,
                            }))
                          }
                        />
                      </div>
                    );
                  })}

                  <div className="flex flex-wrap gap-3 pt-2">
                    <Button className="bg-[#DB4444] text-white hover:bg-[#c53a3a]" onClick={() => saveToast("Notification preferences") }>
                      Save Preferences
                    </Button>
                    <Button variant="outline" className="border-white/10 bg-black/20 hover:bg-white/5">
                      Test notification
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-[#18181B] shadow-xl">
                <CardHeader>
                  <CardTitle className="text-white">Delivery Channels</CardTitle>
                  <CardDescription className="text-zinc-400">
                    How alerts reach your team.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-white">
                      <Mail className="h-4 w-4 text-[#DB4444]" />
                      Email
                    </div>
                    <p className="mt-2 text-sm text-zinc-400">Primary channel for order and payment alerts.</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-white">
                      <Bell className="h-4 w-4 text-[#DB4444]" />
                      App notifications
                    </div>
                    <p className="mt-2 text-sm text-zinc-400">Best for urgent stock and fulfillment updates.</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-white">
                      <Users className="h-4 w-4 text-[#DB4444]" />
                      Team alerts
                    </div>
                    <p className="mt-2 text-sm text-zinc-400">Useful when multiple staff manage orders.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
