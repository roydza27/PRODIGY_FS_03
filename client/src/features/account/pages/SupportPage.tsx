import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { supportService } from "../services/support.service";

const initialForm = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

export default function SupportPage() {
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      await supportService.create(form);

      toast.success("Support ticket submitted successfully");

      setForm(initialForm);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to submit support ticket"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111113]/95 px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Customer Support
          </h1>

          <p className="mt-2 text-sm text-zinc-400">
            Need help with an order, payment, shipment, or account issue?
            Submit a ticket and our support team will get back to you.
          </p>
        </div>

        <Card className="border-white/10 bg-white/5 text-white">
          <CardHeader>
            <CardTitle>Create Support Ticket</CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm text-zinc-300">Full Name</label>

                  <Input
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    placeholder="John Doe"
                    className="border-white/10 bg-black/20 text-white placeholder:text-zinc-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-zinc-300">Email Address</label>

                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    placeholder="john@example.com"
                    className="border-white/10 bg-black/20 text-white placeholder:text-zinc-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-zinc-300">Subject</label>

                <Input
                  value={form.subject}
                  onChange={(e) => update("subject", e.target.value)}
                  placeholder="Order delayed"
                  className="border-white/10 bg-black/20 text-white placeholder:text-zinc-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-zinc-300">Message</label>

                <Textarea
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                  placeholder="Describe your issue in detail..."
                  rows={6}
                  className="border-white/10 bg-black/20 text-white placeholder:text-zinc-500"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-red-500 text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Submitting..." : "Submit Ticket"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5 text-white">
          <CardHeader>
            <CardTitle>Support Information</CardTitle>
          </CardHeader>

          <CardContent className="space-y-3 text-sm text-zinc-400">
            <p>Email: support@prodigyshop.com</p>
            <p>Response Time: Usually within 24 hours</p>
            <p>Available: Monday — Saturday</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}