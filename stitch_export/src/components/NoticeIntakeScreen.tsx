import React, { useState, useEffect } from 'react';
import {
  NoticeItem,
  NoticeCategory,
  RiskTier,
  ServiceMethod,
  RequiredDeliverable,
} from '../types/notice';
import {
  SAMPLE_INTAKE_PRESETS,
  IntakePreset,
} from '../data/mockNotices';
import {
  calculateStatutoryDeadline,
  getRemainingDays,
  formatStatutoryCountdown,
} from '../utils/dateCalculations';
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Building2,
  Scale,
  ShieldAlert,
  ArrowRight,
  ListPlus,
  Trash2,
  RefreshCw,
  Eye,
  FileCheck,
} from 'lucide-react';

interface NoticeIntakeScreenProps {
  onNoticeCreated: (notice: NoticeItem) => void;
  onNavigateToDocket: () => void;
  onNavigateToDossier: (noticeId: string) => void;
}

export const NoticeIntakeScreen: React.FC<NoticeIntakeScreenProps> = ({
  onNoticeCreated,
  onNavigateToDocket,
  onNavigateToDossier,
}) => {
  // Preset selection state
  const [selectedPresetId, setSelectedPresetId] = useState<string>('');

  // Intake Form Fields
  const [title, setTitle] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [category, setCategory] = useState<NoticeCategory>('Regulatory Enforcement');
  const [issuingAuthority, setIssuingAuthority] = useState('');
  const [issuingOfficeOrDivision, setIssuingOfficeOrDivision] = useState('');
  const [servingParty, setServingParty] = useState('');
  const [targetEntity, setTargetEntity] = useState('Apex Enterprise Holdings, Inc.');
  const [jurisdiction, setJurisdiction] = useState('');
  const [registeredAgent, setRegisteredAgent] = useState('CT Corporation System');
  const [serviceMethod, setServiceMethod] = useState<ServiceMethod>('Certified Mail (USPS)');
  
  // Dates & Statutory Tolling
  const [dateOfNotice, setDateOfNotice] = useState('2026-10-30');
  const [dateReceived, setDateReceived] = useState('2026-10-31');
  const [statutoryDays, setStatutoryDays] = useState<number>(20);
  const [isBusinessDays, setIsBusinessDays] = useState<boolean>(true);
  const [statutoryDeadline, setStatutoryDeadline] = useState<string>('');

  // Risk & Governance
  const [riskTier, setRiskTier] = useState<RiskTier>('P2 - High');
  const [financialExposure, setFinancialExposure] = useState<number>(250000);
  const [legalHoldRequired, setLegalHoldRequired] = useState<boolean>(true);
  const [immediateInjunction, setImmediateInjunction] = useState<boolean>(false);

  // Routing
  const [leadCounsel, setLeadCounsel] = useState('Eleanor Vance, VP Regulatory Affairs');
  const [assignedDepartment, setAssignedDepartment] = useState('Corporate Legal & Governance');
  const [outsideCounselFirm, setOutsideCounselFirm] = useState('Gibson, Dunn & Crutcher LLP');

  // Summary & OCR
  const [summary, setSummary] = useState('');
  const [extractedOcrText, setExtractedOcrText] = useState('');
  const [documentFileName, setDocumentFileName] = useState('');
  const [documentFileSize, setDocumentFileSize] = useState('');

  // Deliverables checklist
  const [deliverables, setDeliverables] = useState<RequiredDeliverable[]>([
    { id: '1', label: 'Issue immediate legal hold to named custodians', completed: true },
    { id: '2', label: 'Confer with designated outside counsel', completed: false },
  ]);
  const [newDeliverableInput, setNewDeliverableInput] = useState('');

  // UI state
  const [isScanning, setIsScanning] = useState(false);
  const [ocrConfidence, setOcrConfidence] = useState<number | null>(null);
  const [showOcrPreview, setShowOcrPreview] = useState(false);
  const [submittedNotice, setSubmittedNotice] = useState<NoticeItem | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Recalculate deadline whenever dates or calculation rules change
  useEffect(() => {
    if (dateReceived && statutoryDays) {
      const calculated = calculateStatutoryDeadline(dateReceived, statutoryDays, isBusinessDays);
      setStatutoryDeadline(calculated);
    }
  }, [dateReceived, statutoryDays, isBusinessDays]);

  // Load Preset Handler
  const handleApplyPreset = (preset: IntakePreset) => {
    setSelectedPresetId(preset.id);
    setIsScanning(true);
    setOcrConfidence(null);

    setTimeout(() => {
      setTitle(preset.title);
      setReferenceNumber(preset.referenceNumber);
      setCategory(preset.category);
      setIssuingAuthority(preset.issuingAuthority);
      setIssuingOfficeOrDivision(preset.issuingOfficeOrDivision);
      setServingParty(preset.servingParty);
      setTargetEntity(preset.targetEntity);
      setJurisdiction(preset.jurisdiction);
      setRegisteredAgent(preset.registeredAgent);
      setServiceMethod(preset.serviceMethod);
      setDateOfNotice('2026-10-30');
      setDateReceived('2026-10-31');
      setStatutoryDays(preset.statutoryDays);
      setIsBusinessDays(preset.isBusinessDays);
      setRiskTier(preset.riskTier);
      setFinancialExposure(preset.financialExposure);
      setLegalHoldRequired(preset.legalHoldRequired);
      setImmediateInjunction(preset.immediateInjunction);
      setLeadCounsel(preset.leadCounsel);
      setAssignedDepartment(preset.assignedDepartment);
      setOutsideCounselFirm(preset.outsideCounselFirm);
      setSummary(preset.summary);
      setDocumentFileName(preset.documentFileName);
      setDocumentFileSize(preset.documentFileSize);
      setExtractedOcrText(preset.extractedOcrText);
      setDeliverables(
        preset.deliverables.map((item, idx) => ({
          id: `del-${idx}`,
          label: item,
          completed: false,
        }))
      );
      setIsScanning(false);
      setOcrConfidence(98.4);
      setValidationError(null);
    }, 400);
  };

  // Simulated File Upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    setSubmittedNotice(null);
    setDocumentFileName(file.name);
    setDocumentFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);

    setTimeout(() => {
      // Auto populate simulated OCR extraction based on file name or generic legal notice
      setTitle(`Intake: ${file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' ')}`);
      setReferenceNumber(`DOK-2026-${Math.floor(1000 + Math.random() * 9000)}`);
      setIssuingAuthority('State Regulatory Commission & Enforcement Branch');
      setIssuingOfficeOrDivision('Office of Formal Enforcement');
      setServingParty('Special Agent J. Kowalski');
      setJurisdiction('U.S. District Court');
      setSummary(`Ingested document ${file.name}. OCR parsed statutory notice requiring production of records within statutory response window.`);
      setExtractedOcrText(
        `OFFICIAL NOTICE OF PROCEEDING & STATUTORY INTAKE DEMAND\nFile: ${file.name}\nTimestamp: ${new Date().toISOString()}\nTarget: Apex Enterprise Holdings, Inc.\nPlease take notice that compliance is mandated pursuant to applicable statutory provisions.`
      );
      setIsScanning(false);
      setOcrConfidence(96.8);
    }, 600);
  };

  const handleAddDeliverable = () => {
    if (!newDeliverableInput.trim()) return;
    setDeliverables([
      ...deliverables,
      {
        id: `custom-${Date.now()}`,
        label: newDeliverableInput.trim(),
        completed: false,
      },
    ]);
    setNewDeliverableInput('');
  };

  const handleToggleDeliverable = (id: string) => {
    setDeliverables(
      deliverables.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const handleDeleteDeliverable = (id: string) => {
    setDeliverables(deliverables.filter((item) => item.id !== id));
  };

  const handleResetForm = () => {
    setTitle('');
    setReferenceNumber('');
    setIssuingAuthority('');
    setIssuingOfficeOrDivision('');
    setServingParty('');
    setSummary('');
    setExtractedOcrText('');
    setDocumentFileName('');
    setDocumentFileSize('');
    setSelectedPresetId('');
    setOcrConfidence(null);
    setSubmittedNotice(null);
    setValidationError(null);
  };

  const handleFinalizeIntake = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !referenceNumber.trim() || !issuingAuthority.trim()) {
      setValidationError('Please complete the Notice Title, Reference Number, and Issuing Authority fields before submitting.');
      return;
    }

    const newId = `NOT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const finalDeadline = statutoryDeadline || calculateStatutoryDeadline(dateReceived, statutoryDays, isBusinessDays);

    const newNotice: NoticeItem = {
      id: newId,
      title: title.trim(),
      referenceNumber: referenceNumber.trim(),
      category,
      issuingAuthority: issuingAuthority.trim(),
      issuingOfficeOrDivision: issuingOfficeOrDivision.trim() || 'General Docket Unit',
      servingParty: servingParty.trim() || 'Official Process Server',
      targetEntity,
      jurisdiction: jurisdiction.trim() || 'State & Federal Jurisdictional Venue',
      registeredAgent,
      serviceMethod,
      dateOfNotice,
      dateReceived,
      statutoryDays,
      isBusinessDays,
      statutoryDeadline: finalDeadline,
      riskTier,
      financialExposure,
      legalHoldRequired,
      immediateInjunction,
      status: legalHoldRequired ? 'Legal Hold Active' : 'New Intake',
      leadCounsel,
      assignedDepartment,
      outsideCounselFirm: outsideCounselFirm || 'In-House Legal Management',
      summary: summary.trim() || `Statutory notice from ${issuingAuthority} with deadline ${finalDeadline}.`,
      extractedOcrText: extractedOcrText || `EXTRACTED CONTENT FOR ${title}\nReference: ${referenceNumber}\nMandatory statutory response due: ${finalDeadline}`,
      documentFileName: documentFileName || 'Intake_Notice_Docket_File.pdf',
      documentFileSize: documentFileSize || '2.4 MB',
      requiredDeliverables: deliverables,
      auditHistory: [
        {
          id: `aud-${Date.now()}`,
          timestamp: '2026-10-31 14:15 EST',
          action: 'Formal Notice Ingestion Completed',
          actor: 'Compliance Intake Desk / Eleanor Vance',
          details: `Processed under category ${category}. Statutory countdown initiated (${statutoryDays} ${isBusinessDays ? 'business' : 'calendar'} days). Target: ${targetEntity}.`,
        },
      ],
      responsePackage: {
        responseType: 'Statutory Responsive Answer & Rebuttal Memo',
        counselNotes: 'Pending initial review by lead regulatory counsel.',
        rebuttalBasis: 'Reviewing statutory compliance defenses and evidentiary grounds.',
        filingDeadline: finalDeadline,
        status: 'Drafting',
        signoffs: [
          { role: 'Lead Regulatory Counsel', name: leadCounsel, title: 'Lead Counsel', approved: false },
          { role: 'Outside Counsel', name: outsideCounselFirm, title: 'Special Counsel', approved: false },
        ],
        formalLetterBody: `FORMAL NOTICE OF APPEARANCE & RESPONSIVE STATEMENT\nRE: ${referenceNumber}\nTo: ${issuingAuthority}\n\nPlease take notice that the undersigned counsel appears on behalf of ${targetEntity}...`,
      },
    };

    onNoticeCreated(newNotice);
    setSubmittedNotice(newNotice);
    setValidationError(null);
  };

  const remainingDays = statutoryDeadline ? getRemainingDays(statutoryDeadline, dateReceived) : 0;
  const countdown = formatStatutoryCountdown(remainingDays);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Editorial Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
          <span>Notice Operations</span>
          <span aria-hidden="true">·</span>
          <span>Screen 1</span>
          <span aria-hidden="true">·</span>
          <span>Statutory Compliance Engine</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Notice Intake
        </h1>
        <p className="mt-1 text-base text-slate-600 max-w-3xl">
          Ingest judicial subpoenas, regulatory demands, tax assessments, and contractual cure notices.
          Extract docket metadata, compute statutory tolling deadlines, assess exposure, and route to designated counsel.
        </p>
      </div>

      {/* Submission Success Alert */}
      {submittedNotice && (
        <div className="mb-8 p-5 bg-white border border-emerald-300 rounded-lg shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  Notice Successfully Ingested · Docket ID: <span className="font-mono">{submittedNotice.id}</span>
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  "{submittedNotice.title}" has been recorded. Statutory response countdown set to{' '}
                  <span className="font-mono font-semibold">{submittedNotice.statutoryDeadline}</span>.
                </p>
                <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                  <span>Assigned: {submittedNotice.leadCounsel}</span>
                  <span aria-hidden="true">·</span>
                  <span>Target: {submittedNotice.targetEntity}</span>
                  <span aria-hidden="true">·</span>
                  <span>Status: {submittedNotice.status}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => onNavigateToDossier(submittedNotice.id)}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
              >
                View Dossier
              </button>
              <button
                onClick={onNavigateToDocket}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
              >
                Go to Active Docket →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Presets Strip: Fast Testing for Evaluators & Users */}
      <div className="mb-8 p-4 bg-white border border-slate-200 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
              Quick Intake Presets
            </span>
            <span className="text-xs text-slate-500 ml-2">
              (Load pre-verified notices with OCR data & statutory formulas)
            </span>
          </div>
          {selectedPresetId && (
            <button
              onClick={handleResetForm}
              className="text-xs text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              Clear Preset
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {SAMPLE_INTAKE_PRESETS.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className={`text-left p-3.5 rounded-md border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-slate-900 bg-slate-50/70 ring-1 ring-slate-900'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span>{preset.category}</span>
                  <span className="font-mono tabular-nums">{preset.statutoryDays}d window</span>
                </div>
                <div className="text-sm font-semibold text-slate-900 mb-1 line-clamp-1">
                  {preset.presetName}
                </div>
                <p className="text-xs text-slate-600 line-clamp-2">
                  {preset.tagline}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleFinalizeIntake} className="space-y-8">
        {/* Document Ingestion & Optical Scan Dropzone */}
        <div className="p-6 bg-white border border-slate-200 rounded-lg">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-slate-700" />
              <h2 className="text-base font-semibold text-slate-900">
                01. Document Ingestion & Optical Scan
              </h2>
            </div>
            {ocrConfidence !== null && (
              <div className="text-xs font-mono text-emerald-700">
                OCR Confidence: {ocrConfidence}% · Text Extracted
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            <div className="lg:col-span-2 border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-slate-400 transition-colors bg-slate-50/50">
              <input
                type="file"
                id="notice-file-input"
                className="hidden"
                accept=".pdf,.png,.jpg,.jpeg,.tiff,.docx"
                onChange={handleFileUpload}
              />
              <label htmlFor="notice-file-input" className="cursor-pointer block">
                <FileText className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <span className="text-sm font-medium text-slate-900 block">
                  {documentFileName ? `Uploaded: ${documentFileName}` : 'Drop legal summons, regulatory demand, or certified mail scan'}
                </span>
                <span className="text-xs text-slate-500 mt-1 block">
                  Supports PDF, TIFF, PNG, JPG (Multi-page optical document scanner)
                </span>
                {documentFileSize && (
                  <span className="text-xs font-mono text-slate-400 mt-1 block">
                    File size: {documentFileSize}
                  </span>
                )}
              </label>
            </div>

            <div className="space-y-3">
              <div className="text-xs font-medium text-slate-700">Document Parsing Status</div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200 text-xs space-y-1.5 text-slate-600">
                <div className="flex justify-between">
                  <span>File:</span>
                  <span className="font-mono text-slate-900 truncate max-w-[150px]">
                    {documentFileName || 'None (Upload or pick preset)'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="font-medium text-slate-900">
                    {isScanning ? 'Extracting OCR...' : documentFileName ? 'Parsed & Ready' : 'Awaiting File'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>OCR Buffer:</span>
                  <span>{extractedOcrText ? `${extractedOcrText.length} chars` : '0 chars'}</span>
                </div>
              </div>

              {extractedOcrText && (
                <button
                  type="button"
                  onClick={() => setShowOcrPreview(!showOcrPreview)}
                  className="w-full py-1.5 px-3 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  {showOcrPreview ? 'Hide Raw OCR Text' : 'View Extracted Text'}
                </button>
              )}
            </div>
          </div>

          {showOcrPreview && extractedOcrText && (
            <div className="mt-4 p-3 bg-slate-950 text-slate-200 rounded font-mono text-xs max-h-48 overflow-y-auto whitespace-pre-wrap leading-relaxed">
              {extractedOcrText}
            </div>
          )}
        </div>

        {/* Section 2: Notice Identification & Issuing Authority */}
        <div className="p-6 bg-white border border-slate-200 rounded-lg">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <Scale className="w-5 h-5 text-slate-700" />
            <h2 className="text-base font-semibold text-slate-900">
              02. Primary Notice Identification
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Notice Title / Action Subject *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. SEC Formal Subpoena Duces Tecum & ESI Preservation Demand"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Reference / Docket / Case Number *
              </label>
              <input
                type="text"
                required
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                placeholder="e.g. SEC-HO-14920 or FTB-2026-8831"
                className="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as NoticeCategory)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
              >
                <option value="Regulatory Enforcement">Regulatory Enforcement</option>
                <option value="Judicial Subpoena">Judicial Subpoena</option>
                <option value="Tax & Revenue">Tax & Revenue</option>
                <option value="Contractual Default">Contractual Default</option>
                <option value="Environmental / Municipal">Environmental / Municipal</option>
                <option value="Labor & Employment">Labor & Employment</option>
                <option value="Corporate Governance">Corporate Governance</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Issuing Authority / Agency / Court *
              </label>
              <input
                type="text"
                required
                value={issuingAuthority}
                onChange={(e) => setIssuingAuthority(e.target.value)}
                placeholder="e.g. U.S. Securities and Exchange Commission"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Branch / Division / Bureau
              </label>
              <input
                type="text"
                value={issuingOfficeOrDivision}
                onChange={(e) => setIssuingOfficeOrDivision(e.target.value)}
                placeholder="e.g. Division of Enforcement - New York Office"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Serving Party / Attorney / Officer ID
              </label>
              <input
                type="text"
                value={servingParty}
                onChange={(e) => setServingParty(e.target.value)}
                placeholder="e.g. Christopher Vance, Senior Trial Counsel"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Service Method
              </label>
              <select
                value={serviceMethod}
                onChange={(e) => setServiceMethod(e.target.value as ServiceMethod)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
              >
                <option value="Certified Mail (USPS)">Certified Mail (USPS)</option>
                <option value="Registered Process Server">Registered Process Server</option>
                <option value="Electronic Regulatory Portal">Electronic Regulatory Portal</option>
                <option value="In-Hand Officer Service">In-Hand Officer Service</option>
                <option value="FedEx Priority Overnight">FedEx Priority Overnight</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Statutory Deadlines & Tolling Engine */}
        <div className="p-6 bg-white border border-slate-200 rounded-lg">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-slate-700" />
              <h2 className="text-base font-semibold text-slate-900">
                03. Statutory Tolling & Deadline Calculation
              </h2>
            </div>
            <div className="text-xs text-slate-500">
              Automated business vs calendar day calculator
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Date of Notice
              </label>
              <input
                type="date"
                value={dateOfNotice}
                onChange={(e) => setDateOfNotice(e.target.value)}
                className="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Date Received / Served *
              </label>
              <input
                type="date"
                required
                value={dateReceived}
                onChange={(e) => setDateReceived(e.target.value)}
                className="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Statutory Window (Days)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="180"
                  value={statutoryDays}
                  onChange={(e) => setStatutoryDays(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
                />
                <span className="text-xs text-slate-500 shrink-0">days</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Calculation Standard
              </label>
              <div className="flex items-center gap-2 pt-2">
                <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="calcType"
                    checked={isBusinessDays}
                    onChange={() => setIsBusinessDays(true)}
                    className="accent-slate-900"
                  />
                  <span>Business Days</span>
                </label>
                <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer ml-2">
                  <input
                    type="radio"
                    name="calcType"
                    checked={!isBusinessDays}
                    onChange={() => setIsBusinessDays(false)}
                    className="accent-slate-900"
                  />
                  <span>Calendar Days</span>
                </label>
              </div>
            </div>
          </div>

          {/* Computed Statutory Countdown Banner */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="text-xs text-slate-500">Calculated Final Response Deadline</div>
              <div className="text-xl font-bold font-mono tabular-nums text-slate-900">
                {statutoryDeadline || 'Calculating...'}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                Computed from received date {dateReceived} + {statutoryDays} {isBusinessDays ? 'business days' : 'calendar days'}
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <div>
                <span className="text-slate-500 block">Remaining Window</span>
                <span className={`text-sm font-semibold ${countdown.isUrgent ? 'text-amber-700' : 'text-slate-900'}`}>
                  {countdown.text}
                </span>
              </div>
              <div className="border-l border-slate-200 pl-4">
                <span className="text-slate-500 block">Tolling Grace Period</span>
                <span className="text-sm font-semibold text-slate-900">0 Days (None)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Target Entity & Governance Routing */}
        <div className="p-6 bg-white border border-slate-200 rounded-lg">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <Building2 className="w-5 h-5 text-slate-700" />
            <h2 className="text-base font-semibold text-slate-900">
              04. Entity Assignment & Routing
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Legal Entity *
              </label>
              <select
                value={targetEntity}
                onChange={(e) => setTargetEntity(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
              >
                <option value="Apex Enterprise Holdings, Inc.">Apex Enterprise Holdings, Inc.</option>
                <option value="Apex Technologies Delaware LLC">Apex Technologies Delaware LLC</option>
                <option value="Apex Logistics & Distribution LLC">Apex Logistics & Distribution LLC</option>
                <option value="Apex Data Services Texas LLC">Apex Data Services Texas LLC</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Jurisdiction / Venue
              </label>
              <input
                type="text"
                value={jurisdiction}
                onChange={(e) => setJurisdiction(e.target.value)}
                placeholder="e.g. S.D.N.Y. / State of Delaware"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Designated Registered Agent
              </label>
              <input
                type="text"
                value={registeredAgent}
                onChange={(e) => setRegisteredAgent(e.target.value)}
                placeholder="e.g. CT Corporation System"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Lead Legal Counsel
              </label>
              <input
                type="text"
                value={leadCounsel}
                onChange={(e) => setLeadCounsel(e.target.value)}
                placeholder="e.g. Eleanor Vance, VP Regulatory Affairs"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Assigned Business Department
              </label>
              <input
                type="text"
                value={assignedDepartment}
                onChange={(e) => setAssignedDepartment(e.target.value)}
                placeholder="e.g. Corporate Governance & Legal"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Retained Outside Counsel
              </label>
              <input
                type="text"
                value={outsideCounselFirm}
                onChange={(e) => setOutsideCounselFirm(e.target.value)}
                placeholder="e.g. Gibson, Dunn & Crutcher LLP"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
              />
            </div>
          </div>
        </div>

        {/* Section 5: Risk Tier, Injunctions & Preservation Hold */}
        <div className="p-6 bg-white border border-slate-200 rounded-lg">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <ShieldAlert className="w-5 h-5 text-slate-700" />
            <h2 className="text-base font-semibold text-slate-900">
              05. Risk Assessment & Preservation Controls
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Risk Tier
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['P1 - Critical', 'P2 - High', 'P3 - Medium', 'P4 - Routine'] as RiskTier[]).map((tier) => (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => setRiskTier(tier)}
                      className={`px-3 py-2 text-xs font-medium rounded border text-left cursor-pointer transition-colors ${
                        riskTier === tier
                          ? 'border-slate-900 bg-slate-900 text-white'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {tier}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Estimated Financial / Penalty Exposure (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-sm text-slate-500 font-mono">$</span>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={financialExposure}
                    onChange={(e) => setFinancialExposure(parseFloat(e.target.value) || 0)}
                    className="w-full pl-7 pr-3 py-2 text-sm font-mono tabular-nums border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-md border border-slate-200 space-y-3">
              <div className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                Immediate Protective Actions
              </div>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={legalHoldRequired}
                  onChange={(e) => setLegalHoldRequired(e.target.checked)}
                  className="mt-0.5 accent-slate-900"
                />
                <div>
                  <span className="text-xs font-semibold text-slate-900 block">
                    Trigger Mandatory Legal / ESI Preservation Hold
                  </span>
                  <span className="text-xs text-slate-500 block">
                    Suspends routine auto-deletion policies across email, Slack, cloud drives, and documents.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={immediateInjunction}
                  onChange={(e) => setImmediateInjunction(e.target.checked)}
                  className="mt-0.5 accent-slate-900"
                />
                <div>
                  <span className="text-xs font-semibold text-slate-900 block">
                    Immediate Injunction / Temporary Restraining Order / Cure Notice
                  </span>
                  <span className="text-xs text-slate-500 block">
                    Requires immediate cessation or emergency cure response within 24–72 hours.
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Section 6: Deliverables Checklist */}
        <div className="p-6 bg-white border border-slate-200 rounded-lg">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-slate-700" />
              <h2 className="text-base font-semibold text-slate-900">
                06. Required Deliverables & Production Items
              </h2>
            </div>
            <span className="text-xs text-slate-500">
              {deliverables.length} action item{deliverables.length === 1 ? '' : 's'} tracked
            </span>
          </div>

          <div className="space-y-2 mb-4">
            {deliverables.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 p-2.5 bg-slate-50 rounded border border-slate-200"
              >
                <label className="flex items-center gap-2.5 flex-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => handleToggleDeliverable(item.id)}
                    className="accent-slate-900"
                  />
                  <span className={`text-xs ${item.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                    {item.label}
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() => handleDeleteDeliverable(item.id)}
                  className="text-slate-400 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                  title="Remove deliverable"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newDeliverableInput}
              onChange={(e) => setNewDeliverableInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddDeliverable();
                }
              }}
              placeholder="Add required statutory deliverable (e.g. 'Draft meet and confer agenda')..."
              className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
            />
            <button
              type="button"
              onClick={handleAddDeliverable}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
            >
              <ListPlus className="w-3.5 h-3.5" />
              Add Item
            </button>
          </div>
        </div>

        {/* Section 7: Summary & Allegations */}
        <div className="p-6 bg-white border border-slate-200 rounded-lg">
          <div className="mb-4 pb-3 border-b border-slate-100">
            <h2 className="text-base font-semibold text-slate-900">
              07. Executive Summary & Key Allegations
            </h2>
          </div>

          <textarea
            rows={3}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Summarize the core factual allegations, statutory citations, and requested remedies..."
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
          />
        </div>

        {/* Validation Error Display */}
        {validationError && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-md text-xs text-rose-700 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Bottom Actions Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <div className="text-xs text-slate-500">
            Intake submissions immediately propagate to Active Docket and Statutory Deadlines calendar.
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleResetForm}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Reset Form
            </button>

            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <span>Finalize & Ingest to Docket</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
