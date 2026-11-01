import type { CustomerRecord } from '../api/types';

export function getWhatsAppUrl(c: CustomerRecord): string {
  let phone = (c.phone || '').replace(/[^0-9]/g, '');
  if (phone.startsWith('01') && phone.length === 11) {
    phone = '2' + phone; // Egyptian mobile format (010... -> 2010...)
  } else if (phone.startsWith('00')) {
    phone = phone.substring(2);
  }

  const name = c.name ? `أستاذ ${c.name}` : 'عميلنا العزيز';

  const offerTitles: Record<string, string> = {
    annual_discount: 'خصم 20% عند التجديد أو الترقية لباقة سنوية',
    free_support: '3 أشهر دعم فني مجاني مع أولوية في الخدمة',
    fiber_credit: 'خصم ورصيد مجاني لمدة شهرين على اشتراك الفايبر',
    welcome_gift: 'هدية ولاء: 5 جيجابايت إنترنت إضافية مجاناً',
    autopay_bonus: 'خصم 10% عند تفعيل خاصية الدفع التلقائي',
    general: 'خصم خاص 10% على فواتيرك للأشهر القادمة',
  };

  const offerText = offerTitles[c.suggested_offer || 'general'] || 'خصم خاص على باقتك الشهرية';

  const text = 
`مرحباً ${name}،
يسعدنا وجودك معنا ونقدر ثقتك دائماً ✨
تقديراً لولائك، يسرنا أن نقدم لك هذا العرض الحصري:
🎁 *${offerText}*

يمكنك الاستفادة من هذا العرض فوراً من خلال الرد على هذه الرسالة أو التواصل مع خدمة العملاء.`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

