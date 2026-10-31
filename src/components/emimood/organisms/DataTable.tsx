import type { ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ErrorState } from "@/components/emimood/molecules/states";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type Column<T> = {
  header: string;
  cell: (row: T) => ReactNode;
  className?: string | undefined;
};

type Pagination = {
  page: number;
  pages: number;
  total: number;
  pageSize: number;
  onPage: (p: number) => void;
  onPageSize: (s: number) => void;
};

type DataTableProps<T extends { id: string }> = {
  columns: Column<T>[];
  rows: T[] | undefined;
  loading: boolean;
  error: unknown;
  onRetry: () => void;
  empty: ReactNode;
  onRowClick?: ((row: T) => void) | undefined;
  caption: string;
  pagination?: Pagination | undefined;
};

export function DataTable<T extends { id: string }>({
  columns,
  rows,
  loading,
  error,
  onRetry,
  empty,
  onRowClick,
  pagination,
  caption,
}: DataTableProps<T>) {
  if (error) return <ErrorState error={error} onRetry={onRetry} />;
  if (!loading && rows && rows.length === 0) return <>{empty}</>;
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <div className="overflow-x-auto">
        <Table>
          <caption className="sr-only">{caption}</caption>
          <TableHeader>
            <TableRow>
              {columns.map((c) => (
                <TableHead key={c.header} scope="col" className={c.className}>
                  {c.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && !rows
              ? Array.from({ length: 5 }, (_, i) => (
                  <TableRow key={i}>
                    {columns.map((c) => (
                      <TableCell key={c.header}>
                        <Skeleton className="h-4 w-full max-w-40" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : rows?.map((r) => (
                  <TableRow
                    key={r.id}
                    className={onRowClick ? "cursor-pointer" : undefined}
                    onClick={onRowClick ? () => onRowClick(r) : undefined}
                    onKeyDown={onRowClick ? (e) => e.key === "Enter" && onRowClick(r) : undefined}
                    tabIndex={onRowClick ? 0 : undefined}
                  >
                    {columns.map((c) => (
                      <TableCell key={c.header} className={c.className}>
                        {c.cell(r)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>
      {pagination && pagination.total > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3 text-sm text-muted-foreground">
          <span>
            {pagination.total} élément{pagination.total > 1 ? "s" : ""} · page {pagination.page} /{" "}
            {Math.max(pagination.pages, 1)}
          </span>
          <div className="flex items-center gap-2">
            <label className="sr-only" htmlFor="page-size">
              Taille de page
            </label>
            <select
              id="page-size"
              className="h-8 rounded-md border bg-background px-2 text-foreground"
              value={pagination.pageSize}
              onChange={(e) => pagination.onPageSize(Number(e.target.value))}
            >
              {[10, 20, 50, 100].map((n) => (
                <option key={n} value={n}>
                  {n} / page
                </option>
              ))}
            </select>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              aria-label="Page précédente"
              disabled={pagination.page <= 1}
              onClick={() => pagination.onPage(pagination.page - 1)}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              aria-label="Page suivante"
              disabled={pagination.page >= pagination.pages}
              onClick={() => pagination.onPage(pagination.page + 1)}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
