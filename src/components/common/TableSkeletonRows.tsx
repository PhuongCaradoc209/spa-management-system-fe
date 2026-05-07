import React from "react";

type TableSkeletonRowsProps = {
  rows?: number;
  columns: number;
};

const WIDTHS = ["w-16", "w-24", "w-28", "w-32", "w-36", "w-40", "w-44", "w-48"];

const TableSkeletonRows: React.FC<TableSkeletonRowsProps> = ({
  rows = 5,
  columns,
}) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <tr key={rowIdx} className="animate-pulse">
          {Array.from({ length: columns }).map((__, colIdx) => {
            const width = WIDTHS[(rowIdx + colIdx) % WIDTHS.length];
            const isActionCol = colIdx === columns - 1;
            return (
              <td key={colIdx} className="px-6 py-4">
                {isActionCol ? (
                  <div className="flex items-center justify-end gap-2">
                    <div className="h-9 w-9 rounded-full bg-surface-container-high" />
                    <div className="h-9 w-9 rounded-full bg-surface-container-high" />
                  </div>
                ) : (
                  <div
                    className={`h-4 rounded-full bg-surface-container-high ${width}`}
                  />
                )}
              </td>
            );
          })}
        </tr>
      ))}
    </>
  );
};

export default TableSkeletonRows;
