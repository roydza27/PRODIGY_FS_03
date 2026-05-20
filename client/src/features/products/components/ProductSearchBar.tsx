import { Search } from "lucide-react";
import { Input } from "@/shared/components/ui/input";

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export default function ProductSearchBar({
  value,
  onChange,
  placeholder = "Search products...",
}: Props) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-12 rounded-xl border-white/10 bg-black/20 pl-11 text-white placeholder:text-zinc-500"
      />
    </div>
  );
}