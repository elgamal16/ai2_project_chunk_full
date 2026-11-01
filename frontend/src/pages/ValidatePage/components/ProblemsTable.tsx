import React from 'react';
import { useTranslation } from 'react-i18next';
import { Download, ShieldCheck } from 'lucide-react';
import { Table, TableBody, TableCell, TableHeadCell, TableHeader, TableRow } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { downloadCsv } from '../../../lib/download';
import type { ValidationProblem } from '../../../api/types';

export interface ProblemsTableProps {
  problems: ValidationProblem[];
  blockingRows?: number;
}

export const ProblemsTable: React.FC<ProblemsTableProps> = ({ problems }) => {
  const { t } = useTranslation();

  const handleDownloadProblems = () => {
    const headers = ['row', 'column', 'issue', 'level'];
    const rows = problems.map((p) => [
      p.row ?? '',
      p.column ?? '',
      `"${(p.issue || '').replace(/"/g, '""')}"`,
      p.level || 'error',
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    downloadCsv(csvContent, 'validation_problems.csv');
  };

  if (problems.length === 0) {
    return (
      <div className="flex items-center gap-3 p-4 rounded-card bg-risk-low-bg/40 border border-risk-low-fg/30 text-risk-low-fg">
        <ShieldCheck className="w-5 h-5 shrink-0" />
        <span className="text-sm font-semibold">{t('validate.noProblems')}</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-on-surface">
            {t('validate.problemsTitle')} ({problems.length})
          </h3>
          <p className="text-xs text-on-surface-variant">
            {t('validate.problemsDesc')}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownloadProblems}
          className="shrink-0"
        >
          <Download className="w-4 h-4 me-1.5" />
          {t('validate.downloadProblems')}
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHeadCell>{t('validate.colRow')}</TableHeadCell>
            <TableHeadCell>{t('validate.colColumn')}</TableHeadCell>
            <TableHeadCell>{t('validate.colIssue')}</TableHeadCell>
            <TableHeadCell>{t('validate.colLevel')}</TableHeadCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {problems.slice(0, 100).map((p, idx) => (
            <TableRow key={idx}>
              <TableCell className="font-mono text-xs">{p.row ?? '—'}</TableCell>
              <TableCell className="font-mono text-xs font-semibold">
                {p.column ?? '—'}
              </TableCell>
              <TableCell className="text-xs">{p.issue}</TableCell>
              <TableCell>
                <Badge variant={p.level === 'warning' ? 'warning' : 'error'}>
                  {p.level === 'warning' ? t('validate.warning') : t('validate.error')}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

