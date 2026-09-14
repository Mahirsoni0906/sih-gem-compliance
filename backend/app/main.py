import sys
import os

backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from fastapi import FastAPI, UploadFile, File, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional, Dict, Any

from app.schemas import (
    LoginRequest, AuthResponse, UserRole,
    Tender, Bidder, DocumentOCRResult,
    ComplianceReport, DiscrepancyResolveRequest, OfficerDecisionRequest,
    AuditLogEntry, DocumentChatRequest, DocumentChatResponse, LiveWebUpdateResponse
)
from app.crud import (
    get_tenders, get_tender_by_ref,
    get_bidders, get_bidder_by_id, update_bidder,
    save_compliance_report, get_compliance_report,
    save_officer_decision, add_audit_log, get_audit_logs
)
from app.services.ocr_service import AIOCRService
from app.services.verification_engine import StatutoryVerificationEngine
from app.services.rules_engine import ComplianceRulesEngine
from app.services.scoring_engine import RiskAndScoringEngine
from app.services.local_ai_service import LocalAIService
from app.services.rag_service import StatutoryDomainEngine, GeMRAGRetriever
from app.services.web_search_service import LiveGeMWebSearchService
from app.services.doc_scrutiny_ai import DocumentScrutinyAIService

app = FastAPI(
    title="GeM AI Compliance Verification System (SIH26100 - Code Catalyst)",
    description="Automated statutory verification, AI document OCR scrutiny, compliance rules engine, and procurement officer console for GeM.",
    version="2.5.0"
)

# Enable CORS for frontend Vite dev server (localhost:5173) and production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------------------------------------
# 1. Health & Meta
# ----------------------------------------------------
@app.get("/api/health")
def health_check():
    return {
        "status": "online",
        "system": "GeM AI Compliance Engine (Code Catalyst SIH26100)",
        "version": "2.5.0",
        "documentation": "/docs"
    }


# ----------------------------------------------------
# 2. Authentication & Role-Based Access Control
# ----------------------------------------------------
@app.post("/api/auth/login", response_model=AuthResponse)
def login(creds: LoginRequest):
    u_lower = creds.username.strip().lower()
    is_master = any(m in u_lower for m in ["master", "admin"])
    chosen_role = creds.role or UserRole.SELLER

    if is_master:
        # Master account can authenticate as both seller and officer
        if chosen_role == UserRole.OFFICER:
            user_id = "GOV-OFF-9012"
            username = "master.officer"
            org_name = "Government Procurement Directorate (Ministry of Finance)"
            designation = "Chief Procurement Officer & Legal Scrutiny Authority"
            role = UserRole.OFFICER
        else:
            user_id = "SELLER-GJ-8841"
            username = "master.seller"
            org_name = "ABC Industries Pvt. Ltd."
            designation = "Primary Bidder & Compliance Head (Master Privilege)"
            role = UserRole.SELLER
    else:
        if chosen_role == UserRole.OFFICER or any(off in u_lower for off in ["officer", "gov-off", "ongc"]):
            user_id = creds.username if "gov-off" in u_lower else "GOV-OFF-9012"
            username = creds.username
            org_name = "Government Procurement Directorate (Ministry of Finance)"
            designation = "Legal Procurement Officer (GFR 2017 Rule 144)"
            role = UserRole.OFFICER
        elif chosen_role == UserRole.AUDITOR or "audit" in u_lower:
            user_id = "AUDIT-CAG-2026"
            username = creds.username
            org_name = "Comptroller & Auditor General Compliance Division"
            designation = "Statutory Oversight Auditor"
            role = UserRole.AUDITOR
        else:
            user_id = creds.username if "seller" in u_lower else "SELLER-GJ-8841"
            username = creds.username
            org_name = "ABC Industries Pvt. Ltd."
            designation = "Authorized Signatory (MSME Micro)"
            role = UserRole.SELLER

    token = f"gem_token_{role.value}_{user_id}"
    add_audit_log(
        user=user_id,
        role=role.value,
        action="USER_LOGIN_SUCCESS",
        details=f"User {username} (ID: {user_id}) authenticated as {role.value}. Master ID: {is_master}.",
        severity="INFO"
    )
    return AuthResponse(
        token=token,
        username=username,
        user_id=user_id,
        role=role,
        organization=org_name,
        designation=designation,
        is_master=is_master,
        message=f"Authenticated as {role.value.capitalize()} ({user_id})"
    )

