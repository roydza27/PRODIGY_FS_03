import { Button } from "@/shared/components/ui/button";

type Props = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function ProductPagination({
  page,
  totalPages,
  onPageChange,
}: Props) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-3">
      <Button
        variant="outline"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="rounded-xl border-white/10 bg-transparent hover:bg-white/5"
      >
        Previous
      </Button>

      <span className="text-sm text-zinc-400">
        Page {page} of {totalPages}
      </span>

      <Button
        variant="outline"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="rounded-xl border-white/10 bg-transparent hover:bg-white/5"
      >
        Next
      </Button>
    </div>
  );
}