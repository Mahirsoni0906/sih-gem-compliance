from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum
from datetime import datetime

class RiskTier(str, Enum):
    LOW = "LOW RISK"
    MEDIUM = "MEDIUM RISK"
    HIGH = "HIGH RISK"

class AIRecommendation(str, Enum):
    QUALIFIED = "QUALIFIED FOR FINANCIAL BID OPENING"
    CLARIFICATION_NEEDED = "CLARIFICATION REQUIRED FROM BIDDER"
    DISQUALIFIED = "REJECTED / NON-COMPLIANT"

class UserRole(str, Enum):
    SELLER = "seller"
    OFFICER = "officer"
    AUDITOR = "auditor"

class LoginRequest(BaseModel):
    username: str
    password: str
    role: Optional[UserRole] = UserRole.SELLER

class AuthResponse(BaseModel):
    token: str
    username: str
    user_id: str
    role: UserRole
    organization: str
    designation: Optional[str] = None
    is_master: bool = False
    message: Optional[str] = None

# Tender Schema
class Tender(BaseModel):
    id: str
    ref_no: str
    title: str
    department: str
    category: str
    estimated_value_lakhs: float
    emd_amount_lakhs: float
    min_turnover_lakhs: float
    min_mii_percentage: float
    closing_date: str
    status: str

# Bidder Schema
class Bidder(BaseModel):
    id: str
    legal_name: str
    trade_name: str
    gstin: str
    pan: str
    udyam_no: str
    msme_category: str
    mii_percentage: float
    declared_turnover_lakhs: float
    blacklisted: bool = False
    status: str = "Submitted"

# OCR Extraction Response with AI Legitimacy & Expiry Cross-Verification
class DocumentOCRResult(BaseModel):
    filename: str
    document_type: str
    extracted_gstin: Optional[str] = None
    extracted_pan: Optional[str] = None
    extracted_udyam: Optional[str] = None
    extracted_legal_name: Optional[str] = None
    extracted_address: Optional[str] = None
    extracted_constitution: Optional[str] = None
    extracted_incorporation_date: Optional[str] = None
    extracted_epfo: Optional[str] = None
    extracted_esic: Optional[str] = None
    extracted_mii_percentage: Optional[float] = None
    extracted_mii_class: Optional[str] = None
    extracted_udin: Optional[str] = None
    extracted_oem_auth: Optional[str] = None
    tender_ref: Optional[str] = None
    turnover_breakdown: Optional[Dict[str, Any]] = None
    extracted_turnover: Optional[float] = None
    document_date: Optional[str] = None
    confidence_score: float
    seal_verified: bool
    tampering_detected: bool
    raw_snippet: str

    # AI Legitimacy Cross-Check Fields
    is_legit: bool = True
    legitimacy_status: str = "LEGITIMATE"  # "LEGITIMATE" | "SUSPICIOUS" | "FORGED"
    legitimacy_score: float = 98.5
    legitimacy_checks: List[Dict[str, Any]] = Field(default_factory=list)
    tamper_analysis: Dict[str, Any] = Field(default_factory=dict)

    # Expiry & Validity Period Fields
    has_expiry: bool = False
    expiry_date: Optional[str] = None
    is_expired: bool = False
    days_until_expiry: Optional[int] = None
    validity_status: str = "VALID"  # "VALID" | "EXPIRING_SOON" | "EXPIRED" | "PERPETUAL_ACTIVE" | "SUSPENDED"
    validity_details: str = "Document is within statutory validity period."

    # Cross-Document Consistency Matches
    cross_check_summary: Dict[str, Any] = Field(default_factory=dict)

# Verification Engine Individual Checks
class StatutoryVerificationResponse(BaseModel):
    portal: str
    identifier: str
    verified: bool
    status_code: str
    details: Dict[str, Any]

# Compliance Rules Engine Items
class RuleEvaluationItem(BaseModel):
    rule_id: str
    name: str
    category: str  # Mandatory, Financial, Technical, Statutory
    passed: bool
    severity: str  # Critical, High, Moderate
    details: str
    evidence_source: str

# Full Compliance & Risk Report (Explainable Output Layer)
class ComplianceReport(BaseModel):
    tender_ref: str
    bidder_id: str
    bidder_name: str
    readiness_score: int
    risk_tier: RiskTier
    statutory_checks: Dict[str, str]
    rules_evaluated: List[RuleEvaluationItem]
    discrepancies: List[str]
    evidence_sources: List[Dict[str, str]]
    ai_recommendation: AIRecommendation
    recommendation_rationale: str
    evaluated_at: str

# Discrepancy Resolution
class DiscrepancyResolveRequest(BaseModel):
    bidder_id: str
    tender_ref: str
    field_to_resolve: str
    updated_value: str
    justification: str

# Officer Action Console
class OfficerDecisionRequest(BaseModel):
    tender_ref: str
    bidder_id: str
    decision: str  # APPROVE, CLARIFY, REJECT
    officer_id: str
    officer_name: str
    remarks: str

# Audit Log Entry
class AuditLogEntry(BaseModel):
    id: str
    timestamp: str
    user: str
    role: str
    action: str
    tender_ref: Optional[str] = None
    bidder_name: Optional[str] = None
    details: str
    severity: str = "INFO"

# Multi-Tenant Document Scrutiny AI Q&A Schemas
class DocumentChatRequest(BaseModel):
    question: str
    document_id: Optional[str] = None
    filename: Optional[str] = None
    active_document: Optional[Dict[str, Any]] = None
    user_id: Optional[str] = "user_default"
    organization: Optional[str] = "ABC Industries Pvt. Ltd."
    role: Optional[UserRole] = UserRole.SELLER
    target_org: Optional[str] = None
    tender_ref: Optional[str] = "GEM/2026/B/9012481"

class DocumentChatResponse(BaseModel):
    answer: str
    document_name: str
    document_type: str
    flags_detected: List[str] = Field(default_factory=list)
    validity_verdict: str = "VALID"
    tenant_verified: bool = True
    owner_organization: str = "ABC Industries Pvt. Ltd."
    is_comparison: bool = False
    redacted_fields: List[str] = Field(default_factory=list)
    suggested_actions: List[Dict[str, Any]] = Field(default_factory=list)
    redirect_to_gemmy: Optional[bool] = False
    gemmy_query: Optional[str] = None

# Live Internet Updates Schema
class LiveWebUpdateResponse(BaseModel):
    summary: str
    updates: List[Dict[str, Any]]
    live_connected: bool
    queried_at: str
    source: str

