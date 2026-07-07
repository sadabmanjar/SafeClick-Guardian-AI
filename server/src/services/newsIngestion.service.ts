import District from '../models/district.model';
import Incident from '../models/incident.model';
import News from '../models/news.model';
import { isMockMode } from '../config/db';

// District list of Madhya Pradesh with default/initial cyber crime heuristics
export interface MPDistrictData {
  districtId: string;
  districtName: string;
  geoJsonId: string;
  totalCases: number;
  financialLoss: number;
  riskScore: number;
  commonScam: string;
  recentIncidents: number;
  nearbyStation: string;
  lastUpdated: Date;
}

export let memoryDistricts: MPDistrictData[] = [];
export let memoryIncidents: any[] = [];
export let memoryNews: any[] = [];

const INITIAL_DISTRICTS: Omit<MPDistrictData, 'riskScore' | 'lastUpdated'>[] = [
  { districtId: 'MP-01', districtName: 'Bhopal', geoJsonId: 'Bhopal', totalCases: 382, financialLoss: 12450000, commonScam: 'Telegram Task Fraud', recentIncidents: 14, nearbyStation: 'Bhopal Cyber Cell HQ, Jahangirabad' },
  { districtId: 'MP-02', districtName: 'Indore', geoJsonId: 'Indore', totalCases: 512, financialLoss: 18900000, commonScam: 'UPI Fraud', recentIncidents: 22, nearbyStation: 'Indore Cyber Police Station, Palasia' },
  { districtId: 'MP-03', districtName: 'Jabalpur', geoJsonId: 'Jabalpur', totalCases: 294, financialLoss: 8900000, commonScam: 'KYC Phishing', recentIncidents: 11, nearbyStation: 'Jabalpur Cyber Cell, Civil Lines' },
  { districtId: 'MP-04', districtName: 'Gwalior', geoJsonId: 'Gwalior', totalCases: 260, financialLoss: 7200000, commonScam: 'Loan App Blackmail', recentIncidents: 9, nearbyStation: 'Gwalior Cyber Cell, SP Office' },
  { districtId: 'MP-05', districtName: 'Ujjain', geoJsonId: 'Ujjain', totalCases: 198, financialLoss: 4500000, commonScam: 'UPI Fraud', recentIncidents: 8, nearbyStation: 'Ujjain Cyber Police Station, Nanakheda' },
  { districtId: 'MP-06', districtName: 'Sagar', geoJsonId: 'Sagar', totalCases: 145, financialLoss: 3200000, commonScam: 'Aadhaar Fraud (AePS)', recentIncidents: 6, nearbyStation: 'Sagar Cyber Police Station, Gopal Ganj' },
  { districtId: 'MP-07', districtName: 'Rewa', geoJsonId: 'Rewa', totalCases: 138, financialLoss: 2800000, commonScam: 'KYC Phishing', recentIncidents: 5, nearbyStation: 'Rewa Cyber Cell, Civil Lines' },
  { districtId: 'MP-08', districtName: 'Satna', geoJsonId: 'Satna', totalCases: 120, financialLoss: 3100000, commonScam: 'Phishing', recentIncidents: 4, nearbyStation: 'Satna Cyber Cell, SP Office' },
  { districtId: 'MP-09', districtName: 'Morena', geoJsonId: 'Morena', totalCases: 95, financialLoss: 1800000, commonScam: 'UPI Fraud', recentIncidents: 3, nearbyStation: 'Morena Cyber Cell, SP Office' },
  { districtId: 'MP-10', districtName: 'Chhindwara', geoJsonId: 'Chhindwara', totalCases: 110, financialLoss: 2100000, commonScam: 'Aadhaar Fraud (AePS)', recentIncidents: 4, nearbyStation: 'Chhindwara Cyber Cell, SP Office' },
  { districtId: 'MP-11', districtName: 'Dhar', geoJsonId: 'Dhar', totalCases: 88, financialLoss: 1500000, commonScam: 'UPI Fraud', recentIncidents: 2, nearbyStation: 'Dhar Cyber Cell, SP Office' },
  { districtId: 'MP-12', districtName: 'Guna', geoJsonId: 'Guna', totalCases: 76, financialLoss: 1200000, commonScam: 'KYC Phishing', recentIncidents: 2, nearbyStation: 'Guna Cyber Cell, SP Office' },
  { districtId: 'MP-13', districtName: 'Dewas', geoJsonId: 'Dewas', totalCases: 84, financialLoss: 1650000, commonScam: 'Telegram Task Fraud', recentIncidents: 3, nearbyStation: 'Dewas Cyber Cell, SP Office' },
  { districtId: 'MP-14', districtName: 'Katni', geoJsonId: 'Katni', totalCases: 72, financialLoss: 1100000, commonScam: 'KYC Phishing', recentIncidents: 2, nearbyStation: 'Katni Cyber Cell, SP Office' },
  { districtId: 'MP-15', districtName: 'Khandwa', geoJsonId: 'Khandwa', totalCases: 68, financialLoss: 980000, commonScam: 'UPI Fraud', recentIncidents: 1, nearbyStation: 'Khandwa Cyber Cell, SP Office' },
  { districtId: 'MP-16', districtName: 'Khargone', geoJsonId: 'Khargone', totalCases: 74, financialLoss: 1300000, commonScam: 'Aadhaar Fraud (AePS)', recentIncidents: 2, nearbyStation: 'Khargone Cyber Cell, SP Office' },
  { districtId: 'MP-17', districtName: 'Singrauli', geoJsonId: 'Singrauli', totalCases: 92, financialLoss: 2400000, commonScam: 'Telegram Task Fraud', recentIncidents: 4, nearbyStation: 'Singrauli Cyber Cell, Waidhan' },
  { districtId: 'MP-18', districtName: 'Hoshangabad', geoJsonId: 'Hoshangabad', totalCases: 82, financialLoss: 1540000, commonScam: 'UPI Fraud', recentIncidents: 3, nearbyStation: 'Hoshangabad Cyber Cell, SP Office' },
  { districtId: 'MP-19', districtName: 'Bhind', geoJsonId: 'Bhind', totalCases: 64, financialLoss: 920000, commonScam: 'KYC Phishing', recentIncidents: 2, nearbyStation: 'Bhind Cyber Cell, SP Office' },
  { districtId: 'MP-20', districtName: 'Shivpuri', geoJsonId: 'Shivpuri', totalCases: 78, financialLoss: 1150000, commonScam: 'Loan App Blackmail', recentIncidents: 3, nearbyStation: 'Shivpuri Cyber Cell, SP Office' },
  { districtId: 'MP-21', districtName: 'Ratlam', geoJsonId: 'Ratlam', totalCases: 86, financialLoss: 1800000, commonScam: 'UPI Fraud', recentIncidents: 3, nearbyStation: 'Ratlam Cyber Cell, SP Office' },
  { districtId: 'MP-22', districtName: 'Damoh', geoJsonId: 'Damoh', totalCases: 54, financialLoss: 750000, commonScam: 'Aadhaar Fraud (AePS)', recentIncidents: 1, nearbyStation: 'Damoh Cyber Cell, SP Office' },
  { districtId: 'MP-23', districtName: 'Chhatarpur', geoJsonId: 'Chhatarpur', totalCases: 80, financialLoss: 1400000, commonScam: 'KYC Phishing', recentIncidents: 2, nearbyStation: 'Chhatarpur Cyber Cell, SP Office' },
  { districtId: 'MP-24', districtName: 'Sehore', geoJsonId: 'Sehore', totalCases: 62, financialLoss: 880000, commonScam: 'UPI Fraud', recentIncidents: 1, nearbyStation: 'Sehore Cyber Cell, SP Office' },
  { districtId: 'MP-25', districtName: 'Betul', geoJsonId: 'Betul', totalCases: 58, financialLoss: 940000, commonScam: 'KYC Phishing', recentIncidents: 1, nearbyStation: 'Betul Cyber Cell, SP Office' },
  { districtId: 'MP-26', districtName: 'Seoni', geoJsonId: 'Seoni', totalCases: 48, financialLoss: 620000, commonScam: 'Aadhaar Fraud (AePS)', recentIncidents: 1, nearbyStation: 'Seoni Cyber Cell, SP Office' },
  { districtId: 'MP-27', districtName: 'Shahdol', geoJsonId: 'Shahdol', totalCases: 52, financialLoss: 850000, commonScam: 'Telegram Task Fraud', recentIncidents: 2, nearbyStation: 'Shahdol Cyber Cell, SP Office' },
  { districtId: 'MP-28', districtName: 'Balaghat', geoJsonId: 'Balaghat', totalCases: 60, financialLoss: 1050000, commonScam: 'UPI Fraud', recentIncidents: 1, nearbyStation: 'Balaghat Cyber Cell, SP Office' },
  { districtId: 'MP-29', districtName: 'Mandla', geoJsonId: 'Mandla', totalCases: 36, financialLoss: 480000, commonScam: 'Aadhaar Fraud (AePS)', recentIncidents: 1, nearbyStation: 'Mandla Cyber Cell, SP Office' },
  { districtId: 'MP-30', districtName: 'Neemuch', geoJsonId: 'Neemuch', totalCases: 42, financialLoss: 580000, commonScam: 'KYC Phishing', recentIncidents: 1, nearbyStation: 'Neemuch Cyber Cell, SP Office' },
  { districtId: 'MP-31', districtName: 'Sidhi', geoJsonId: 'Sidhi', totalCases: 38, financialLoss: 520000, commonScam: 'UPI Fraud', recentIncidents: 0, nearbyStation: 'Sidhi Cyber Cell, SP Office' },
  { districtId: 'MP-32', districtName: 'Barwani', geoJsonId: 'Barwani', totalCases: 44, financialLoss: 690000, commonScam: 'Aadhaar Fraud (AePS)', recentIncidents: 1, nearbyStation: 'Barwani Cyber Cell, SP Office' },
  { districtId: 'MP-33', districtName: 'Mandsaur', geoJsonId: 'Mandsaur', totalCases: 56, financialLoss: 820000, commonScam: 'UPI Fraud', recentIncidents: 1, nearbyStation: 'Mandsaur Cyber Cell, SP Office' },
  { districtId: 'MP-34', districtName: 'Sheopur', geoJsonId: 'Sheopur', totalCases: 28, financialLoss: 310000, commonScam: 'KYC Phishing', recentIncidents: 0, nearbyStation: 'Sheopur Cyber Cell, SP Office' },
  { districtId: 'MP-35', districtName: 'Alirajpur', geoJsonId: 'Alirajpur', totalCases: 32, financialLoss: 380000, commonScam: 'Aadhaar Fraud (AePS)', recentIncidents: 1, nearbyStation: 'Alirajpur Cyber Cell, SP Office' },
  { districtId: 'MP-36', districtName: 'Ashoknagar', geoJsonId: 'Ashoknagar', totalCases: 34, financialLoss: 420000, commonScam: 'UPI Fraud', recentIncidents: 1, nearbyStation: 'Ashoknagar Cyber Cell, SP Office' },
  { districtId: 'MP-37', districtName: 'Dindori', geoJsonId: 'Dindori', totalCases: 24, financialLoss: 290000, commonScam: 'KYC Phishing', recentIncidents: 0, nearbyStation: 'Dindori Cyber Cell, SP Office' },
  { districtId: 'MP-38', districtName: 'Harda', geoJsonId: 'Harda', totalCases: 30, financialLoss: 360000, commonScam: 'UPI Fraud', recentIncidents: 0, nearbyStation: 'Harda Cyber Cell, SP Office' },
  { districtId: 'MP-39', districtName: 'Jhabua', geoJsonId: 'Jhabua', totalCases: 26, financialLoss: 320000, commonScam: 'Aadhaar Fraud (AePS)', recentIncidents: 0, nearbyStation: 'Jhabua Cyber Cell, SP Office' },
  { districtId: 'MP-40', districtName: 'Narsimhapur', geoJsonId: 'Narsimhapur', totalCases: 46, financialLoss: 680000, commonScam: 'KYC Phishing', recentIncidents: 1, nearbyStation: 'Narsinghpur Cyber Cell, SP Office' },
  { districtId: 'MP-41', districtName: 'Panna', geoJsonId: 'Panna', totalCases: 40, financialLoss: 540000, commonScam: 'UPI Fraud', recentIncidents: 1, nearbyStation: 'Panna Cyber Cell, SP Office' },
  { districtId: 'MP-42', districtName: 'Raisen', geoJsonId: 'Raisen', totalCases: 52, financialLoss: 890000, commonScam: 'KYC Phishing', recentIncidents: 1, nearbyStation: 'Raisen Cyber Cell, SP Office' },
  { districtId: 'MP-43', districtName: 'Rajgarh', geoJsonId: 'Rajgarh', totalCases: 48, financialLoss: 710000, commonScam: 'UPI Fraud', recentIncidents: 1, nearbyStation: 'Rajgarh Cyber Cell, SP Office' },
  { districtId: 'MP-44', districtName: 'Shajapur', geoJsonId: 'Shajapur', totalCases: 42, financialLoss: 610000, commonScam: 'Aadhaar Fraud (AePS)', recentIncidents: 1, nearbyStation: 'Shajapur Cyber Cell, SP Office' },
  { districtId: 'MP-45', districtName: 'Tikamgarh', geoJsonId: 'Tikamgarh', totalCases: 38, financialLoss: 490000, commonScam: 'KYC Phishing', recentIncidents: 0, nearbyStation: 'Tikamgarh Cyber Cell, SP Office' },
  { districtId: 'MP-46', districtName: 'Umaria', geoJsonId: 'Umaria', totalCases: 30, financialLoss: 390000, commonScam: 'UPI Fraud', recentIncidents: 1, nearbyStation: 'Umaria Cyber Cell, SP Office' },
  { districtId: 'MP-47', districtName: 'Vidisha', geoJsonId: 'Vidisha', totalCases: 58, financialLoss: 980000, commonScam: 'Telegram Task Fraud', recentIncidents: 1, nearbyStation: 'Vidisha Cyber Cell, SP Office' },
  { districtId: 'MP-48', districtName: 'Burhanpur', geoJsonId: 'Burhanpur', totalCases: 36, financialLoss: 510000, commonScam: 'UPI Fraud', recentIncidents: 1, nearbyStation: 'Burhanpur Cyber Cell, SP Office' },
  { districtId: 'MP-49', districtName: 'Agar Malwa', geoJsonId: 'Agar Malwa', totalCases: 32, financialLoss: 410000, commonScam: 'KYC Phishing', recentIncidents: 0, nearbyStation: 'Agar Malwa Cyber Cell, SP Office' },
  { districtId: 'MP-50', districtName: 'Niwari', geoJsonId: 'Niwari', totalCases: 20, financialLoss: 250000, commonScam: 'UPI Fraud', recentIncidents: 0, nearbyStation: 'Niwari Cyber Cell, SP Office' },
  { districtId: 'MP-51', districtName: 'Datia', geoJsonId: 'Datia', totalCases: 38, financialLoss: 520000, commonScam: 'KYC Phishing', recentIncidents: 1, nearbyStation: 'Datia Cyber Cell, SP Office' },
  { districtId: 'MP-52', districtName: 'Singrauli', geoJsonId: 'Singrauli', totalCases: 94, financialLoss: 2100000, commonScam: 'Telegram Task Fraud', recentIncidents: 3, nearbyStation: 'Singrauli Cyber Cell, Waidhan' }
];

