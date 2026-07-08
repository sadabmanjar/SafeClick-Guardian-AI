import { URL } from 'url';

export interface DomainAnalysisResult {
  domainRisk: number;
  reasons: string[];
}

const SUSPICIOUS_KEYWORDS = ['login', 'secure', 'verify', 'update', 'banking', 'kyc', 'support', 'service', 'account', 'check', 'portal', 'claim', 'refund', 'verification'];
const BRAND_KEYWORDS = ['paytm', 'phonepe', 'sbi', 'hdfc', 'icici', 'axis', 'google', 'microsoft', 'amazon', 'netflix', 'paypal', 'facebook', 'instagram', 'whatsapp', 'telegram'];

export const analyzeDomain = (urlStr: string): DomainAnalysisResult => {
  const reasons: string[] = [];
  let riskScore = 0;

  try {
    // Normalizing URL string to ensure it parses correctly
    let normalizedUrl = urlStr.trim().toLowerCase();
    if (!/^https?:\/\//i.test(normalizedUrl)) {
      normalizedUrl = 'http://' + normalizedUrl;
    }

    const parsed = new URL(normalizedUrl);
    const host = parsed.hostname;

    // Skip IP Addresses since they are already heavily penalized by the URL Detector
    if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(host)) {
      return { domainRisk: 40, reasons: ['URL domain resolves to direct IP coordinates'] };
    }

    // 1. Length checks
    if (host.length > 28) {
      riskScore += 15;
      reasons.push('Domain name is abnormally long (character padding)');
    }

    // 2. Hyphen checks (often used to structure fake domains: sbi-verification-secure)
    const hyphenCount = (host.match(/-/g) || []).length;
    if (hyphenCount > 1) {
      riskScore += 20;
      reasons.push(`Domain contains multiple hyphens (${hyphenCount}) indicative of typosquatting`);
    }

    // 3. Subdomain abuse (e.g., sbi.co.in.secure-verification.xyz)
    const parts = host.split('.');
    if (parts.length > 3) {
      riskScore += 25;
      reasons.push(`Abnormally high subdomain count (${parts.length - 2}) indicating possible phishing redirection`);
    }

    // 4. Typosquatting / Brand hijacking check
    // Check if domain contains brand names but is NOT the official domain
    for (const brand of BRAND_KEYWORDS) {
      const regex = new RegExp(brand, 'i');
      if (regex.test(host)) {
        // Verify if it is indeed the official domain
        const isOfficial = host.endsWith(`${brand}.com`) || host.endsWith(`${brand}.in`) || host.endsWith(`${brand}.co.in`);
        if (!isOfficial) {
          riskScore += 35;
          reasons.push(`Brand hijacking detected: contains '${brand}' but is hosted on an unofficial host domain`);
        }
      }
    }

    // 5. Keyword stuffing
    const stuffed = SUSPICIOUS_KEYWORDS.filter((kw) => host.includes(kw));
    if (stuffed.length > 1) {
      riskScore += 15 * stuffed.length;
      reasons.push(`Security keyword padding detected: contains multiple credential traps [${stuffed.join(', ')}]`);
    }

    // 6. Character randomness (entropy estimation)
    const uniqueChars = new Set(host.replace(/\./g, '')).size;
    const ratio = uniqueChars / host.length;
    if (ratio > 0.8 && host.length > 12) {
      riskScore += 15;
      reasons.push('High character entropy (random sequence signatures)');
    }

  } catch (err) {
    return { domainRisk: 10, reasons: ['Failed to analyze domain format'] };
  }

  return {
    domainRisk: Math.min(riskScore, 100),
    reasons,
  };
};