# ----------------------------------------------------
# 3. Tenders & Bidders Management
# ----------------------------------------------------
@app.get("/api/tenders", response_model=List[Tender])
def list_tenders():
    return get_tenders()

@app.get("/api/tenders/{tender_ref}")
def get_tender(tender_ref: str):
    t = get_tender_by_ref(tender_ref)
    if not t:
        raise HTTPException(status_code=404, detail="Tender reference not found.")
    return t

@app.get("/api/bidders", response_model=List[Bidder])
def list_bidders():
    return get_bidders()

@app.get("/api/bidders/{bidder_id}")
def get_bidder(bidder_id: str):
    b = get_bidder_by_id(bidder_id)
    if not b:
        raise HTTPException(status_code=404, detail="Bidder not found.")
    return b

# ----------------------------------------------------
# 4. Layer 1 & 2: Data Ingestion & AI OCR Service
# ----------------------------------------------------
@app.post("/api/ocr/extract", response_model=DocumentOCRResult)
async def extract_document_ocr(file: UploadFile = File(...)):
    contents = await file.read()
    result = await AIOCRService.process_document(file.filename, contents)

    # Determine severity based on legitimacy and expiration
    severity = "SUCCESS"
    if not result.get("is_legit") or result.get("tampering_detected"):
        severity = "ERROR"
    elif result.get("is_expired") or result.get("validity_status") in ["EXPIRED", "SUSPENDED"]:
        severity = "WARNING"

    add_audit_log(
        user="SYSTEM_AI_OCR",
        role="system",
        action="AI_DOCUMENT_INGESTION_SCRUTINY",
        details=(
            f"Processed document '{file.filename}' ({result.get('document_type')}). "
            f"Legitimacy: {result.get('legitimacy_status')} ({result.get('legitimacy_score')}%), "
            f"Validity: {result.get('validity_status')} (Expired: {result.get('is_expired')})."
        ),
        severity=severity
    )
    return result

@app.get("/api/ocr/samples")
def get_sample_documents():
    """Return pre-configured sample document scenarios for testing legitimacy, expiration, and tampering."""
    return [
        {
            "id": "gst_valid",
            "name": "gst_reg06_active_valid.pdf",
            "label": "GST Certificate (Active Regular)",
            "icon": "📄",
            "expected_verdict": "LEGITIMATE & VALID",
            "description": "Active Regular GSTIN with up-to-date GSTR-3B filings (August 2026)."
        },
        {
            "id": "gst_cancelled",
            "name": "gst_reg06_cancelled_expired.pdf",
            "label": "GST Certificate (Suspended / Expired)",
            "icon": "⚠️",
            "expected_verdict": "EXPIRED / SUSPENDED",
            "description": "Suspended under CGST Sec 29(2) due to >6 months non-filing of returns."
        },
        {
            "id": "pan_valid",
            "name": "pan_corporate_card.pdf",
            "label": "PAN Card (Operative)",
            "icon": "💳",
            "expected_verdict": "LEGITIMATE & PERPETUAL",
            "description": "Operative Company PAN (AAACB1234F) verified with CBDT."
        },
        {
            "id": "pan_fake",
            "name": "pan_fake_forged.pdf",
            "label": "PAN Card (Forged / Cut-and-Paste)",
            "icon": "🚫",
            "expected_verdict": "FORGED & TAMPERED",
            "description": "Font mismatch and non-existent PAN in Income Tax database."
        },
        {
            "id": "iso_expired",
            "name": "iso_9001_quality_expired.pdf",
            "label": "ISO 9001:2015 (Expired 2025)",
            "icon": "⏳",
            "expected_verdict": "EXPIRED (600+ Days)",
            "description": "Accredited TUV cert, but validity lapsed on 15-Jan-2025."
        },
        {
            "id": "ca_turnover",
            "name": "ca_audited_turnover_udin.pdf",
            "label": "CA Turnover & Net Worth (₹125L)",
            "icon": "📊",
            "expected_verdict": "LEGITIMATE & VALID",
            "description": "Valid ICAI UDIN for FY 2024-25 compliance."
        },
        {
            "id": "udyam_msme",
            "name": "udyam_msme_registration.pdf",
            "label": "Udyam MSME Certificate",
            "icon": "🏭",
            "expected_verdict": "LEGITIMATE & PERPETUAL",
            "description": "Active Micro Enterprise registration on Ministry of MSME portal."
        }
    ]