// Recalculates risk scores using the formula: Raw = (Cases * 0.6) + ((Loss / 1000) * 0.2) + (Recent * 0.2)
// and normalizes between 0 and 100.
export const recalculateRiskScores = async () => {
  if (isMockMode) {
    let maxRaw = 0;
    const rawScores = memoryDistricts.map(d => {
      const raw = (d.totalCases * 0.6) + ((d.financialLoss / 1000) * 0.2) + (d.recentIncidents * 0.2);
      if (raw > maxRaw) maxRaw = raw;
      return { id: d.districtId, raw };
    });

    memoryDistricts = memoryDistricts.map(d => {
      const rawObj = rawScores.find(r => r.id === d.districtId);
      const raw = rawObj ? rawObj.raw : 0;
      const normalized = maxRaw > 0 ? Math.round((raw / maxRaw) * 100) : 0;
      return { ...d, riskScore: normalized, lastUpdated: new Date() };
    });
    return;
  }

  try {
    const districts = await District.find({});
    if (districts.length === 0) return;

    let maxRaw = 0;
    const rawScores = districts.map(d => {
      const raw = (d.totalCases * 0.6) + ((d.financialLoss / 1000) * 0.2) + (d.recentIncidents * 0.2);
      if (raw > maxRaw) maxRaw = raw;
      return { _id: d._id, raw };
    });

    for (const d of districts) {
      const rawObj = rawScores.find(r => String(r._id) === String(d._id));
      const raw = rawObj ? rawObj.raw : 0;
      const normalized = maxRaw > 0 ? Math.round((raw / maxRaw) * 100) : 0;
      
      d.riskScore = normalized;
      d.lastUpdated = new Date();
      await d.save();
    }
  } catch (err) {
    console.error('Error recalculating risk scores:', err);
  }
};

