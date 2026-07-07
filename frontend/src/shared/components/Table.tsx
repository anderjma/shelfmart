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
}

export default function Table<T>({
    columns,
    data,
    keyExtractor,
    isLoading = false,
    emptyMessage = "No records found.",
    emptyIcon
}: TableProps<T>) {
    if (!isLoading && data.length === 0) {
        return (
            <div className="text-center p-16 bg-white border border-gray-200 rounded-lg flex flex-col items-center justify-center">
                {emptyIcon ?? <Inbox className="w-16 h-16 text-gray-300 mb-4" aria-hidden="true" />}
                <h3 className="text-lg font-medium text-gray-900">{emptyMessage}</h3>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        {columns.map((column) => (
                            <th
                                key={column.key}
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                {column.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {isLoading
                        ? Array.from({ length: 5 }).map((_, rowIndex) => (
                              <tr key={`skeleton-${rowIndex}`} className="animate-pulse">
                                  {columns.map((column) => (
                                      <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                      </td>
                                  ))}
                              </tr>
                          ))
                        : data.map((row) => (
                              <tr key={keyExtractor(row)}>
                                  {columns.map((column) => (
                                      <td
                                          key={column.key}
                                          className={`px-6 py-4 whitespace-nowrap text-sm text-gray-700 ${column.className ?? ""}`}
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