# ----------------------------------------------------
# 5. Layer 3: Statutory Verification Engine Connectors
# ----------------------------------------------------
@app.get("/api/verify/gst")
def verify_gst(gstin: str = Query(..., description="15-digit GSTIN")):
    res = StatutoryVerificationEngine.verify_gst(gstin)
    add_audit_log(
        user="SYSTEM_CONNECTOR",
        role="system",
        action="GST_PORTAL_QUERY",
        details=f"Queried GSTN Common Portal for GSTIN {gstin}. Status: {res.get('status_code')}.",
        severity="SUCCESS" if res.get("verified") else "WARNING"
    )
    return res

@app.get("/api/verify/pan")
def verify_pan(pan: str = Query(..., description="10-digit PAN")):
    res = StatutoryVerificationEngine.verify_pan(pan)
    return res

@app.get("/api/verify/udyam")
def verify_udyam(udyam_no: str = Query(..., description="Udyam Registration Number")):
    res = StatutoryVerificationEngine.verify_udyam(udyam_no)
    return res

@app.get("/api/verify/mca")
def verify_mca(cin: str = Query(..., description="Corporate Identification Number")):
    res = StatutoryVerificationEngine.verify_mca(cin)
    return res

# ----------------------------------------------------
# 6. Layers 4, 5, 6: Compliance Evaluation Pipeline
# ----------------------------------------------------
@app.post("/api/compliance/evaluate", response_model=ComplianceReport)
def evaluate_compliance(tender_ref: str = Query(...), bidder_id: str = Query(...)):
    tender = get_tender_by_ref(tender_ref)
    if not tender:
        raise HTTPException(status_code=404, detail="Tender not found.")

    bidder = get_bidder_by_id(bidder_id)
    if not bidder:
        raise HTTPException(status_code=404, detail="Bidder not found.")

    # Ingest document data or mock current active profile
    mock_ocr = {
        "filename": "gst_and_turnover_certificates.pdf",
        "tampering_detected": False,
        "seal_verified": True
    }

    # Evaluate Rules Engine (Layer 4)
    rules = ComplianceRulesEngine.evaluate_all(tender, bidder, mock_ocr)

    # Compute Risk & Scoring Engine with Explainable Output (Layers 5 & 6)
    report = RiskAndScoringEngine.compute_report(tender, bidder, rules)

    # Persist in DB
    save_compliance_report(tender_ref, bidder_id, report.model_dump())

    # Log to Audit Trail
    add_audit_log(
        user="SYSTEM_RULES_ENGINE",
        role="system",
        action="COMPLIANCE_EVALUATION_COMPLETED",
        tender_ref=tender_ref,
        bidder_name=bidder["legal_name"],
        details=f"Computed Score: {report.readiness_score}% ({report.risk_tier.value}). AI Recommendation: {report.ai_recommendation.value}.",
        severity="SUCCESS" if report.readiness_score >= 85 else "WARNING"
    )

    return report

@app.get("/api/compliance/report")
def get_existing_report(tender_ref: str = Query(...), bidder_id: str = Query(...)):
    report = get_compliance_report(tender_ref, bidder_id)
    if not report:
        # Fallback to evaluating fresh
        return evaluate_compliance(tender_ref=tender_ref, bidder_id=bidder_id)
    return report