// Seed districts on server startup
export const initializeDistricts = async () => {
  console.log('[SAFECLICK HEATMAP] Initializing MP district stats...');
  
  if (isMockMode) {
    memoryDistricts = INITIAL_DISTRICTS.map(d => ({
      ...d,
      riskScore: 0,
      lastUpdated: new Date()
    }));
    await recalculateRiskScores();
    console.log('[SAFECLICK HEATMAP] Initialized memory fallback with', memoryDistricts.length, 'districts.');
    return;
  }

  try {
    const count = await District.countDocuments({});
    if (count === 0) {
      const districtsToInsert = INITIAL_DISTRICTS.map(d => ({
        ...d,
        riskScore: 0,
        lastUpdated: new Date()
      }));
      await District.insertMany(districtsToInsert);
      console.log('[SAFECLICK HEATMAP] Seeded MongoDB with 52 MP districts.');
    } else {
      console.log('[SAFECLICK HEATMAP]', count, 'districts already seeded in MongoDB.');
    }
    await recalculateRiskScores();
  } catch (err) {
    console.error('[SAFECLICK HEATMAP] Failed to seed districts in MongoDB:', err);
    // fallback to memory
    memoryDistricts = INITIAL_DISTRICTS.map(d => ({
      ...d,
      riskScore: 0,
      lastUpdated: new Date()
    }));
    await recalculateRiskScores();
  }
};

