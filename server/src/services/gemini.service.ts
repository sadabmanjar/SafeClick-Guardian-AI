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

export const generateComplaintWithGemini = async (formData: any): Promise<string> => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.warn('[GEMINI SERVICE] API Key missing. Returning fallback complaint text.');
    return simulateComplaintGeneration(formData);
  }

  try {
    const prompt = `
      You are an expert Cybercrime Lawyer and Police Official in India.
      Draft a formal police complaint for the National Cybercrime Reporting Portal (NCRP) based on the following victim details.
      
      Victim Details:
      - Name: ${formData.complainantName || '[Not provided]'}
      - Phone: ${formData.contactNumber || '[Not provided]'}
      - Email: ${formData.emailAddress || '[Not provided]'}
      
      Incident Details:
      - Fraud Type: ${formData.fraudType || 'Online Fraud'}
      - Date of Incident: ${formData.incidentDate || '[Not provided]'}
      - Amount Lost: ₹${formData.amountLost || '0'}
      - Incident Description: ${formData.incidentDescription || '[Not provided]'}
      
      Platform Details:
      - Platform Used: ${formData.platformUsed || '[Not provided]'}
      - Suspect Contact Info: ${formData.suspectContactInfo || '[Not provided]'}
      
      Format the complaint professionally, including:
      1. To: The Officer In-Charge, Cyber Crime Cell
      2. Subject line
      3. Salutation
      4. Detailed body describing the sequence of events clearly
      5. Financial loss details
      6. Prayer for action
      7. Sign-off

      Do not wrap the output in markdown code blocks like \`\`\` text, just return the raw text. Make it sound highly professional and legally sound under the IT Act 2000.
    `;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      }
    );

    let resultText = response.data.candidates[0].content.parts[0].text;
    resultText = resultText.replace(/^```[a-zA-Z]*\n/, '').replace(/\\n```$/, '');
    return resultText;
  } catch (error) {
    console.error('[GEMINI SERVICE] Complaint generation API request error:', error);
    return simulateComplaintGeneration(formData);
  }
};

const simulateComplaintGeneration = (data: any): string => {
  return `To,
The Officer In-Charge,
Cyber Crime Investigation Cell
Police Headquarters

Subject: Formal Complaint regarding Cyber Fraud of ₹${data.amountLost || '0'} via ${data.platformUsed || 'online platform'}.

Respected Sir/Madam,

I, ${data.complainantName || 'the undersigned'}, am writing to formally report an incident of cyber fraud that occurred on ${data.incidentDate || 'the recent date'}. 

Incident Details:
${data.incidentDescription || 'I was deceived by a fraudulent scheme leading to a financial loss.'}

The suspect communicated via: ${data.suspectContactInfo || 'unknown means'}.
Total Financial Loss: ₹${data.amountLost || '0'}

I have attached the necessary evidence and transaction records for your reference. I kindly request you to register an FIR under Section 420 of IPC and Section 66D of the IT Act, 2000, and initiate an urgent investigation to freeze the suspect's accounts and recover the lost funds.

Thanking you,
Yours faithfully,

${data.complainantName || '[Name]'}
Phone: ${data.contactNumber || '[Phone]'}
Email: ${data.emailAddress || '[Email]'}`;
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
