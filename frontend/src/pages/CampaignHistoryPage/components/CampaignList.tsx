import React from 'react';
import { useTranslation } from 'react-i18next';
import { Table, TableBody, TableCell, TableHeadCell, TableHeader, TableRow } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { EmptyState } from '../../../components/ui/EmptyState';
import { formatDate, formatNumber } from '../../../lib/format';
import type { CampaignSummaryRecord } from '../../../api/types';

export interface CampaignListProps {
  campaigns: CampaignSummaryRecord[];
  selectedId: string | null;
  onSelectCampaign: (id: string) => void;
}

export const CampaignList: React.FC<CampaignListProps> = ({
  campaigns,
  selectedId,
  onSelectCampaign,
}) => {
  const { t, i18n } = useTranslation();

  if (campaigns.length === 0) {
    return <EmptyState title={t('history.empty')} />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHeadCell>{t('history.colDate')}</TableHeadCell>
          <TableHeadCell>{t('history.colChannel')}</TableHeadCell>
          <TableHeadCell>{t('history.colOffer')}</TableHeadCell>
          <TableHeadCell>{t('history.colMode')}</TableHeadCell>
          <TableHeadCell>{t('history.colRecipients')}</TableHeadCell>
          <TableHeadCell>{t('history.colSent')}</TableHeadCell>
          <TableHeadCell>{t('history.colFailed')}</TableHeadCell>
          <TableHeadCell>{t('history.colSkipped')}</TableHeadCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {campaigns.map((c) => {
          const isSelected = selectedId === c.id;
          return (
            <TableRow
              key={c.id}
              isClickable
              onClick={() => onSelectCampaign(c.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onSelectCampaign(c.id);
              }}
              className={isSelected ? 'bg-primary/5 border-s-4 border-primary' : ''}
            >
              <TableCell className="text-xs font-medium text-on-surface">
                {formatDate(c.created, i18n.language)}
              </TableCell>
              <TableCell className="font-mono text-xs font-semibold uppercase text-primary">
                {c.channel}
              </TableCell>
              <TableCell className="text-xs text-on-surface-variant font-mono">
                {c.offer_id}
              </TableCell>
              <TableCell>
                <Badge variant={c.mode === 'live' ? 'teal' : 'neutral'}>
                  {c.mode === 'live' ? t('history.modeLive') : t('history.modeDryRun')}
                </Badge>
              </TableCell>
              <TableCell className="font-mono text-xs font-bold">
                {formatNumber(c.recipients, i18n.language)}
              </TableCell>
              <TableCell className="font-mono text-xs text-risk-low-fg font-bold">
                {formatNumber(c.sent, i18n.language)}
              </TableCell>
              <TableCell className="font-mono text-xs text-error font-bold">
                {formatNumber(c.failed, i18n.language)}
              </TableCell>
              <TableCell className="font-mono text-xs text-on-surface-variant">
                {formatNumber(c.skipped, i18n.language)}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