# ----------------------------------------------------
# 7. Discrepancy Resolution Workflow (Self-Service)
# ----------------------------------------------------
@app.post("/api/compliance/resolve-discrepancy")
def resolve_discrepancy(payload: DiscrepancyResolveRequest):
    bidder = get_bidder_by_id(payload.bidder_id)
    if not bidder:
        raise HTTPException(status_code=404, detail="Bidder not found.")

    updates: Dict[str, Any] = {}
    if payload.field_to_resolve == "turnover":
        try:
            updates["declared_turnover_lakhs"] = float(payload.updated_value)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid turnover numeric value.")
    elif payload.field_to_resolve == "mii_percentage":
        try:
            updates["mii_percentage"] = float(payload.updated_value)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid MII percentage numeric value.")
    elif payload.field_to_resolve == "gstin":
        updates["gstin"] = payload.updated_value
    elif payload.field_to_resolve == "pan":
        updates["pan"] = payload.updated_value

    updated_bidder = update_bidder(payload.bidder_id, updates)

    # Re-evaluate compliance
    fresh_report = evaluate_compliance(payload.tender_ref, payload.bidder_id)

    add_audit_log(
        user=bidder.get("legal_name", payload.bidder_id),
        role="seller",
        action="DISCREPANCY_RESOLVED",
        tender_ref=payload.tender_ref,
        bidder_name=bidder.get("legal_name"),
        details=f"Seller updated {payload.field_to_resolve} to '{payload.updated_value}'. Justification: {payload.justification}. New Score: {fresh_report.readiness_score}%.",
        severity="SUCCESS"
    )

    return {
        "status": "success",
        "message": "Discrepancy rectified and verified successfully.",
        "updated_bidder": updated_bidder,
        "fresh_report": fresh_report
    }

# ----------------------------------------------------
# 8. Layer 7: Procurement Officer Scrutiny & Decisions
# ----------------------------------------------------
@app.post("/api/officer/decision")
def record_officer_decision(payload: OfficerDecisionRequest):
    decision_record = {
        "tender_ref": payload.tender_ref,
        "bidder_id": payload.bidder_id,
        "decision": payload.decision,
        "officer_id": payload.officer_id,
        "officer_name": payload.officer_name,
        "remarks": payload.remarks
    }
    save_officer_decision(payload.tender_ref, payload.bidder_id, decision_record)
    return {
        "status": "success",
        "message": f"Officer decision '{payload.decision}' recorded successfully.",
        "record": decision_record
    }

# ----------------------------------------------------
# 9. Auditability: Immutable Logs
# ----------------------------------------------------
@app.get("/api/audit/logs", response_model=List[AuditLogEntry])
def fetch_audit_logs(limit: int = 50):
    return get_audit_logs(limit=limit)

