import React from 'react';
import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';

export const AppShell: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      <TopBar />
      <div className="flex-1 flex flex-col md:flex-row">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <main className="flex-1 p-4 md:p-6 lg:p-8 pb-20 md:pb-8 max-w-7xl w-full mx-auto">
            <Outlet />
          </main>
          <footer className="border-t border-outline-variant/30 py-4 px-6 text-center text-xs text-on-surface-variant bg-surface-lowest/70 hidden md:block">
            <p>{t('footer.disclaimer')}</p>
          </footer>
        </div>
      </div>
      <footer className="border-t border-outline-variant/30 py-3 px-4 text-center text-[11px] text-on-surface-variant bg-surface-lowest/80 md:hidden mb-16">
        <p>{t('footer.disclaimer')}</p>
      </footer>
    </div>
  );
};

