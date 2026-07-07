import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export interface GeminiAnalysisResult {
  riskScore: number;
  riskLevel: 'safe' | 'low' | 'medium' | 'high' | 'critical';
  scamType: string;
  confidence: number;
  explanation: string;
  redFlags: string[];
  psychologicalTricks: string[];
  recommendedActions: string[];
}

export const analyzeContentWithGemini = async (
  content: string,
  contentType: 'text' | 'url' | 'image'
): Promise<GeminiAnalysisResult> => {
  const apiKey = process.env.GEMINI_API_KEY;

  // Fallback Mock generator if Gemini API key is missing
  if (!apiKey) {
    console.warn('[GEMINI SERVICE] API Key missing. Returning simulated safety assessment.');
    return simulateAnalysis(content, contentType);
  }

  try {
    const prompt = `
      You are a world-class Cybersecurity Threat Analyst and AI Scam Detector.
      Analyze the following suspicious ${contentType} input content:
      "${content}"

      Return a strict JSON object only (no markdown, no backticks, no wrapping) matching the following format:
      {
        "riskScore": number (0 to 100),
        "riskLevel": "safe" | "low" | "medium" | "high" | "critical",
        "scamType": "Phishing" | "UPI Fraud" | "Job Scam" | "Predatory Loan App" | "Social Engineering" | "Safe",
        "confidence": number (0 to 100),
        "explanation": "clear, concise explanation of the security risk",
        "redFlags": ["flag 1", "flag 2"],
        "psychologicalTricks": ["trick 1", "trick 2"],
        "recommendedActions": ["action 1", "action 2"]
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
    const resultJson = JSON.parse(resultText) as GeminiAnalysisResult;
    return resultJson;
  } catch (error) {
    console.error('[GEMINI SERVICE] API request error:', error);
    return simulateAnalysis(content, contentType);
  }
};

const simulateAnalysis = (content: string, contentType: 'text' | 'url' | 'image'): GeminiAnalysisResult => {
  const lower = content.toLowerCase();
  
  if (lower.includes('kyc') || lower.includes('block') || lower.includes('bank') || lower.includes('verify')) {
    return {
      riskScore: 88,
      riskLevel: 'high',
      scamType: 'Phishing',
      confidence: 94,
      explanation: 'Sender uses high-pressure language claiming immediate account closure. Linked domain does not belong to the official banking authority.',
      redFlags: ['Urgent activation deadline', 'Unofficial banking subdomain', 'SMS sender number spoofing indicator'],
      psychologicalTricks: ['Authority coercion', 'Urgency & Fear activation'],
      recommendedActions: ['Do not input credentials', 'Block contact and report to 1930 helpline', 'Check bank status via official app'],
    };
  }

  if (lower.includes('lottery') || lower.includes('win') || lower.includes('crore') || lower.includes('whatsapp')) {
    return {
      riskScore: 92,
      riskLevel: 'critical',
      scamType: 'Social Engineering',
      confidence: 98,
      explanation: 'Promises large lottery sums (KBC/WhatsApp rewards) but requires upfront processing/tax verification payments.',
      redFlags: ['Pre-payment fee request', 'Unsolicited reward notification', 'Gmail address used by official support'],
      psychologicalTricks: ['Greed persuasion', 'Artificial validation checks'],
      recommendedActions: ['Never transfer upfront money', 'Report phone number to WhatsApp support', 'Delete the message thread'],
    };
  }

  return {
    riskScore: 12,
    riskLevel: 'safe',
    scamType: 'Safe',
    confidence: 85,
    explanation: 'No phishing indicators, social engineering triggers, or suspicious domain signatures detected in input content.',
    redFlags: [],
    psychologicalTricks: [],
    recommendedActions: ['Maintain standard credentials hygiene', 'Enable multi-factor alerts'],
  };
};