# ----------------------------------------------------
# 10. GeM Marketplace Products Catalog
# ----------------------------------------------------
CATALOG_PRODUCTS = [
    {
        "id": "prod-001",
        "title": "High-Pressure Forged Steel Industrial Gate Valve 4-Inch (Class 300)",
        "category": "Industrial & Mechanical",
        "sub_category": "Valves & Piping",
        "price": 28500.0,
        "seller_name": "ABC Industries Pvt. Ltd.",
        "seller_id": "bid-001",
        "mii_percentage": 78.5,
        "mii_class": "Class-I Local Supplier",
        "msme_verified": True,
        "gst_status": "Active Regular",
        "rating": 4.9,
        "reviews_count": 142,
        "image_icon": "⚙️",
        "specs": {
            "Material": "Forged Carbon Steel ASTM A105",
            "Pressure Rating": "Class 300",
            "End Connection": "Flanged ANSI B16.5",
            "Warranty": "24 Months"
        },
        "tender_eligible": True,
        "available_qty": 450
    },
    {
        "id": "prod-002",
        "title": "Medical Grade Compressed Oxygen Cylinder Type D (46.7L Water Capacity)",
        "category": "Medical & Healthcare",
        "sub_category": "Oxygen Gas & Accessories",
        "price": 14200.0,
        "seller_name": "ABC Industries Pvt. Ltd.",
        "seller_id": "bid-001",
        "mii_percentage": 85.0,
        "mii_class": "Class-I Local Supplier",
        "msme_verified": True,
        "gst_status": "Active Regular",
        "rating": 4.95,
        "reviews_count": 310,
        "image_icon": "🧪",
        "specs": {
            "Standard": "IS:7285 Part 2 Certified",
            "Working Pressure": "150 bar",
            "Valve Type": "Pin Index Bullnose",
            "Tare Weight": "52 kg approx"
        },
        "tender_eligible": True,
        "available_qty": 1200
    },
    {
        "id": "prod-003",
        "title": "Commercial Desktop Workstation Intel Core i7 16GB 512GB SSD Windows 11 Pro",
        "category": "IT & Electronics",
        "sub_category": "Computers & Peripherals",
        "price": 68900.0,
        "seller_name": "Zenith Global Tech Infra Ltd.",
        "seller_id": "bid-002",
        "mii_percentage": 42.0,
        "mii_class": "Class-II Local Supplier",
        "msme_verified": False,
        "gst_status": "Active Regular",
        "rating": 4.4,
        "reviews_count": 89,
        "image_icon": "🖥️",
        "specs": {
            "Processor": "Intel Core i7-13700 13th Gen",
            "Memory": "16GB DDR5 4800MHz",
            "Storage": "512GB NVMe PCIe Gen 4 SSD",
            "Display": "23.8-inch FHD IPS Included"
        },
        "tender_eligible": False,
        "available_qty": 200
    },
    {
        "id": "prod-004",
        "title": "ABC Stored Pressure Dry Chemical Powder Fire Extinguisher 6kg (IS:15683)",
        "category": "Safety & Security",
        "sub_category": "Fire Safety",
        "price": 3150.0,
        "seller_name": "Bharat Precision Instruments",
        "seller_id": "bid-003",
        "mii_percentage": 92.0,
        "mii_class": "Class-I Local Supplier",
        "msme_verified": True,
        "gst_status": "Flagged / Non-Compliant",
        "rating": 4.6,
        "reviews_count": 64,
        "image_icon": "🧯",
        "specs": {
            "Extinguishing Agent": "Mono Ammonium Phosphate 50%",
            "Capacity": "6 Kg",
            "Discharge Range": "> 4 Meters",
            "Certifications": "BIS / ISI Marked"
        },
        "tender_eligible": False,
        "available_qty": 800
    },
    {
        "id": "prod-005",
        "title": "Ergonomic High-Back Executive Mesh Revolving Office Chair with Lumbar Support",
        "category": "Furniture & Office",
        "sub_category": "Office Seating",
        "price": 8950.0,
        "seller_name": "ABC Industries Pvt. Ltd.",
        "seller_id": "bid-001",
        "mii_percentage": 82.0,
        "mii_class": "Class-I Local Supplier",
        "msme_verified": True,
        "gst_status": "Active Regular",
        "rating": 4.8,
        "reviews_count": 178,
        "image_icon": "🪑",
        "specs": {
            "Frame": "Reinforced Nylon & Breathable Mesh",
            "Mechanism": "Synchro-Tilt Multi-Lock",
            "Gas Lift": "Class 4 BIFMA Certified",
            "Base": "Heavy-duty Die-cast Aluminum"
        },
        "tender_eligible": True,
        "available_qty": 350
    },
    {
        "id": "prod-006",
        "title": "Fully Automatic Digital Upper Arm Blood Pressure Monitor with Arrhythmia Detection",
        "category": "Medical & Healthcare",
        "sub_category": "Medical Devices",
        "price": 2490.0,
        "seller_name": "ABC Industries Pvt. Ltd.",
        "seller_id": "bid-001",
        "mii_percentage": 68.0,
        "mii_class": "Class-I Local Supplier",
        "msme_verified": True,
        "gst_status": "Active Regular",
        "rating": 4.85,
        "reviews_count": 420,
        "image_icon": "🩺",
        "specs": {
            "Measurement Method": "Oscillometric",
            "Memory Capacity": "2 x 90 Sets with Date & Time",
            "Cuff Circumference": "22-42 cm Universal Fit",
            "Power Source": "Dual Battery & USB Type-C"
        },
        "tender_eligible": True,
        "available_qty": 950
    }
]

@app.get("/api/products")
def list_products(category: Optional[str] = None, q: Optional[str] = None):
    results = CATALOG_PRODUCTS
    if category and category.lower() != "all":
        results = [p for p in results if category.lower() in p["category"].lower() or category.lower() in p["sub_category"].lower()]
    if q:
        query_str = q.lower()
        results = [p for p in results if query_str in p["title"].lower() or query_str in p["seller_name"].lower() or query_str in p["category"].lower()]
    return results

