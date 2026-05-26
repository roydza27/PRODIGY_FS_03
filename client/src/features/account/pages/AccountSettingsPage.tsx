"use client";

import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  Bell,
  ChevronRight,
  Edit2,
  KeyRound,
  Lock,
  Mail,
  MapPin,
  Package,
  Plus,
  Save,
  ShieldCheck,
  Smartphone,
  Star,
  Trash2,
  X,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/shared/components/ui/card";
import { Switch } from "@/shared/components/ui/switch";
import { Button } from "@/shared/components/ui/button";
import { toast } from "sonner";

import ProfileFormCard from "@/features/account/components/account-profile/ProfileFormCard";
import AccountOverviewCard from "@/features/account/components/account-profile/AccountOverviewCard";
import { accountProfileData } from "@/features/account/constants/account-profile.constants";

type NotificationKey = "orders" | "promo" | "sms";

function SectionHeader({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description?: string;
  icon: React.ElementType;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div>
        <CardTitle className="text-base sm:text-lg">{title}</CardTitle>
        {description ? (
          <CardDescription className="text-zinc-400">{description}</CardDescription>
        ) : null}
      </div>
    </div>
  );
}

function ActionRow({
  title,
  description,
  icon: Icon,
  buttonLabel,
  onClick,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  buttonLabel: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-left transition hover:border-white/15 hover:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-[#DB4444]/40"
    >
      <div className="flex items-center gap-4">
        <div className="rounded-xl bg-white/5 p-2 text-zinc-300">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{title}</p>
          <p className="text-xs text-zinc-500">{description}</p>
        </div>
      </div>

      <span className="flex items-center gap-2 text-sm font-medium text-zinc-200">
        {buttonLabel}
        <ChevronRight className="h-4 w-4 text-zinc-500" />
      </span>
    </button>
  );
}

function DeleteAccountDialog({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const [confirmText, setConfirmText] = useState("");
  const canDelete = confirmText === "DELETE";

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full text max-w-md rounded-3xl border border-red-900/30 bg-[#111113] p-6 shadow-2xl">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-red-500/10 p-2.5">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <h2 id="delete-dialog-title" className="text-base font-semibold text-white">
                Delete your account?
              </h2>
              <p className="mt-1 text-xs text-zinc-400">
                This permanently removes your profile and data.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-lg p-1.5 text-zinc-500 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DB4444]/60"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mb-5 rounded-2xl border border-red-900/20 bg-red-950/10 p-4">
          <ul className="space-y-2 text-sm text-red-200/85">
            {[
              "Profile and personal data will be removed",
              "Active orders may be affected",
              "Order history will no longer be accessible",
              "This action cannot be undone",
            ].map((line) => (
              <li key={line} className="flex items-start gap-2">
                <span className="mt-1 text-red-400">•</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-5 space-y-2">
          <label
            htmlFor="confirm-delete"
            className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400"
          >
            Type <span className="font-mono text-red-400">DELETE</span> to confirm
          </label>
          <input
            id="confirm-delete"
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="DELETE"
            className="w-full rounded-2xl border border-white/10 bg-[#09090B] px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20"
          />
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1 rounded-2xl border-white/10 bg-transparent text-zinc-200 hover:bg-white/5 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={!canDelete}
            onClick={onConfirm}
            className="flex-1 rounded-2xl bg-red-600 text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  );
}

function ChangePasswordDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [form, setForm] = useState({ current: "", next: "", confirm: "" });
  const [saving, setSaving] = useState(false);

  const mismatch = form.next.length > 0 && form.confirm.length > 0 && form.next !== form.confirm;
  const canSubmit =
    form.current.length >= 8 &&
    form.next.length >= 8 &&
    form.next === form.confirm;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success("Password updated successfully");
      onClose();
    }, 1000);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pw-dialog-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#111113] p-6 shadow-2xl">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-emerald-500/10 p-2.5">
              <KeyRound className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <h2 id="pw-dialog-title" className="text-base font-semibold text-white">
                Change Password
              </h2>
              <p className="mt-1 text-xs text-zinc-400">
                Use a strong password that is not reused elsewhere.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-lg p-1.5 text-zinc-500 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DB4444]/60"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { id: "current", label: "Current Password", key: "current" as const },
            { id: "next", label: "New Password", key: "next" as const },
            { id: "confirm", label: "Confirm New Password", key: "confirm" as const },
          ].map(({ id, label, key }) => (
            <div key={id} className="space-y-2">
              <label htmlFor={id} className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
                {label}
              </label>
              <input
                id={id}
                type="password"
                value={form[key]}
                onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
                placeholder="••••••••"
                minLength={8}
                required
                className={[
                  "w-full rounded-2xl border bg-[#09090B] px-4 py-3 text-sm text-white outline-none transition",
                  key === "confirm" && mismatch
                    ? "border-red-500/60 focus:border-red-500/60 focus:ring-2 focus:ring-red-500/20"
                    : "border-white/10 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20",
                ].join(" ")}
              />
              {key === "confirm" && mismatch ? (
                <p className="text-xs text-red-400">Passwords do not match.</p>
              ) : null}
            </div>
          ))}

          <div className="flex gap-3 pt-1">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 rounded-2xl border-white/10 bg-transparent text-zinc-200 hover:bg-white/5 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!canSubmit || saving}
              className="flex-1 rounded-2xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-40"
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Saving…
                </span>
              ) : (
                "Update Password"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function TwoFactorDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [code, setCode] = useState("");
  const [saving, setSaving] = useState(false);

  const handleEnable = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length < 6) return;

    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success("Two-factor authentication enabled");
      onClose();
    }, 1000);
  };

  const qrPattern = useMemo(
    () =>
      Array.from({ length: 64 }, (_, i) => ((i * 7 + 3) % 11 < 5 ? "solid" : "empty")),
    [],
  );

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tfa-dialog-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#111113] p-6 shadow-2xl">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-indigo-500/10 p-2.5">
              <ShieldCheck className="h-5 w-5 text-indigo-400" />
            </div>
            <div>
              <h2 id="tfa-dialog-title" className="text-base font-semibold text-white">
                Enable Two-Factor Auth
              </h2>
              <p className="mt-1 text-xs text-zinc-400">
                Add an extra layer of protection to your account.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-lg p-1.5 text-zinc-500 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DB4444]/60"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mb-5 rounded-2xl border border-white/10 bg-[#09090B] p-5">
          <div className="mx-auto grid h-32 w-32 grid-cols-8 gap-0.5">
            {qrPattern.map((cell, i) => (
              <div
                key={i}
                className="rounded-[1px]"
                style={{ background: cell === "solid" ? "#fff" : "transparent" }}
              />
            ))}
          </div>
          <p className="mt-3 text-center text-xs text-zinc-500">
            Scan this QR code with your authenticator app.
          </p>
        </div>

        <form onSubmit={handleEnable} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="tfa-code" className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
              Enter the 6-digit code
            </label>
            <input
              id="tfa-code"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              placeholder="000000"
              className="w-full rounded-2xl border border-white/10 bg-[#09090B] px-4 py-3 text-center font-mono text-lg tracking-[0.5em] text-white outline-none transition placeholder:text-zinc-600 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 rounded-2xl border-white/10 bg-transparent text-zinc-200 hover:bg-white/5 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={code.length < 6 || saving}
              className="flex-1 rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40"
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Verifying…
                </span>
              ) : (
                "Enable 2FA"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AccountSettingsPage() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState<Record<NotificationKey, boolean>>({
    orders: true,
    promo: false,
    sms: true,
  });

  const [showDelete, setShowDelete] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  const toggleNotification = (key: NotificationKey) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleProfileSave = () => {
    setSavingProfile(true);
    setTimeout(() => {
      setSavingProfile(false);
      toast.success("Profile updated successfully");
    }, 900);
  };

  return (
    <>
      <DeleteAccountDialog
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={() => {
          setShowDelete(false);
          toast.success("Account deleted");
          navigate("/");
        }}
      />
      <ChangePasswordDialog
        open={showPassword}
        onClose={() => setShowPassword(false)}
      />
      <TwoFactorDialog
        open={showTwoFactor}
        onClose={() => setShowTwoFactor(false)}
      />

      <div className="min-h-screen bg-[#09090B] px-4 py-8 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-8 text-left">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Account Settings
            </h1>
            <p className="max-w-2xl text-zinc-400">
              Manage your profile, security, saved places, and notification preferences from one place.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
            <ProfileFormCard
              profile={{
                fullName: accountProfileData.fullName,
                email: accountProfileData.email,
                phone: accountProfileData.phone,
                location: accountProfileData.location,
              }}
              onSave={handleProfileSave}
              onCancel={() => toast.message("No changes to discard")}
              onAvatarClick={() => toast.message("Avatar upload coming soon")}
            />

            <AccountOverviewCard
              status={accountProfileData.status}
              memberSince={accountProfileData.memberSince}
              ordersPlaced={accountProfileData.ordersPlaced}
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-white/10 bg-[#111113] shadow-none">
              <CardHeader className="border-b border-white/5 pb-5">
                <SectionHeader
                  title="Saved Addresses"
                  description="Manage your shipping and billing addresses."
                  icon={MapPin}
                />
              </CardHeader>
              <CardContent className="space-y-3 pt-6">
                {["Home", "Office"].map((addr) => (
                  <div
                    key={addr}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:bg-white/[0.06]"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white">{addr} Address</p>
                      <p className="truncate text-xs text-zinc-500">
                        123 MG Road, Bengaluru, 560001
                      </p>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-xl border border-white/10 bg-white/5 text-zinc-200 hover:bg-white/10 hover:text-white"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  className="h-11 w-full rounded-2xl border-white/10 bg-transparent text-zinc-200 hover:bg-white/5 hover:text-white"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Address
                </Button>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-[#111113] shadow-none">
              <CardHeader className="border-b border-white/5 pb-5">
                <SectionHeader
                  title="Your Reviews"
                  description="Recent ratings and feedback you have shared."
                  icon={Star}
                />
              </CardHeader>
              <CardContent className="space-y-3 pt-6">
                {[
                  { product: "Smart Watch Series 9", rating: 5, date: "May 17" },
                  { product: "Noise Cancelling Headphones", rating: 4, date: "May 10" },
                ].map((rev) => (
                  <div
                    key={`${rev.product}-${rev.date}`}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-white">{rev.product}</p>
                        <div className="mt-1 flex items-center gap-1 text-amber-400">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="h-3.5 w-3.5 fill-current" />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-zinc-500">{rev.date}</span>
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  className="h-11 w-full rounded-2xl border-white/10 bg-transparent text-zinc-200 hover:bg-white/5 hover:text-white"
                >
                  View All Reviews
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-white/10 bg-[#111113] shadow-none">
              <CardHeader className="border-b border-white/5 pb-5">
                <SectionHeader
                  title="Notifications"
                  description="Choose the updates you want to receive."
                  icon={Bell}
                />
              </CardHeader>

              <CardContent className="space-y-2 pt-6">
                {[
                  {
                    id: "orders" as NotificationKey,
                    label: "Order Updates",
                    Icon: Package,
                    desc: "Real-time tracking and delivery alerts",
                  },
                  {
                    id: "promo" as NotificationKey,
                    label: "Promotional Emails",
                    Icon: Mail,
                    desc: "Offers, discounts, and newsletters",
                  },
                  {
                    id: "sms" as NotificationKey,
                    label: "SMS Notifications",
                    Icon: Smartphone,
                    desc: "Urgent shipping updates via text",
                  },
                ].map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:bg-white/[0.06]"
                  >
                    <div className="flex items-center gap-4">
                      <div className="rounded-xl bg-white/5 p-2.5 text-zinc-300">
                        <item.Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{item.label}</p>
                        <p className="text-xs text-zinc-500">{item.desc}</p>
                      </div>
                    </div>

                    <Switch
                      checked={notifications[item.id]}
                      onCheckedChange={() => toggleNotification(item.id)}
                      className="data-[state=checked]:bg-[#DB4444]"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-[#111113] shadow-none">
              <CardHeader className="border-b border-white/5 pb-5">
                <SectionHeader
                  title="Login & Security"
                  description="Control your account access and extra protection."
                  icon={Lock}
                />
              </CardHeader>

              <CardContent className="space-y-3 pt-6">
                <ActionRow
                  title="Update Password"
                  description="Change your login password"
                  icon={KeyRound}
                  buttonLabel="Open"
                  onClick={() => setShowPassword(true)}
                />
                <ActionRow
                  title="Two-Factor Authentication"
                  description="Add an extra verification layer"
                  icon={ShieldCheck}
                  buttonLabel="Enable"
                  onClick={() => setShowTwoFactor(true)}
                />
              </CardContent>
            </Card>
          </div>

          <Card className="border border-red-900/20 bg-red-950/5 shadow-none">
            <CardHeader className="border-b border-red-900/20 pb-5">
              <SectionHeader
                title="Danger Zone"
                description="Permanent actions are grouped here."
                icon={Trash2}
              />
            </CardHeader>

            <CardContent className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-white">Delete Account</p>
                <p className="mt-1 text-sm text-red-300/60">
                  Permanently remove your account and all associated data.
                </p>
              </div>

              <Button
                type="button"
                onClick={() => setShowDelete(true)}
                className="rounded-2xl bg-red-600 text-white hover:bg-red-700"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Account
              </Button>
            </CardContent>
          </Card>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 text-sm text-zinc-400">
            <span className="font-semibold text-white">Tip:</span> keep profile details current so orders,
            support requests, and security checks stay accurate.
          </div>
        </div>
      </div>
    </>
  );
}