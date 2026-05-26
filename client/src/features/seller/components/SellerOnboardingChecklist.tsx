import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { CheckCircle2, Circle, X, ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface OnboardingItem {
  id: string;
  title: string;
  description: string;
  action: string;
  route?: string;
  completed: boolean;
  priority: "high" | "medium" | "low";
}

export default function SellerOnboardingChecklist() {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [items, setItems] = useState<OnboardingItem[]>([
    {
      id: "profile",
      title: "Complete Your Seller Profile",
      description: "Add a profile picture, shop banner, and business description",
      action: "Go to Settings",
      route: "/seller/settings",
      completed: false,
      priority: "high",
    },
    {
      id: "products",
      title: "Upload Your First Product",
      description: "Add at least 1 product to your store to start selling",
      action: "Add Product",
      route: "/seller/products",
      completed: false,
      priority: "high",
    },
    {
      id: "policies",
      title: "Set Return & Refund Policies",
      description: "Define your return period, refund process, and shipping policy",
      action: "View Policies",
      route: "/seller/settings",
      completed: false,
      priority: "high",
    },
    {
      id: "bank",
      title: "Verify Bank Account",
      description: "Confirm your bank details for payouts and settlements",
      action: "Verify Account",
      route: "/seller/settings",
      completed: false,
      priority: "high",
    },
    {
      id: "inventory",
      title: "Manage Inventory",
      description: "Set up inventory tracking and low stock alerts",
      action: "Go to Inventory",
      route: "/seller/inventory",
      completed: false,
      priority: "medium",
    },
    {
      id: "payments",
      title: "Set Up Payment Methods",
      description: "Configure payment gateway and commission details",
      action: "View Payments",
      route: "/seller/settings",
      completed: false,
      priority: "medium",
    },
    {
      id: "shipping",
      title: "Configure Shipping Settings",
      description: "Set up shipping rates and supported delivery regions",
      action: "Configure Shipping",
      route: "/seller/settings",
      completed: false,
      priority: "medium",
    },
    {
      id: "analytics",
      title: "Review Getting Started Guide",
      description: "Learn best practices and tips for successful selling",
      action: "Read Guide",
      route: "/seller/support",
      completed: false,
      priority: "low",
    },
  ]);

  const completedCount = items.filter((item) => item.completed).length;
  const highPriorityCount = items.filter(
    (item) => item.priority === "high" && !item.completed
  ).length;

  const handleMarkComplete = (id: string) => {
    setItems(items.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item)));
  };

  const handleAction = (route?: string) => {
    if (route) navigate(route);
  };

  return (
    <Card className="border-amber-800 bg-amber-900/20 mb-6">
      <CardHeader
        className="cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-600/20">
              <span className="text-sm font-bold text-amber-200">
                {completedCount}/{items.length}
              </span>
            </div>
            <div>
              <CardTitle className="text-amber-100">Welcome to Your Seller Dashboard! 🎉</CardTitle>
              <CardDescription className="text-amber-200/70 mt-1">
                Complete these steps to get the most out of our platform
                {highPriorityCount > 0 && (
                  <Badge className="ml-2 bg-red-600 text-white">
                    {highPriorityCount} urgent
                  </Badge>
                )}
              </CardDescription>
            </div>
          </div>
          <button className="text-amber-200 hover:text-amber-100">
            {isExpanded ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-3">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-amber-200">
              <span>Progress</span>
              <span>{Math.round((completedCount / items.length) * 100)}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-amber-900/50">
              <div
                className="h-full rounded-full bg-amber-600 transition-all"
                style={{
                  width: `${(completedCount / items.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Checklist */}
          <div className="mt-6 space-y-3">
            {/* High Priority Items */}
            <div>
              <h4 className="mb-2 text-xs font-semibold text-amber-200/70 uppercase">
                High Priority
              </h4>
              <div className="space-y-2">
                {items
                  .filter((item) => item.priority === "high")
                  .map((item) => (
                    <ChecklistItem
                      key={item.id}
                      item={item}
                      onMarkComplete={handleMarkComplete}
                      onAction={handleAction}
                    />
                  ))}
              </div>
            </div>

            {/* Medium Priority Items */}
            <div>
              <h4 className="mb-2 text-xs font-semibold text-zinc-400 uppercase">
                Medium Priority
              </h4>
              <div className="space-y-2">
                {items
                  .filter((item) => item.priority === "medium")
                  .map((item) => (
                    <ChecklistItem
                      key={item.id}
                      item={item}
                      onMarkComplete={handleMarkComplete}
                      onAction={handleAction}
                    />
                  ))}
              </div>
            </div>

            {/* Low Priority Items */}
            <div>
              <h4 className="mb-2 text-xs font-semibold text-zinc-400 uppercase">
                Optional
              </h4>
              <div className="space-y-2">
                {items
                  .filter((item) => item.priority === "low")
                  .map((item) => (
                    <ChecklistItem
                      key={item.id}
                      item={item}
                      onMarkComplete={handleMarkComplete}
                      onAction={handleAction}
                    />
                  ))}
              </div>
            </div>
          </div>

          {completedCount === items.length && (
            <div className="mt-6 rounded-lg bg-green-900/20 p-3 text-center">
              <p className="text-sm text-green-100">
                ✨ Great! You're all set to start selling. Good luck!
              </p>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}

interface ChecklistItemProps {
  item: OnboardingItem;
  onMarkComplete: (id: string) => void;
  onAction: (route?: string) => void;
}

function ChecklistItem({ item, onMarkComplete, onAction }: ChecklistItemProps) {
  return (
    <div
      className={`flex items-start gap-3 rounded-lg p-3 transition ${
        item.completed
          ? "bg-zinc-900/50"
          : "bg-zinc-900/70 border border-zinc-800"
      }`}
    >
      <button
        onClick={() => onMarkComplete(item.id)}
        className="mt-1 flex-shrink-0 text-zinc-400 hover:text-amber-400"
      >
        {item.completed ? (
          <CheckCircle2 className="h-5 w-5 text-green-500" />
        ) : (
          <Circle className="h-5 w-5" />
        )}
      </button>

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p
            className={`text-sm font-medium ${
              item.completed
                ? "text-zinc-500 line-through"
                : "text-zinc-200"
            }`}
          >
            {item.title}
          </p>
          {item.priority === "high" && !item.completed && (
            <Badge className="h-5 bg-red-600/40 text-red-100 text-xs px-1.5">
              Urgent
            </Badge>
          )}
        </div>
        <p className="mt-1 text-xs text-zinc-400">{item.description}</p>
      </div>

      <Button
        size="sm"
        variant={item.completed ? "outline" : "default"}
        onClick={() => onAction(item.route)}
        className={
          item.completed
            ? "gap-1 text-zinc-400 hover:text-zinc-200"
            : "gap-1 bg-amber-600 hover:bg-amber-700 text-white"
        }
      >
        {item.completed ? (
          <>
            <X className="h-3 w-3" />
            Undo
          </>
        ) : (
          item.action
        )}
      </Button>
    </div>
  );
}
