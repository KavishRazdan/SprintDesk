import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, ChevronsUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../Button';
import { Skeleton } from '../Skeleton';
import { clsx } from 'clsx';

export interface ColumnDef<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (row: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

export interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  isLoading?: boolean;
  pageSize?: number;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
}

export function DataTable<T extends { id: string | number }>({
  columns,
  data,
  isLoading = false,
  pageSize = 5,
  emptyMessage = 'No items found.',
  onRowClick,
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (key?: keyof T) => {
    if (!key) return;
    if (sortColumn === key) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else {
        setSortColumn(null);
        setSortDirection('asc');
      }
    } else {
      setSortColumn(key);
      setSortDirection('asc');
    }
  };

  const sortedData = useMemo(() => {
    if (!sortColumn) return data;
    return [...data].sort((a, b) => {
      const valA = a[sortColumn];
      const valB = b[sortColumn];
      if (valA === valB) return 0;
      if (valA === undefined || valA === null) return 1;
      if (valB === undefined || valB === null) return -1;
      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      return sortDirection === 'asc' ? 1 : -1;
    });
  }, [data, sortColumn, sortDirection]);

  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  if (isLoading) {
    return (
      <div className="w-full space-y-3">
        <Skeleton className="h-10 w-full rounded-xl bg-slate-200 dark:bg-[#041F18]" />
        <Skeleton className="h-12 w-full rounded-xl bg-white dark:bg-[#0A1513]" />
        <Skeleton className="h-12 w-full rounded-xl bg-white dark:bg-[#0A1513]" />
        <Skeleton className="h-12 w-full rounded-xl bg-white dark:bg-[#0A1513]" />
      </div>
    );
  }

  return (
    <div className="w-full border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden bg-white dark:bg-[#0A1513] shadow-sm dark:shadow-[0_0_20px_rgba(4,31,24,0.5)]">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead className="bg-slate-100 dark:bg-[#041F18] text-[11px] font-heading uppercase font-bold text-slate-600 dark:text-[#A1A1AA] border-b border-slate-200 dark:border-white/10">
            <tr>
              {columns.map((col, index) => (
                <th
                  key={index}
                  scope="col"
                  className={clsx('px-4 py-3.5 select-none', col.className)}
                  onClick={() => col.sortable && handleSort(col.accessorKey)}
                >
                  <div
                    className={clsx(
                      'flex items-center gap-1.5',
                      col.sortable && 'cursor-pointer hover:text-emerald-600 dark:hover:text-[#00F5A0]'
                    )}
                  >
                    <span>{col.header}</span>
                    {col.sortable && (
                      <span className="text-emerald-600 dark:text-[#00F5A0]">
                        {sortColumn === col.accessorKey ? (
                          sortDirection === 'asc' ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )
                        ) : (
                          <ChevronsUpDown className="w-3.5 h-3.5 opacity-40 text-slate-400 dark:text-[#71717A]" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-slate-400 dark:text-[#71717A] text-sm">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={clsx(
                    'transition-colors hover:bg-slate-50 dark:hover:bg-[#041F18]/50',
                    onRowClick && 'cursor-pointer'
                  )}
                >
                  {columns.map((col, cIdx) => (
                    <td key={cIdx} className={clsx('px-4 py-3.5 text-slate-800 dark:text-slate-200 text-xs font-medium', col.className)}>
                      {col.cell
                        ? col.cell(row)
                        : col.accessorKey
                        ? String(row[col.accessorKey] ?? '')
                        : null}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {sortedData.length > pageSize && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#041F18]/30">
          <p className="text-xs text-slate-500 dark:text-[#A1A1AA]">
            Showing <span className="font-bold text-slate-900 dark:text-white">{Math.min((currentPage - 1) * pageSize + 1, sortedData.length)}</span> to{' '}
            <span className="font-bold text-slate-900 dark:text-white">{Math.min(currentPage * pageSize, sortedData.length)}</span> of{' '}
            <span className="font-bold text-emerald-600 dark:text-[#00F5A0]">{sortedData.length}</span> items
          </p>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              aria-label="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-xs font-semibold px-2 text-slate-500 dark:text-[#A1A1AA]">
              Page <span className="text-slate-900 dark:text-white">{currentPage}</span> of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              aria-label="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