# ----------------------------------------------------
# 11. SIH26100 AI Compliance Assistant (Ask GeMMy)
# ----------------------------------------------------
class AIChatRequest(Dict[str, Any]):
    message: str
    role: Optional[str] = "general"
    context: Optional[Dict[str, Any]] = None

@app.post("/api/ai/chat")
async def ai_chat_assistant(payload: Dict[str, Any]):
    user_msg = payload.get("message", "").strip()
    user_role = payload.get("role", "general")
    user_context = payload.get("context", None)

    # 1. Tier 1: Instant Direct Statutory Domain Engine (< 5ms Latency)
    direct_match = StatutoryDomainEngine.find_direct_answer(user_msg, user_role)
    if direct_match:
        add_audit_log(
            user=payload.get("user", "ANONYMOUS_USER"),
            role=user_role,
            action="STATUTORY_AI_QUERY",
            details=f"User queried: '{user_msg[:60]}...'. Answered instantly by Statutory Domain Engine.",
            severity="INFO"
        )
        return direct_match

    # 2. Tier 2: Query Local On-Premise LLM with strict 10s timeout
    local_ai_result = await LocalAIService.generate_response(user_msg, user_role, user_context, timeout_seconds=10.0)
    if local_ai_result:
        add_audit_log(
            user=payload.get("user", "ANONYMOUS_USER"),
            role=user_role,
            action="LOCAL_AI_ASSISTANT_QUERY",
            details=f"User queried: '{user_msg[:60]}...'. Response generated by local LLM {local_ai_result.get('model')}.",
            severity="INFO"
        )
        return local_ai_result

    # 3. Tier 3: RAG Retrieval Synthesizer Fallback (< 5ms Latency)
    rag_chunks = GeMRAGRetriever.retrieve(user_msg, top_k=2)
    if rag_chunks:
        primary_chunk = rag_chunks[0]
        reply = (
            f"**{primary_chunk['title']}**:\n\n"
            f"{primary_chunk['content']}\n\n"
            f"*(Source: Sovereign GeM Compliance & Statutory Verification Regulations)*"
        )
        suggested_actions = LocalAIService._generate_suggested_actions(user_msg, reply)
        add_audit_log(
            user=payload.get("user", "ANONYMOUS_USER"),
            role=user_role,
            action="RAG_SYNTHESIZER_QUERY",
            details=f"User queried: '{user_msg[:60]}...'. Synthesized from RAG rule {primary_chunk.get('id')}.",
            severity="INFO"
        )
        return {
            "reply": reply,
            "suggested_actions": suggested_actions,
            "model": "GeMMy Live Assistant",
            "is_local_ai": False
        }

    # 4. General Default Response
    reply = (
        f"Hello! I am **GeMMy**, the official AI Statutory Compliance Assistant for the Government e-Marketplace.\n\n"
        f"I can help you with:\n"
        f"• **Statutory Compliance Rules**: Verifying GSTIN status rules, PAN validation, and Udyam MSME exemptions.\n"
        f"• **Profile & Onboarding**: Resolving automated rejections during seller profile creation.\n"
        f"• **Procurement Policies**: Guidance on GFR 2017, Rule 144(xi), and Class-I/II Make-in-India guidelines.\n"
        f"• **Document Scrutiny**: Directing you to our secure, authenticated DocScrutiny AI Desk for document inspection.\n"
        f"• **Live Gazette Updates**: Real-time procurement circulars and Office Memorandums.\n\n"
        f"Try asking: *'What causes automated rejection during profile creation?'*, *'Explain GFR Rule 144(xi)'*, or *'How does Make in India (MII) preference work?'*."
    )
    suggested_actions = [
        {"label": "🌐 Latest Gazette & OMs", "action": "query_latest_updates"},
        {"label": "❌ Profile Rejection Causes", "action": "query_profile_rejection"},
        {"label": "🏛️ Explain GFR Rule 144(xi)", "action": "query_rule144"},
        {"label": "📄 Open DocScrutiny AI Desk", "action": "open_ocr_desk"}
    ]

    add_audit_log(
        user=payload.get("user", "ANONYMOUS_USER"),
        role=user_role,
        action="AI_ASSISTANT_QUERY",
        details=f"User queried: '{user_msg[:60]}...'. Response generated by GeMMy AI Assistant.",
        severity="INFO"
    )
    
    return {
        "reply": reply,
        "suggested_actions": suggested_actions,
        "model": "GeMMy Live Assistant",
        "is_local_ai": False
    }

