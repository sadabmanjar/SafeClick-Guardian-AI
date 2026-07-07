/** Shared geographic location type */
export interface GeoLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export type RiskLevel = 'safe' | 'low' | 'medium' | 'high' | 'critical';

export type ContentType = 'text' | 'url' | 'image';

// ── Scan ────────────────────────────────────────────────────────────────────

export interface ScanResult {
  _id: string;
  userId?: string;
  input: string;
  inputType: ContentType;
  keywords: string[];
  urls: string[];
  emails: string[];
  phones: string[];
  domainRisk: number;
  riskScore: number;
  confidence: number;
  scamType: string;
  riskLevel: RiskLevel;
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
  country: string;
  ipAddress?: string;
  location?: GeoLocation;
  createdAt: string;
}

export interface ScanRequest {
  content: string;
  contentType: ContentType;
  location?: Pick<GeoLocation, 'latitude' | 'longitude'>;
}

// ── Complaint ────────────────────────────────────────────────────────────────

export interface EvidenceFile {
  fileName: string;
  fileType: string;
  fileSize: string;
  hashKey?: string;
}

export interface VictimDetails {
  name: string;
  phone: string;
  email?: string;
  address?: string;
}

export interface SuspectDetails {
  phone?: string;
  upiId?: string;
  bankAccount?: string;
  websiteUrl?: string;
  otherDetails?: string;
}

export interface Complaint {
  _id: string;
  userId?: string;
  category: string;
  subCategory?: string;
  incidentDate: string;
  platform: string;
  lossAmount?: number;
  transactionId?: string;
  bankName?: string;
  victimDetails: VictimDetails;
  suspectDetails?: SuspectDetails;
  narrative: string;
  evidenceFiles: EvidenceFile[];
  createdAt: string;
}

export interface CreateComplaintRequest {
  category: string;
  subCategory?: string;
  incidentDate: string;
  platform: string;
  lossAmount?: number;
  transactionId?: string;
  bankName?: string;
  victimDetails: VictimDetails;
  suspectDetails?: SuspectDetails;
  narrative: string;
  evidenceFiles?: EvidenceFile[];
}

// ── Emergency Alert ─────────────────────────────────────────────────────────

export type AlertType = 'SOS_BUTTON' | 'SMS_DISPATCH' | 'MANUAL_TRIGGER';

export interface EmergencyAlert {
  _id: string;
  userId?: string;
  location?: GeoLocation;
  contactsNotified: string[];
  alertType: AlertType;
  resolved: boolean;
  createdAt: string;
}

export interface TriggerAlertRequest {
  alertType: AlertType;
  contactsNotified?: string[];
  location?: GeoLocation;
}

// ── Admin ─────────────────────────────────────────────────────────────────

export interface AdminStats {
  totalScans: number;
  totalComplaints: number;
  totalAlerts: number;
  criticalScans: number;
  highRiskScans: number;
  resolvedAlerts: number;
}
