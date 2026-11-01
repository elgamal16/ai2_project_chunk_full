import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sliders, Download } from 'lucide-react';
import { Stepper } from '../../components/ui/Stepper';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { ErrorBanner } from '../../components/ui/ErrorBanner';
import { SummaryCards } from './components/SummaryCards';
import { RiskDonut } from './components/RiskDonut';
import { ContractBars } from './components/ContractBars';
import { ReachabilityCard } from './components/ReachabilityCard';
import { CustomerTable } from './components/CustomerTable';
import { CustomerDrawer } from './components/CustomerDrawer';
import { SelectionBar } from './components/SelectionBar';
import { useAnalysis } from './hooks/useAnalysis';
import { useCustomers } from './hooks/useCustomers';
import { useAnalysisContext } from '../../app/AnalysisContext';
import { getExportCsvUrl } from '../../api/analysis';
import type { CustomerRecord } from '../../api/types';

export const ResultsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { selectedCustomerIds, toggleCustomerSelection, clearSelection, setSelectedCustomerIds } = useAnalysisContext();
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerRecord | null>(null);

  const { data: analysis, isLoading: isAnalysisLoading, error: analysisError } = useAnalysis(id);
  const { data: customerData, filters, updateFilters, isLoading: isCustLoading } = useCustomers(id);

  if (isAnalysisLoading) {
    return <div className="space-y-4"><Stepper currentStep={3} /><Skeleton height={100} /><Skeleton height={300} /></div>;
  }
  if (analysisError || !analysis || !analysis.summary) {
    return <div className="space-y-4"><Stepper currentStep={3} /><ErrorBanner message={analysisError?.message || t('ui.emptyDesc')} /></div>;
  }

  const items = customerData?.items || [];
  const handleSelectHighRisk = () => {
    const highRiskIds = items.filter((c) => c.risk_level === 'high').map((c) => c.customer_id);
    setSelectedCustomerIds(Array.from(new Set([...selectedCustomerIds, ...highRiskIds])));
  };

  const reachableCount = items.filter((c) => selectedCustomerIds.includes(c.customer_id) && (c.phone || c.email)).length;
  const unreachableCount = selectedCustomerIds.length - reachableCount;

  return (
    <div className="space-y-6">
      <Stepper currentStep={3} />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-on-surface">{t('results.title')}</h1>
          <p className="text-xs text-on-surface-variant mt-0.5">{analysis.filename} · {analysis.id}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link to={`/results/${id}/simulate`}>
            <Button variant="outline" size="sm">
              <Sliders className="w-4 h-4 me-1.5" />{t('results.simulateThreshold')}
            </Button>
          </Link>
          <a href={getExportCsvUrl(analysis.id)} download>
            <Button variant="primary" size="sm">
              <Download className="w-4 h-4 me-1.5" />{t('results.exportCsv')}
            </Button>
          </a>
        </div>
      </div>
      <SummaryCards summary={analysis.summary} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <RiskDonut riskLevels={analysis.summary.risk_levels} />
        <ContractBars byContract={analysis.summary.by_contract} />
        <ReachabilityCard highRiskReachable={analysis.summary.high_risk_reachable} />
      </div>
      {isCustLoading ? <Skeleton height={350} /> : (
        <CustomerTable
          customers={items}
          total={customerData?.total || 0}
          filters={filters}
          onFilterChange={updateFilters}
          selectedIds={selectedCustomerIds}
          onToggleSelect={toggleCustomerSelection}
          onSelectAllHighRisk={handleSelectHighRisk}
          onRowClick={(c) => setSelectedCustomer(c)}
        />
      )}
      <CustomerDrawer customer={selectedCustomer} onClose={() => setSelectedCustomer(null)} />
      <SelectionBar
        selectedCount={selectedCustomerIds.length}
        reachableCount={reachableCount}
        unreachableCount={unreachableCount}
        onClear={clearSelection}
      />
    </div>
  );
};

