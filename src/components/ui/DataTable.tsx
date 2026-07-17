"use client";
import { cn } from "@/lib/utils";
import { ChevronsUpDown, ChevronUp, ChevronDown } from "lucide-react";
import { Pagination } from "./Pagination";
import { SkeletonTable } from "./Skeleton";
import type { ReactNode } from "react";

export interface Column<T = object> {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: "left" | "center" | "right";
  render?: (value: unknown, row: T) => ReactNode;
}

interface DataTableProps<T = object> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  page?: number;
  totalPages?: number;
  total?: number;
  perPage?: number;
  onPageChange?: (p: number) => void;
  sortKey?: string | null;
  sortDir?: "asc" | "desc";
  onSort?: (key: string) => void;
  emptyMessage?: string;
  emptyIcon?: ReactNode;
  className?: string;
  rowClassName?: (row: T) => string;
  onRowClick?: (row: T) => void;
}

export function DataTable<T = object>({
  columns,
  data,
  loading,
  page = 1,
  totalPages = 1,
  total = 0,
  perPage = 20,
  onPageChange,
  sortKey,
  sortDir,
  onSort,
  emptyMessage = "No results found",
  emptyIcon,
  className,
  rowClassName,
  onRowClick,
}: DataTableProps<T>) {
  return (
    <div className={cn("flex flex-col", className)}>
      <div className="table-container">
        <table className="table-premium">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{ width: col.width }}
                  className={cn(
                    col.align === "center" && "text-center",
                    col.align === "right"  && "text-right",
                    col.sortable && "cursor-pointer select-none hover:text-text-secondary transition-colors"
                  )}
                  onClick={() => col.sortable && onSort?.(col.key)}
                >
                  <span className="inline-flex items-center gap-1.5">
                    {col.label}
                    {col.sortable && (
                      <span className="text-text-subtle">
                        {sortKey === col.key ? (
                          sortDir === "asc" ? (
                            <ChevronUp className="w-3 h-3 text-primary" />
                          ) : (
                            <ChevronDown className="w-3 h-3 text-primary" />
                          )
                        ) : (
                          <ChevronsUpDown className="w-3 h-3" />
                        )}
                      </span>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <SkeletonTable rows={8} />
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>
                  <div className="flex flex-col items-center justify-center py-16 gap-3 text-text-muted">
                    {emptyIcon ?? <div className="w-10 h-10 rounded-xl bg-surface-2 flex items-center justify-center text-text-subtle">?</div>}
                    <p className="text-[13.5px]">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, ri) => (
                <tr
                  key={ri}
                  className={cn(
                    onRowClick && "cursor-pointer",
                    rowClassName?.(row)
                  )}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        col.align === "center" && "text-center",
                        col.align === "right"  && "text-right"
                      )}
                    >
                      {col.render
                        ? col.render(row[col.key as keyof T], row)
                        : String(row[col.key as keyof T] ?? "—")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {onPageChange && total > 0 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          total={total}
          perPage={perPage}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
