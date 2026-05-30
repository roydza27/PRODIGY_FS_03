import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import { IconMessageCircle } from "@tabler/icons-react";
import {
  BookOpen,
  CheckCircle2,
  FileText,
  Headphones,
  LifeBuoy,
  MessageSquare,
  Search,
  ShieldCheck,
  Sparkles,
  Tag,
  Truck,
  Workflow,
} from "lucide-react";

const tickets = [
  {
    id: "TKT-1024",
    subject: "Product approval delayed",
    status: "Open",
    priority: "High",
    category: "Listings",
    updated: "2 hours ago",
  },
  {
    id: "TKT-1018",
    subject: "Payout not received",
    status: "In Progress",
    priority: "Medium",
    category: "Payments",
    updated: "1 day ago",
  },
  {
    id: "TKT-1007",
    subject: "Shipment tracking mismatch",
    status: "Resolved",
    priority: "Low",
    category: "Orders",
    updated: "3 days ago",
  },
];

const faqItems = [
  {
    q: "How do I add products to my store?",
    a: "Go to the Products page, click Add New Product, fill in details, upload images, and submit for approval.",
  },
  {
    q: "When will I receive payments?",
    a: "Payments are processed on the seller payout schedule. Check the Earnings section for the next settlement date.",
  },
  {
    q: "How do I handle returns?",
    a: "Open the Orders page, review the return request, and accept or reject it based on your policy.",
  },
  {
    q: "How can I improve product visibility?",
    a: "Use clear titles, strong images, accurate pricing, and complete category and inventory fields.",
  },
];

const docs = [
  {
    title: "Getting Started as a Seller",
    icon: Sparkles,
    description: "Set up your storefront, bank details, and first listings.",
  },
  {
    title: "Product Listing Best Practices",
    icon: Tag,
    description: "Learn how to write titles, descriptions, and upload images that convert.",
  },
  {
    title: "Managing Orders and Shipments",
    icon: Truck,
    description: "Understand how fulfillment, tracking, and delivery updates work.",
  },
  {
    title: "Understanding Commission Rates",
    icon: FileText,
    description: "See how fees are calculated and how payouts are handled.",
  },
  {
    title: "Seller Agreement and Policies",
    icon: ShieldCheck,
    description: "Review the terms, prohibited items, and store responsibilities.",
  },
];

const quickActions = [
  { label: "Create ticket", icon: IconMessageCircle },
  { label: "Read docs", icon: BookOpen },
  { label: "Check payout", icon: Workflow },
  { label: "Track shipment", icon: Truck },
];

const supportChannels = [
  { title: "Live chat", description: "Fast help for urgent issues", icon: MessageSquare, status: "Available" },
  { title: "Email support", description: "Best for detailed requests", icon: Headphones, status: "Within 24h" },
  { title: "Help center", description: "Self-service guides and articles", icon: LifeBuoy, status: "Always on" },
  { title: "Account review", description: "For verification and policy issues", icon: CheckCircle2, status: "Business hours" },
];

function statusClasses(status: string) {
  switch (status) {
    case "Open":
      return "border-amber-500/20 bg-amber-500/10 text-amber-300";
    case "In Progress":
      return "border-blue-500/20 bg-blue-500/10 text-blue-300";
    case "Resolved":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";
    default:
      return "border-white/10 bg-white/5 text-zinc-300";
  }
}

function priorityClasses(priority: string) {
  switch (priority) {
    case "High":
      return "border-red-500/20 bg-red-500/10 text-red-300";
    case "Medium":
      return "border-amber-500/20 bg-amber-500/10 text-amber-300";
    case "Low":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";
    default:
      return "border-white/10 bg-white/5 text-zinc-300";
  }
}

