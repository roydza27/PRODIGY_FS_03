type Props = {
  label: string;
  active?: boolean;
  onClick: () => void;
};

export default function FilterChip({ label, active, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm transition",
        active
          ? "border-red-500 bg-red-500 text-white"
          : "border-white/10 bg-white/5 text-zinc-200 hover:bg-white/10",
      ].join(" ")}
    >
      {label}
    </button>
  );
}