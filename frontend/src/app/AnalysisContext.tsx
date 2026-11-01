import React, { createContext, useContext, useState, useMemo } from 'react';

interface AnalysisContextValue {
  file: File | null;
  setFile: (file: File | null) => void;
  activeAnalysisId: string | null;
  setActiveAnalysisId: (id: string | null) => void;
  selectedCustomerIds: string[];
  setSelectedCustomerIds: (ids: string[]) => void;
  toggleCustomerSelection: (id: string) => void;
  clearSelection: () => void;
}

const AnalysisContext = createContext<AnalysisContextValue | undefined>(undefined);

export const AnalysisProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [file, setFile] = useState<File | null>(null);
  const [activeAnalysisId, setActiveAnalysisId] = useState<string | null>(null);
  const [selectedCustomerIds, setSelectedCustomerIds] = useState<string[]>([]);

  const toggleCustomerSelection = (id: string) => {
    setSelectedCustomerIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const clearSelection = () => {
    setSelectedCustomerIds([]);
  };

  const value = useMemo(
    () => ({
      file,
      setFile,
      activeAnalysisId,
      setActiveAnalysisId,
      selectedCustomerIds,
      setSelectedCustomerIds,
      toggleCustomerSelection,
      clearSelection,
    }),
    [file, activeAnalysisId, selectedCustomerIds]
  );

  return <AnalysisContext.Provider value={value}>{children}</AnalysisContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export function useAnalysisContext(): AnalysisContextValue {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error('useAnalysisContext must be used within an AnalysisProvider');
  }
  return context;
}
