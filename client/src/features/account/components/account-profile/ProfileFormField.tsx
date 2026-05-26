import { Input } from "@/shared/components/ui/input";

type Props = {
  label: string;
  defaultValue: string;
  type?: string;
};

export default function ProfileFormField({ label, defaultValue, type = "text" }: Props) {
  return (
    <div className="space-y-1.5 text-left ">
      <label className="text-xs font-medium text-zinc-400 px-2">{label}</label>
      <Input
        type={type}
        defaultValue={defaultValue}
        className="h-11 rounded-xl border-white/10 bg-black/40 text-white transition-all focus:border-[#DB4444] focus:ring-1 focus:ring-[#DB4444]"
      />
    </div>
  );
}