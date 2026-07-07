export interface EmailDetectionResult {
  emails: string[];
  official: boolean;
  score: number;
}

const FREE_DOMAINS = ['gmail.com', 'yahoo.com', 'yahoo.co.in', 'hotmail.com', 'outlook.com', 'protonmail.com', 'proton.me', 'yandex.com', 'mail.ru'];
const TEMP_DOMAINS = ['tempmail.com', 'mailinator.com', 'guerrillamail.com', 'dispostable.com', '10minutemail.com', 'sharklasers.com', 'yopmail.com'];
const OFFICIAL_DOMAINS = ['sbi.co.in', 'icicibank.com', 'hdfcbank.com', 'axisbank.com', 'paytm.com', 'phonepe.com', 'cybercrime.gov.in', 'rbi.org.in', 'incometax.gov.in', 'gov.in', 'nic.in'];

// Common brand keywords scammers spoof via free webmail (e.g., sbi-support@gmail.com)
const OFFICIAL_BRAND_KEYWORDS = ['sbi', 'hdfc', 'icici', 'axis', 'paytm', 'phonepe', 'rbi', 'npci', 'incometax', 'customs', 'police', 'fedex', 'dhl'];

const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi;

export const detectEmails = (content: string): EmailDetectionResult => {
  const emails: string[] = [];
  let score = 0;
  let hasOfficialDomain = false;

  const matches = content.match(EMAIL_REGEX);
  if (!matches) {
    return { emails: [], official: false, score: 0 };
  }

  for (const match of matches) {
    const email = match.trim().toLowerCase();
    emails.push(email);

    const domain = email.split('@')[1];
    
    // Check if domain is listed under official banks/gov
    if (OFFICIAL_DOMAINS.includes(domain)) {
      hasOfficialDomain = true;
      continue;
    }

    // Check temp mail domains
    if (TEMP_DOMAINS.includes(domain)) {
      score += 35;
      continue;
    }

    // Check if a free email is spoofing official keywords (e.g. sbi-alerts@gmail.com)
    const localPart = email.split('@')[0];
    const isFreeDomain = FREE_DOMAINS.includes(domain);

    const isSpoofingBrand = OFFICIAL_BRAND_KEYWORDS.some(
      (brand) => localPart.includes(brand) || domain.includes(brand)
    );

    if (isFreeDomain && isSpoofingBrand) {
      score += 45; // Extremely high risk signature
    } else if (isFreeDomain) {
      score += 10; // Moderate risk if sending transactional info from free mail
    } else {
      score += 15; // Unknown custom domain
    }
  }

  return {
    emails,
    official: hasOfficialDomain,
    score: Math.min(score, 100),
  };
};