export default function SellerSupportPage() {
  const [search, setSearch] = useState("");

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const haystack = [ticket.id, ticket.subject, ticket.status, ticket.priority, ticket.category, ticket.updated]
        .join(" ")
        .toLowerCase();
      return haystack.includes(search.toLowerCase());
    });
  }, [search]);

  return (
    <div className="min-h-screen bg-[#111113] px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl space-y-8 text-left">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <LifeBuoy className="h-4 w-4 text-[#DB4444]" />
              Seller support hub
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Support & Help</h1>
            <p className="max-w-2xl text-sm text-zinc-400 sm:text-base">
              Get help with your seller account, resolve issues faster, and access the documentation that keeps your store moving.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:min-w-[560px]">
            <div className="rounded-2xl border border-white/10 bg-[#18181B] p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">Open tickets</p>
              <p className="mt-2 text-2xl font-bold text-amber-300">1</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#18181B] p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">Response time</p>
              <p className="mt-2 text-2xl font-bold text-blue-300">24h</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#18181B] p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">Resolved</p>
              <p className="mt-2 text-2xl font-bold text-emerald-300">18</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#18181B] p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">Satisfaction</p>
              <p className="mt-2 text-2xl font-bold text-[#DB4444]">98%</p>
            </div>
          </div>
        </div>

        <Card className="border-white/10 bg-[#18181B] shadow-xl">
          <CardContent className="flex flex-col gap-5 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
            <div className="flex items-start gap-4 lg:max-w-xl">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#DB4444]/20 bg-[#DB4444]/10 text-[#DB4444]">
                <ShieldCheck className="h-6 w-6" />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-medium text-white">
                  Priority support available
                </p>
                <p className="mt-1 text-sm leading-6 text-zinc-400">
                  Use tickets for account, payments, shipping, and policy issues. For urgent problems, start with live chat.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4 lg:min-w-[420px]">
              {quickActions.map((action) => {
                const ActionIcon = action.icon;

                return (
                  <Button
                    key={action.label}
                    variant="outline"
                    className="h-auto w-full justify-start gap-2 border-white/10 bg-black/20 px-3 py-3 text-left hover:bg-white/5"
                  >
                    <ActionIcon className="h-4 w-4 shrink-0 text-[#DB4444]" />
                    <span className="truncate text-sm">{action.label}</span>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="tickets" className="space-y-6">
          <TabsList className="flex w-full gap-2 rounded-2xl border border-white/10 bg-[#18181B] p-8">
            {[
              { value: "tickets", label: "Support Tickets", icon: MessageSquare },
              { value: "faq", label: "FAQ", icon: CheckCircle2 },
              { value: "documentation", label: "Documentation", icon: BookOpen },
            ].map((tab) => {
              const TabIcon = tab.icon;

              return (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="
                    flex-1
                    rounded-xl
                    px-6
                    py-6
                    text-sm
                    whitespace-nowrap
                    data-[state=active]:bg-[#DB4444]
                    data-[state=active]:text-white
                  "
                >
                  <div className="flex items-center justify-center gap-2">
                    <TabIcon className="h-4 w-4 shrink-0" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </div>
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value="tickets" className="mt-0 space-y-6 text-left">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full lg:max-w-md">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search ticket ID, subject, category..."
                  className="h-12 border-white/10 bg-black/20 pl-9 text-white placeholder:text-zinc-500 focus-visible:ring-[#DB4444]"
                />
              </div>

              <Button className="bg-[#DB4444] text-white hover:bg-[#c53a3a]">
                <IconMessageCircle className="mr-2 h-4 w-4" />
                Create Support Ticket
              </Button>
            </div>

            <div className="grid gap-6 xl:grid-cols-3">
              <Card className="border-white/10 bg-[#18181B] shadow-xl xl:col-span-2">
                <CardHeader>
                  <CardTitle className="text-white">Recent Tickets</CardTitle>
                  <CardDescription className="text-zinc-400">
                    Track current issues and their resolution state.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {filteredTickets.length > 0 ? (
                    filteredTickets.map((ticket) => (
                      <div
                        key={ticket.id}
                        className="rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:border-white/15 hover:bg-white/5"
                      >
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                          <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-sm font-semibold text-white">{ticket.subject}</p>
                              <Badge variant="outline" className={`rounded-full border px-3 py-1 ${statusClasses(ticket.status)}`}>
                                {ticket.status}
                              </Badge>
                              <Badge variant="outline" className={`rounded-full border px-3 py-1 ${priorityClasses(ticket.priority)}`}>
                                {ticket.priority}
                              </Badge>
                            </div>
                            <p className="text-sm text-zinc-400">
                              {ticket.id} · {ticket.category} · Updated {ticket.updated}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" className="border-white/10 bg-black/20 hover:bg-white/5">
                              View
                            </Button>
                            <Button className="bg-[#DB4444] text-white hover:bg-[#c53a3a]">
                              Reply
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 p-10 text-center">
                      <p className="text-base font-medium text-white">No matching tickets found</p>
                      <p className="mt-2 text-sm text-zinc-400">Try a different search term or create a new ticket.</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-[#18181B] shadow-xl">
                <CardHeader>
                  <CardTitle className="text-white">Support Channels</CardTitle>
                  <CardDescription className="text-zinc-400">
                    Pick the fastest path for your issue.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {supportChannels.map((channel) => (
                    <div key={channel.title} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#DB4444]/10 text-[#DB4444]">
                            <channel.icon className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{channel.title}</p>
                            <p className="mt-1 text-sm text-zinc-400">{channel.description}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="border-white/10 bg-white/5 text-zinc-300">
                          {channel.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="faq" className="mt-0 text-left">
            <div className="grid gap-6 xl:grid-cols-3">
              <Card className="border-white/10 bg-[#18181B] shadow-xl xl:col-span-2">
                <CardHeader>
                  <CardTitle className="text-white">Frequently Asked Questions</CardTitle>
                  <CardDescription className="text-zinc-400">
                    Answers to the most common seller questions.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {faqItems.map((item) => (
                    <div key={item.q} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <h4 className="font-semibold text-white">{item.q}</h4>
                      <p className="mt-2 text-sm leading-6 text-zinc-400">{item.a}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-[#18181B] shadow-xl">
                <CardHeader>
                  <CardTitle className="text-white">Need a faster answer?</CardTitle>
                  <CardDescription className="text-zinc-400">
                    Contact support with a structured ticket.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="text-sm font-medium text-white">What to include</p>
                    <ul className="mt-2 space-y-2 text-sm text-zinc-400">
                      <li>• Order or product ID</li>
                      <li>• Screenshot if available</li>
                      <li>• Clear issue summary</li>
                    </ul>
                  </div>
                  <Button className="w-full bg-[#DB4444] text-white hover:bg-[#c53a3a]">
                    Create Support Ticket
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="documentation" className="mt-0 text-left">
            <div className="grid gap-8 lg:grid-cols-12">
              <Card className="border-white/10 bg-[#18181B] shadow-xl lg:col-span-8">
                <CardHeader className="space-y-2">
                  <CardTitle className="text-white">Seller Documentation</CardTitle>
                  <CardDescription className="text-zinc-400">
                    Practical guides for running your store efficiently.
                  </CardDescription>
                </CardHeader>

                <CardContent className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
                  {docs.map((doc) => {
                    const DocIcon = doc.icon;

                    return (
                      <div
                        key={doc.title}
                        className="flex h-full flex-col rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:border-white/15 hover:bg-white/5"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#DB4444]/10 text-[#DB4444]">
                            <DocIcon className="h-4 w-4" />
                          </div>

                          <div className="min-w-0">
                            <p className="font-medium text-white">{doc.title}</p>
                            <p className="mt-1 text-sm leading-6 text-zinc-400">
                              {doc.description}
                            </p>
                          </div>
                        </div>

                        <Button
                          variant="link"
                          className="mt-auto h-auto w-fit px-0 pt-4 text-[#DB4444]"
                        >
                          Open article
                        </Button>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-[#18181B] shadow-xl lg:col-span-4 lg:sticky lg:top-6">
                <CardHeader className="space-y-2">
                  <CardTitle className="text-white">Knowledge Base</CardTitle>
                  <CardDescription className="text-zinc-400">
                    Searchable support content.
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-3">
                  {[
                    "Product listing",
                    "Order fulfillment",
                    "Shipping setup",
                    "Payouts and commissions",
                    "Seller policies",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-zinc-300"
                    >
                      {item}
                    </div>
                  ))}

                  <div className="rounded-2xl border border-[#DB4444]/20 bg-[#DB4444]/10 p-4 text-sm leading-6 text-[#ffd7d7]">
                    Documentation is the fastest way to solve common setup issues.
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
