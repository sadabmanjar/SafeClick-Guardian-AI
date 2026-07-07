import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export interface StructuredContext {
  originalContent: string;
  contentType: 'text' | 'url' | 'image';
  detectedKeywords: string[];
  detectedUrls: string[];
  detectedEmails: string[];
  detectedPhones: string[];
  domainRisk: number;
  domainRiskReasons: string[];
  calculatedLocalRiskScore: number;
  calculatedLocalRiskLevel: string;
}

export interface PremiumGeminiResult {
  riskScore: number;
  confidence: number;
  riskLevel: 'safe' | 'low' | 'medium' | 'high' | 'critical';
  scamType: string;
  explanation: string;
  redFlags: string[];
  psychologicalTricks: string[];
  victimImpact: string;
  recommendedActions: string[];
  legalAdvice: string;
  reportImmediately: boolean;
  governmentPortal: string;
  helpline: string;
  similarScams: string[];
}

export const analyzeContentWithGemini = async (
  context: StructuredContext
): Promise<PremiumGeminiResult> => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'YOUR_GEMINI_KEY') {
    console.warn('[GEMINI SERVICE] API Key missing/placeholder. Emitting high-fidelity mock audit.');
    return simulatePremiumAnalysis(context);
  }

  try {
    const prompt = `
      You are India's leading AI Cybersecurity Threat Analyst and Digital Fraud Interception expert at the National Cybercrime Research Agency.
      Analyze the following suspicious incident context derived from local heuristic detectors:

      === INCIDENT CONTEXT ===
      Suspicious Input Type: ${context.contentType}
      Original Content: "${context.originalContent}"
      Detected Risk Keywords: [${context.detectedKeywords.join(', ')}]
      Extracted URLs: [${context.detectedUrls.join(', ')}]
      Extracted Email accounts: [${context.detectedEmails.join(', ')}]
      Extracted Callbacks/Phone numbers: [${context.detectedPhones.join(', ')}]
      Domain Risk Score: ${context.domainRisk}/100
      Domain Risk Flags: [${context.domainRiskReasons.join(', ')}]
      Calculated Local Heuristic Risk Score: ${context.calculatedLocalRiskScore}/100 (${context.calculatedLocalRiskLevel.toUpperCase()})

      Evaluate this payload specifically targeting the INDIAN cybersecurity landscape.
      Ensure references are aligned with:
      - RBI (Reserve Bank of India) regulations
      - NPCI (National Payments Corporation of India) UPI transaction frameworks
      - Cyber Police reporting portals (cybercrime.gov.in)
      - The National Cybercrime Helpline (1930)
      - Indian IT Act 2000 (especially Section 66C and 66D)

      Return a strict JSON object only (no markdown formatting, no backticks, no wrapper text).
      Matching this JSON layout:
      {
        "riskScore": number (0 to 100),
        "confidence": number (0 to 100),
        "riskLevel": "safe" | "low" | "medium" | "high" | "critical",
        "scamType": "Phishing" | "UPI Fraud" | "Job Scam" | "Predatory Loan App" | "Social Engineering" | "Aadhaar/PAN Scam" | "Courier/FedEx Scam" | "Safe",
        "explanation": "detailed explanation of the scam footprint & how it operates in India",
        "redFlags": ["flag 1", "flag 2"],
        "psychologicalTricks": ["Authority coercion", "Urgency/Panic creation", "Greed activation"],
        "victimImpact": "expected financial or privacy loss details",
        "recommendedActions": ["immediate containment action 1", "containment action 2"],
        "legalAdvice": "specific legal referencing (e.g. IT Act Section 66D for identity theft)",
        "reportImmediately": true/false,
        "governmentPortal": "https://www.cybercrime.gov.in",
        "helpline": "1930",
        "similarScams": ["historical scam type 1", "scam type 2"]
      }
    `;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          responseMimeType: "application/json"
        }
      }
    );

    const resultText = response.data.candidates[0].content.parts[0].text;
    const resultJson = JSON.parse(resultText) as PremiumGeminiResult;
    return resultJson;
  } catch (error) {
    console.error('[GEMINI SERVICE] API processing error. Falling back to local simulation.', error);
    return simulatePremiumAnalysis(context);
  }
};

