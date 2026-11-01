import React from 'react';
import { useTranslation } from 'react-i18next';
import { X, Send, AlertCircle } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Table, TableBody, TableCell, TableHeadCell, TableHeader, TableRow } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Skeleton } from '../../../components/ui/Skeleton';
import type { CampaignDetailResponse } from '../../../api/types';

export interface CampaignDetailProps {
  detail: CampaignDetailResponse | undefined;
  isLoading: boolean;
  onClose: () => void;
}

export const CampaignDetail: React.FC<CampaignDetailProps> = ({
  detail,
  isLoading,
  onClose,
}) => {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <Card className="space-y-3">
        <Skeleton height={24} width={150} />
        <Skeleton height={180} />
      </Card>
    );
  }

  if (!detail) return null;

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
        <div className="flex items-center gap-2">
          <Send className="w-5 h-5 text-primary-container" />
          <div>
            <h3 className="text-base font-bold text-on-surface">{t('history.detailTitle')}</h3>
            <span className="text-xs text-on-surface-variant font-mono">{detail.id}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-control text-on-surface-variant hover:bg-surface-container min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Close details"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {detail.messages.length === 0 ? (
        <div className="p-4 text-center text-xs text-on-surface-variant">
          No message logs available for this batch.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeadCell>{t('history.colCustomer')}</TableHeadCell>
              <TableHeadCell>{t('history.colChannel')}</TableHeadCell>
              <TableHeadCell>{t('history.colAddress')}</TableHeadCell>
              <TableHeadCell>{t('history.colStatus')}</TableHeadCell>
              <TableHeadCell>{t('history.colDetail')}</TableHeadCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {detail.messages.map((m, idx) => (
              <TableRow key={idx}>
                <TableCell className="font-mono text-xs font-bold text-primary">
                  {m.customer_id}
                </TableCell>
                <TableCell className="font-mono text-xs uppercase">{m.channel}</TableCell>
                <TableCell className="font-mono text-xs text-on-surface-variant">
                  {m.to_addr}
                </TableCell>
                <TableCell>
                  <Badge variant={m.status === 'sent' ? 'low' : 'error'}>
                    {m.status === 'sent' ? t('history.statusSent') : t('history.statusFailed')}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-on-surface-variant flex items-center gap-1.5">
                  {m.status === 'failed' && <AlertCircle className="w-3.5 h-3.5 text-error shrink-0" />}
                  <span>{m.detail || '—'}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Card>
  );
};

