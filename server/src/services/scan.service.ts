import { detectKeywords } from '../utils/keywordDetector';
import { detectUrls } from '../utils/urlDetector';
import { detectEmails } from '../utils/emailDetector';
import { detectPhones } from '../utils/phoneDetector';
import { analyzeDomain } from '../utils/domainAnalyzer';
import { calculateRisk } from '../utils/riskEngine';
import { analyzeContentWithGemini, StructuredContext } from './gemini.service';
import Scan, { IScan } from '../models/scan.model';
import { AppError } from '../middlewares/error.middleware';
import { createSystemNotification } from './notification.service';

interface AnalyzeRequest {
  userId?: string;
  content: string;
  contentType: 'text' | 'url' | 'image';
  location?: any;
  ipAddress?: string;
}

export const processScan = async (params: AnalyzeRequest) => {
  const { content, contentType, userId, location, ipAddress } = params;

  // Run all detectors in parallel using Promise.all
  const [keywordsResult, urlsResult, emailsResult, phonesResult] = await Promise.all([
    Promise.resolve(detectKeywords(content)),
    Promise.resolve(detectUrls(content)),
    Promise.resolve(detectEmails(content)),
    Promise.resolve(detectPhones(content)),
  ]);

  // Analyze first extracted URL domain risk if URLs exist
  let domainScore = 0;
  let domainReasons: string[] = [];
  if (urlsResult.urls.length > 0) {
    const domResult = analyzeDomain(urlsResult.urls[0]);
    domainScore = domResult.domainRisk;
    domainReasons = domResult.reasons;
  }

  // Run local risk engine
  const localRisk = calculateRisk({
    keywordScore: keywordsResult.score,
    urlScore: urlsResult.score,
    emailScore: emailsResult.score,
    phoneScore: phonesResult.score,
    domainScore,
  });

  const structuredContext: StructuredContext = {
    originalContent: content,
    contentType,
    detectedKeywords: keywordsResult.keywords,
    detectedUrls: urlsResult.urls,
    detectedEmails: emailsResult.emails,
    detectedPhones: phonesResult.phones,
    domainRisk: domainScore,
    domainRiskReasons: domainReasons,
    calculatedLocalRiskScore: localRisk.riskScore,
    calculatedLocalRiskLevel: localRisk.riskLevel,
  };

  const geminiStart = Date.now();
  const geminiResult = await analyzeContentWithGemini(structuredContext);
  const geminiTime = Date.now() - geminiStart;

  const mongoStart = Date.now();
  const newScan = new Scan({
    userId,
    input: content,
    inputType: contentType,
    keywords: keywordsResult.keywords,
    urls: urlsResult.urls,
    emails: emailsResult.emails,
    phones: phonesResult.phones,
    domainRisk: domainScore,
    ipAddress,
    location,
    country: 'India',
    ...geminiResult,
  });

  await newScan.save();
  const mongoTime = Date.now() - mongoStart;

  if (userId) {
    if (newScan.riskLevel === 'high' || newScan.riskLevel === 'critical') {
      await createSystemNotification({
        userId,
        title: 'Security Alert: High Risk Detected',
        message: `Your recent scan of a ${contentType} was flagged as ${newScan.riskLevel} risk. Please review the recommended actions.`,
        type: 'security',
        priority: 'critical',
        redirectUrl: `/dashboard/scans/${newScan._id}`,
      });
    } else {
      await createSystemNotification({
        userId,
        title: 'Scan Completed',
        message: `Your ${contentType} has been successfully analyzed.`,
        type: 'ai',
        priority: 'low',
        redirectUrl: `/dashboard/scans/${newScan._id}`,
      });
    }
  }

  return { newScan, timings: { geminiTime, mongoTime } };
};

export const getScanHistory = async (userId: string): Promise<IScan[]> => {
  return Scan.find({ userId }).sort({ createdAt: -1 });
};

export const getScanById = async (id: string, userId?: string): Promise<IScan> => {
  const query: any = { _id: id };
  if (userId) query.userId = userId;

  const scan = await Scan.findOne(query);
  if (!scan) {
    const err: AppError = new Error('Threat scan entry not found or permission denied');
    err.statusCode = 404;
    throw err;
  }
  return scan;
};

export const deleteScanById = async (id: string, userId?: string): Promise<void> => {
  const query: any = { _id: id };
  if (userId) query.userId = userId;

  const scan = await Scan.findOneAndDelete(query);
  if (!scan) {
    const err: AppError = new Error('Threat scan entry not found or permission denied');
    err.statusCode = 404;
    throw err;
  }
};
