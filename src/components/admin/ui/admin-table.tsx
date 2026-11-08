"use client";

import React from "react";
import { Inbox, Loader2 } from "lucide-react";

export interface Column<T> {
  key: string;
  header: React.ReactNode;
  cell: (item: T, index: number) => React.ReactNode;
  className?: string;
  headerClassName?: string;
}

export interface AdminTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T, index: number) => string | number;
  loading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  renderMobileCard?: (item: T, index: number) => React.ReactNode;
  onRowClick?: (item: T) => void;
  className?: string;
}

export function AdminTable<T>({
  columns,
  data,
  keyExtractor,
  loading = false,
  emptyTitle = "Tiada Data Dijumpai",
  emptyDescription = "Tiada rekod yang sepadan dengan kriteria carian atau penapis.",
  renderMobileCard,
  onRowClick,
  className = "",
}: AdminTableProps<T>) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 bg-[#17191E] border border-[#27272A] rounded-xl text-center space-y-3">
        <Loader2 className="w-8 h-8 text-[#FF3845] animate-spin" />
        <p className="text-sm font-medium text-[#C5C6CA]">Memuatkan data rekod...</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 bg-[#17191E] border border-[#27272A] rounded-xl text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-[#202126] border border-[#37383D] flex items-center justify-center text-[#96989F]">
          <Inbox className="w-6 h-6" />
        </div>
        <h4 className="text-base font-bold text-white">{emptyTitle}</h4>
        <p className="text-xs text-[#96989F] max-w-sm">{emptyDescription}</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Desktop Table View (>= 768px) */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-[#27272A] bg-[#17191E] shadow-lg admin-scrollbar">
        <table className="w-full text-left text-sm text-[#E5E5E7] border-collapse">
          <thead className="bg-[#1C1E24] border-b border-[#27272A] text-xs font-semibold uppercase tracking-wider text-[#96989F]">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={`px-5 py-3.5 whitespace-nowrap ${
                    col.headerClassName || ""
                  }`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#27272A]">
            {data.map((item, index) => {
              const rowKey = keyExtractor(item, index);
              return (
                <tr
                  key={rowKey}
                  onClick={() => onRowClick && onRowClick(item)}
                  className={`admin-table-row ${
                    onRowClick ? "cursor-pointer" : ""
                  }`}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-5 py-3.5 align-middle ${
                        col.className || ""
                      }`}
                    >
                      {col.cell(item, index)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Fallback View (< 768px) */}
      <div className="md:hidden space-y-3">
        {data.map((item, index) => {
          const rowKey = keyExtractor(item, index);

          if (renderMobileCard) {
            return (
              <div key={rowKey} onClick={() => onRowClick && onRowClick(item)}>
                {renderMobileCard(item, index)}
              </div>
            );
          }

          // Default automated card view when no custom card renderer provided
          return (
            <div
              key={rowKey}
              onClick={() => onRowClick && onRowClick(item)}
              className={`p-4 bg-[#17191E] border border-[#27272A] rounded-xl space-y-3 ${
                onRowClick ? "cursor-pointer active:bg-[#202126]" : ""
              }`}
            >
              {columns.map((col) => (
                <div
                  key={col.key}
                  className="flex items-center justify-between text-xs py-1 border-b border-[#202126] last:border-0"
                >
                  <span className="font-medium text-[#96989F] uppercase tracking-wider">
                    {col.header}
                  </span>
                  <div className="text-right text-[#E5E5E7]">
                    {col.cell(item, index)}
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
