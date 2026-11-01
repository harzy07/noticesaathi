import { NoticeItem } from '../types/notice';

export const INITIAL_NOTICES: NoticeItem[] = [
  {
    id: 'NOT-2026-0842',
    title: 'SEC Formal Order of Investigation & Subpoena Duces Tecum',
    referenceNumber: 'SEC-NYRO-HO-14920',
    category: 'Regulatory Enforcement',
    issuingAuthority: 'U.S. Securities and Exchange Commission',
    issuingOfficeOrDivision: 'New York Regional Office, Division of Enforcement',
    servingParty: 'Christopher Vance, Senior Trial Counsel',
    targetEntity: 'Apex Enterprise Holdings, Inc.',
    jurisdiction: 'United States District Court, Southern District of New York',
    registeredAgent: 'CT Corporation System, New York',
    serviceMethod: 'Certified Mail (USPS)',
    dateOfNotice: '2026-10-24',
    dateReceived: '2026-10-27',
    statutoryDays: 20,
    isBusinessDays: true,
    statutoryDeadline: '2026-11-25',
    riskTier: 'P1 - Critical',
    financialExposure: 2500000,
    legalHoldRequired: true,
    immediateInjunction: false,
    status: 'Legal Hold Active',
    leadCounsel: 'Eleanor Vance, VP of Regulatory Affairs',
    assignedDepartment: 'Corporate Legal & Governance',
    outsideCounselFirm: 'Gibson Dunn & Crutcher LLP',
    summary:
      'Subpoena seeking all internal trading records, executive Slack/email archives, and quarterly rev-rec memos concerning Q2-Q3 SaaS contract amendments.',
    extractedOcrText: `UNITED STATES OF AMERICA
BEFORE THE SECURITIES AND EXCHANGE COMMISSION
In the Matter of: APEX ENTERPRISE HOLDINGS, INC. (NY-14920)
SUBPOENA DUCES TECUM
TO: Apex Enterprise Holdings, Inc., c/o CT Corporation System, 28 Liberty St, New York, NY 10005

YOU ARE HEREBY REQUIRED to appear before the Securities and Exchange Commission and produce documents responsive to Schedule A attached hereto at 200 Vesey Street, Suite 400, New York, NY on or before November 25, 2026 at 10:00 A.M.

SCHEDULE A:
1. All communications between Chief Revenue Officer and enterprise accounts regarding side letters.
2. Complete transaction ledger for software maintenance renewal deferrals.
Failure to comply may subject the respondent to judicial enforcement under Section 21(c) of the Securities Exchange Act of 1934.`,
    documentFileName: 'SEC_Subpoena_ApexHoldings_HO-14920.pdf',
    documentFileSize: '4.2 MB',
    requiredDeliverables: [
      { id: 'del-1', label: 'Issue Company-wide Litigation Hold Notice to all named custodians', completed: true },
      { id: 'del-2', label: 'Suspend automated 30-day message retention on executive Google Workspace & Slack', completed: true },
      { id: 'del-3', label: 'Complete ESI forensic extraction of CFO and VP Sales mailboxes', completed: false },
      { id: 'del-4', label: 'Schedule 26(f) preliminary scope conference with SEC staff attorneys', completed: false },
    ],
    auditHistory: [
      {
        id: 'aud-1',
        timestamp: '2026-10-27 09:14 EST',
        action: 'Notice Ingested via Certified Mail scan',
        actor: 'Intake Desk / Marcus Ray',
        details: 'Initial OCR processing completed. P1 Critical severity assigned automatically based on SEC enforcement docket keywords.',
      },
      {
        id: 'aud-2',
        timestamp: '2026-10-27 10:30 EST',
        action: 'Legal Hold Enacted',
        actor: 'Eleanor Vance',
        details: 'Mandatory litigation hold notices broadcasted to 48 custodian accounts. Document preservation enacted.',
      },
      {
        id: 'aud-3',
        timestamp: '2026-10-28 14:00 EST',
        action: 'Outside Counsel Retained',
        actor: 'Eleanor Vance',
        details: 'Retained Gibson Dunn securities defense team led by partner M. Sterling.',
      },
    ],
    responsePackage: {
      responseType: 'Formal Privilege Log & Motion for Modification of Production Scope',
      counselNotes: 'Outside counsel recommends seeking 14-day rolling production agreement rather than full omnibus production by deadline.',
      rebuttalBasis: 'Overbroad temporal scope covering non-material regional subsidiary operations not subject to NY jurisdiction.',
      filingDeadline: '2026-11-25',
      status: 'Pending Sign-Off',
      signoffs: [
        { role: 'Lead Regulatory Counsel', name: 'Eleanor Vance', title: 'VP Legal & Regulatory Affairs', approved: true, date: '2026-10-29' },
        { role: 'Chief Financial Officer', name: 'Marcus Sterling', title: 'CFO', approved: false, comments: 'Under review by internal audit team' },
        { role: 'External Defense Counsel', name: 'Katherine Shaw', title: 'Partner, Gibson Dunn', approved: true, date: '2026-10-30' },
      ],
      formalLetterBody: `VIA ELECTRONIC TRANSMISSION (SECDox Portal)
U.S. Securities and Exchange Commission
Division of Enforcement
200 Vesey Street, Suite 400
New York, NY 10281

Re: In the Matter of Apex Enterprise Holdings, Inc. (File No. NY-14920)

Dear Mr. Vance:

We represent Apex Enterprise Holdings, Inc. ("Apex") in connection with the above-referenced subpoena dated October 24, 2026. Apex acknowledges receipt and confirms it has implemented comprehensive document preservation protocols across all relevant business units. 

Pursuant to our preliminary discussions, Apex proposes a phased rolling production schedule commencing with Category 1 (Contract Documentation) on November 18, 2026, while conferring regarding the reasonable search parameters for Category 2 ESI.`,
    },
  },
  {
    id: 'NOT-2026-0791',
    title: 'State Franchise Tax Board - Notice of Proposed Assessment & Deficiency',
    referenceNumber: 'FTB-NPA-2026-883192',
    category: 'Tax & Revenue',
    issuingAuthority: 'California Franchise Tax Board',
    issuingOfficeOrDivision: 'Audit Bureau - Corporation Tax Section',
    servingParty: 'E. Rodriguez, Tax Auditor ID #4928',
    targetEntity: 'Apex Enterprise Holdings, Inc. (CA Corp #4189021)',
    jurisdiction: 'State of California - Sacramento County',
    registeredAgent: 'CSC - Lawyers Incorporating Service',
    serviceMethod: 'Certified Mail (USPS)',
    dateOfNotice: '2026-10-18',
    dateReceived: '2026-10-22',
    statutoryDays: 60,
    isBusinessDays: false,
    statutoryDeadline: '2026-12-17',
    riskTier: 'P2 - High',
    financialExposure: 684200,
    legalHoldRequired: false,
    immediateInjunction: false,
    status: 'Under Review',
    leadCounsel: 'David Chen, Director of Tax Counsel',
    assignedDepartment: 'Corporate Tax & Accounting',
    outsideCounselFirm: 'KPMG State and Local Tax (SALT) Group',
    summary:
      'Proposed corporate tax adjustment of $684,200 plus interest regarding single-sales factor apportionment calculations for cloud infrastructure services for tax year 2024.',
    extractedOcrText: `STATE OF CALIFORNIA - FRANCHISE TAX BOARD
PO BOX 942857, SACRAMENTO CA 94257-0501
NOTICE OF PROPOSED ASSESSMENT (NPA)
Date of Notice: October 18, 2026
Taxpayer ID: 4189021 | Case Ref: FTB-NPA-2026-883192

Total Proposed Additional Tax: $572,400.00
Penalties (Sec. 19131 & 19164): $68,688.00
Accrued Interest to Date: $43,112.00
TOTAL AMOUNT DUE: $684,200.00

STATUTORY PROTEST DEADLINE: You have 60 days from the Date of Notice to file a written protest. Your protest must be postmarked or submitted electronically no later than DECEMBER 17, 2026. If you do not protest, this assessment will become final and payable immediately.`,
    documentFileName: 'FTB_NPA_2026_883192_Assessment.pdf',
    documentFileSize: '2.1 MB',
    requiredDeliverables: [
      { id: 'ftb-1', label: 'Extract California customer billing addresses and IP geo-allocation tables for 2024', completed: true },
      { id: 'ftb-2', label: 'Reconcile Form 100 Schedule R market-based sourcing vs cost-of-performance schedules', completed: false },
      { id: 'ftb-3', label: 'Draft formal written Protest Letter under Cal. Rev. & Tax Code § 19041', completed: false },
    ],
    auditHistory: [
      {
        id: 'aud-ftb-1',
        timestamp: '2026-10-22 11:20 EST',
        action: 'Notice Logged and Classified',
        actor: 'Intake Desk / Marcus Ray',
        details: 'Certified Mail logged. Routing automatically dispatched to Tax Counsel queue.',
      },
    ],
    responsePackage: {
      responseType: 'Statutory Protest under RTC Section 19041 & Request for Oral Hearing',
      counselNotes: 'KPMG SALT team completed apportionment recalculation showing sourcing error of $410K. Strong merit for protest.',
      rebuttalBasis: 'Auditor improperly sourced enterprise SaaS license fees to CA based on billing address rather than benefit received location.',
      filingDeadline: '2026-12-17',
      status: 'Drafting',
      signoffs: [
        { role: 'Tax Counsel Director', name: 'David Chen', title: 'Director of Tax Counsel', approved: false },
        { role: 'VP Controller', name: 'Sarah Lin', title: 'Corporate Controller', approved: false },
      ],
      formalLetterBody: `STATE OF CALIFORNIA
FRANCHISE TAX BOARD - PROTEST SECTION
PO Box 942867
Sacramento, CA 94267-5540

PROTEST OF PROPOSED ASSESSMENT UNDER REVENUE & TAXATION CODE SECTION 19041
Taxpayer: Apex Enterprise Holdings, Inc. (Entity ID 4189021)
Notice Reference: FTB-NPA-2026-883192 | Tax Year: 2024

Apex hereby timely files this Protest against the proposed deficiency assessment. Apex disputes the entirety of the market-based sourcing adjustments...`,
    },
  },
  {
    id: 'NOT-2026-0855',
    title: 'Commercial Master Lease - 10-Day Notice to Cure Covenant Default',
    referenceNumber: 'LD-450-LEX-2026',
    category: 'Contractual Default',
    issuingAuthority: 'Metropolitan Real Estate Trust (Landlord)',
    issuingOfficeOrDivision: 'Office of Commercial Property Management',
    servingParty: 'Seyfarth Shaw LLP on behalf of Landlord',
    targetEntity: 'Apex Enterprise Holdings, Inc. (Tenant)',
    jurisdiction: 'New York City Commercial Leasing Tribunal',
    registeredAgent: 'Personal Service upon Managing Agent',
    serviceMethod: 'Registered Process Server',
    dateOfNotice: '2026-10-28',
    dateReceived: '2026-10-29',
    statutoryDays: 10,
    isBusinessDays: false,
    statutoryDeadline: '2026-11-08',
    riskTier: 'P1 - Critical',
    financialExposure: 185000,
    legalHoldRequired: false,
    immediateInjunction: true,
    status: 'New Intake',
    leadCounsel: 'Eleanor Vance, VP Legal',
    assignedDepartment: 'Real Estate & Corporate Facilities',
    outsideCounselFirm: 'DLA Piper LLP',
    summary:
      'Landlord alleges unauthorized structural modification of Floor 14 server room HVAC exhaust without landlord engineering review and certificates of insurance.',
    extractedOcrText: `TEN-DAY NOTICE TO CURE LEASE COVENANT DEFAULT
TO TENANT: Apex Enterprise Holdings, Inc., 450 Lexington Ave, Floors 14-16, New York, NY 10017
FROM LANDLORD: Metropolitan Real Estate Trust

PLEASE TAKE NOTICE that Tenant is in substantial default of Section 12.03 (Tenant Alterations) and Section 18.01 (Hazardous Mechanical Installations) of the Agreement of Lease dated June 1, 2021.
Tenant has caused unauthorized modifications to structural floor risers and roof chilled-water valves.

YOU ARE HEREBY REQUIRED TO CURE THE AFORESAID DEFAULTS within TEN (10) DAYS from the date of service of this notice, on or before NOVEMBER 8, 2026.
IF TENANT FAILS TO CURE within said ten days, Landlord shall exercise its right to terminate tenancy under Section 24.02.`,
    documentFileName: 'Notice_To_Cure_450Lexington_Metropolitan.pdf',
    documentFileSize: '1.4 MB',
    requiredDeliverables: [
      { id: 'lease-1', label: 'Obtain expedited MEP engineer inspection certificate from Syska Hennessy', completed: false },
      { id: 'lease-2', label: 'Transmit updated contractor COI naming Metropolitan Real Estate Trust as additional insured', completed: true },
      { id: 'lease-3', label: 'Deliver formal cure verification notice with engineer affidavit before Nov 8', completed: false },
    ],
    auditHistory: [
      {
        id: 'aud-lease-1',
        timestamp: '2026-10-29 16:45 EST',
        action: 'Hand Delivery Logged by Process Server',
        actor: 'Reception Intake / Amy Keller',
        details: 'Personal service accepted at HQ desk. Transferred immediately to Legal Dept.',
      },
    ],
    responsePackage: {
      responseType: 'Formal Notice of Full Cure & Engineer Affidavit',
      counselNotes: 'HVAC contractor had already pulled city permits; need engineer affidavit confirming compliance with building code to cure.',
      rebuttalBasis: 'All alterations are non-structural and fully permitted under NYC DOB Permit #3299102.',
      filingDeadline: '2026-11-08',
      status: 'Drafting',
      signoffs: [
        { role: 'Facilities Director', name: 'Robert Craig', title: 'VP Facilities', approved: true, date: '2026-10-30' },
        { role: 'General Counsel', name: 'Eleanor Vance', title: 'VP Legal', approved: false },
      ],
      formalLetterBody: `VIA HAND DELIVERY & CERTIFIED MAIL
Metropolitan Real Estate Trust
c/o Seyfarth Shaw LLP
620 Eighth Avenue
New York, NY 10018

Re: Commercial Lease dated June 1, 2021 - Notice of Complete Cure
Tenant: Apex Enterprise Holdings, Inc. | Premises: 450 Lexington Ave, 14th Floor

Dear Counsel:

We write on behalf of Apex Enterprise Holdings, Inc. ("Tenant") in response to Landlord's Ten-Day Notice to Cure dated October 28, 2026. Please be advised that the alleged covenant defaults have been fully satisfied and cured...`,
    },
  },
  {
    id: 'NOT-2026-0720',
    title: 'Department of Labor - OSHA Notice of Alleged Safety Violations',
    referenceNumber: 'OSHA-REG2-2026-4401',
    category: 'Labor & Employment',
    issuingAuthority: 'Occupational Safety and Health Administration (OSHA)',
    issuingOfficeOrDivision: 'Region 2 District Office - Teterboro Distribution Center',
    servingParty: 'Area Director M. Alverez',
    targetEntity: 'Apex Logistics & Distribution LLC',
    jurisdiction: 'United States Department of Labor',
    registeredAgent: 'CT Corporation System, New Jersey',
    serviceMethod: 'Certified Mail (USPS)',
    dateOfNotice: '2026-10-12',
    dateReceived: '2026-10-15',
    statutoryDays: 15,
    isBusinessDays: true,
    statutoryDeadline: '2026-11-05',
    riskTier: 'P3 - Medium',
    financialExposure: 42500,
    legalHoldRequired: false,
    immediateInjunction: false,
    status: 'Response Drafted',
    leadCounsel: 'Jordan Miller, Employment Counsel',
    assignedDepartment: 'Workplace Safety & Operations',
    outsideCounselFirm: 'Littler Mendelson P.C.',
    summary:
      'Alleged Citation 1 Item 1 (29 CFR 1910.178) involving automated guided forklift traffic light interlocks at New Jersey fulfillment center.',
    extractedOcrText: `U.S. DEPARTMENT OF LABOR - OSHA
CITATION AND NOTIFICATION OF PENALTY
Inspection Number: 1829041 | Issuance Date: 10/12/2026

Citation 1 Item 1: 29 CFR 1910.178(n)(4): Industrial truck operators failed to slow down and sound horn at cross aisles.
Proposed Penalty: $14,502.00
Citation 1 Item 2: 29 CFR 1910.22(a)(1): Storage racking aisle clearance impaired.
Proposed Penalty: $27,998.00

RIGHT TO CONTEST: You have 15 working days from receipt to request an Informal Conference with the Area Director or file a notice of contest before the Occupational Safety and Health Review Commission.`,
    documentFileName: 'OSHA_Citation_Teterboro_NJ_4401.pdf',
    documentFileSize: '3.0 MB',
    requiredDeliverables: [
      { id: 'osha-1', label: 'Submit photographic proof of installed optical barrier sensors at Bay 3', completed: true },
      { id: 'osha-2', label: 'Schedule Informal Conference with OSHA Area Director for penalty abatement', completed: true },
    ],
    auditHistory: [
      {
        id: 'aud-osha-1',
        timestamp: '2026-10-15 14:10 EST',
        action: 'Ingested and Assigned',
        actor: 'Intake Desk / Marcus Ray',
        details: 'Routed to Employment Counsel and EHS Operations team.',
      },
    ],
    responsePackage: {
      responseType: 'Request for Informal Conference & Notice of Corrective Action Abatement',
      counselNotes: 'Facility already installed automatic sound beacons. OSHA likely to reduce proposed penalty by 60%.',
      rebuttalBasis: 'Violations were immediately abated within 48 hours with engineering controls.',
      filingDeadline: '2026-11-05',
      status: 'Approved',
      signoffs: [
        { role: 'Employment Counsel', name: 'Jordan Miller', title: 'Senior Employment Counsel', approved: true, date: '2026-10-24' },
        { role: 'EHS Operations Director', name: 'Gary Vance', title: 'VP Environmental Health & Safety', approved: true, date: '2026-10-25' },
      ],
      formalLetterBody: `Area Director
U.S. Department of Labor - OSHA
500 Route 17 South, 2nd Floor
Hasbrouck Heights, NJ 07604

Re: Inspection No. 1829041 - Request for Informal Conference & Certification of Abatement
Employer: Apex Logistics & Distribution LLC

Dear Area Director:

Apex Logistics & Distribution LLC hereby requests an Informal Conference pursuant to 29 CFR 1903.19 regarding Citation 1, Items 1 and 2. Apex has already instituted permanent corrective engineering modifications...`,
    },
  },
  {
    id: 'NOT-2026-0688',
    title: 'County Dept of Environmental Protection - Stormwater Discharge Notice',
    referenceNumber: 'DEP-SW-2026-092',
    category: 'Environmental / Municipal',
    issuingAuthority: 'Travis County Environmental Health Department',
    issuingOfficeOrDivision: 'Water Quality Enforcement Division',
    servingParty: 'Field Inspector Laura Martinez',
    targetEntity: 'Apex Data Services Texas LLC',
    jurisdiction: 'Travis County, State of Texas',
    registeredAgent: 'CSC Corporation, Austin TX',
    serviceMethod: 'Certified Mail (USPS)',
    dateOfNotice: '2026-09-30',
    dateReceived: '2026-10-03',
    statutoryDays: 30,
    isBusinessDays: false,
    statutoryDeadline: '2026-11-02',
    riskTier: 'P4 - Routine',
    financialExposure: 15000,
    legalHoldRequired: false,
    immediateInjunction: false,
    status: 'Filed & Completed',
    leadCounsel: 'David Chen, Counsel',
    assignedDepartment: 'Facilities & Infrastructure',
    outsideCounselFirm: 'Baker Botts L.L.P.',
    summary:
      'Routine municipal stormwater discharge self-monitoring quarterly certification filing correction for Austin Data Center campus cooling tower runoff.',
    extractedOcrText: `TRAVIS COUNTY ENVIRONMENTAL PROTECTION
NOTICE OF NON-COMPLIANCE - PERMIT #TX-SW-88192
Date: September 30, 2026
Permittee: Apex Data Services Texas LLC

The quarterly Stormwater Pollution Prevention Plan (SWPPP) analytical discharge report for Q3-2026 was received missing laboratory total suspended solids (TSS) bench certificates.
Please provide certified laboratory report within 30 days of this notice.`,
    documentFileName: 'Travis_County_DEP_Stormwater_092.pdf',
    documentFileSize: '1.1 MB',
    requiredDeliverables: [
      { id: 'dep-1', label: 'Obtain certified lab report from Austin Analytical Services', completed: true },
      { id: 'dep-2', label: 'Submit revised Form DEP-SW-3 with compliance officer signature', completed: true },
    ],
    auditHistory: [
      {
        id: 'aud-dep-1',
        timestamp: '2026-10-03 10:00 CST',
        action: 'Notice Ingested',
        actor: 'Intake Desk / Marcus Ray',
        details: 'Routine compliance notification logged.',
      },
      {
        id: 'aud-dep-2',
        timestamp: '2026-10-18 15:30 CST',
        action: 'Response Filed & Closed',
        actor: 'David Chen',
        details: 'Submitted verified lab analytics via Travis County portal. Notice resolved.',
      },
    ],
    responsePackage: {
      responseType: 'Transmittal of Supplemental Analytical Certification',
      counselNotes: 'Lab confirmed TSS was well within municipal threshold of 30 mg/L.',
      rebuttalBasis: 'Complete laboratory data submitted curing administrative omission.',
      filingDeadline: '2026-11-02',
      status: 'Transmitted',
      signoffs: [
        { role: 'Facility Counsel', name: 'David Chen', title: 'Legal Counsel', approved: true, date: '2026-10-17' },
      ],
      formalLetterBody: `Travis County Environmental Health Department
Water Quality Enforcement Division
Austin, TX 78701

Re: Curing of Permit #TX-SW-88192 Deficiency Notice dated September 30, 2026

Dear Ms. Martinez:
Attached please find the certified independent analytical laboratory results for Q3-2026...`,
    },
  },
];

