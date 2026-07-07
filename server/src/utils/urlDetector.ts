export interface UrlDetectionResult {
  urls: string[];
  suspiciousUrls: string[];
  score: number;
}

const SHORTENERS = ['bit.ly', 'tinyurl.com', 'rb.gy', 'cutt.ly', 'tiny.cc', 'goo.gl', 'is.gd', 't.co', 'short.gy'];
const SUSPICIOUS_TLDS = ['.xyz', '.click', '.top', '.live', '.zip', '.work', '.shop', '.ml', '.tk', '.ga', '.cf', '.cc', '.info', '.buzz', '.gq'];

// Regex to extract URLs
const URL_REGEX = /(((https?:\/\/)|(www\.))[^\s/$.?#].[^\s]*)/gi;
// Regex to identify raw IP address as domain (e.g., http://192.168.1.1)
const IP_URL_REGEX = /^https?:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/i;

export const detectUrls = (content: string): UrlDetectionResult => {
  const urls: string[] = [];
  const suspiciousUrls: string[] = [];
  let score = 0;

  // Extract all URLs
  const matches = content.match(URL_REGEX);
  if (!matches) {
    return { urls: [], suspiciousUrls: [], score: 0 };
  }

  for (const match of matches) {
    // Sanitize matched URL
    const urlStr = match.trim().replace(/[.,;]$/, '');
    urls.push(urlStr);

    let isSuspicious = false;
    let urlScore = 0;

    // Check HTTP (No SSL)
    if (urlStr.startsWith('http://')) {
      isSuspicious = true;
      urlScore += 15;
    }

    // Check IP address URLs
    if (IP_URL_REGEX.test(urlStr)) {
      isSuspicious = true;
      urlScore += 35;
    }

    // Check shorteners
    const hasShortener = SHORTENERS.some((sh) => urlStr.toLowerCase().includes(sh));
    if (hasShortener) {
      isSuspicious = true;
      urlScore += 25;
    }

    // Check TLDs
    const hasSuspiciousTld = SUSPICIOUS_TLDS.some((tld) => urlStr.toLowerCase().includes(tld));
    if (hasSuspiciousTld) {
      isSuspicious = true;
      urlScore += 20;
    }

    if (isSuspicious) {
      suspiciousUrls.push(urlStr);
      score += urlScore;
    }
  }

  return {
    urls,
    suspiciousUrls,
    score: Math.min(score, 100),
  };
};
