import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  UploadCloud,
  CheckSquare,
  BarChart3,
  Send,
  History,
  Activity,
} from 'lucide-react';
import { useAnalysisContext } from '../../app/AnalysisContext';

export const Sidebar: React.FC = () => {
  const { t } = useTranslation();
  const { activeAnalysisId } = useAnalysisContext();

  const resultsPath = activeAnalysisId ? `/results/${activeAnalysisId}` : '/';

  const navItems = [
    { to: '/', label: t('nav.upload'), icon: UploadCloud, end: true },
    { to: '/check', label: t('nav.validate'), icon: CheckSquare },
    { to: resultsPath, label: t('nav.results'), icon: BarChart3 },
    { to: '/campaign', label: t('nav.campaign'), icon: Send },
    { to: '/campaigns', label: t('nav.history'), icon: History },
    { to: '/model', label: t('nav.model'), icon: Activity },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 bg-surface-lowest border-e border-outline-variant/30 min-h-[calc(100vh-4rem)] p-4">
        <nav className="flex-1 space-y-1.5" aria-label="Main Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-control font-medium text-sm transition-colors min-h-[44px] ${
                    isActive
                      ? 'bg-primary-container text-white shadow-sm'
                      : 'text-on-surface-variant hover:bg-surface-container/60 hover:text-on-surface'
                  }`
                }
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Bottom Navigation Bar (< 768px) */}
      <nav
        className="md:hidden fixed bottom-0 start-0 end-0 z-40 bg-surface-lowest border-t border-outline-variant/30 flex items-center justify-around py-1 px-2 safe-area-bottom"
        aria-label="Mobile Navigation"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center p-1 rounded-control min-h-[44px] min-w-[44px] text-xs transition-colors ${
                  isActive ? 'text-primary font-bold' : 'text-on-surface-variant'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] truncate max-w-[50px]">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </>
  );
};

