export type NoticeCategory =
  | 'Regulatory Enforcement'
  | 'Judicial Subpoena'
  | 'Tax & Revenue'
  | 'Contractual Default'
  | 'Environmental / Municipal'
  | 'Labor & Employment'
  | 'Corporate Governance';

export type RiskTier = 'P1 - Critical' | 'P2 - High' | 'P3 - Medium' | 'P4 - Routine';

export type NoticeStatus =
  | 'New Intake'
  | 'Under Review'
  | 'Legal Hold Active'
  | 'Response Drafted'
  | 'Filed & Completed'
  | 'Dismissed';

export type ServiceMethod =
  | 'Certified Mail (USPS)'
  | 'Registered Process Server'
  | 'Electronic Regulatory Portal'
  | 'In-Hand Officer Service'
  | 'FedEx Priority Overnight';

export interface RequiredDeliverable {
  id: string;
  label: string;
  completed: boolean;
  notes?: string;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  details: string;
}

export interface SignOffApprover {
  role: string;
  name: string;
  title: string;
  approved: boolean;
  date?: string;
  comments?: string;
}

export interface NoticeResponsePackage {
  responseType: string;
  counselNotes: string;
  rebuttalBasis: string;
  filingDeadline: string;
  status: 'Not Started' | 'Drafting' | 'Pending Sign-Off' | 'Approved' | 'Transmitted';
  signoffs: SignOffApprover[];
  formalLetterBody: string;
}

export interface NoticeItem {
  id: string;
  title: string;
  referenceNumber: string; // Docket / Notice / Audit #
  category: NoticeCategory;
  issuingAuthority: string; // e.g. "U.S. Securities and Exchange Commission"
  issuingOfficeOrDivision: string;
  servingParty: string;
  targetEntity: string; // e.g. "Apex Holdings, Inc."
  jurisdiction: string; // e.g. "Delaware / Southern District of New York"
  registeredAgent: string; // e.g. "CT Corporation System"
  serviceMethod: ServiceMethod;
  dateOfNotice: string; // ISO date
  dateReceived: string; // ISO date
  statutoryDays: number; // e.g. 14, 21, 30
  isBusinessDays: boolean;
  statutoryDeadline: string; // Calculated final date
  riskTier: RiskTier;
  financialExposure: number; // in USD
  legalHoldRequired: boolean;
  immediateInjunction: boolean;
  status: NoticeStatus;
  leadCounsel: string;
  assignedDepartment: string;
  outsideCounselFirm: string;
  summary: string;
  extractedOcrText: string;
  documentFileName: string;
  documentFileSize: string;
  requiredDeliverables: RequiredDeliverable[];
  auditHistory: AuditEntry[];
  responsePackage: NoticeResponsePackage;
}

export type ScreenId = 'intake' | 'docket' | 'dossier' | 'response' | 'calendar';
