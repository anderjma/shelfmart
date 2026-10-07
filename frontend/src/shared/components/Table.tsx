import type { ReactNode } from "react";
import { Inbox } from "lucide-react";

export interface TableColumn<T> {
    key: string;
    header: string;
    render?: (row: T) => ReactNode;
    className?: string;
}

export interface TableProps<T> {
    columns: TableColumn<T>[];
    data: T[];
    keyExtractor: (row: T) => string;
    isLoading?: boolean;
    emptyMessage?: string;
    emptyIcon?: ReactNode;
    ariaLabel?: string;
}

export default function Table<T>({
    columns,
    data,
    keyExtractor,
    isLoading = false,
    emptyMessage = "No records found.",
    emptyIcon,
    ariaLabel
}: TableProps<T>) {
    if (!isLoading && data.length === 0) {
        return (
            <div
                role="status"
                aria-live="polite"
                className="text-center p-16 bg-white dark:bg-slate-900 border border-sand-300 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center shadow-xs"
            >
                {emptyIcon ?? <Inbox className="w-16 h-16 text-sand-400 dark:text-slate-500 mb-4" aria-hidden="true" />}
                <h3 className="text-lg font-medium text-ink-900 dark:text-slate-100">{emptyMessage}</h3>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xs overflow-hidden border border-sand-300 dark:border-slate-700 overflow-x-auto">
            <table className="min-w-full divide-y divide-sand-300 dark:divide-slate-700" aria-label={ariaLabel} aria-busy={isLoading || undefined}>
                <thead className="bg-cream-100 dark:bg-slate-800">
                    <tr>
                        {columns.map((column) => (
                            <th
                                key={column.key}
                                scope="col"
                                className="px-6 py-3.5 text-left text-xs font-semibold text-ink-700 dark:text-slate-300 uppercase tracking-wider"
                            >
                                {column.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-900 divide-y divide-sand-300 dark:divide-slate-700">
                    {isLoading
                        ? Array.from({ length: 5 }).map((_, rowIndex) => (
                              <tr key={`skeleton-${rowIndex}`} className="animate-pulse">
                                  {columns.map((column) => (
                                      <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                                          <div className="h-4 bg-cream-200 dark:bg-slate-800 rounded w-3/4"></div>
                                      </td>
                                  ))}
                              </tr>
                          ))
                        : data.map((row) => (
                              <tr key={keyExtractor(row)} className="hover:bg-cream-50 dark:hover:bg-slate-800/50 transition-colors">
                                  {columns.map((column) => (
                                      <td
                                          key={column.key}
                                          className={`px-6 py-4 whitespace-nowrap text-sm text-ink-700 dark:text-slate-200 ${column.className ?? ""}`}
                                      >
                                          {column.render ? column.render(row) : String((row as Record<string, unknown>)[column.key] ?? "")}
                                      </td>
                                  ))}
                              </tr>
                          ))}
                </tbody>
            </table>
        </div>
    );
}
