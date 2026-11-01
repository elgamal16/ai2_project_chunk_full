export type ContactType = 'phone' | 'email' | 'both' | 'none';

export function getContactType(phone?: string | null, email?: string | null): ContactType {
  const hasPhone = Boolean(phone && phone.trim());
  const hasEmail = Boolean(email && email.trim());
  if (hasPhone && hasEmail) return 'both';
  if (hasPhone) return 'phone';
  if (hasEmail) return 'email';
  return 'none';
}

export function isReachable(phone?: string | null, email?: string | null): boolean {
  return Boolean((phone && phone.trim()) || (email && email.trim()));
}

