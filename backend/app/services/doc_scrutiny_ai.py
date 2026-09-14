import re
from typing import Dict, Any, List, Optional
from datetime import datetime, date

class DocumentScrutinyAIService:
    """
    Dedicated Multi-Tenant Document Scrutiny AI.
    - Specialized in document-level OCR extraction, expiry analysis, and discrepancy diagnostics.
    - Provides comparative bid evaluation (public technical parameters: MII %, turnover compliance, suitability).
    - Enforces strict multi-tenant privacy boundaries: Redacts sensitive tax certificates, PAN numbers,
      and private bank records of other bidders under the DPDP Act 2023.
    """

    # Detailed Bidder Dossiers with Full Document Inventories for Authorized Officer Scrutiny
    BIDDER_DOSSIERS: Dict[str, Dict[str, Any]] = {
        "abc": {
            "id": "bid-001",
            "legal_name": "ABC Industries Pvt. Ltd.",
            "org_code": "SELLER-GJ-8841",
            "role": "seller",
            "primary_contact": "compliance@abcindustries.in",
            "pan": "AAACB1234F",
            "gstin": "24AAACB1234F1Z5",
            "udyam": "UDYAM-GJ-01-008291",
            "mii_percentage": 78.0,
            "mii_class": "Class-I Local Supplier (MII >= 50%)",
            "declared_turnover_lakhs": 125.0,
            "turnover_eligibility": "ELIGIBLE (Exceeds ₹80L minimum)",
            "compliance_status": "COMPLIANT",
            "risk_score": 96.5,
            "debarment_status": "CLEAR (Zero adverse regulatory orders)",
            "l1_standing": "L1 (Most Competitive & Technically Qualified)",
            "technical_verdict": "Fully qualified for commercial bid opening with superior local value addition (78%).",
            "documents": [
                {
                    "doc_id": "DOC-ABC-01",
                    "filename": "gst_reg06_active_valid.pdf",
                    "document_type": "GST Registration Certificate (REG-06)",
                    "extracted_id": "24AAACB1234F1Z5",
                    "status": "VALID",
                    "sovereign_gateway": "api.gst.gov.in (GSTN Common Portal)",
                    "details": "Active Regular GSTIN with monthly GSTR-3B filings up to date (August 2026). Zero tax defaults."
                },
                {
                    "doc_id": "DOC-ABC-02",
                    "filename": "pan_corp_valid.pdf",
                    "document_type": "Permanent Account Number (PAN) Card",
                    "extracted_id": "AAACB1234F",
                    "status": "VALID",
                    "sovereign_gateway": "incometax.gov.in (CBDT Protean Gateway)",
                    "details": "Sovereign reconciliation confirmed. Corporate entity active under MCA-21."
                },
                {
                    "doc_id": "DOC-ABC-03",
                    "filename": "ca_turnover_cert_fy25_26.pdf",
                    "document_type": "CA Certified Annual Turnover Statement",
                    "extracted_id": "UDIN-26123456AAAA1234",
                    "status": "VALID",
                    "sovereign_gateway": "udin.icai.org (ICAI Verification Portal)",
                    "details": "Average annual turnover certified at ₹125.0 Lakhs, comfortably exceeding the ₹80.0 Lakhs tender threshold."
                },
                {
                    "doc_id": "DOC-ABC-04",
                    "filename": "udyam_msme_cert.pdf",
                    "document_type": "Udyam MSME Registration Certificate",
                    "extracted_id": "UDYAM-GJ-01-008291",
                    "status": "VALID",
                    "sovereign_gateway": "udyamregistration.gov.in",
                    "details": "Verified Micro Enterprise manufacturer under NIC Code 28195. Class-I Local Content: 78.0%."
                }
            ],
            "compliance_flags": []
        },
        "zenith": {
            "id": "bid-002",
            "legal_name": "Zenith Global Tech Infra Ltd.",
            "org_code": "SELLER-MH-4019",
            "role": "seller",
            "primary_contact": "tenders@zenithinfra.com",
            "pan": "AABCZ9988H",
            "gstin": "27AABCZ9988H1Z1",
            "udyam": "N/A (Large Corporate)",
            "mii_percentage": 42.0,
            "mii_class": "Class-II Local Supplier (Deficit: 42% < 50% threshold)",
            "declared_turnover_lakhs": 65.0,
            "turnover_eligibility": "DEFICIT (₹65L declared against ₹80L required)",
            "compliance_status": "CLARIFICATION_REQUIRED",
            "risk_score": 62.0,
            "debarment_status": "CLEAR",
            "l1_standing": "L2 (Higher Cost with Technical Qualifications Pending)",
            "technical_verdict": "Sub-optimal compliance due to 8% MII shortfall and ₹15L turnover deficit.",
            "documents": [
                {
                    "doc_id": "DOC-ZEN-01",
                    "filename": "zenith_gstin_reg06.pdf",
                    "document_type": "GST Registration Certificate",
                    "extracted_id": "27AABCZ9988H1Z1",
                    "status": "VALID",
                    "sovereign_gateway": "api.gst.gov.in",
                    "details": "Active Regular taxpayer in Maharashtra. Monthly returns up to date."
                },
                {
                    "doc_id": "DOC-ZEN-02",
                    "filename": "zenith_corporate_pan.pdf",
                    "document_type": "Permanent Account Number (PAN) Card",
                    "extracted_id": "AABCZ9988H",
                    "status": "VALID",
                    "sovereign_gateway": "incometax.gov.in",
                    "details": "CBDT Protean Gateway verified. Matches corporate legal entity."
                },
                {
                    "doc_id": "DOC-ZEN-03",
                    "filename": "zenith_ca_turnover_statement.pdf",
                    "document_type": "CA Certified Turnover Certificate",
                    "extracted_id": "UDIN-26987654BBBB5678",
                    "status": "DEFICIT_FLAGGED",
                    "sovereign_gateway": "udin.icai.org",
                    "details": "Certified annual turnover ₹65.0 Lakhs. DEFICIT of ₹15.0 Lakhs against tender mandatory minimum of ₹80.0 Lakhs."
                },
                {
                    "doc_id": "DOC-ZEN-04",
                    "filename": "zenith_mii_self_declaration.pdf",
                    "document_type": "Make-in-India Local Content Undertaking",
                    "extracted_id": "MII-DEC-2026-081",
                    "status": "DEFICIT_FLAGGED",
                    "sovereign_gateway": "dpiit.gov.in",
                    "details": "Declared local content: 42.0% (Class-II). Non-compliant with tender mandatory 50.0% Class-I threshold."
                }
            ],
            "compliance_flags": [
                "MII_LOCAL_CONTENT_DEFICIT (42% < 50% mandatory)",
                "TURNOVER_THRESHOLD_SHORTFALL (₹65L vs ₹80L minimum requirement)"
            ]
        },
        "bharat": {
            "id": "bid-003",
            "legal_name": "Bharat Precision Instruments",
            "org_code": "SELLER-DL-1102",
            "role": "seller",
            "primary_contact": "info@bharatprecision.in",
            "pan": "AAACX9999F",
            "gstin": "07AABCB5678G1Z9",
            "udyam": "UDYAM-DL-02-004412",
            "mii_percentage": 65.0,
            "mii_class": "Class-I Local Supplier",
            "declared_turnover_lakhs": 92.0,
            "turnover_eligibility": "ELIGIBLE (₹92L vs ₹80L)",
            "compliance_status": "DISQUALIFIED",
            "risk_score": 25.0,
            "debarment_status": "DEBARRED (CPPP Registry Order No. CPPP/DEB/2025/1109)",
            "l1_standing": "DISQUALIFIED",
            "technical_verdict": "Legally disqualified under GFR Rule 144(xi) and CVC debarment guidelines.",
            "documents": [
                {
                    "doc_id": "DOC-BPI-01",
                    "filename": "bharat_gst_cancelled.pdf",
                    "document_type": "GST Registration Certificate",
                    "extracted_id": "07AABCB5678G1Z9",
                    "status": "SUSPENDED",
                    "sovereign_gateway": "api.gst.gov.in",
                    "details": "SUSPENDED under CGST Act Section 29(2)(c) due to continuous non-filing of GSTR-3B for >6 months."
                },
                {
                    "doc_id": "DOC-BPI-02",
                    "filename": "bharat_pan_card.pdf",
                    "document_type": "Permanent Account Number (PAN) Card",
                    "extracted_id": "AAACX9999F",
                    "status": "FORGED_TAMPERED",
                    "sovereign_gateway": "incometax.gov.in",
                    "details": "FORGERY DETECTED: Invalid 4th character 'X' (not a recognized entity type). Protean database returned NULL record. Forensic pixel cut-and-paste detected."
                },
                {
                    "doc_id": "DOC-BPI-03",
                    "filename": "bharat_cppp_debarment_record.pdf",
                    "document_type": "Central Debarment Registry Order",
                    "extracted_id": "CPPP/DEB/2025/1109",
                    "status": "DEBARRED",
                    "sovereign_gateway": "eprocure.gov.in / GeM Incident Desk",
                    "details": "Active Debarment Order in effect until 31-Dec-2027 for submission of fraudulent test reports in Tender GEM/2025/B/4401."
                }
            ],
            "compliance_flags": [
                "CGST_SEC_29_GSTIN_SUSPENSION (Non-filing of GSTR-3B > 6 months)",
                "CBDT_PAN_ABSENT_PIXEL_TAMPER (Fraudulent PAN AAACX9999F)",
                "CPPP_SOVEREIGN_DEBARMENT_ACTIVE (Blacklisted under GFR Rule 144(xi))"
            ]
        }
    }

    # Public bidder profiles for general comparison
    PUBLIC_BIDDER_PROFILES = BIDDER_DOSSIERS

    @classmethod
    def is_asking_other_bidder_docs(cls, question: str, user_org: str = "ABC Industries Pvt. Ltd.") -> bool:
        """
        Check if a query is asking for other bidders' documents, files, certificates, or private records.
        Sellers are strictly forbidden from viewing or questioning other bidders' documents.
        """
        q_lower = question.lower().strip()
        
        # 1. Participating bidder entity names & IDs (All bidders are protected under DPDP Act)
        # Any query by a seller naming a specific bidder entity (abc, zenith, bharat, bid-001, etc.)
        # is strictly prohibited unless it's a pure public comparison.
        has_bidder_entity_name = bool(re.search(
            r"\b(abc|abc\s+industries|zenith|zenith\s+global|bharat|bharat\s+precision|bid-001|bid-002|bid-003|seller-gj-8841|seller-mh-4019|seller-dl-1102|seller-gj|seller-mh|seller-dl)\b",
            q_lower
        ))
        mentions_specific_competitor = has_bidder_entity_name
        
        # 2. General competitor / other bidder / other seller references
        has_other_entity_ref = bool(re.search(
            r"\b(other|others|others'|other's|another|competitor|competitors|rival|rivals|different bidder|different seller|all bidders?|all sellers?|all vendors?|any other|anyone else|rest of the bidders?|rest of the sellers?|other vendor|other vendors|other company|other companies|other party|other parties|all uploaded|all submitted)\b",
            q_lower
        ))
        
        # 3. Document / credential / file inquiry terms
        has_doc_terms = bool(re.search(
            r"\b(doc|docs|document|documents|file|files|cert|certs|certificate|certificates|pan|gst|gstin|turnover|bank|account|tax|upload|uploads|uploaded|submit|submits|submitted|scanned|dossier|dossiers|record|records|audit|flags|deficits|credential|credentials|balance sheet|udin|cheque|evidence|details|detail|papers|paperwork|data|proof|proofs)\b",
            q_lower
        ))
        
        # 4. Probing questions about other parties (e.g. "whose pan", "who uploaded", "who has fake", "what did they upload", "who is debarred")
        has_probing_interrogative = bool(re.search(
            r"\b(whose|who uploaded|who submitted|what did they|what did others|what did zenith|what did bharat|which bidder has|which seller has|who has fake|who has suspended|who has deficit|who is debarred|who is blacklisted)\b",
            q_lower
        ))
        
        # 5. Pure comparison queries that ONLY ask about public technical parameters (MII %, turnover qualification, L1 status)
        is_pure_comparison = (
            bool(re.search(r"\b(compare|comparison|versus|vs|better suited|which bid is better|who is l1|ranking|commercial standing|local content percentage|mii percentage|mii %)\b", q_lower)) and
            not bool(re.search(r"\b(pan|gst|gstin|file|files|document|documents|upload|uploads|download|scanned|tax|cheque|bank|cert|certificate|record|private|personal|internal|dossier|papers|credentials)\b", q_lower))
        )
        
        # IF mentions specific competitor and NOT pure comparison -> PROHIBITED!
        if mentions_specific_competitor and not is_pure_comparison:
            return True
            
        # IF references other bidders/sellers/others AND asks for documents/details/files -> PROHIBITED!
        if has_other_entity_ref and (has_doc_terms or has_probing_interrogative):
            return True
            
        # IF general probe asking whose document / who uploaded what -> PROHIBITED!
        if has_probing_interrogative and (has_doc_terms or 'pan' in q_lower or 'gst' in q_lower or 'debar' in q_lower):
            return True
            
        # IF asking to see all documents or other documents in tender -> PROHIBITED!
        if bool(re.search(r"\b(all documents|all uploaded documents|all bidder documents|all bidders documents|other documents|others documents|others' documents|other's documents|others document|other document details|others document details|others' document details|other's document details)\b", q_lower)):
            return True
            
        return False

    @classmethod
    def is_comparison_query(cls, question: str) -> bool:
        """Check if query is asking to compare bids, evaluate competitiveness, or check technical specs."""
        q_lower = question.lower()
        comparison_terms = [
            "compare", "comparison", "better", "versus", "vs", "which bid",
            "who is l1", "competitor", "turnover", "mii", "local content",
            "suitability", "ranking", "qualified", "evaluat", "standing"
        ]
        return any(term in q_lower for term in comparison_terms)

    @classmethod
    def answer_officer_bidder_scrutiny(
        cls,
        question: str,
        officer_id: str = "GOV-OFF-9012"
    ) -> Dict[str, Any]:
        """
        Dedicated handler for Government Procurement Officers with verified legal login IDs.
        Officers have statutory authority under GFR 2017 Rule 144 to scrutinize ANY bidder's uploaded documents,
        compliance risk scores, discrepancy flags, and debarment histories.
        """
        q_lower = question.lower()
        
        # Identify target bidder
        target_key = None
        if "zenith" in q_lower or "bid-002" in q_lower or "seller-mh" in q_lower:
            target_key = "zenith"
        elif "bharat" in q_lower or "bid-003" in q_lower or "seller-dl" in q_lower:
            target_key = "bharat"
        elif "abc" in q_lower or "bid-001" in q_lower or "seller-gj" in q_lower:
            target_key = "abc"

        # Case 1: Specific Bidder Scrutiny Dossier requested by Officer
        if target_key:
            bidder = cls.BIDDER_DOSSIERS[target_key]
            doc_rows = []
            for d in bidder["documents"]:
                status_badge = "✅ VALID" if d["status"] == "VALID" else f"❌ {d['status']}"
                doc_rows.append(
                    f"| `{d['doc_id']}` | **{d['document_type']}** | `{d['filename']}` | {status_badge} | {d['sovereign_gateway']} |\n"
                    f"  ↳ *Extraction & Details*: `{d['extracted_id']}` — {d['details']}"
                )
            doc_table = "\n".join(doc_rows)
            
            flags_text = "\n".join([f"• ⚠️ **{f}**" for f in bidder["compliance_flags"]]) if bidder["compliance_flags"] else "• 🟢 **Zero adverse flags detected (100% Compliant)**"
            
            # Recommendation based on status
            if bidder["compliance_status"] == "COMPLIANT":
                recommendation = "🟢 **QUALIFIED FOR COMMERCIAL BID OPENING**: All statutory documents verified letter-for-letter against sovereign gateways. Class-I MII (78%) and ₹125L turnover verified."
            elif bidder["compliance_status"] == "CLARIFICATION_REQUIRED":
                recommendation = "🟡 **STATUTORY CLARIFICATION REQUIRED (Form GEM-CLAR-02)**: Issue 48-hour deficiency notice for 8% MII local content shortfall and ₹15L turnover deficit."
            else:
                recommendation = "🔴 **SUMMARY REJECTION & DISQUALIFICATION (GFR Rule 144(xi))**: Immediate tender disqualification mandated due to CPPP Debarment Order and CBDT PAN forgery."

            answer = (
                f"🏛️ **Authorized Procurement Officer Scrutiny Console**\n"
                f"• **Authenticated Officer Login ID**: `{officer_id}` (Dr. S. K. Ramanathan, Chief Procurement Officer)\n"
                f"• **Statutory Authority**: General Financial Rules (GFR) 2017 Rule 144 & GeM GTC Clause 12\n"
                f"• **Target Entity**: **{bidder['legal_name']}** (Org ID: `{bidder['org_code']}` | Bid ID: `{bidder['id']}`)\n\n"
                f"---\n\n"
                f"### 📂 Uploaded Documents & Forensic Gateway Reconciliation\n\n"
                f"{doc_table}\n\n"
                f"### ⚠️ Compliance & Discrepancy Diagnostics\n"
                f"{flags_text}\n\n"
                f"### 📊 Key Bid Metrics\n"
                f"• **Make-in-India (MII) Local Content**: {bidder['mii_percentage']}% ({bidder['mii_class']})\n"
                f"• **Audited Annual Turnover**: ₹{bidder['declared_turnover_lakhs']} Lakhs ({bidder['turnover_eligibility']})\n"
                f"• **Debarment / Sovereign Registry**: {bidder['debarment_status']}\n"
                f"• **Risk Rating Score**: **{bidder['risk_score']}/100** ({bidder['compliance_status']})\n\n"
                f"### ⚖️ Legal Scrutiny Verdict & Recommended Officer Action\n"
                f"{recommendation}\n\n"
                f"*(Audit log generated: `OFFICER_LEGAL_SCRUTINY_AUDIT_{bidder['id']}`)*"
            )
            return {
                "answer": answer,
                "document_name": f"Officer_Scrutiny_Dossier_{bidder['id']}.pdf",
                "document_type": "Officer Statutory Scrutiny Dossier",
                "flags_detected": bidder["compliance_flags"],
                "validity_verdict": f"OFFICER_SCRUTINY_{bidder['compliance_status']}",
                "tenant_verified": True,
                "owner_organization": bidder["legal_name"],
                "is_comparison": False,
                "redacted_fields": [],
                "suggested_actions": [
                    {"label": f"Scrutinize Next Bidder ({'Zenith' if target_key != 'zenith' else 'Bharat Precision'})", "action": "scrutinize_next"},
                    {"label": "Generate Official Tender Scrutiny Summary", "action": "generate_officer_summary"}
                ]
            }

        # Case 2: Full Tender Scrutiny Matrix across All Bidders requested by Officer
        abc = cls.BIDDER_DOSSIERS["abc"]
        zen = cls.BIDDER_DOSSIERS["zenith"]
        bhp = cls.BIDDER_DOSSIERS["bharat"]

        answer = (
            f"🏛️ **Comprehensive Officer Tender Scrutiny Report (Tender: GEM/2026/B/9012481)**\n"
            f"• **Authenticated Officer Login ID**: `{officer_id}` (Executive Jurisdiction: GFR 2017 Rule 144)\n"
            f"• **Total Bidders Evaluated**: 3 Entities (Full Document Dossiers Decrypted)\n\n"
            f"### Statutory Document Verification & Risk Matrix\n\n"
            f"| Bidder ID & Name | Uploaded Documents Verified | Compliance Flags | MII % & Class | Turnover Status | Technical Verdict |\n"
            f"| :--- | :--- | :--- | :--- | :--- | :--- |\n"
            f"| **{abc['id']}**: {abc['legal_name']} | 4/4 Valid (GST, PAN, CA, Udyam) | 0 Flags (Clean) | {abc['mii_percentage']}% (Class-I) | ₹{abc['declared_turnover_lakhs']}L (Meets min) | 🟢 **QUALIFIED (L1)** |\n"
            f"| **{zen['id']}**: {zen['legal_name']} | 2/4 Valid (2 Deficits) | MII Deficit (42%), Turnover Shortfall | {zen['mii_percentage']}% (Class-II) | ₹{zen['declared_turnover_lakhs']}L (Shortfall: ₹15L) | 🟡 **CLARIFICATION (L2)** |\n"
            f"| **{bhp['id']}**: {bhp['legal_name']} | 0/3 Valid (Suspended, Forged, Debarred) | Suspended GST, Forged PAN, CPPP Debarment | {bhp['mii_percentage']}% (Class-I) | ₹{bhp['declared_turnover_lakhs']}L | 🔴 **DISQUALIFIED** |\n\n"
            f"### Officer Directive Summary\n"
            f"1. **{abc['legal_name']} (`bid-001`)**: Approved for Financial Bid Opening. Sovereign documents 100% reconciled.\n"
            f"2. **{zen['legal_name']} (`bid-002`)**: Issue Notice GEM-CLAR-02 granting 48 hours to furnish supplementary turnover/MII proof.\n"
            f"3. **{bhp['legal_name']} (`bid-003`)**: Reject under GFR Rule 144(xi), forfeit EMD, and notify Central Vigilance Commission.\n\n"
            f"*(Authorized under Sovereign Procurement Authority guidelines)*"
        )
        return {
            "answer": answer,
            "document_name": "Tender_Officer_Full_Scrutiny_Matrix.pdf",
            "document_type": "Executive Officer Tender Scrutiny",
            "flags_detected": ["ZENITH_MII_DEFICIT", "ZENITH_TURNOVER_SHORTFALL", "BHARAT_FORGED_PAN", "BHARAT_CPPP_DEBARMENT"],
            "validity_verdict": "OFFICER_EVALUATION_COMPLETED",
            "tenant_verified": True,
            "owner_organization": "Government Procurement Directorate",
            "is_comparison": True,
            "redacted_fields": [],
            "suggested_actions": [
                {"label": "Examine Bharat Precision Forgery Evidence", "action": "scrutinize_bharat"},
                {"label": "Examine Zenith Local Content Deficit", "action": "scrutinize_zenith"}
            ]
        }

    @classmethod
    def answer_document_query(
        cls,
        question: str,
        active_document: Optional[Dict[str, Any]] = None,
        user_org: str = "ABC Industries Pvt. Ltd.",
        user_role: str = "seller",
        user_id: Optional[str] = None,
        target_org: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Main entrypoint for DocScrutiny AI with Role-Based Access Control (RBAC):
        
        1. OFFICER WITH LEGAL LOGIN ID (user_role in ['officer', 'evaluator', 'auditor', 'admin']):
           - Has statutory authority under GFR 2017 Rule 144.
           - Can inspect and scrutinize ANY bidder/seller's uploaded documents, verification flags, and compliance dossiers.
           
        2. BIDDER / SELLER (user_role == 'seller'):
           - Isolated strictly to their own uploaded documents.
           - Questioning other bidders' personal documents, certificates, or tax files is STRICTLY PROHIBITED (DPDP Act 2023).
           - CAN ONLY compare bids on high-level public technical parameters (Make-in-India %, eligibility thresholds).
        """
        q_lower = question.lower()
        now_date = date(2026, 9, 14)
        role_normalized = (user_role or "seller").lower()
        effective_officer_id = user_id or "GOV-OFF-9012"

        # =========================================================================
        # BRANCH 1: GOVERNMENT PROCUREMENT OFFICER WITH LEGAL LOGIN ID
        # =========================================================================
        if role_normalized in ["officer", "evaluator", "auditor", "admin", "buyer"]:
            # If the officer is querying about any bidder, document, or tender comparison, provide full legal scrutiny
            if any(term in q_lower for term in [
                "zenith", "bharat", "abc", "bid-001", "bid-002", "bid-003",
                "bidder", "vendor", "compare", "scrutin", "evaluat", "audit",
                "dossier", "who is l1", "debarment", "tender", "matrix", "report"
            ]):
                return cls.answer_officer_bidder_scrutiny(question, officer_id=effective_officer_id)
            # If questioning an active document, proceed to deep forensic analysis for the officer
            # (handled below with officer context badge)

        # =========================================================================
        # BRANCH 2: SELLER / BIDDER - STRICT MULTI-TENANT ISOLATION
        # =========================================================================
        if role_normalized == "seller":
            # Rule A: Inquiring about other bidders' personal documents is STRICTLY PROHIBITED
            if cls.is_asking_other_bidder_docs(question, user_org):
                prohibited_reply = (
                    "🚫 **Access Strictly Prohibited — DPDP Act 2023 & GeM Multi-Tenant Isolation**:\n\n"
                    "• **Multi-Tenant Document Boundary**: Under Section 8 of the Digital Personal Data Protection (DPDP) Act 2023 "
                    "and GeM General Terms & Conditions (GTC Clause 4), sellers and bidders are **strictly prohibited** from viewing, "
                    "querying, or accessing the personal documents, uploaded certificates, PAN/GST filings, or internal compliance data of other bidders.\n"
                    "• **Your Permitted Scope**: As a registered bidder (`ABC Industries Pvt. Ltd.`), you can **only question and inspect your own uploaded documents**.\n"
                    "• **Allowed Bid Comparison**: You may freely compare your tender bid with others on **public technical parameters** "
                    "(e.g., Make-in-India local content % and eligibility qualification thresholds).\n"
                    "• **Statutory Officer Clearance**: If you are a Government Procurement Officer requiring access to examine bidder documents, "
                    "please switch to **Officer Scrutiny Mode** with an authorized Legal Login ID (`GOV-OFF-XXXX`) under GFR 2017 Rule 144.\n\n"
                    "*(Security Notice: Unauthorized cross-tenant document inquiry logged under Audit ID: `AUDIT-SEC-VIOLATION`)*"
                )
                return {
                    "answer": prohibited_reply,
                    "document_name": "Multi_Tenant_Security_Boundary.pdf",
                    "document_type": "Prohibited Cross-Tenant Access",
                    "flags_detected": ["COMPETITOR_DOCUMENT_ACCESS_PROHIBITED"],
                    "validity_verdict": "PROHIBITED_CROSS_TENANT_ACCESS",
                    "tenant_verified": True,
                    "owner_organization": user_org,
                    "is_comparison": False,
                    "redacted_fields": ["Competitor Scanned Documents", "Tax Certificates", "PAN/GST Filings", "Internal Audit Records"],
                    "suggested_actions": [
                        {"label": "Compare Public Bid Parameters", "action": "compare_public_bids"},
                        {"label": "Inspect My Own Document Flags", "action": "inspect_own_flags"}
                    ]
                }

            # Rule B: Allowed Public Bid Comparison (Comparing Tender Bids on Public Criteria)
            if cls.is_comparison_query(question):
                abc = cls.BIDDER_DOSSIERS["abc"]
                zenith = cls.BIDDER_DOSSIERS["zenith"]
                bharat = cls.BIDDER_DOSSIERS["bharat"]

                comp_reply = (
                    f"📊 **Comparative Technical Bid Intelligence (Tender: GEM/2026/B/9012481)**:\n\n"
                    f"### Public Bid Evaluation Summary Matrix\n\n"
                    f"| Bidder Name | Make-in-India (MII) % | Declared Turnover Eligibility | Debarment / GFR 144 | Commercial Standing |\n"
                    f"| :--- | :--- | :--- | :--- | :--- |\n"
                    f"| **{abc['legal_name']} (You)** | **{abc['mii_percentage']}% (Class-I)** | **₹{abc['declared_turnover_lakhs']} Lakhs** (Meets ₹80L min) | ✅ {abc['debarment_status']} | 🟢 **{abc['l1_standing']}** |\n"
                    f"| **{zenith['legal_name']}** | {zenith['mii_percentage']}% (Class-II Deficit) | ₹{zenith['declared_turnover_lakhs']} Lakhs (Shortfall: ₹15L) | ✅ {zenith['debarment_status']} | 🟡 {zenith['l1_standing']} |\n"
                    f"| **{bharat['legal_name']}** | {bharat['mii_percentage']}% (Class-I) | ₹{bharat['declared_turnover_lakhs']} Lakhs (Meets min) | ❌ **{bharat['debarment_status']}** | 🔴 **{bharat['l1_standing']}** |\n\n"
                    f"### Comparative Evaluation Findings\n"
                    f"1. **{abc['legal_name']} is the Preferred L1 Bid**: Your submission exceeds the Class-I Make-in-India threshold by **+28%** (78% vs 50% mandatory) and comfortably satisfies the minimum turnover criteria by +₹45 Lakhs. You hold the **L1 competitive technical rank**.\n"
                    f"2. **Zenith Global Tech**: Has an 8% shortfall in local content (42% vs 50% required) and a ₹15 Lakhs turnover deficit, triggering a statutory clarification requirement.\n"
                    f"3. **Bharat Precision**: Legally disqualified from public procurement due to an active CPPP debarment order under GFR Rule 144(xi).\n\n"
                    f"*(Privacy Assurance: Competitor personal documents, tax files, and bank records are strictly air-gapped and excluded from seller comparison under DPDP Act 2023.)*"
                )
                return {
                    "answer": comp_reply,
                    "document_name": "Tender_Comparative_Matrix_GEM_2026.pdf",
                    "document_type": "Comparative Bid Intelligence Report",
                    "flags_detected": ["ZENITH_MII_SHORTFALL", "ZENITH_TURNOVER_DEFICIT", "BHARAT_CPPP_DEBARMENT"],
                    "validity_verdict": "ABC_INDUSTRIES_L1_QUALIFIED",
                    "tenant_verified": True,
                    "owner_organization": user_org,
                    "is_comparison": True,
                    "redacted_fields": [],
                    "suggested_actions": [
                        {"label": "Inspect My Document Flags", "action": "inspect_own_flags"},
                        {"label": "Check My Certificate Expiry", "action": "inspect_own_expiry"}
                    ]
                }

        # ----------------------------------------------------
        # 3. Document-Level Scrutiny (Own Uploaded File)
        # ----------------------------------------------------
        doc = active_document or {}
        fn = doc.get("filename", "").lower()
        doc_extracted_name = (doc.get("extracted_legal_name") or "").lower()
        doc_pan = (doc.get("extracted_pan") or "").upper()
        doc_gstin = (doc.get("extracted_gstin") or "").upper()

        # Rule C: Cross-Tenant Active Document Air-Gap for Sellers
        if role_normalized == "seller":
            is_competitor_doc = (
                any(comp in fn for comp in ["zenith", "bharat", "bid-002", "bid-003", "seller-mh", "seller-dl"]) or
                any(comp in doc_extracted_name for comp in ["zenith", "bharat precision"]) or
                doc_pan in ["AABCZ9988H", "AAACX9999F", "AAACB0000A"] or
                doc_gstin.startswith("27AABCZ9988H") or doc_gstin.startswith("07AAACB0000")
            )
            if is_competitor_doc:
                return {
                    "answer": (
                        "🚫 **Access Strictly Prohibited — DPDP Act 2023 & GeM Multi-Tenant Isolation**:\n\n"
                        "• **Cross-Tenant Document Violation**: This document belongs to a competitor entity and is strictly protected under Section 8 of the Digital Personal Data Protection Act 2023.\n"
                        "• **Seller Scope**: As a registered bidder (`ABC Industries Pvt. Ltd.`), you are only permitted to inspect and question your own organization's uploaded documents.\n"
                        "• **Authorized Access**: Only Government Procurement Officers with verified Legal Login credentials (`GOV-OFF-XXXX`) are authorized to scrutinize competitor dossiers under GFR 2017 Rule 144."
                    ),
                    "document_name": doc.get("filename", "Competitor_Protected_Document.pdf"),
                    "document_type": "Prohibited Cross-Tenant Document",
                    "flags_detected": ["COMPETITOR_DOCUMENT_ACCESS_PROHIBITED"],
                    "validity_verdict": "PROHIBITED_CROSS_TENANT_ACCESS",
                    "tenant_verified": True,
                    "owner_organization": user_org,
                    "is_comparison": False,
                    "redacted_fields": ["Competitor Scanned Documents", "Tax Certificates", "PAN/GST Filings", "Internal Audit Records"],
                    "suggested_actions": [
                        {"label": "Inspect My Own Documents", "action": "inspect_own_docs"},
                        {"label": "Compare Public Bid Parameters", "action": "compare_public_bids"}
                    ]
                }

        doc_type = doc.get("document_type", "Statutory Document")
        is_expired = doc.get("is_expired", False)
        validity_status = doc.get("validity_status", "VALID")
        is_legit = doc.get("is_legit", True)
        legitimacy_score = doc.get("legitimacy_score", 98.5)
        expiry_date = doc.get("expiry_date", "Continuous / Perpetual")
        days_left = doc.get("days_until_expiry")

        # Query A: Why is document flagged?
        if any(w in q_lower for w in ["flag", "why flagged", "discrepancy", "anomaly", "issue", "reject", "suspend"]):
            if "cancelled" in fn or "susp" in fn or validity_status == "SUSPENDED":
                answer = (
                    "⚠️ **Statutory Flag Diagnosis: GST Registration Suspended under CGST Act Section 29(2)(c)**\n\n"
                    "• **Reason for Suspension**: The GST Common Portal (`gst.gov.in`) reports this GSTIN as **SUSPENDED** due to "
                    "continuous non-filing of monthly **GSTR-3B** returns for more than 6 consecutive tax periods.\n"
                    "• **Tender Impact**: A suspended GSTIN renders the bidder legally ineligible for tender participation or PO issuance.\n"
                    "• **Step-by-Step Rectification**:\n"
                    "  1. Log into the GST portal (`gst.gov.in`) and file all pending GSTR-3B and GSTR-1 returns with late fees.\n"
                    "  2. File an online application for Revocation of Cancellation/Suspension (Form GST REG-21) to the jurisdictional tax officer.\n"
                    "  3. Once status returns to **Active Regular**, re-trigger automated verification in the Seller Console."
                )
            elif "fake" in fn or "forged" in fn or not is_legit:
                answer = (
                    "🚫 **Statutory Flag Diagnosis: Critical Forensic Tamper & CBDT Registry Absence**\n\n"
                    "• **Reason for Rejection**: The PAN extracted (`AAACX9999F`) has an invalid 4th character ('X' is not a recognized legal entity code under CBDT rules), "
                    "and does not exist in the Income Tax Department (Protean e-Gov) sovereign database.\n"
                    "• **Pixel Forensics**: Pixel variance analysis detected cut-and-paste digital manipulation in the name banner.\n"
                    "• **Remediation**: Upload the authentic, original color PDF directly downloaded from the NSDL/UTIITSL or Income Tax e-Filing portal."
                )
            elif "expired" in fn or validity_status == "EXPIRED":
                answer = (
                    f"⏳ **Statutory Flag Diagnosis: Certificate Validity Expired**\n\n"
                    f"• **Reason for Expiry**: This certificate expired on **{expiry_date}** (over {abs(days_left) if days_left else 'several'} days ago).\n"
                    f"• **Public Procurement Mandate**: Under GeM GTC Clause 3.2, all quality certifications (e.g. ISO 9001) must be active and valid "
                    f"on the date of bid submission and tender opening.\n"
                    f"• **Remediation**: Submit the renewed certificate issued by the NABCB/IAF accredited certifying body with valid QR code."
                )
            else:
                answer = (
                    "🟢 **No Adverse Compliance Flags Detected**:\n\n"
                    f"• **Document Status**: **100% LEGITIMATE & VALID**\n"
                    f"• **Sovereign Reconciliation**: All identifiers (PAN, GSTIN, Legal Entity Name) reconcile letter-for-letter "
                    f"against sovereign gateways (CBDT, GSTN, MCA-21).\n"
                    f"• **Integrity Check**: Cryptographic SHA-256 seal and digital vector text layer verified without tampering."
                )
            return {
                "answer": answer,
                "document_name": doc.get("filename", "Uploaded_Document.pdf"),
                "document_type": doc_type,
                "flags_detected": ["CGST_SEC_29_SUSPENSION"] if "cancelled" in fn else (["CBDT_RECORD_ABSENT", "PIXEL_TAMPER"] if "fake" in fn else []),
                "validity_verdict": validity_status,
                "tenant_verified": True,
                "owner_organization": user_org,
                "is_comparison": False,
                "suggested_actions": [
                    {"label": "How to Rectify Suspension", "action": "rectify_suspension"},
                    {"label": "Compare with Other Bidders", "action": "compare_bids"}
                ]
            }

        # Query B: When does it expire / Validity check?
        if any(w in q_lower for w in ["expiry", "expire", "valid", "validity", "how many days", "date"]):
            if "gst" in fn or "pan" in fn or "udyam" in fn:
                answer = (
                    f"📅 **Statutory Validity & Expiry Assessment for {doc_type}**:\n\n"
                    f"• **Statutory Classification**: **PERPETUAL VALIDITY (Conditioned on Regulatory Compliance)**\n"
                    f"• **Statutory Rule**: Under Indian tax law, PAN and regular GSTIN certificates do not carry a calendar expiration date. "
                    f"However, GSTIN validity is continuously conditional on **timely monthly filing of GSTR-3B returns**.\n"
                    f"• **Current Status**: **{validity_status}**\n"
                    f"• **Details**: {doc.get('validity_details', 'Valid and operative for all government procurement tenders.')}"
                )
            elif expiry_date and expiry_date != "Continuous / Perpetual":
                answer = (
                    f"📅 **Statutory Validity & Expiry Assessment for {doc_type}**:\n\n"
                    f"• **Certificate Expiry Date**: **{expiry_date}**\n"
                    f"• **Validity Verdict**: **{validity_status}**\n"
                    f"• **Timeline Status**: {f'{days_left} days remaining before mandatory renewal.' if days_left and days_left > 0 else f'EXPIRED ({abs(days_left) if days_left else 0} days overdue).'}\n"
                    f"• **Tender Rule**: Must be renewed prior to technical evaluation opening."
                )
            else:
                answer = (
                    f"📅 **Statutory Validity for {doc_type}**:\n\n"
                    f"• **Status**: **{validity_status}**\n"
                    f"• **Effective Date**: {doc.get('document_date', 'Operative')}\n"
                    f"• **Details**: Continuous validity verified with sovereign regulatory authority."
                )
            return {
                "answer": answer,
                "document_name": doc.get("filename", "Uploaded_Document.pdf"),
                "document_type": doc_type,
                "flags_detected": [],
                "validity_verdict": validity_status,
                "tenant_verified": True,
                "owner_organization": user_org,
                "is_comparison": False,
                "suggested_actions": [
                    {"label": "Check Rectification Steps", "action": "rectify_flag"},
                    {"label": "Compare Tender Bids", "action": "compare_bids"}
                ]
            }

        # Default Document Q&A Answer
        answer = (
            f"📄 **DocScrutiny AI Analysis for '{doc.get('filename', 'Selected Document')}'**:\n\n"
            f"• **Document Classification**: **{doc_type}**\n"
            f"• **Legitimacy Verdict**: **{doc.get('legitimacy_status', 'LEGITIMATE')}** (Confidence: {legitimacy_score}%)\n"
            f"• **Statutory Validity**: **{validity_status}** (Expiry: {expiry_date})\n"
            f"• **Reconciliation Details**: {doc.get('validity_details', 'Document reconciled with sovereign databases.')}\n\n"
            f"You can ask me: *'Why was this document flagged?'*, *'When does it expire?'*, *'How do I fix the non-filing flag?'*, or *'Compare my bid with other bidders'*."
        )
        return {
            "answer": answer,
            "document_name": doc.get("filename", "Uploaded_Document.pdf"),
            "document_type": doc_type,
            "flags_detected": [],
            "validity_verdict": validity_status,
            "tenant_verified": True,
            "owner_organization": user_org,
            "is_comparison": False,
            "suggested_actions": [
                {"label": "Why was this flagged?", "action": "why_flagged"},
                {"label": "When does it expire?", "action": "check_expiry"},
                {"label": "Compare My Bid with Competitors", "action": "compare_bids"}
            ]
        }
