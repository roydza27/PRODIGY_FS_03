import { Button } from "@/shared/components/ui/button";

export default function ProfileActions() {
  return (
    <div className="flex items-center gap-3 pt-2">
      <Button className="rounded-xl bg-red-500 hover:bg-red-600">
        Save changes
      </Button>
      <Button
        variant="outline"
        className="rounded-xl border-white/10 bg-transparent text-white hover:bg-white/5"
      >
        Cancel
      </Button>
    </div>
  );
}