// Ingest simulated cyber news updates
const SAMPLE_NEWS_POOL = [
  { title: 'Indore senior citizen scammed of 2 Lakhs via fake electricity bill UPI link', district: 'Indore', scamType: 'UPI Fraud', loss: 200000, description: 'Victim clicked a spoofed SMS link threatening electricity cut-off.' },
  { title: 'Bhopal techie falls for fake part-time work Telegram task, loses 5 Lakhs', district: 'Bhopal', scamType: 'Telegram Task Fraud', loss: 500000, description: 'Victim completed rating tasks on Telegram and deposited cash for higher tiers.' },
  { title: 'Identity theft case registered in Jabalpur after fraudulent bank accounts opened', district: 'Jabalpur', scamType: 'Identity Theft', loss: 0, description: 'PAN card misused to register shell business current accounts.' },
  { title: 'Ujjain student targeted in high-return investment scam via fake UPI QR code', district: 'Ujjain', scamType: 'UPI Fraud', loss: 75000, description: 'Instagram ad promising daily doubling returns led to money transfers.' },
  { title: 'Sagar merchant duped of 1.2 Lakhs via biometric clone Aadhaar Enabled Payment System (AePS) fraud', district: 'Sagar', scamType: 'Aadhaar Fraud (AePS)', loss: 120000, description: 'Biometric registration spoofed at micro-ATM terminal.' },
  { title: 'Gwalior woman blackmailed by fake credit app operators after downloading predatory loan application', district: 'Gwalior', scamType: 'Loan App Blackmail', loss: 50000, description: 'App hijacked contact list and sent morphed photos to relatives.' },
  { title: 'Rewa school teacher loses bank deposits in OTP phishing scam over fake KYC update message', district: 'Rewa', scamType: 'KYC Phishing', loss: 95000, description: 'Spoofed SBI netbanking panel phished OTP codes.' },
  { title: 'Satna businessman targeted in business email compromise, logs 8 Lakhs financial loss', district: 'Satna', scamType: 'Phishing', loss: 800000, description: 'Vendor email hacked and bank invoice details altered.' },
  { title: 'Morena resident scammed of 30,000 via OLX fake defense officer advance payment QR scan', district: 'Morena', scamType: 'UPI Fraud', loss: 30000, description: 'Buyer sent money-receive code requesting PIN entry.' },
  { title: 'Burhanpur youth falls victim to romance scam, transfers money for customs clearance fees', district: 'Burhanpur', scamType: 'Romance Scam', loss: 150000, description: 'Online friend claimed gift package was detained by custom officers.' }
];

