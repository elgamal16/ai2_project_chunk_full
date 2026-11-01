export type RiskLevel = 'low' | 'medium' | 'high';

export function getRiskLevel(score: number): RiskLevel {
  if (score >= 50) return 'high';
  if (score >= 30) return 'medium';
  return 'low';
}

export function getRiskBadgeClasses(level: RiskLevel): string {
  switch (level) {
    case 'high':
      return 'bg-risk-high-bg text-risk-high-fg border border-risk-high-fg/20';
    case 'medium':
      return 'bg-risk-medium-bg text-risk-medium-fg border border-risk-medium-fg/20';
    case 'low':
      return 'bg-risk-low-bg text-risk-low-fg border border-risk-low-fg/20';
  }
}

export function getRiskBarColor(score: number): string {
  if (score >= 50) return 'bg-[#bd3b3b]';
  if (score >= 30) return 'bg-[#b46e1b]';
  return 'bg-[#2e7d5b]';
}

