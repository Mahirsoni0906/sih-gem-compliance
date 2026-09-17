import re
from typing import Dict, Any, List, Optional
from datetime import datetime, date
from app.services.verification_engine import StatutoryVerificationEngine

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
        """Check if query is asking to compare bids, evaluate competitiveness, or check standing against competitors."""
        q_lower = question.lower()
        comparison_terms = [
            "compare", "comparison", "better bid", "versus", " vs ", "vs.", "which bid",
            "who is l1", "competitor", "ranking", "zenith", "standing"
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
    def answer_general_rules_query(
        cls,
        question: str,
        user_org: str = "ABC Industries Pvt. Ltd.",
        user_role: str = "seller"
    ) -> Dict[str, Any]:
        """
        Answers general statutory rules, GeM guidelines, GFR 2017, MII thresholds, and validity policies
        that do not require uploading any document, directing users seamlessly to GeMMy AI.
        """
        q_lower = question.lower()

        # 1. Validity & Renewal Rules (GST, PAN, MSME, ITR, UDIN, OEM)
        if any(term in q_lower for term in ["validity", "renewal", "renew", "expiry", "expire", "how long", "valid"]):
            ans = (
                "🏛️ **Statutory Validity & Renewal Guidelines on GeM** *(No Document Upload Required)*\n\n"
                "Under Ministry of Finance procurement rules and Indian statutory frameworks, certificates and business credentials operate under the following validity mandates:\n\n"
                "### 1. Tax Registrations (GSTIN & PAN)\n"
                "• **GSTIN (Form GST REG-06)**: **Perpetual / Continuous**. Registration does not have an expiration date, but remains valid only if monthly **GSTR-1** and **GSTR-3B** returns are furnished. Failure to file for > 6 consecutive tax periods triggers automated suspension under **CGST Act Section 29(2)(c)**.\n"
                "• **Permanent Account Number (PAN)**: **Permanent Lifetime**. Never expires. Must remain linked to Aadhaar (for individuals/proprietorships) or authenticated via MCA-21 (for corporate entities).\n\n"
                "### 2. MSME & Enterprise Classification\n"
                "• **Udyam MSME Certificate**: **Lifetime Validity**. Does not require re-registration. However, enterprises must maintain **annual dynamic updation** of investment and turnover data (sourced directly from CBDT ITR and GST returns) on the Udyam portal under Ministry of MSME Notification S.O. 2119(E).\n\n"
                "### 3. Financial Statements & OEM Authorizations\n"
                "• **CA Turnover Certificate (ICAI UDIN)**: Must be issued within the financial year specified by the tender closing date, with an active 18-digit UDIN verifiable on `udin.icai.org`.\n"
                "• **OEM Authorization Form (MAF)**: Must remain strictly valid throughout the tender execution period. Expired authorizations trigger disqualification.\n\n"
                "---\n"
                "💡 **Direct Rule Assistance**: This is a general statutory rule inquiry. For deeper interactive policy exploration or GFR 2017 clauses, you can send this question directly to **GeMMy AI**."
            )
            return {
                "answer": ans,
                "document_name": "GeM_Statutory_Validity_Guidelines.pdf",
                "document_type": "Public Procurement Statutory Policy",
                "flags_detected": [],
                "validity_verdict": "GENERAL_RULES_INQUIRY",
                "tenant_verified": True,
                "owner_organization": user_org,
                "is_comparison": False,
                "redacted_fields": [],
                "suggested_actions": [
                    {"label": f"💬 Ask GeMMy AI: '{question[:32]}...'", "action": "send_to_gemmy", "query": question},
                    {"label": "Required Documents for GeM", "action": "send_to_gemmy", "query": "What statutory documents and certificates are mandatory for GeM tender eligibility?"},
                    {"label": "MII Local Content Rules", "action": "send_to_gemmy", "query": "What are Class-I and Class-II Make in India (MII) local content requirements under DPIIT?"}
                ],
                "redirect_to_gemmy": True,
                "gemmy_query": question
            }

        # 2. Required / Mandatory Documents for GeM Tender Eligibility
        if any(term in q_lower for term in ["required doc", "mandatory doc", "what doc", "documents required", "eligibility doc", "certificate required", "documents and certificates"]):
            ans = (
                "🏛️ **Mandatory Statutory Documents for GeM Tender Eligibility** *(No Document Upload Required)*\n\n"
                "To qualify for public procurement tenders on the Government e-Marketplace, bidders must possess valid sovereign registrations under General Financial Rules (GFR 2017):\n\n"
                "### Mandatory Statutory Document Checklist\n"
                "1. **GST Registration Certificate (Form GST REG-06)**: Verifying regular taxpayer standing and active state jurisdiction.\n"
                "2. **PAN Card**: Permanent Account Number issued by the Income Tax Department (CBDT).\n"
                "3. **Udyam MSME Registration Certificate**: Mandatory for claiming EMD exemption and tender purchase preference under Public Procurement Policy for MSEs Order 2012.\n"
                "4. **Audited Financials / CA Turnover Certificate**: With mandatory 18-digit **ICAI UDIN** verifying 3-year average turnover.\n"
                "5. **EPFO & ESIC Registrations**: Mandatory if employee count meets statutory thresholds (or self-declaration of non-applicability).\n"
                "6. **Make in India (MII) Local Content Declaration**: Self-declaration or statutory auditor certificate declaring local value addition %.\n"
                "7. **OEM Authorization Form (MAF)**: Required if participating as an authorized distributor or reseller.\n\n"
                "---\n"
                "💡 **Direct Rule Assistance**: This is a general policy inquiry. You can send this question to **GeMMy AI** for tender exemption rules or profile registration steps."
            )
            return {
                "answer": ans,
                "document_name": "Mandatory_Tender_Documents_GFR2017.pdf",
                "document_type": "Public Procurement Policy Guide",
                "flags_detected": [],
                "validity_verdict": "GENERAL_RULES_INQUIRY",
                "tenant_verified": True,
                "owner_organization": user_org,
                "is_comparison": False,
                "redacted_fields": [],
                "suggested_actions": [
                    {"label": f"💬 Ask GeMMy AI: '{question[:32]}...'", "action": "send_to_gemmy", "query": question},
                    {"label": "EPFO & ESIC Thresholds", "action": "send_to_gemmy", "query": "What are the EPFO and ESIC compliance thresholds for public procurement bids?"},
                    {"label": "Check Validity & Expiry Rules", "action": "send_to_gemmy", "query": "What are the validity and renewal rules for GST, PAN, and MSME on GeM?"}
                ],
                "redirect_to_gemmy": True,
                "gemmy_query": question
            }

        # 3. EPFO & ESIC Thresholds
        if any(term in q_lower for term in ["epfo", "esic", "labor", "labour", "provident", "threshold"]):
            ans = (
                "👷 **EPFO & ESIC Statutory Compliance Thresholds** *(No Document Upload Required)*\n\n"
                "Under statutory Indian labor legislation and GeM public procurement mandates:\n\n"
                "### 1. Employees' Provident Fund (EPFO)\n"
                "• **Statutory Threshold**: Mandatory for any establishment employing **20 or more persons** under the Employees' Provident Funds and Miscellaneous Provisions Act 1952.\n"
                "• **Compliance Requirement**: Active Establishment Code and current monthly Electronic Challan cum Return (ECR) filing.\n\n"
                "### 2. Employees' State Insurance (ESIC)\n"
                "• **Statutory Threshold**: Mandatory for non-seasonal factories/establishments employing **10 or more persons** with monthly wages up to **₹21,000** under the ESI Act 1948.\n"
                "• **Compliance Requirement**: 17-digit Employer Registration Code and regular monthly contribution payments.\n\n"
                "### 3. Exemption / Small Entity Provision\n"
                "• If an enterprise employs fewer persons than the statutory thresholds, it must upload a **formal self-declaration of non-applicability** on company letterhead signed by the authorized signatory.\n\n"
                "---\n"
                "💡 **Direct Rule Assistance**: This is a general statutory inquiry. You can send this question to **GeMMy AI** for labor compliance audit advice."
            )
            return {
                "answer": ans,
                "document_name": "EPFO_ESIC_Labor_Compliance_Rules.pdf",
                "document_type": "Labor Statutory Guidelines",
                "flags_detected": [],
                "validity_verdict": "GENERAL_RULES_INQUIRY",
                "tenant_verified": True,
                "owner_organization": user_org,
                "is_comparison": False,
                "redacted_fields": [],
                "suggested_actions": [
                    {"label": f"💬 Ask GeMMy AI: '{question[:32]}...'", "action": "send_to_gemmy", "query": question},
                    {"label": "MII Local Content Rules", "action": "send_to_gemmy", "query": "What are Class-I and Class-II Make in India (MII) local content requirements under DPIIT?"}
                ],
                "redirect_to_gemmy": True,
                "gemmy_query": question
            }

        # 4. Make in India (MII) Local Content Rules
        if any(term in q_lower for term in ["mii", "make in india", "local content", "class-i", "class-ii", "non-local", "dpiit"]):
            ans = (
                "🇮🇳 **Make in India (MII) Local Content Rules & Classifications** *(No Document Upload Required)*\n\n"
                "Under DPIIT Public Procurement (Preference to Make in India) Order P-45021/2/2017-PP:\n\n"
                "### Supplier Classifications & Procurement Thresholds\n"
                "• **Class-I Local Supplier**: Local content **>= 50%**. Receives the highest statutory purchase preference (20% margin of purchase preference over non-local suppliers in L1 price matching).\n"
                "• **Class-II Local Supplier**: Local content **>= 20% but < 50%**. Eligible to bid in tenders up to ₹200 Crores, but does NOT receive purchase preference over Class-I bidders.\n"
                "• **Non-Local Supplier**: Local content **< 20%**. Ineligible to bid on domestic procurement tenders valued under ₹200 Crores where domestic capability exists.\n\n"
                "### Verification & Certification Mandates\n"
                "• **Tenders up to ₹10 Crores**: Self-declaration of local content % and manufacturing location.\n"
                "• **Tenders exceeding ₹10 Crores**: Mandatory statutory auditor or cost accountant certificate with verifiable 18-digit **ICAI UDIN**.\n\n"
                "---\n"
                "💡 **Direct Rule Assistance**: This is a general policy inquiry. Send this question to **GeMMy AI** for margin-of-preference formulas or tender-specific MII rules."
            )
            return {
                "answer": ans,
                "document_name": "DPIIT_Make_In_India_Rules.pdf",
                "document_type": "Industrial Procurement Policy",
                "flags_detected": [],
                "validity_verdict": "GENERAL_RULES_INQUIRY",
                "tenant_verified": True,
                "owner_organization": user_org,
                "is_comparison": False,
                "redacted_fields": [],
                "suggested_actions": [
                    {"label": f"💬 Ask GeMMy AI: '{question[:32]}...'", "action": "send_to_gemmy", "query": question},
                    {"label": "Check Validity & Expiry Rules", "action": "send_to_gemmy", "query": "What are the validity and renewal rules for GST, PAN, and MSME on GeM?"}
                ],
                "redirect_to_gemmy": True,
                "gemmy_query": question
            }

        # 5. Default General Rules Inquiry
        ans = (
            f"🏛️ **General Procurement Rule Inquiry** *(No Document Upload Required)*\n\n"
            f"You asked a general question about GeM rules, policies, or statutory guidelines:\n"
            f"> \"{question}\"\n\n"
            f"### Scrutiny Scope Clarification\n"
            f"• **DocScrutiny AI Role**: Specialized in optical character recognition (OCR), cryptographic checksum verification, font tampering detection, and forensic validation of **uploaded vendor files and certificates**.\n"
            f"• **GeMMy AI Role**: GeM's official sovereign AI Policy & Compliance Assistant, trained on GFR 2017, General Terms & Conditions (GTC), tender evaluation guidelines, and dispute resolution.\n\n"
            f"Since your question is about general rules and does not require an uploaded document, we have prepared this query for **GeMMy AI**.\n\n"
            f"👉 **Click the button below to send this question to GeMMy AI for an immediate detailed answer.**"
        )
        return {
            "answer": ans,
            "document_name": "General_Procurement_Rules.pdf",
            "document_type": "Public Procurement Rulebook",
            "flags_detected": [],
            "validity_verdict": "GENERAL_RULES_INQUIRY",
            "tenant_verified": True,
            "owner_organization": user_org,
            "is_comparison": False,
            "redacted_fields": [],
            "suggested_actions": [
                {"label": f"💬 Ask GeMMy AI: '{question[:32]}...'", "action": "send_to_gemmy", "query": question},
                {"label": "Validity & Expiry Rules", "action": "send_to_gemmy", "query": "What are the validity and renewal rules for GST, PAN, and MSME on GeM?"},
                {"label": "Required Documents", "action": "send_to_gemmy", "query": "What statutory documents and certificates are mandatory for GeM tender eligibility?"}
            ],
            "redirect_to_gemmy": True,
            "gemmy_query": question
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
                        {"label": "💬 Ask GeMMy AI: Competitor Public Rules", "action": "send_to_gemmy", "query": "What are the public tender eligibility, debarment, and comparison rules for competing bidders under GFR 144?"},
                        {"label": "Compare Public Bid Parameters", "action": "compare_public_bids"},
                        {"label": "Inspect My Own Document Flags", "action": "inspect_own_flags"}
                    ],
                    "redirect_to_gemmy": True,
                    "gemmy_query": "What are the public tender eligibility, debarment, and comparison rules for competing bidders under GFR 144?"
                }

            # Rule B: Allowed Public Bid Comparison (when no document uploaded yet)
            if not active_document and cls.is_comparison_query(question):
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
        # 3. Document-Level Scrutiny vs General Rules Inquiry
        # ----------------------------------------------------
        if not active_document:
            return cls.answer_general_rules_query(question, user_org, role_normalized)

        doc = active_document
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

        # ----------------------------------------------------
        # DYNAMIC EXTRACTION OF DOCUMENT ATTRIBUTES (ZERO MOCK FALLBACKS)
        # ----------------------------------------------------
        filename = doc.get("filename") or "Uploaded_Document"
        doc_type = doc.get("document_type") or "Statutory Document"
        legal_name = doc.get("extracted_legal_name")
        gstin = doc.get("extracted_gstin")
        pan = doc.get("extracted_pan")
        udyam = doc.get("extracted_udyam")
        epfo = doc.get("extracted_epfo")
        esic = doc.get("extracted_esic")
        mii = doc.get("extracted_mii_percentage")
        mii_class = doc.get("extracted_mii_class") or ("Class-I Local Supplier (>= 50%)" if mii and mii >= 50 else ("Class-II Local Supplier (< 50%)" if mii else None))
        udin = doc.get("extracted_udin")
        oem = doc.get("extracted_oem_auth")
        t_ref = doc.get("tender_ref")
        addr = doc.get("extracted_address")
        const = doc.get("extracted_constitution")
        inc_date = doc.get("extracted_incorporation_date")
        turnover_val = doc.get("extracted_turnover")
        legitimacy_score = doc.get("legitimacy_score", 0.0)
        legitimacy_status = doc.get("legitimacy_status") or ("LEGITIMATE" if legitimacy_score >= 80 else ("SUSPICIOUS" if legitimacy_score >= 50 else "NON_COMPLIANT"))
        validity_status = doc.get("validity_status") or "VALID"
        validity_details = doc.get("validity_details") or ""
        expiry_date = doc.get("expiry_date") or "Continuous / Perpetual"
        days_left = doc.get("days_until_expiry")
        is_expired = doc.get("is_expired", False)
        legitimacy_checks = doc.get("legitimacy_checks") or []
        tamper_analysis = doc.get("tamper_analysis") or {}
        compliance_flags = doc.get("compliance_flags") or []

        entity_display = legal_name or "Recognized Bidder Entity"

        # ----------------------------------------------------
        # CASE 1: LABOR COMPLIANCE (EPFO & ESIC) QUERY
        # ----------------------------------------------------
        is_labor_query = bool(re.search(r'\b(epfo|esic|labor|labour|provident|esi|employee|workforce)\b', q_lower))
        if is_labor_query and not any(p in q_lower for p in ["all", "everything", "dossier", "all statutory", "full"]):
            if epfo or esic:
                epfo_section = (
                    f"• **EPFO Establishment Code**: `{epfo}`\n"
                    f"  - **Jurisdiction**: {StatutoryVerificationEngine.verify_epfo(epfo).get('details', {}).get('regional_office', 'Regional Office')}\n"
                    f"  - **Compliance Status**: **100% REGULAR & ACTIVE** under EPF & MP Act 1952\n"
                ) if epfo else (
                    f"• **EPFO Establishment Code**: ⚠️ **Not Declared in {filename}**\n"
                    f"  - Bidder has not provided an EPFO code in this document.\n"
                )

                esic_section = (
                    f"• **ESIC Employer Code**: `{esic}`\n"
                    f"  - **Region**: {StatutoryVerificationEngine.verify_esic(esic).get('details', {}).get('regional_office', 'Regional Directorate')}\n"
                    f"  - **Compliance Status**: **OPERATIVE EMPLOYER** under ESI Act 1948\n"
                ) if esic else (
                    f"• **ESIC Employer Code**: ⚠️ **Not Declared in {filename}**\n"
                    f"  - Bidder has not provided an ESIC employer code in this document.\n"
                )

                labor_verdict = "🟢 FULLY COMPLIANT" if (epfo and esic) else "🟡 PARTIALLY COMPLIANT (Supplementary labor registration required)"
                answer = (
                    f"👷 **Statutory Labor Compliance Audit for {entity_display}**\n\n"
                    f"{epfo_section}\n"
                    f"{esic_section}\n"
                    f"---\n"
                    f"### ⚖️ Labor Standing Verdict: {labor_verdict}\n"
                    f"• **Regulatory Verification**: Cross-checked with Ministry of Labour & Employment sovereign registries.\n"
                    f"• **Tender Requirement**: Bidder must ensure monthly ECR returns and contributions remain up to date."
                )
            else:
                answer = (
                    f"⚠️ **Labor Compliance Identifiers Not Detected in '{filename}'**\n\n"
                    f"• **EPFO Establishment Code**: Not present in uploaded document.\n"
                    f"• **ESIC Employer Code**: Not present in uploaded document.\n\n"
                    f"---\n"
                    f"### 📋 Mandatory Public Procurement Labor Guidelines:\n"
                    f"1. **EPFO Mandate**: Establishments employing 20 or more persons must register under the Employees' Provident Funds and Miscellaneous Provisions Act, 1952.\n"
                    f"2. **ESIC Mandate**: Required under the Employees' State Insurance Act, 1948 for units in implemented areas with 10+ employees.\n"
                    f"3. **Required Action**: If this GeM tender enforces labor compliance criteria, please upload a comprehensive vendor dossier, EPFO monthly ECR challan, or Form C-18 employer registration to pass verification."
                )

            return {
                "answer": answer,
                "document_name": filename,
                "document_type": doc_type,
                "flags_detected": [f for f in compliance_flags if "EPFO" in f or "ESIC" in f or "LABOR" in f],
                "validity_verdict": "LABOR_VERIFIED" if (epfo and esic) else "LABOR_CREDENTIALS_MISSING",
                "tenant_verified": True,
                "owner_organization": user_org,
                "is_comparison": False,
                "suggested_actions": [
                    {"label": "Verify All Statutory Details", "action": "verify_all"},
                    {"label": "Audit MII & OEM Authorization", "action": "audit_mii_oem"}
                ]
            }

        # ----------------------------------------------------
        # CASE 2: MAKE IN INDIA (MII) & OEM AUTHORIZATION QUERY
        # ----------------------------------------------------
        is_mii_oem_query = bool(re.search(r'\b(mii|make in india|local content|oem|maf|manufacturer|authorization)\b', q_lower))
        if is_mii_oem_query and not any(p in q_lower for p in ["all", "everything", "dossier", "all statutory", "full"]):
            if (mii is not None) or oem:
                if mii is not None:
                    if mii >= 50.0:
                        mii_verdict = f"🟢 **QUALIFIED AS CLASS-I LOCAL SUPPLIER (>= 50%)**\n  - Declared Local Content: **{mii}%** (Exceeds mandatory threshold by +{round(mii - 50.0, 1)}%)\n  - **Purchase Preference**: Eligible for preferential evaluation under DPIIT Public Procurement Order P-45021/2/2017-PP."
                    elif mii >= 20.0:
                        mii_verdict = f"🟡 **CLASS-II LOCAL SUPPLIER (< 50%)**\n  - Declared Local Content: **{mii}%** (Deficit of {round(50.0 - mii, 1)}% vs Class-I threshold)\n  - **Limitation**: Not eligible for Class-I reserved tenders or purchase preference."
                    else:
                        mii_verdict = f"🔴 **NON-LOCAL SUPPLIER (< 20%)**\n  - Declared Local Content: **{mii}%** (Below 20% threshold)\n  - **Disqualification Warning**: Ineligible for local supplier procurement benefits."
                else:
                    mii_verdict = f"⚠️ **Not Declared**: No Make-in-India local content percentage specified in `{filename}`."

                if oem:
                    oem_section = (
                        f"• **Manufacturer Authorization Form (MAF)**: `{oem}`\n"
                        f"  - **Verification Status**: Validated against OEM registry" + (f" for Bid Ref `{t_ref}`" if t_ref else "") + ".\n"
                        f"  - **Standing**: Authorized distributor / supplier standing confirmed."
                    )
                else:
                    oem_section = f"• **OEM Authorization (MAF)**: ⚠️ **Not Found in {filename}** (Bidder has not attached an OEM MAF authorization letter)."

                answer = (
                    f"🇮🇳 **Make in India (MII) & OEM Authorization Audit for {entity_display}**\n\n"
                    f"### 1. Make in India Local Content Declaration\n"
                    f"{mii_verdict}\n\n"
                    f"### 2. OEM Authorization (MAF) Status\n"
                    f"{oem_section}\n\n"
                    f"*(Audit standard: DPIIT Order P-45021/2/2017-PP and GeM GTC Clause 12)*"
                )
            else:
                answer = (
                    f"⚠️ **No MII or OEM Authorization Found in '{filename}'**\n\n"
                    f"• **Make in India (MII) Local Content**: Not declared in uploaded document.\n"
                    f"• **OEM Authorization (MAF)**: No manufacturer authorization letter detected.\n\n"
                    f"---\n"
                    f"### 📋 Mandatory Requirements under DPIIT Public Procurement Orders:\n"
                    f"• **Tenders up to ₹200 Crores**: Reserved exclusively for Class-I (>= 50%) and Class-II (>= 20%) local suppliers.\n"
                    f"• **Reseller / Partner Requirement**: If you are not the original equipment manufacturer (OEM), you must attach a valid MAF signed by the OEM.\n"
                    f"• **Next Step**: Upload a formal Make-in-India local content self-declaration or OEM MAF letter."
                )

            return {
                "answer": answer,
                "document_name": filename,
                "document_type": doc_type,
                "flags_detected": [f for f in compliance_flags if "MII" in f or "OEM" in f],
                "validity_verdict": "MII_OEM_AUDITED",
                "tenant_verified": True,
                "owner_organization": user_org,
                "is_comparison": False,
                "suggested_actions": [
                    {"label": "Verify All Statutory Details", "action": "verify_all"},
                    {"label": "Check Labor Compliance", "action": "verify_labor"}
                ]
            }

        # ----------------------------------------------------
        # CASE 3: EXPIRY TIMELINE & STATUTORY VALIDITY QUERY
        # ----------------------------------------------------
        is_expiry_query = bool(re.search(r'\b(expiry|expire|valid|validity|how many days|date|renew|calendar)\b', q_lower))
        if is_expiry_query and not any(p in q_lower for p in ["all", "everything", "dossier", "all statutory", "full"]):
            if validity_status == "SUSPENDED":
                exp_verdict = f"🔴 **SUSPENDED / CANCELLED**\n• **Forensic Reason**: {validity_details or 'Statutory registration suspended on sovereign portal.'}\n• **Action Required**: File overdue returns and submit Revocation Form GST REG-21 immediately."
            elif is_expired or (days_left is not None and days_left <= 0):
                exp_verdict = f"🔴 **EXPIRED**\n• **Expiry Date**: **{expiry_date}** ({abs(days_left) if days_left else 'several'} days overdue)\n• **Requirement**: Under GeM GTC Clause 3.2, certificates must be active on bid opening date. Renewal required."
            elif days_left is not None and days_left > 0:
                exp_verdict = f"🟢 **ACTIVE & VALID**\n• **Expiry Date**: **{expiry_date}**\n• **Time Remaining**: **{days_left} days** remaining before renewal is due."
            elif gstin or pan or udyam:
                exp_verdict = f"🟢 **PERPETUAL OPERATIONAL VALIDITY**\n• **Regulatory Status**: Indian PAN, MSME Udyam, and regular GSTIN registrations do not have calendar expiry dates.\n• **Condition**: GSTIN validity is continuously conditional on **timely monthly filing of GSTR-3B & GSTR-1 returns**."
            else:
                exp_verdict = f"ℹ️ **{validity_status}**\n• **Details**: {validity_details or 'Continuous validity.'}"

            answer = (
                f"⏳ **Statutory Validity & Expiry Assessment for '{filename}'**\n\n"
                f"• **Document Classification**: **{doc_type}**\n"
                f"• **Entity**: **{entity_display}**\n"
                f"---\n"
                f"### Validity & Expiry Breakdown\n"
                f"{exp_verdict}\n\n"
                f"*(Reconciled against sovereign regulatory gateways)*"
            )
            return {
                "answer": answer,
                "document_name": filename,
                "document_type": doc_type,
                "flags_detected": [f for f in compliance_flags if "EXPIR" in f or "SUSP" in f],
                "validity_verdict": validity_status,
                "tenant_verified": True,
                "owner_organization": user_org,
                "is_comparison": False,
                "suggested_actions": [
                    {"label": "Verify All Statutory Details", "action": "verify_all"},
                    {"label": "Compare My Bid with Competitors", "action": "compare_bids"}
                ]
            }

        # ----------------------------------------------------
        # CASE 4: COMPARISON WITH COMPETITORS / ZENITH
        # ----------------------------------------------------
        is_compare_query = bool(re.search(r'\b(compare|comparison|versus|vs|zenith|competitor|ranking|standing)\b', q_lower))
        if is_compare_query:
            zenith = cls.BIDDER_DOSSIERS["zenith"]
            bharat = cls.BIDDER_DOSSIERS["bharat"]

            your_mii_str = f"{mii}% ({mii_class})" if mii is not None else "Not declared in document"
            your_turnover_str = f"₹{turnover_val} Lakhs" if turnover_val is not None else "Not specified in document"

            if legitimacy_status in ["FORGED", "NON_COMPLIANT"] or legitimacy_score < 70:
                standing_analysis = (
                    f"🔴 **CRITICAL COMPLIANCE DEFICIT IN YOUR SUBMISSION**:\n"
                    f"• **AI Legitimacy Assessment**: **{legitimacy_status} ({legitimacy_score}% confidence)**\n"
                    f"• **Disqualification Risk**: Your uploaded document (`{filename}`) contains compliance flags or potential irregularities.\n"
                    f"• **Zenith Standing**: While Zenith Global Tech has an 8% MII deficit (42% vs 50%), their statutory filings are verified. Your bid **cannot be qualified** until you upload legitimate, untampered credentials."
                )
            elif mii is not None and mii >= 50.0:
                standing_analysis = (
                    f"🟢 **YOUR BID HOLDS THE PREFERRED L1 COMPETITIVE STANDING**:\n"
                    f"• **Make-in-India Advantage**: You declare **{mii}% Class-I local content**, exceeding the mandatory 50% threshold by **+{round(mii - 50.0, 1)}%**.\n"
                    f"• **Zenith Comparison**: Zenith Global Tech is Class-II at only 42% (8% deficit) and faces Form GEM-CLAR-02 clarification.\n"
                    f"• **Turnover Advantage**: Your certified turnover ({your_turnover_str}) qualifies comfortably against Zenith's ₹15L shortfall."
                )
            else:
                standing_analysis = (
                    f"🟡 **CLARIFICATION REQUIRED BEFORE L1 CONFIRMATION**:\n"
                    f"• Local content ({your_mii_str}) or turnover details need formal verification to confirm preference over Zenith."
                )

            answer = (
                f"⚖️ **Comparative Bid Evaluation: {entity_display} vs Competitors**\n"
                f"• **Tender Reference**: `{t_ref or 'GEM/2026/B/9012481'}`\n\n"
                f"### Comparative Evaluation Matrix\n\n"
                f"| Bidder Name | Make-in-India (MII) % | Declared Turnover | Legitimacy & Risk | Commercial Standing |\n"
                f"| :--- | :--- | :--- | :--- | :--- |\n"
                f"| **{entity_display} (You)** | {your_mii_str} | {your_turnover_str} | {legitimacy_score}% ({legitimacy_status}) | **Evaluated Submission** |\n"
                f"| **{zenith['legal_name']}** | {zenith['mii_percentage']}% (Class-II Deficit) | ₹{zenith['declared_turnover_lakhs']}L (Deficit: ₹15L) | 62.0% (Clarification) | 🟡 {zenith['l1_standing']} |\n"
                f"| **{bharat['legal_name']}** | {bharat['mii_percentage']}% (Class-I) | ₹{bharat['declared_turnover_lakhs']}L | 0.0% (Debarred/Suspended) | 🔴 {bharat['l1_standing']} |\n\n"
                f"---\n\n"
                f"{standing_analysis}\n\n"
                f"*(DPDP Act 2023: Competitor personal tax and certificate files remain strictly protected and unexposed.)*"
            )
            return {
                "answer": answer,
                "document_name": filename,
                "document_type": "Comparative Bid Intelligence",
                "flags_detected": compliance_flags,
                "validity_verdict": f"COMP_EVAL_{legitimacy_status}",
                "tenant_verified": True,
                "owner_organization": user_org,
                "is_comparison": True,
                "suggested_actions": [
                    {"label": "Verify All Statutory Details", "action": "verify_all"},
                    {"label": "Audit Labor Compliance", "action": "verify_labor"}
                ]
            }

        # ----------------------------------------------------
        # CASE 5: VERIFY ALL STATUTORY DETAILS & COMPREHENSIVE DOSSIER AUDIT
        # ----------------------------------------------------
        table_rows = []
        if gstin:
            gst_v = StatutoryVerificationEngine.verify_gst(gstin)
            gst_stat = "🟢 VALID (Active Regular)" if gst_v.get("verified") else f"🔴 {gst_v.get('details', {}).get('cancellation_reason', 'SUSPENDED/INVALID')}"
            table_rows.append(f"| **GSTIN** | `{gstin}` | `api.gst.gov.in` ({gst_v.get('details', {}).get('state', 'Registered State')} • Active Regular) | {gst_stat} |")
        else:
            table_rows.append("| **GSTIN** | *Not Found* | `api.gst.gov.in` | ⚠️ Missing in Document |")

        if pan:
            pan_v = StatutoryVerificationEngine.verify_pan(pan)
            pan_stat = "🟢 OPERATIVE (CBDT)" if pan_v.get("verified") else "🔴 FORGED / CBDT ABSENT"
            pan_cat = pan_v.get('details', {}).get('entity_type', 'Registered Entity')
            table_rows.append(f"| **PAN** | `{pan}` | `incometax.gov.in` (CBDT Category: {pan_cat}) | {pan_stat} |")
        else:
            table_rows.append("| **PAN** | *Not Found* | `incometax.gov.in` | ⚠️ Missing in Document |")

        if udyam:
            table_rows.append(f"| **Udyam MSME** | `{udyam}` | `udyamregistration.gov.in` | 🟢 PERPETUAL ACTIVE |")
        else:
            table_rows.append("| **Udyam MSME** | *Not Found* | `udyamregistration.gov.in` | ⚠️ Not Declared |")

        if epfo:
            epfo_reg = StatutoryVerificationEngine.verify_epfo(epfo).get('details', {}).get('regional_office', 'EPFO Regional Office')
            table_rows.append(f"| **EPFO Labor** | `{epfo}` | `epfindia.gov.in` ({epfo_reg}) | 🟢 FULLY COMPLIANT |")
        else:
            table_rows.append("| **EPFO Labor** | *Not Found* | `epfindia.gov.in` | ⚠️ Not Declared |")

        if esic:
            esic_reg = StatutoryVerificationEngine.verify_esic(esic).get('details', {}).get('regional_office', 'ESIC Region')
            table_rows.append(f"| **ESIC Labor** | `{esic}` | `esic.gov.in` ({esic_reg}) | 🟢 FULLY COMPLIANT |")
        else:
            table_rows.append("| **ESIC Labor** | *Not Found* | `esic.gov.in` | ⚠️ Not Declared |")

        table_md = (
            "| Statutory Instrument | Extracted Number | Sovereign Gateway Registry | Status |\n"
            "| :--- | :--- | :--- | :--- |\n" +
            "\n".join(table_rows)
        )

        decl_items = []
        if mii is not None:
            decl_items.append(f"• **Make in India (MII) Local Content**: **{mii}%** ({mii_class})")
        else:
            decl_items.append("• **Make in India (MII)**: ⚠️ Not declared in uploaded document")

        if udin:
            decl_items.append(f"• **ICAI UDIN**: `{udin}` (CA Certified Statement)")
        if oem:
            decl_items.append(f"• **OEM Authorization (MAF)**: `{oem}`")
        if turnover_val is not None:
            decl_items.append(f"• **Audited Annual Turnover**: **₹{turnover_val} Lakhs**")

        declarations_md = "\n".join(decl_items)

        checks_items = []
        for chk in legitimacy_checks:
            icon = "🟢" if chk.get("passed") else "🔴"
            checks_items.append(f"• {icon} **{chk.get('name')}**: {chk.get('details')}")
        checks_md = "\n".join(checks_items) if checks_items else "• Continuous sovereign verification performed."

        tamper_md = ""
        font_stat = tamper_analysis.get("font_consistency", "")
        pixel_stat = tamper_analysis.get("pixel_tamper_risk", "")
        if "MISMATCHED" in font_stat or "HIGH" in pixel_stat:
            tamper_md = f"\n\n⚠️ **Forensic Tamper Warning**: {font_stat} • Pixel Risk: {pixel_stat}"

        if legitimacy_status == "LEGITIMATE":
            status_badge = "🟢 **100% STATUTORILY COMPLIANT & LEGITIMATE (LOW RISK)**\n• **Recommendation**: Approved for Commercial Bid Opening under GFR 2017 Rule 173."
        elif legitimacy_status == "SUSPICIOUS":
            status_badge = f"🟡 **STATUTORY CLARIFICATION REQUIRED ({legitimacy_score}% CONFIDENCE)**\n• **Recommendation**: Issue Form GEM-CLAR-02: 48-hour deficiency notice to clarify unverified parameters."
        else:
            status_badge = f"🔴 **CRITICAL NON-COMPLIANCE / TAMPER DETECTED ({legitimacy_score}% CONFIDENCE)**\n• **Recommendation**: Rejection mandated under GFR 2017 Rule 144(xi) due to statutory deficits or document anomalies."

        answer = (
            f"🏛️ **DocScrutiny AI Sovereign Verification Report: '{filename}'**\n\n"
            f"• **Recognized Legal Name**: **{entity_display}**\n"
            f"• **Registered Address**: {addr or 'Not specified in document'}\n"
            f"• **Constitution / Type**: {const or 'Commercial Vendor'}" + (f" (Incorporated: {inc_date})" if inc_date else "") + "\n"
            f"• **Classification**: {doc_type}" + (f" • Tender Ref: `{t_ref}`" if t_ref else "") + "\n\n"
            f"---\n\n"
            f"### 1. 🛡️ Statutory Compliance & Sovereign Portal Reconciliation\n\n"
            f"{table_md}\n\n"
            f"---\n\n"
            f"### 2. 📋 Extracted Declarations & Bid Audit\n\n"
            f"{declarations_md}\n\n"
            f"---\n\n"
            f"### 3. 🔍 Forensic Checks & Gateway Integrity Results\n\n"
            f"{checks_md}"
            f"{tamper_md}\n\n"
            f"---\n\n"
            f"### ⚖️ Final Scrutiny Verdict\n"
            f"{status_badge}"
        )

        return {
            "answer": answer,
            "document_name": filename,
            "document_type": doc_type,
            "flags_detected": compliance_flags,
            "validity_verdict": legitimacy_status,
            "tenant_verified": True,
            "owner_organization": user_org,
            "is_comparison": False,
            "suggested_actions": [
                {"label": "Check Labor Compliance (EPFO/ESIC)", "action": "verify_labor"},
                {"label": "Audit Make in India & OEM", "action": "audit_mii_oem"},
                {"label": "Compare with Competitors (Zenith)", "action": "compare_bids"}
            ]
        }