export const ingestNews = async (): Promise<number> => {
  console.log('[SAFECLICK NEWS SERVICE] Initiating hourly cyber crime news ingestion...');
  
  // Select 2 random news items from pool to simulate dynamic feed updates
  const shuffled = [...SAMPLE_NEWS_POOL].sort(() => 0.5 - Math.random());
  const selectedItems = shuffled.slice(0, 2);
  let processedCount = 0;

  for (const item of selectedItems) {
    const uniqueUrl = `https://mpcybernews.gov.in/articles/${item.district.toLowerCase()}-${Date.now()}-${processedCount}`;
    
    if (isMockMode) {
      // Memory process
      const newsItem = {
        title: item.title,
        url: uniqueUrl,
        publishedAt: new Date(),
        district: item.district,
        scamType: item.scamType,
        processed: true
      };
      memoryNews.push(newsItem);

      // Create Incident
      const incidentItem = {
        title: item.title,
        district: item.district,
        source: 'News Ingestion',
        date: new Date(),
        scamType: item.scamType,
        financialLoss: item.loss,
        description: item.description,
        priority: item.loss > 200000 ? 'critical' : item.loss > 80000 ? 'high' : 'medium'
      };
      memoryIncidents.push(incidentItem);

      // Update District
      const dist = memoryDistricts.find(d => d.districtName.toLowerCase() === item.district.toLowerCase());
      if (dist) {
        dist.totalCases += 1;
        dist.financialLoss += item.loss;
        dist.recentIncidents += 1;
        dist.commonScam = item.scamType;
      }
      processedCount++;
      continue;
    }

    try {
      // Check if title or url already in DB (to avoid duplicate processing)
      const existing = await News.findOne({ title: item.title });
      if (existing) continue;

      const newsEntry = new News({
        title: item.title,
        url: uniqueUrl,
        publishedAt: new Date(),
        district: item.district,
        scamType: item.scamType,
        processed: true
      });
      await newsEntry.save();

      // Create formal Incident log
      const incidentEntry = new Incident({
        title: item.title,
        district: item.district,
        source: 'News Ingestion',
        date: new Date(),
        scamType: item.scamType,
        financialLoss: item.loss,
        description: item.description,
        priority: item.loss > 200000 ? 'critical' : item.loss > 80000 ? 'high' : 'medium'
      });
      await incidentEntry.save();

      // Update District metrics
      const dist = await District.findOne({ districtName: { $regex: new RegExp(`^${item.district}$`, 'i') } });
      if (dist) {
        dist.totalCases += 1;
        dist.financialLoss += item.loss;
        dist.recentIncidents += 1;
        dist.commonScam = item.scamType;
        dist.lastUpdated = new Date();
        await dist.save();
      }

      processedCount++;
    } catch (err) {
      console.error('[SAFECLICK NEWS SERVICE] Error processing news item:', err);
    }
  }

  if (processedCount > 0) {
    console.log('[SAFECLICK NEWS SERVICE] Processed', processedCount, 'new cyber crime incident alerts.');
    await recalculateRiskScores();
  } else {
    console.log('[SAFECLICK NEWS SERVICE] No new news articles found.');
  }

  return processedCount;
};
