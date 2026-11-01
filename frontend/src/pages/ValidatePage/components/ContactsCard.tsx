import React from 'react';
import { useTranslation } from 'react-i18next';
import { Phone, Mail, CheckCheck, XCircle, AlertTriangle } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { formatNumber } from '../../../lib/format';
import type { ContactsSummary } from '../../../api/types';

export interface ContactsCardProps {
  contacts: ContactsSummary;
}

export const ContactsCard: React.FC<ContactsCardProps> = ({ contacts }) => {
  const { t, i18n } = useTranslation();

  const quadrants = [
    {
      label: t('validate.both'),
      count: contacts.both,
      icon: CheckCheck,
      color: 'text-risk-low-fg bg-risk-low-bg/60 border-risk-low-fg/20',
    },
    {
      label: t('validate.phoneOnly'),
      count: contacts.phone_only,
      icon: Phone,
      color: 'text-primary-container bg-primary-container/10 border-primary-container/20',
    },
    {
      label: t('validate.emailOnly'),
      count: contacts.email_only,
      icon: Mail,
      color: 'text-secondary bg-secondary-container/30 border-secondary/20',
    },
    {
      label: t('validate.neither'),
      count: contacts.neither,
      icon: XCircle,
      color: 'text-error bg-error-container/40 border-error/20',
    },
  ];

  return (
    <Card>
      <h3 className="text-base font-bold text-on-surface mb-3">
        {t('validate.contactsTitle')}
      </h3>

      <div className="grid grid-cols-2 gap-3">
        {quadrants.map((q) => {
          const Icon = q.icon;
          return (
            <div
              key={q.label}
              className={`p-3.5 rounded-card border flex items-center justify-between ${q.color}`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className="w-5 h-5 shrink-0" />
                <span className="text-xs font-medium text-on-surface">{q.label}</span>
              </div>
              <span className="text-lg font-bold">
                {formatNumber(q.count, i18n.language)}
              </span>
            </div>
          );
        })}
      </div>

      {(contacts.invalid_phone > 0 || contacts.invalid_email > 0) && (
        <div className="mt-3 pt-3 border-t border-outline-variant/30 flex flex-wrap items-center gap-4 text-xs text-on-surface-variant">
          {contacts.invalid_phone > 0 && (
            <span className="inline-flex items-center gap-1.5 text-risk-medium-fg">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              {t('validate.invalidPhone')}: {formatNumber(contacts.invalid_phone, i18n.language)}
            </span>
          )}
          {contacts.invalid_email > 0 && (
            <span className="inline-flex items-center gap-1.5 text-risk-medium-fg">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              {t('validate.invalidEmail')}: {formatNumber(contacts.invalid_email, i18n.language)}
            </span>
          )}
        </div>
      )}
    </Card>
  );
};

