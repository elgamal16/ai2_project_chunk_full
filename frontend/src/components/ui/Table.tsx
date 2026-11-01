import React from 'react';

export const Table: React.FC<React.TableHTMLAttributes<HTMLTableElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <div className="w-full overflow-x-auto rounded-card border border-outline-variant/30">
    <table className={`w-full text-start text-sm border-collapse ${className}`} {...props}>
      {children}
    </table>
  </div>
);

export const TableHeader: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <thead className={`bg-surface-container/60 border-b border-outline-variant/30 ${className}`} {...props}>
    {children}
  </thead>
);

export const TableBody: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <tbody className={`divide-y divide-outline-variant/20 bg-surface-lowest ${className}`} {...props}>
    {children}
  </tbody>
);

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  isClickable?: boolean;
}

export const TableRow: React.FC<TableRowProps> = ({
  isClickable = false,
  className = '',
  children,
  ...props
}) => (
  <tr
    tabIndex={isClickable ? 0 : undefined}
    className={`transition-colors ${
      isClickable
        ? 'cursor-pointer hover:bg-surface-low focus:bg-surface-low focus:outline-none'
        : 'hover:bg-surface-container/20'
    } ${className}`}
    {...props}
  >
    {children}
  </tr>
);

export const TableHeadCell: React.FC<React.ThHTMLAttributes<HTMLTableCellElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <th
    className={`px-4 py-3 text-start font-semibold text-xs text-on-surface-variant uppercase tracking-wider ${className}`}
    {...props}
  >
    {children}
  </th>
);

export const TableCell: React.FC<React.TdHTMLAttributes<HTMLTableCellElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <td className={`px-4 py-3.5 text-start text-on-surface align-middle ${className}`} {...props}>
    {children}
  </td>
);

