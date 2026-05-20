import { ChevronRight } from "lucide-react";

interface Crumb {
  label: string;
  href?: string;
}

interface Props {
  crumbs: Crumb[];
}

export default function ProductBreadcrumb({ crumbs }: Props) {
  return (
    <nav className="flex items-center gap-1.5 text-xs text-zinc-500 mb-8">
      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1;
        return (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="h-3 w-3 text-zinc-600" />}
            {isLast ? (
              <span className="text-zinc-200 font-medium">{crumb.label}</span>
            ) : (
              <a
                href={crumb.href ?? "#"}
                className="hover:text-zinc-300 transition-colors"
              >
                {crumb.label}
              </a>
            )}
          </span>
        );
      })}
    </nav>
  );
}