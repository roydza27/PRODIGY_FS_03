import {
  BadgeCheck,
  Banknote,
  FileText,
  ShieldCheck,
  Store,
  Truck,
} from "lucide-react";

export const sellerBenefits = [
  {
    title: "Sell your products",
    description: "Create your own shop and manage listings from one place.",
    icon: Store,
  },
  {
    title: "Track earnings",
    description: "Monitor performance, orders, and revenue in your seller dashboard.",
    icon: Banknote,
  },
  {
    title: "Build trust",
    description: "Show a verified storefront with clear business details.",
    icon: BadgeCheck,
  },
];

export const sellerRequirements = [
  "Valid shop name and description",
  "Business email and phone number",
  "Bank account details for payouts",
  "Business registration number",
  "GST number if applicable",
];

export const sellerProcessSteps = [
  {
    title: "Apply",
    description: "Submit your shop and business details.",
    icon: FileText,
  },
  {
    title: "Review",
    description: "Admin reviews your seller application.",
    icon: ShieldCheck,
  },
  {
    title: "Start selling",
    description: "Approved sellers unlock their dashboard.",
    icon: Truck,
  },
];