export interface IntakePreset {
  id: string;
  presetName: string;
  tagline: string;
  category: NoticeItem['category'];
  title: string;
  referenceNumber: string;
  issuingAuthority: string;
  issuingOfficeOrDivision: string;
  servingParty: string;
  targetEntity: string;
  jurisdiction: string;
  registeredAgent: string;
  serviceMethod: NoticeItem['serviceMethod'];
  statutoryDays: number;
  isBusinessDays: boolean;
  riskTier: NoticeItem['riskTier'];
  financialExposure: number;
  legalHoldRequired: boolean;
  immediateInjunction: boolean;
  leadCounsel: string;
  assignedDepartment: string;
  outsideCounselFirm: string;
  summary: string;
  documentFileName: string;
  documentFileSize: string;
  deliverables: string[];
  extractedOcrText: string;
}

export const SAMPLE_INTAKE_PRESETS: IntakePreset[] = [
  {
    id: 'preset-sec',
    presetName: 'SEC Enforcement Subpoena',
    tagline: 'Urgent Securities Subpoena with 20-Day Statutory Response Window',
    category: 'Regulatory Enforcement',
    title: 'SEC Subpoena Duces Tecum & Document Preservation Demand',
    referenceNumber: 'SEC-DIV-ENF-2026-9930',
    issuingAuthority: 'U.S. Securities and Exchange Commission',
    issuingOfficeOrDivision: 'Division of Enforcement - Cloud & SaaS Unit',
    servingParty: 'L. Vance, Staff Attorney, SEC Enforcement',
    targetEntity: 'Apex Enterprise Holdings, Inc.',
    jurisdiction: 'United States District Court, Southern District of New York',
    registeredAgent: 'CT Corporation System, New York',
    serviceMethod: 'Certified Mail (USPS)',
    statutoryDays: 20,
    isBusinessDays: true,
    riskTier: 'P1 - Critical',
    financialExposure: 3200000,
    legalHoldRequired: true,
    immediateInjunction: false,
    leadCounsel: 'Eleanor Vance, VP Regulatory Affairs',
    assignedDepartment: 'Corporate Governance & Legal',
    outsideCounselFirm: 'Gibson, Dunn & Crutcher LLP',
    summary:
      'Formal SEC document production demand requesting all executive communications, compensation committee minutes, and revenue recognition schedules for FY2025.',
    documentFileName: 'SEC_Subpoena_Formal_Order_9930.pdf',
    documentFileSize: '4.8 MB',
    deliverables: [
      'Issue comprehensive corporate litigation hold across 35 executive custodian mailboxes',
      'Preserve automated ephemeral messaging logs (Slack, Microsoft Teams, Signal)',
      'Prepare initial meet-and-confer agenda regarding ESI search terms and production format',
      'Retain specialized electronic discovery forensics vendor',
    ],
    extractedOcrText: `UNITED STATES OF AMERICA
SECURITIES AND EXCHANGE COMMISSION
WASHINGTON, D.C. 20549
SUBPOENA DUCES TECUM
In the Matter of: APEX ENTERPRISE HOLDINGS, INC. (Inquiry Ref: 2026-9930)

TO: Apex Enterprise Holdings, Inc., c/o CT Corporation System, New York NY
YOU ARE COMMANDED TO PRODUCE the books, papers, and electronic records described in Attachment A at the SEC New York Regional Office, 200 Vesey Street, New York, NY on or before the statutory deadline.

FAILURE TO COMPLY may result in summary application to the U.S. District Court for an order compelling obedience under penalty of contempt.`,
  },
  {
    id: 'preset-tax',
    presetName: 'State Tax Proposed Deficiency',
    tagline: 'State Department of Revenue 30-Day Notice of Tax Assessment',
    category: 'Tax & Revenue',
    title: 'State Dept of Revenue - Notice of Corporate Franchise Tax Adjustment',
    referenceNumber: 'SDR-TAX-2026-40291',
    issuingAuthority: 'Delaware Division of Revenue',
    issuingOfficeOrDivision: 'Corporate Audit & Compliance Section',
    servingParty: 'Audit Group Senior Examiner H. Miller',
    targetEntity: 'Apex Technologies Delaware LLC',
    jurisdiction: 'State of Delaware, New Castle County',
    registeredAgent: 'The Corporation Trust Company (CT Corp)',
    serviceMethod: 'Certified Mail (USPS)',
    statutoryDays: 30,
    isBusinessDays: false,
    riskTier: 'P2 - High',
    financialExposure: 420000,
    legalHoldRequired: false,
    immediateInjunction: false,
    leadCounsel: 'David Chen, Tax Counsel Director',
    assignedDepartment: 'Corporate Tax & Accounting',
    outsideCounselFirm: 'PwC State & Local Tax Practice',
    summary:
      'State audit division proposes disallowance of net operating loss carryforwards and intercompany software license fee deductions totaling $420,000.',
    documentFileName: 'DE_Revenue_Notice_Deficiency_40291.pdf',
    documentFileSize: '1.9 MB',
    deliverables: [
      'Compile intercompany transfer pricing study documentation for Delaware entity',
      'Reconcile Schedule M-1 book-to-tax adjustments with federal Form 1120',
      'Draft administrative protest letter before 30-day statutory default date',
    ],
    extractedOcrText: `STATE OF DELAWARE - DIVISION OF REVENUE
CARVEL STATE OFFICE BUILDING, 820 N. FRENCH STREET, WILMINGTON, DE 19801
NOTICE OF PROPOSED CORPORATE FRANCHISE TAX ASSESSMENT
Assessment Notice #: SDR-TAX-2026-40291
Tax Year Ended: December 31, 2024
Total Deficiency Proposed: $420,000.00 (Including Statutory Penalties and Interest)

IMPORTANT STATUTORY NOTICE: Under 30 Del. C. § 521, you have exactly THIRTY (30) DAYS from the date of this notice to file a formal written protest. If no protest is filed within this 30-day window, this assessment becomes FINAL and NON-APPEALABLE.`,
  },
  {
    id: 'preset-lease',
    presetName: 'Commercial Lease 10-Day Cure',
    tagline: 'Emergency Notice of Default & Landlord Covenant Cure Demand',
    category: 'Contractual Default',
    title: 'Master Commercial Lease - Notice to Cure Default & Covenant Violation',
    referenceNumber: 'LEASE-HQ-2026-DEF01',
    issuingAuthority: 'Rockefeller Center Commercial Properties LP (Landlord)',
    issuingOfficeOrDivision: 'Legal & Asset Management Department',
    servingParty: 'Gibson Dunn LLP, Counsel to Landlord',
    targetEntity: 'Apex Enterprise Holdings, Inc.',
    jurisdiction: 'New York County Commercial Landlord-Tenant Court',
    registeredAgent: 'Personal Service upon General Counsel',
    serviceMethod: 'Registered Process Server',
    statutoryDays: 10,
    isBusinessDays: false,
    riskTier: 'P1 - Critical',
    financialExposure: 145000,
    legalHoldRequired: false,
    immediateInjunction: true,
    leadCounsel: 'Eleanor Vance, VP Legal',
    assignedDepartment: 'Real Estate & Corporate Facilities',
    outsideCounselFirm: 'DLA Piper LLP',
    summary:
      'Landlord demands immediate cure within 10 days regarding cooling tower auxiliary generator electrical hookup on the 18th floor roof deck.',
    documentFileName: 'Rockefeller_Notice_To_Cure_Def01.pdf',
    documentFileSize: '2.5 MB',
    deliverables: [
      'Retain licensed PE electrical engineer for on-site structural sign-off',
      'Submit revised mechanical engineering schematics to Landlord building management',
      'Deliver certified certificate of cure with insurance endorsement within 10 days',
    ],
    extractedOcrText: `TEN (10) DAY NOTICE TO CURE LEASE DEFAULT
TO: Apex Enterprise Holdings, Inc., Tenant under Lease dated July 15, 2022
Premises: 1251 Avenue of the Americas, Floors 18 & 19, New York, NY 10020

TAKE NOTICE that you are in violation of Section 14 (Tenant Installations) and Section 22 (Building Life Safety Systems) of your Lease.
Tenant has installed auxiliary diesel generator connections without requisite landlord prior written consent.
You are required to CURE the above violation within TEN (10) DAYS from the service hereof, failing which Landlord will serve a 3-day notice of cancellation and terminate the tenancy.`,
  },
];
