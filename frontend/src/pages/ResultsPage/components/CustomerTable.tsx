import React from 'react';
import { useTranslation } from 'react-i18next';
import { Phone, Mail, Minus, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHeadCell, TableHeader, TableRow } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { formatCharge } from '../../../lib/format';
import { getRiskBarColor } from '../../../lib/risk';
import { getWhatsAppUrl } from '../../../lib/whatsapp';
import { CustomerFiltersBar } from './CustomerFiltersBar';
import type { CustomerRecord } from '../../../api/types';
import type { FilterState } from '../ResultsPage.types';

export interface CustomerTableProps {
  customers: CustomerRecord[];
  total: number;
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onSelectAllHighRisk: () => void;
  onRowClick: (customer: CustomerRecord) => void;
}

export const CustomerTable: React.FC<CustomerTableProps> = ({
  customers,
  total,
  filters,
  onFilterChange,
  selectedIds,
  onToggleSelect,
  onSelectAllHighRisk,
  onRowClick,
}) => {
  const { t } = useTranslation();
  const totalPages = Math.max(1, Math.ceil(total / filters.page_size));

  return (
    <div className="space-y-3">
      <CustomerFiltersBar
        filters={filters}
        onFilterChange={onFilterChange}
        onSelectAllHighRisk={onSelectAllHighRisk}
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHeadCell className="w-8">
              <span className="sr-only">Select</span>
            </TableHeadCell>
            <TableHeadCell>{t('results.colCustomerId')}</TableHeadCell>
            <TableHeadCell>{t('results.colContact')}</TableHeadCell>
            <TableHeadCell>{t('results.colContract')}</TableHeadCell>
            <TableHeadCell>{t('results.colTenure')}</TableHeadCell>
            <TableHeadCell>{t('results.colMonthly')}</TableHeadCell>
            <TableHeadCell>{t('results.colRiskScore')}</TableHeadCell>
            <TableHeadCell>{t('results.colPrediction')}</TableHeadCell>
            <TableHeadCell>{t('results.colMainReason')}</TableHeadCell>
            <TableHeadCell className="text-center">{t('results.colAction')}</TableHeadCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((c) => {
            const isSelected = selectedIds.includes(c.customer_id);
            return (
              <TableRow
                key={c.customer_id}
                isClickable
                onClick={() => onRowClick(c)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onRowClick(c);
                }}
              >
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSelect(c.customer_id)}
                    className="w-4 h-4 rounded text-primary focus:ring-primary"
                    aria-label={`Select ${c.customer_id}`}
                  />
                </TableCell>
                <TableCell>
                  {c.name ? <div className="text-xs font-bold text-on-surface">{c.name}</div> : null}
                  <div className="font-mono text-xs text-primary">{c.customer_id}</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    {c.phone && <Phone className="w-3.5 h-3.5 text-primary-container" />}
                    {c.email && <Mail className="w-3.5 h-3.5 text-secondary" />}
                    {!c.phone && !c.email && <Minus className="w-3.5 h-3.5 text-outline-variant" />}
                  </div>
                </TableCell>
                <TableCell className="text-xs">{c.contract}</TableCell>
                <TableCell className="text-xs font-mono">{c.tenure}m</TableCell>
                <TableCell className="text-xs font-mono">${formatCharge(c.monthly_charges)}</TableCell>
                <TableCell className="w-28">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono w-7">{c.risk_score}%</span>
                    <div className="flex-1 bg-outline-variant/30 h-1.5 rounded-full overflow-hidden">
                      <div className={`h-full ${getRiskBarColor(c.risk_score)}`} style={{ width: `${c.risk_score}%` }} />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={c.prediction === 'will_leave' ? 'high' : 'low'}>
                    {c.prediction === 'will_leave' ? t('results.willLeaveBadge') : t('results.willStayBadge')}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-on-surface-variant truncate max-w-[150px]">{c.main_reason || '—'}</TableCell>
                <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                  {c.phone ? (
                    <a
                      href={getWhatsAppUrl(c)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-white bg-[#25D366] hover:bg-[#1ebd5a] active:scale-95 transition-all rounded-control shadow-sm whitespace-nowrap"
                      title={t('results.sendWhatsapp')}
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>{t('results.sendWhatsapp')}</span>
                    </a>
                  ) : (
                    <span className="text-[11px] text-on-surface-variant/40">—</span>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between text-xs text-on-surface-variant pt-2">
        <span>{total} customers</span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={filters.page <= 1}
            onClick={() => onFilterChange({ page: filters.page - 1 })}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span>{t('ui.page')} {filters.page} {t('ui.of')} {totalPages}</span>
          <Button
            variant="outline"
            size="sm"
            disabled={filters.page >= totalPages}
            onClick={() => onFilterChange({ page: filters.page + 1 })}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
