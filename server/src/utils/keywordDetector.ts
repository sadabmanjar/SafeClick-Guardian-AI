export interface KeywordDetectionResult {
  keywords: string[];
  score: number;
}

// Risk weights assigned to common scam terms
const RISK_KEYWORDS: Record<string, number> = {
  'verify': 10,
  'bank': 8,
  'blocked': 15,
  'kyc': 20,
  'urgent': 15,
  'reward': 15,
  'winner': 20,
  'lottery': 25,
  'gift': 10,
  'cashback': 15,
  'refund': 15,
  'upi': 20,
  'qr': 20,
  'payment': 8,
  'salary': 10,
  'job': 12,
  'telegram': 15,
  'whatsapp': 12,
  'processing fee': 25,
  'limited time': 15,
  'otp': 25,
  'click here': 15,
  'link': 5,
  'account suspended': 25,
  'pan': 15,
  'aadhaar': 15,
  'income tax': 20,
  'rbi': 20,
  'npci': 20,
  'loan': 15,
  'crypto': 20,
  'investment': 18,
  'bonus': 12,
  'customs clearance': 25,
  'parcel': 12,
  'unclaimed': 15,
  'arrest warrant': 30,
  'police notice': 25,
  'cbi': 25,
  'fedex': 15,
  'sextortion': 35,
  'blackmail': 30,
  'nude': 20
};

export const detectKeywords = (content: string): KeywordDetectionResult => {
  const detected: string[] = [];
  let score = 0;
  const lowerContent = content.toLowerCase();

  for (const [keyword, weight] of Object.entries(RISK_KEYWORDS)) {
    // Escaping keyword for safe regex compilation
    const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escapedKeyword}\\b`, 'gi');
    
    if (regex.test(lowerContent)) {
      detected.push(keyword);
      score += weight;
    }
  }

  return {
    keywords: detected,
    score: Math.min(score, 100),
  };
};
