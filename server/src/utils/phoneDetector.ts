export interface PhoneDetectionResult {
  phones: string[];
  international: boolean;
  score: number;
}

// Regexes to extract Indian and International phone formats
const PHONE_REGEX = /(\+?\d{1,4}[-.\s]?)?\(?\d{2,5}\)?[-.\s]?\d{3,5}[-.\s]?\d{4,6}/g;
const WA_LINK_REGEX = /(wa\.me|api\.whatsapp\.com\/send)/gi;
const TG_LINK_REGEX = /(t\.me|telegram\.me)/gi;

// High risk international prefixes commonly associated with virtual number scams (+234, +92, +44 virtual, +1 VoIP)
const HIGH_RISK_PREFIXES = ['+234', '+92', '+255', '+447', '+1', '+971', '+62'];

export const detectPhones = (content: string): PhoneDetectionResult => {
  const phones: string[] = [];
  let score = 0;
  let hasInternational = false;

  // Search for phone patterns
  const matches = content.match(PHONE_REGEX);
  if (matches) {
    for (const match of matches) {
      const sanitized = match.trim().replace(/[-\s().]/g, '');
      
      // Filter out short numbers (like dates, codes, amounts)
      if (sanitized.length < 10 || sanitized.length > 15) {
        continue;
      }

      phones.push(sanitized);

      // Check if it is international (doesn't start with standard India +91 or domestic 0/91/no-prefix 10-digits)
      const startsWithIntl = sanitized.startsWith('+') && !sanitized.startsWith('+91');
      const isHighRiskIntl = HIGH_RISK_PREFIXES.some((prefix) => sanitized.startsWith(prefix));

      if (startsWithIntl) {
        hasInternational = true;
        score += isHighRiskIntl ? 35 : 20;
      }
    }
  }

  // Check social engineering direct contact links (WhatsApp invites, Telegram bots)
  if (WA_LINK_REGEX.test(content)) {
    score += 25;
  }
  if (TG_LINK_REGEX.test(content)) {
    score += 25;
  }

  // If message requests urgent calling or callback details
  if (/\b(call|contact|dial|callback|helpline|number)\b/i.test(content) && phones.length > 0) {
    score += 15;
  }

  return {
    phones,
    international: hasInternational,
    score: Math.min(score, 100),
  };
};
