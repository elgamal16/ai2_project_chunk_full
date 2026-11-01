import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowUpRight, History } from 'lucide-react';
import { useRecentAnalyses } from '../hooks/useRecentAnalyses';
import { formatDate, formatNumber } from '../../../lib/format';
import { Table, TableBody, TableCell, TableHeadCell, TableHeader, TableRow } from '../../../components/ui/Table';
import { Skeleton } from '../../../components/ui/Skeleton';
import { EmptyState } from '../../../components/ui/EmptyState';
import { Badge } from '../../../components/ui/Badge';

export const RecentRuns: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { data: runs, isLoading, isError } = useRecentAnalyses();

  if (isLoading) {
    return (
      <div className="space-y-3 mt-8">
        <Skeleton height={24} width={180} />
        <Skeleton height={120} />
      </div>
    );
  }

  if (isError || !runs || runs.length === 0) {
    return (
      <div className="mt-8">
        <h3 className="text-base font-semibold text-on-surface mb-3 flex items-center gap-2">
          <History className="w-5 h-5 text-primary-container" />
          {t('upload.recentRuns')}
        </h3>
        <EmptyState title={t('upload.recentEmpty')} />
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h3 className="text-base font-semibold text-on-surface mb-3 flex items-center gap-2">
        <History className="w-5 h-5 text-primary-container" />
        {t('upload.recentRuns')}
      </h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHeadCell>{t('upload.filename')}</TableHeadCell>
            <TableHeadCell>{t('upload.date')}</TableHeadCell>
            <TableHeadCell>{t('upload.total')}</TableHeadCell>
            <TableHeadCell>{t('upload.willLeave')}</TableHeadCell>
            <TableHeadCell className="text-end">{t('upload.viewResults')}</TableHeadCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {runs.map((run) => (
            <TableRow
              key={run.id}
              isClickable
              onClick={() => navigate(`/results/${run.id}`)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') navigate(`/results/${run.id}`);
              }}
            >
              <TableCell className="font-semibold text-primary">{run.filename}</TableCell>
              <TableCell className="text-on-surface-variant text-xs">
                {formatDate(run.created, i18n.language)}
              </TableCell>
              <TableCell>{formatNumber(run.total ?? 0, i18n.language)}</TableCell>
              <TableCell>
                <Badge variant="high">
                  {formatNumber(run.will_leave ?? 0, i18n.language)}
                </Badge>
              </TableCell>
              <TableCell className="text-end">
                <span className="inline-flex items-center text-primary-container text-xs font-semibold">
                  <ArrowUpRight className="w-4 h-4 ms-1" />
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