# ----------------------------------------------------
# 12. Dedicated Multi-Tenant Document Scrutiny AI
# ----------------------------------------------------
@app.post("/api/documents/scrutiny-chat", response_model=DocumentChatResponse)
async def document_scrutiny_chat(req: DocumentChatRequest):
    """
    Dedicated Multi-Tenant Document Scrutiny & Comparative Bid Evaluation AI.
    - Answers questions on active document validity, expiry, and flags.
    - Provides comparative technical bid analysis across competitors (MII %, turnover, L1 ranking).
    - Enforces DPDP Act 2023 redaction: Strictly blocks competitor private tax/PAN documents.
    """
    user_org = req.organization or "ABC Industries Pvt. Ltd."
    user_role_str = req.role.value if req.role else "seller"
    user_id = req.user_id or ("GOV-OFF-9012" if user_role_str == "officer" else "SELLER_GJ_8841")

    res = DocumentScrutinyAIService.answer_document_query(
        question=req.question,
        active_document=req.active_document,
        user_org=user_org,
        user_role=user_role_str,
        user_id=user_id,
        target_org=req.target_org
    )

    if user_role_str == "officer":
        action = "OFFICER_LEGAL_SCRUTINY_AUDIT"
        severity = "INFO"
    elif "COMPETITOR_DOCUMENT_ACCESS_PROHIBITED" in res.get("flags_detected", []):
        action = "SELLER_CROSS_TENANT_BLOCKED"
        severity = "WARNING"
    else:
        action = "DOCUMENT_SCRUTINY_AI_QUERY"
        severity = "INFO"

    add_audit_log(
        user=user_id,
        role=user_role_str,
        action=action,
        details=(
            f"DocScrutiny AI query by {user_role_str.upper()}: '{req.question[:60]}...' on doc '{res.get('document_name')}'. "
            f"Verdict: {res.get('validity_verdict')}. Flags: {res.get('flags_detected')}."
        ),
        severity=severity
    )
    return res

# ----------------------------------------------------
# 13. Live Internet Sovereign Gazette & News Feed
# ----------------------------------------------------
@app.get("/api/ai/live-updates", response_model=LiveWebUpdateResponse)
async def get_live_gem_updates(query: str = Query(default="")):
    """
    Real-time Internet Connected updates feed for GeMMy AI.
    Fetches live notifications, circulars, and Ministry of Finance gazettes.
    """
    return await LiveGeMWebSearchService.fetch_live_updates(query)

# ----------------------------------------------------
# 14. Production Static Frontend SPA Mounting
# ----------------------------------------------------
import os
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

FRONTEND_DIST_DIRS = [
    os.path.abspath(os.path.join(os.path.dirname(__file__), "../../frontend/dist")),
    os.path.abspath(os.path.join(os.getcwd(), "frontend/dist")),
    os.path.abspath("dist"),
]

FRONTEND_DIST = next((d for d in FRONTEND_DIST_DIRS if os.path.exists(d) and os.path.isdir(d)), None)

if FRONTEND_DIST:
    assets_dir = os.path.join(FRONTEND_DIST, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        if full_path.startswith("api") or full_path.startswith("docs") or full_path.startswith("openapi.json"):
            raise HTTPException(status_code=404, detail="API endpoint not found")
        target_file = os.path.join(FRONTEND_DIST, full_path)
        if full_path and os.path.isfile(target_file):
            return FileResponse(target_file)
        index_file = os.path.join(FRONTEND_DIST, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
        raise HTTPException(status_code=404, detail="Frontend build index.html not found")
else:
    @app.get("/")
    def read_root():
        return {
            "status": "online",
            "system": "GeM AI Compliance Engine (Code Catalyst SIH26100)",
            "version": "2.5.0",
            "documentation": "/docs"
        }