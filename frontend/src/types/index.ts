export type UserRole = 'seller' | 'officer' | 'auditor';
export const UserRole = {
  seller: 'seller' as const,
  officer: 'officer' as const,
  auditor: 'auditor' as const,
};

export interface User {
  username: string;
  userId: string;
  user_id?: string;
  role: UserRole;
  organization: string;
  designation?: string;
  isMaster?: boolean;
  is_master?: boolean;
  token: string;
  message?: string;
}

export interface Tender {
  id: string;
  ref_no: string;
  title: string;
  department: string;
  category: string;
  estimated_value_lakhs: number;
  emd_amount_lakhs: number;
  min_turnover_lakhs: number;
  min_mii_percentage: number;
  closing_date: string;
  status: string;
}

export interface Bidder {
  id: string;
  legal_name: string;
  trade_name: string;
  gstin: string;
  pan: string;
  udyam_no: string;
  msme_category: string;
  mii_percentage: number;
  declared_turnover_lakhs: number;
  blacklisted: boolean;
  status: string;
}

export interface DocumentLegitimacyCheck {
  name: string;
  passed: boolean;
  score: number;
  details: string;
  source: string;
}

export interface DocumentOCRResult {
  filename: string;
  document_type: string;
  extracted_gstin?: string;
  extracted_pan?: string;
  extracted_udyam?: string;
  extracted_legal_name?: string;
  extracted_turnover?: number;
  document_date?: string;
  confidence_score: number;
  seal_verified: boolean;
  tampering_detected: boolean;
  raw_snippet: string;

  // AI Legitimacy Cross-Check Fields
  is_legit?: boolean;
  legitimacy_status?: 'LEGITIMATE' | 'SUSPICIOUS' | 'FORGED';
  legitimacy_score?: number;
  legitimacy_checks?: DocumentLegitimacyCheck[];
  tamper_analysis?: {
    font_consistency?: string;
    pixel_tamper_risk?: string;
    digital_signature_valid?: boolean;
    hash_checksum?: string;
  };

  // Expiry & Validity Period Fields
  has_expiry?: boolean;
  expiry_date?: string;
  is_expired?: boolean;
  days_until_expiry?: number | null;
  validity_status?: 'VALID' | 'EXPIRING_SOON' | 'EXPIRED' | 'PERPETUAL_ACTIVE' | 'SUSPENDED';
  validity_details?: string;

  // Cross-Document Consistency Matches
  cross_check_summary?: {
    pan_gstin_match?: boolean;
    embedded_pan?: string;
    submitted_pan?: string;
    legal_name_match?: boolean;
    sovereign_db_match?: boolean;
    audit_verdict?: string;
  };
}

export interface RuleEvaluationItem {
  rule_id: string;
  name: string;
  category: string;
  passed: boolean;
  severity: 'Critical' | 'High' | 'Moderate';
  details: string;
  evidence_source: string;
}

export type RiskTier = 'LOW RISK' | 'MEDIUM RISK' | 'HIGH RISK';

export type AIRecommendation =
  | 'QUALIFIED FOR FINANCIAL BID OPENING'
  | 'CLARIFICATION REQUIRED FROM BIDDER'
  | 'REJECTED / NON-COMPLIANT';

export interface ComplianceReport {
  tender_ref: string;
  bidder_id: string;
  bidder_name: string;
  readiness_score: number;
  risk_tier: RiskTier;
  statutory_checks: Record<string, string>;
  rules_evaluated: RuleEvaluationItem[];
  discrepancies: string[];
  evidence_sources: Array<{ rule: string; source: string; status: string }>;
  ai_recommendation: AIRecommendation;
  recommendation_rationale: string;
  evaluated_at: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  tender_ref?: string;
  bidder_name?: string;
  details: string;
  severity: string;
}

export interface Product {
  id: string;
  title: string;
  category: string;
  sub_category: string;
  price: number;
  seller_name: string;
  seller_id: string;
  mii_percentage: number;
  mii_class: string;
  msme_verified: boolean;
  gst_status: string;
  rating: number;
  reviews_count: number;
  image_icon: string;
  specs: Record<string, string>;
  tender_eligible: boolean;
  available_qty: number;
}

export interface AIChatAction {
  label: string;
  action: string;
  id?: string;
}

export interface AIChatResponse {
  reply: string;
  suggested_actions: AIChatAction[];
  model: string;
  is_local_ai?: boolean;
}

export interface DocumentChatRequest {
  question: string;
  document_id?: string;
  filename?: string;
  active_document?: Partial<DocumentOCRResult> | null;
  user_id?: string;
  organization?: string;
  role?: UserRole;
  target_org?: string;
  tender_ref?: string;
}

export interface DocumentChatResponse {
  answer: string;
  document_name: string;
  document_type: string;
  flags_detected: string[];
  validity_verdict: string;
  tenant_verified: boolean;
  owner_organization: string;
  is_comparison: boolean;
  redacted_fields: string[];
  suggested_actions: Array<{ label: string; action: string }>;
}

export interface LiveWebUpdateItem {
  id?: string;
  title: string;
  date: string;
  source: string;
  summary: string;
  link?: string;
}

export interface LiveWebUpdateResponse {
  summary: string;
  updates: LiveWebUpdateItem[];
  live_connected: boolean;
  queried_at: string;
  source: string;
}


