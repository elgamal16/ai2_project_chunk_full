import React from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, XCircle } from 'lucide-react';
import { Card } from '../../../components/ui/Card';

const REQUIRED_COLUMNS = [
  'customerID',
  'gender',
  'SeniorCitizen',
  'Partner',
  'Dependents',
  'tenure',
  'PhoneService',
  'MultipleLines',
  'InternetService',
  'OnlineSecurity',
  'OnlineBackup',
  'DeviceProtection',
  'TechSupport',
  'StreamingTV',
  'StreamingMovies',
  'Contract',
  'PaperlessBilling',
  'PaymentMethod',
  'MonthlyCharges',
];

export interface ColumnStatusProps {
  columnsFound: string[];
  missingColumns: string[];
}

export const ColumnStatus: React.FC<ColumnStatusProps> = ({
  columnsFound,
  missingColumns,
}) => {
  const { t } = useTranslation();
  const allValid = missingColumns.length === 0;

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-on-surface">
            {t('validate.columnsStatus')}
          </h3>
          <p className="text-xs text-on-surface-variant mt-0.5">
            {allValid ? t('validate.columnsValid') : t('validate.columnsMissing')}
          </p>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
            allValid
              ? 'bg-risk-low-bg text-risk-low-fg'
              : 'bg-error-container text-error'
          }`}
        >
          {allValid ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              {t('validate.present')}
            </>
          ) : (
            <>
              <XCircle className="w-4 h-4" />
              {missingColumns.length} {t('validate.missing')}
            </>
          )}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
        {REQUIRED_COLUMNS.map((col) => {
          const isPresent = columnsFound.includes(col);
          return (
            <div
              key={col}
              className={`flex items-center justify-between px-3 py-2 rounded-control text-xs border ${
                isPresent
                  ? 'bg-surface-lowest border-outline-variant/30 text-on-surface'
                  : 'bg-error-container/40 border-error/40 text-error'
              }`}
            >
              <span className="font-mono truncate">{col}</span>
              {isPresent ? (
                <CheckCircle2 className="w-4 h-4 text-risk-low-fg shrink-0 ms-1.5" />
              ) : (
                <XCircle className="w-4 h-4 text-error shrink-0 ms-1.5" />
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
};