const simulatePremiumAnalysis = (context: StructuredContext): PremiumGeminiResult => {
  const isScam = context.calculatedLocalRiskScore > 15 || context.detectedKeywords.length > 0;
  
  if (!isScam) {
    return {
      riskScore: context.calculatedLocalRiskScore,
      confidence: 85,
      riskLevel: 'safe',
      scamType: 'Safe',
      explanation: 'No phishing indicators, social engineering triggers, or suspicious domain signatures detected in input content.',
      redFlags: [],
      psychologicalTricks: [],
      victimImpact: 'None. Safe configuration verified.',
      recommendedActions: ['Maintain standard credentials hygiene', 'Enable multi-factor alerts'],
      legalAdvice: 'No violations detected. Covered under general digital hygiene guidelines.',
      reportImmediately: false,
      governmentPortal: 'https://www.cybercrime.gov.in',
      helpline: '1930',
      similarScams: []
    };
  }

  // Determine categories
  let category = 'Social Engineering';
  let explain = 'Suspicious content detected pretending to be from official banking or delivery services.';
  let tricks = ['Urgency activation', 'Authority impersonation'];
  let flags = ['Urgent deadline padding', 'Unofficial domains usage'];
  let advice = 'Violation of Section 66D of the Information Technology Act 2000 (cheating by personation using computer resources).';

  const origLower = context.originalContent.toLowerCase();

  if (origLower.includes('kyc') || origLower.includes('blocked') || origLower.includes('sbi') || origLower.includes('hdfc')) {
    category = 'Phishing';
    explain = 'The message spoofing bank alerts claims immediate account suspension. RBI regulations mandate banks never request credential updates via SMS links.';
    tricks = ['Fear activation', 'Loss aversion'];
    flags = ['Unofficial short URL redirection', 'Requesting sensitive PIN/OTP details'];
  } else if (origLower.includes('lottery') || origLower.includes('winner') || origLower.includes('cashback')) {
    category = 'Social Engineering';
    explain = 'Pretends to offer KBC rewards or lottery cashbacks to lure targets into processing fee transactions.';
    tricks = ['Greed activation', 'Artificial gratification'];
    flags = ['Upfront payment requested', 'Verification via WhatsApp link'];
  } else if (origLower.includes('job') || origLower.includes('internship') || origLower.includes('telegram')) {
    category = 'Job Scam';
    explain = 'Telegram rating task scams offering daily income, followed by mandatory security deposits to release earnings.';
    tricks = ['Reciprocity baiting', 'Initial small payouts payout trust'];
    flags = ['Deposits required to work', 'Operations hosted on unverified Telegram channels'];
  }

  return {
    riskScore: Math.max(context.calculatedLocalRiskScore, 75), // Guarantee high risk on mock scam indicators
    confidence: 90,
    riskLevel: context.calculatedLocalRiskScore > 89 ? 'critical' : 'high',
    scamType: category,
    explanation: explain,
    redFlags: [...context.domainRiskReasons, ...flags],
    psychologicalTricks: tricks,
    victimImpact: 'Loss of credentials, unauthorized access to mobile banking apps, or fraudulent debit transfers.',
    recommendedActions: [
      'Do not tap or click the links included.',
      'Report the sender number or WhatsApp invite immediately on cybercrime.gov.in.',
      'Call the Reserve Bank helpline or 1930 cyber emergency number if transactions occur.'
    ],
    legalAdvice: advice,
    reportImmediately: true,
    governmentPortal: 'https://www.cybercrime.gov.in',
    helpline: '1930',
    similarScams: ['UPI spoof collect requests', 'Fake FedEx customs parcel scams']
  };
};
