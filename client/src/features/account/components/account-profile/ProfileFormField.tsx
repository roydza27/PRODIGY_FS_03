import { Input } from "@/shared/components/ui/input";

type Props = {
  label: string;
  defaultValue: string;
  type?: string;
};

export default function ProfileFormField({
  label,
  defaultValue,
  type = "text",
}: Props) {
  return (
    <div className="space-y-2">
      <label className="text-sm text-zinc-400">{label}</label>
      <Input
        type={type}
        defaultValue={defaultValue}
        className="border-white/10 bg-black/20 text-white"
      />
    </div>
  );
}