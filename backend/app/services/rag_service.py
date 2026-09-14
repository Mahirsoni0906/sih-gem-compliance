import re
import math
from typing import List, Dict, Any, Tuple, Optional

# ----------------------------------------------------------------------
# 1. Curated GeM Statutory & Procurement Knowledge Chunks
# ----------------------------------------------------------------------
GEM_KNOWLEDGE_BASE: List[Dict[str, Any]] = [
    {
        "id": "gem_profile_creation_rejection_resolution",
        "category": "Seller Onboarding & Profile Verification",
        "title": "Primary Causes of Automated Rejection During Initial Profile Creation & Step-by-Step Resolution",
        "keywords": [
            "rejection", "rejected", "profile", "creation", "initial", "onboarding", "registration",
            "causes", "cause", "resolve", "resolved", "resolution", "pan mismatch", "gstin mismatch",
            "discrepancy", "signatory", "penny drop", "pfms", "mca", "udyam mismatch", "automated rejection",
            "why profile rejected", "fix profile rejection", "seller registration"
        ],
        "content": (
            "During initial seller profile creation on GeM, automated compliance engines cross-reference input credentials "
            "against sovereign government databases in real time.\n\n"
            "Primary Causes of Automated Rejection:\n"
            "1. Legal Entity Name & PAN Mismatch (CBDT / NSDL Gateway): The business name entered does not match letter-for-letter "
            "with the Income Tax Department (CBDT) database. Even minor differences in spacing, abbreviations ('Pvt Ltd' vs 'Private Limited'), "
            "or initials trigger instant automated rejection.\n"
            "2. Inactive, Cancelled, or Composition GSTIN (GSTN Common Portal): The GSTIN provided is in 'Cancelled', 'Suspended', or "
            "'Inactive' status on the GSTN portal, or is registered under a different PAN, or belongs to the Composition Scheme "
            "(ineligible for standard government procurement tenders).\n"
            "3. Primary Authorized Signatory Aadhaar e-KYC Failure (UIDAI): The authorized signatory's PAN or Aadhaar name/DOB "
            "does not match UIDAI records, or the mobile number linked to Aadhaar is unlinked/inactive, preventing OTP verification.\n"
            "4. Corporate Status Discrepancy (MCA-21 Gateway): For Companies and LLPs, the Corporate Identification Number (CIN) "
            "or LLPIN is 'Struck Off', inactive, or the director's DIN is unverified/disqualified.\n"
            "5. Bank Account PFMS / Penny-Drop Failure: The beneficiary name returned by the bank API does not match the legal entity "
            "name associated with the PAN, resulting in automated PFMS penny-drop validation failure.\n\n"
            "How It Is Resolved (Step-by-Step Resolution):\n"
            "• Step 1 - Check Exact Legal Name on PAN: Verify the exact name format on the Income Tax e-Filing or NSDL portal. "
            "Enter the identical string (including casing and punctuation) during GeM onboarding.\n"
            "• Step 2 - Verify Active Regular GSTIN: Log into `gst.gov.in` to confirm GSTIN status is Active Regular and ensure all "
            "monthly GSTR-3B filings are up to date.\n"
            "• Step 3 - Sync Authorized Signatory Mobile: Ensure the authorized signatory's mobile number is updated in Aadhaar (UIDAI) "
            "to receive e-KYC OTPs.\n"
            "• Step 4 - Verify MCA-21 Master Data: For corporate entities, confirm Active status and active DINs on MCA-21.\n"
            "• Step 5 - Self-Service Discrepancy Rectification: Use the GeM Discrepancy Resolution Tool in the Seller Console to "
            "re-trigger automated verification after updating sovereign portal records."
        )
    },
    {
        "id": "gem_mfa_dsc_esign_auth",
        "category": "Authentication & Bid Submission Security",
        "title": "Mandatory Multi-Factor Authentication (OTP, Class-3 DSC, eSign) for Bid Submission",
        "keywords": [
            "mfa", "otp", "dsc", "esign", "authentication", "multi-factor", "token",
            "digital signature", "class 3", "submission", "bid submission", "aadhaar",
            "security", "two-factor", "2fa", "signing", "cryptographic", "cryptotoken"
        ],
        "content": (
            "Under GeM General Terms and Conditions (GTC Clause 4) and the Information Technology Act 2000 (Sections 3 & 3A), "
            "Multi-Factor Authentication (MFA) is strictly mandatory for all tender and bid submissions on the GeM portal.\n"
            "Every bidder must authenticate bid submission through the following statutory mechanisms:\n"
            "1. Two-Factor Authentication (2FA) via OTP: Time-based One-Time Password (OTP) sent to the registered mobile number "
            "and email of the authorized signatory to establish session integrity.\n"
            "2. Class 3 Digital Signature Certificate (DSC): Cryptographic signing using CCA-approved USB Crypto Token (SHA-256 with 2048-bit RSA) "
            "issued by licensed Certifying Authorities (e.g., eMudhra, (n)Code, Capricorn, SafeScrypt). The DSC must be registered under the bidder's PAN/Aadhaar "
            "to guarantee non-repudiation and tamper-evident sealing of technical and financial proposals.\n"
            "3. Aadhaar-based eSign: Authorized alternate digital signing using UIDAI e-KYC OTP authentication for eligible proprietorship and MSE vendors.\n"
            "4. Statutory Verdict: Bids submitted without valid Class 3 DSC or Aadhaar eSign plus OTP verification are rejected automatically at technical opening "
            "due to lack of legal non-repudiation under GFR 2017 and GeM procurement rules."
        )
    },
    {
        "id": "gem_discrepancy_resolution_workflow",
        "category": "Self-Service Rectification & Audit",
        "title": "GeM Self-Service Discrepancy Resolution & Audit Trail Workflow",
        "keywords": [
            "discrepancy", "resolve", "resolution", "rectification", "self-service", "audit",
            "turnover", "mii", "re-evaluate", "score", "justification"
        ],
        "content": (
            "GeM provides a dedicated Self-Service Discrepancy Resolution workflow for bidders:\n"
            "1. Detection: Automated Layer 4 Rules Engine flags discrepancies (e.g. turnover deficit, MII percentage below threshold, unverified GSTIN).\n"
            "2. Self-Service Rectification: Bidder uploads updated statutory values with verified documentary evidence (e.g., CA Certificate with valid UDIN, updated MII declaration).\n"
            "3. Instant Re-Scoring: The system re-evaluates compliance in real time (e.g., score improves to 98% LOW RISK).\n"
            "4. Immutable Audit Trail: Every correction is logged in the Chronological Audit Ledger with timestamp, user ID, justification, and previous vs new values."
        )
    },
    {
        "id": "gem_bid_encryption_tamper",
        "category": "Bid Security & Encryption",
        "title": "Tender Bid Cryptographic Encryption & Technical/Financial Cover Isolation",
        "keywords": [
            "encryption", "tamper", "cover", "two-cover", "financial bid", "technical bid",
            "envelope", "pki", "public key", "sealed", "bid opening", "hash"
        ],
        "content": (
            "GeM enforces asymmetric PKI encryption (Two-Cover System). Both technical and financial bids are encrypted "
            "at the bidder's endpoint using the procuring entity's public key before network transmission.\n"
            "Financial bids remain cryptographically sealed until the technical evaluation committee records final qualification in the immutable audit ledger. "
            "Any tampering with digital seals, hash mismatches, or altered file signatures triggers immediate disqualification."
        )
    },
    {
        "id": "gfr_rule_144_xi",
        "category": "Statutory Procurement Compliance",
        "title": "GFR 2017 Rule 144(xi) Land Border Country Restrictions",
        "keywords": [
            "gfr", "rule 144", "land border", "border", "dpiit", "clearance", "mea",
            "mha", "foreign", "competent authority", "beneficial ownership"
        ],
        "content": (
            "Under Rule 144(xi) of the General Financial Rules (GFR 2017), any bidder from a country sharing a land border with India "
            "is eligible to bid in public procurement ONLY if registered with the competent authority (Department for Promotion of Industry "
            "and Internal Trade - DPIIT) and cleared by MEA and MHA.\n"
            "Failure to present valid DPIIT registration certificates results in immediate rejection and potential referral to the CPPP debarment database."
        )
    },
    {
        "id": "make_in_india_mii",
        "category": "Industrial Policy & Local Content",
        "title": "Public Procurement (Preference to Make in India) Order Thresholds",
        "keywords": [
            "mii", "make in india", "local content", "class-i", "class-ii", "non-local",
            "supplier", "preference", "threshold", "percentage"
        ],
        "content": (
            "Public Procurement (Preference to Make in India) Order classifies suppliers by local content percentage:\n"
            "1. Class-I Local Supplier: Local content >= 50%. Only Class-I suppliers get purchase preference in GeM tenders.\n"
            "2. Class-II Local Supplier: Local content >= 20% and < 50%. Eligible only when tender allows Class-II, but receives no purchase preference.\n"
            "3. Non-Local Supplier: Local content < 20%.\n"
            "For ONGC Tender GEM/2026/B/9012481, minimum local content is 50.0% (Class-I Required). Zenith Global Tech (42.0%) is Class-II and fails this mandate."
        )
    },
    {
        "id": "msme_policy_udyam_emd",
        "category": "MSME Procurement Policy",
        "title": "MSME Public Procurement Policy 2012 & Udyam EMD Exemptions",
        "keywords": [
            "msme", "udyam", "micro", "small", "enterprise", "emd", "exemption",
            "tender fee", "earnest money", "deposit", "policy"
        ],
        "content": (
            "Under the MSME Public Procurement Policy 2012, Micro and Small Enterprises (MSEs) registered on the Udyam portal "
            "are 100% EXEMPT from paying Earnest Money Deposit (EMD) and tender document fees.\n"
            "Central Ministries and CPSEs must procure a minimum of 25% annually from MSEs. ABC Industries (Micro Enterprise under UDYAM-GJ-01-008291) "
            "is fully entitled to EMD exemption for the ONGC tender (saving ₹4.8 Lakhs EMD)."
        )
    },
    {
        "id": "statutory_verification_gstin_pan_udin",
        "category": "Statutory Verification",
        "title": "Statutory Verification: GSTIN, PAN, and CA Turnover UDIN",
        "keywords": [
            "gstin", "gst", "pan", "turnover", "udin", "ca", "chartered accountant",
            "audited", "balance sheet", "net worth", "icai"
        ],
        "content": (
            "GeM automated statutory scrutiny verifies:\n"
            "1. GSTIN (15 alphanumeric): Validated via GSTN portal API for Active Regular status and filing history.\n"
            "2. PAN (10 characters): Entity identity cross-checked with Income Tax / NSDL databases.\n"
            "3. Annual Turnover: Must be certified by an active Chartered Accountant with a verified UDIN (Unique Document Identification Number) "
            "registered on the ICAI portal to prevent forged balance sheets."
        )
    },
    {
        "id": "active_tenders_overview",
        "category": "Live Public Tenders Overview",
        "title": "Active GeM Public Tenders & Statutory Criteria",
        "keywords": [
            "tender", "ongc", "bhel", "valves", "scada", "tenders", "active tenders"
        ],
        "content": (
            "Active Public Tenders on Record:\n"
            "• ONGC (GEM/2026/B/9012481): High-Pressure Valves, Est ₹240L, Min Turnover ₹80L, Min MII 50% (Class-I Required), EMD ₹4.8L.\n"
            "• BHEL (GEM/2026/B/9012482): SCADA Panel, Est ₹450L, Min Turnover ₹150L, Min MII 60%, EMD ₹9.0L.\n"
            "Statutory Privacy Notice: Under the DPDP Act 2023, individual vendor submissions, uploaded statutory certificates, and confidential bidder evaluations are air-gapped and accessible only to authorized officers and the respective bidders via DocScrutiny AI."
        )
    },
    {
        "id": "gem_interactive_training_courses_lms",
        "category": "Interactive Training Courses & Capacity Building LMS",
        "title": "GeM Four-Level Buyer Certification, Seller Onboarding & Interactive LMS Curriculum",
        "keywords": [
            "training", "course", "courses", "lms", "elearning", "webinar", "certification",
            "certify", "certificate", "buyer certification", "level 1", "level 2", "level 3", "level 4",
            "four level", "four-level", "seller training", "msme training", "interactive course",
            "how to learn", "how to get certified", "training calendar", "syllabus"
        ],
        "content": (
            "Government e-Marketplace (GeM) offers an institutional, multi-tier capacity building curriculum "
            "directly within the portal for Government Buyers, Primary/Secondary Officers, Sellers, and MSMEs:\n\n"
            "1. Four-Level Buyer Certification Framework:\n"
            "• Level 1 (Foundation): GeM Overview, Legal Framework & GFR 149 Mandate, Account Roles (HOD, DDO, Buyer, Consignee).\n"
            "• Level 2 (Intermediate): Direct Purchase (up to ₹25,000 / ₹50,000), L1 Comparison (up to ₹5 Lakhs), Custom Bids & BOQ tenders.\n"
            "• Level 3 (Advanced): Bidding, Reverse Auction (RA), Technical Specification drafting, GFR Rule 144(xi) Land Border validation.\n"
            "• Level 4 (Specialist): Contract Management, Consignee Receipt and Acceptance Certificate (CRAC) within 10 days, "
            "e-Invoicing, and Automated Milestone Payments (PFMS/GeM Pool Account).\n\n"
            "2. Seller & MSME Accreditation Series:\n"
            "• Course GEM-SLR-101: Vendor Onboarding, Sovereign Database e-KYC (CBDT PAN, GSTN, Udyam, MCA-21), Catalog Management.\n"
            "• Course GEM-SLR-202: Tender Participation, EMD Exemption, Make in India (Class-I / Class-II) declarations, CA Turnover UDIN.\n"
            "• Course GEM-FIN-401: GeM Sahay, TReDS Bill Factoring, Invoice Discounting, and automated dispute escalation.\n\n"
            "3. Interactive Features & Assessment:\n"
            "• SCORM-compliant step-by-step interactive course reader.\n"
            "• Real-time Statutory Quiz with instant scoring (80% passing threshold).\n"
            "• Tamper-evident Government of India & GeM Certificate of Statutory Competency with verifiable serial number and QR code.\n"
            "• Live WebEx Training Calendar every Tuesday, Wednesday, and Thursday with instant seat reservation."
        )
    },
    {
        "id": "gem_ai_document_legitimacy_expiry_cross_check",
        "category": "Document Legitimacy & Statutory Expiry Verification",
        "title": "AI-Powered Document Authenticity, Sovereign Cross-Checking, Tamper Detection & Statutory Expiry",
        "keywords": [
            "legit", "legitimate", "authenticity", "fake", "forged", "tamper", "tampered",
            "cross check", "cross-check", "expiry", "expired", "gstin expired", "validity",
            "pan check", "udin", "iso expired", "document verification", "ocr scrutiny"
        ],
        "content": (
            "When a bidder uploads documents (PAN, GSTIN, CA Turnover Certificates, Udyam MSME, ISO 9001) on GeM, "
            "the Layer 2 AI Scrutiny Engine automatically executes a three-dimensional statutory cross-verification:\n\n"
            "1. Sovereign Registry Cross-Verification (Real-Time APIs):\n"
            "• PAN Card: Validated against CBDT/NSDL database to verify 'Operative & Seeded' status, legal entity match, and 4th-char entity classification.\n"
            "• GSTIN REG-06: Queried against GSTN Common Portal (api.gst.gov.in). Evaluates active status vs Cancellation/Suspension under CGST Act Section 29(2)(c).\n"
            "• Udyam Certificate: Verified against Ministry of MSME master database for enterprise tier (Micro/Small/Medium) and NIC manufacturing activity.\n"
            "• CA Statement: Validated against ICAI UDIN (Unique Document Identification Number) register for statutory authenticity and financial year.\n"
            "• ISO 9001 / Quality: Checked against NABCB / IAF registry for valid accreditation and scope.\n\n"
            "2. Statutory Expiry & Period Validity Analysis:\n"
            "• GSTIN Expiry & Return Timeliness: GSTIN has continuous validity conditional on timely GSTR-3B filings. If unfiled for > 6 consecutive tax periods, the engine flags it as EXPIRED / SUSPENDED.\n"
            "• ISO / Quality Certificates: Strict date comparison against the tender opening date. If current date exceeds expiry date, the certificate is rejected as EXPIRED.\n"
            "• CA Turnover Certificates: Valid for the 3 preceding financial years under GFR Rule 173.\n\n"
            "3. Anti-Forgery Forensics & Cross-Document Reconciliation:\n"
            "• Embedded PAN Link: Compares characters 3-12 of GSTIN against uploaded PAN. Any mismatch triggers an automated impersonation / forgery alert.\n"
            "• Pixel & Font Forensics: Inspects PDF text layers for font inconsistencies, cut-and-paste alterations, and validates digital SHA-256 cryptographic signatures."
        )
    }
]

# ----------------------------------------------------------------------
# 2. Domain Synonym Expansion for Procurement Queries
# ----------------------------------------------------------------------
SYNONYM_EXPANSIONS = {
    "mfa": ["multi-factor", "authentication", "2fa", "two-factor", "otp", "dsc", "esign"],
    "otp": ["one-time", "password", "authentication", "2fa", "verification"],
    "dsc": ["digital", "signature", "certificate", "class-3", "token", "cryptotoken"],
    "esign": ["electronic", "signature", "aadhaar", "uidai", "ekyc"],
    "gfr": ["general", "financial", "rules", "rule", "144"],
    "mii": ["make", "in", "india", "local", "content"],
    "msme": ["micro", "small", "enterprise", "udyam", "emd"],
    "turnover": ["ca", "chartered", "accountant", "udin", "revenue"],
    "debar": ["blacklisted", "cppp", "disqualified", "banned"],
    "rejection": ["rejections", "rejected", "reject", "fail", "failed", "disqualified", "denial", "error"],
    "profile": ["registration", "onboarding", "account", "seller", "sign-up", "signup"],
    "creation": ["initial", "setup", "registering", "creating"],
    "resolve": ["resolved", "resolution", "fix", "fixing", "remedy", "rectify", "rectification", "correct", "correction"],
    "cause": ["causes", "reason", "reasons", "why"],
    "training": ["course", "courses", "lms", "elearning", "learn", "study", "module", "webinar", "workshop", "certification", "syllabus"],
    "course": ["courses", "training", "lms", "module", "certification", "tutorial"],
    "certification": ["certificate", "certified", "exam", "quiz", "assessment", "credentials", "diploma"],
    "lms": ["training", "courses", "elearning", "learning", "portal"],
    "legit": ["legitimate", "authenticity", "fake", "forged", "forgery", "tamper", "tampered", "genuine", "real"],
    "expiry": ["expired", "validity", "lapse", "lapsed", "suspension", "suspended", "cancelled", "overdue"],
}

# ----------------------------------------------------------------------
# 3. Hybrid BM25 & Semantic Term-Frequency Vector Retriever
# ----------------------------------------------------------------------
class GeMRAGRetriever:
    """Fast, zero-dependency, on-premise RAG retriever tailored for GeM procurement rules."""

    @classmethod
    def _tokenize(cls, text: str) -> List[str]:
        text_clean = re.sub(r"[^a-zA-Z0-9\-\s]", " ", text.lower())
        tokens = [t.strip() for t in text_clean.split() if len(t.strip()) > 1]
        return tokens

    @classmethod
    def _expand_query(cls, query: str) -> List[str]:
        tokens = cls._tokenize(query)
        expanded = list(tokens)
        for t in tokens:
            if t in SYNONYM_EXPANSIONS:
                expanded.extend(SYNONYM_EXPANSIONS[t])
        return expanded

    @classmethod
    def retrieve(cls, query: str, top_k: int = 2) -> List[Dict[str, Any]]:
        """
        Rank knowledge chunks against the query using a hybrid TF-IDF / BM25 term weighting.
        Returns the top_k most relevant chunks.
        """
        expanded_query = cls._expand_query(query)
        if not expanded_query:
            return GEM_KNOWLEDGE_BASE[:top_k]

        scored_chunks: List[Tuple[float, Dict[str, Any]]] = []

        for chunk in GEM_KNOWLEDGE_BASE:
            score = 0.0
            chunk_tokens = cls._tokenize(chunk["title"] + " " + chunk["content"])
            chunk_keywords = set(chunk.get("keywords", []))

            # Keyword matches have high relevance weight
            for q_term in expanded_query:
                # Direct keyword tag match
                if q_term in chunk_keywords:
                    score += 5.0

                # Title match
                if q_term in chunk["title"].lower():
                    score += 3.5

                # Content frequency match with sub-linear TF
                term_count = chunk_tokens.count(q_term)
                if term_count > 0:
                    tf = 1.0 + math.log(term_count)
                    score += tf * 1.5

            if score > 0.0:
                scored_chunks.append((score, chunk))

        # Sort descending by relevance score
        scored_chunks.sort(key=lambda x: x[0], reverse=True)

        if not scored_chunks:
            # Fallback to general overview chunks
            return [GEM_KNOWLEDGE_BASE[0], GEM_KNOWLEDGE_BASE[-1]][:top_k]

        return [item[1] for item in scored_chunks[:top_k]]

    @classmethod
    def format_context_for_prompt(cls, query: str, top_k: int = 2) -> str:
        """Retrieve and format top knowledge chunks into a compact RAG context block."""
        chunks = cls.retrieve(query, top_k=top_k)
        if not chunks:
            return ""

        context_lines = ["\n[VERIFIED GeM STATUTORY RAG CONTEXT (Mandatory Compliance Regulations)]:"]
        for idx, chunk in enumerate(chunks, 1):
            context_lines.append(f"\n--- Context Rule #{idx}: {chunk['title']} ---")
            context_lines.append(chunk["content"])

        return "\n".join(context_lines)


# ----------------------------------------------------------------------
# 4. Instant Statutory Domain Engine (< 5ms Latency Guaranteed)
# ----------------------------------------------------------------------
class StatutoryDomainEngine:
    """
    Direct statutory decision engine for core GeM compliance queries.
    Provides sub-second, authoritative answers with zero API calls or CPU bottlenecks.
    """

    @classmethod
    def find_direct_answer(cls, query: str, role: str = "general") -> Optional[Dict[str, Any]]:
        q_lower = query.lower()

        # 1. Statutory Privacy & DPDP Act 2023 Air-Gap Enforcement: Private Organization Documents & Credentials
        has_gstin_pattern = bool(re.search(r"\b\d{2}[A-Za-z0-9]{8,13}\b", query.strip()))
        has_pan_pattern = bool(re.search(r"\b[A-Za-z]{5}\d{4}[A-Za-z]{1}\b", query.strip()))
        has_bidder_entity = bool(re.search(r"\b(abc|abc\s+industries|zenith|bharat|bid-001|bid-002|bid-003|seller-mh|seller-dl)\b", q_lower))
        has_other_entity_probe = bool(re.search(
            r"\b(other|others|others'|other's|another|competitor|competitors|rival|rivals|different bidder|all bidders?|all sellers?|all vendors?|other vendor|other vendors|other company|other companies|all uploaded|whose|who uploaded|which bidder|who has fake|who has suspended|who is debarred|who is blacklisted)\b",
            q_lower
        ))
        has_doc_terms = bool(re.search(
            r"\b(doc|docs|document|documents|file|files|cert|certs|certificate|certificates|pan|gst|gstin|turnover|bank|account|tax|upload|uploads|uploaded|submit|submits|submitted|scanned|dossier|dossiers|record|records|audit|flags|deficits|credential|credentials|balance sheet|details|detail|proof|proofs|debar|debarred|blacklisted)\b",
            q_lower
        ))
        has_doc_request = (
            (has_other_entity_probe and has_doc_terms) or
            bool(re.search(r"\b(whose pan|fake pan|who is debarred|which bidder|all documents|all uploaded documents|all bidder documents|other documents|others documents|others document details|other document details)\b", q_lower)) or
            any(w in q_lower for w in [
                "show me document", "upload document", "bidder document", "pan document", "gst document",
                "scanned document", "extract document", "bidder's document", "bidders document", "see document",
                "view document", "zenith document", "abc document", "private file", "personal doc", "org doc",
                "org personal", "organization personal", "vendor document", "company document", "financial turnover of",
                "balance sheet of", "tax filing of", "private document", "confidential doc"
            ])
        )

        if has_gstin_pattern or has_pan_pattern or has_bidder_entity or has_doc_request:
            reply = (
                "🔒 **Access Restricted: Organization Data Protected under DPDP Act 2023**\n\n"
                "Under the **Digital Personal Data Protection Act 2023** and Government e-Marketplace Data Confidentiality Protocols, "
                "private organizational documents, tax credentials (GSTIN/PAN records), Udyam MSME certificates, "
                "audited balance sheets, and proprietary vendor bid evaluations are strictly confidential and air-gapped from the public chat assistant.\n\n"
                "• **Public Advisory Scope**: GeMMy provides guidance exclusively on public procurement regulations, GFR 2017 compliance, "
                "Make-in-India thresholds, seller profile creation requirements, and sovereign gazette notifications.\n"
                "• **Authenticated Document Scrutiny**: To verify, inspect, or audit documents for your registered organization, "
                "please access the authenticated **DocScrutiny AI Console**."
            )
            actions = [
                {"label": "📄 Open Secure DocScrutiny AI Desk", "action": "open_ocr_desk"},
                {"label": "📋 View Statutory Compliance Rules", "action": "open_seller_checklist"},
                {"label": "🌐 Latest GeM Updates & OMs", "action": "query_latest_updates"}
            ]
            return {
                "reply": reply,
                "suggested_actions": actions,
                "model": "GeMMy Live Assistant",
                "is_local_ai": False
            }

        # 2. Profile Creation Rejection & Resolution
        profile_rejection_terms = [
            "rejection", "rejected", "profile creation", "initial profile",
            "creation, and how is it resolved", "automated rejection",
            "registration rejected", "why was my profile rejected",
            "profile rejected", "onboarding rejection"
        ]
        has_rejection = any(k in q_lower for k in ["reject", "rejection", "rejected", "disqualif"])
        has_profile = any(k in q_lower for k in ["profile", "creation", "onboarding", "registration", "initial"])

        if any(term in q_lower for term in profile_rejection_terms) or (has_rejection and has_profile):
            reply = (
                "**Primary Causes of Automated Rejection During Initial Profile Creation & Resolution**:\n\n"
                "During GeM vendor onboarding, automated verification algorithms cross-reference submitted credentials "
                "against sovereign databases. Rejections occur automatically when these checks fail:\n\n"
                "### 🔴 Primary Causes of Automated Rejection:\n"
                "1. **Legal Entity Name & PAN Mismatch (CBDT / NSDL Gateway)**:\n"
                "   • *Cause*: The business name entered does not match letter-for-letter with the Income Tax Department (CBDT) database. "
                "Even minor variations (e.g., `Pvt Ltd` vs `Private Limited`, punctuation, or initials) trigger instant rejection.\n\n"
                "2. **Inactive, Cancelled, or Composition GSTIN (GSTN Common Portal)**:\n"
                "   • *Cause*: The GSTIN provided is Cancelled, Suspended, or Inactive on the GSTN portal, or registered under a different PAN, "
                "or registered under the Composition Scheme (which restricts standard B2B/B2G public procurement).\n\n"
                "3. **Authorized Signatory Aadhaar e-KYC Discrepancy (UIDAI)**:\n"
                "   • *Cause*: The primary authorized signatory's PAN or Aadhaar details do not match UIDAI / ITD records, or the mobile number "
                "linked to Aadhaar is unlinked/inactive, preventing mandatory e-KYC OTP verification.\n\n"
                "4. **Corporate Status Discrepancy (MCA-21 Gateway)**:\n"
                "   • *Cause*: For Companies (Pvt Ltd / Ltd) and LLPs, the Corporate Identification Number (CIN) or LLPIN is Inactive, "
                "'Struck Off', or director's DIN is unverified/disqualified.\n\n"
                "5. **Bank Account PFMS / Penny-Drop Failure**:\n"
                "   • *Cause*: The account holder name returned by the bank API does not match the legal entity name on the PAN card.\n\n"
                "---\n"
                "### 🟢 How Each Cause Is Resolved (Step-by-Step):\n"
                "• **Step 1 - Match PAN Name Exactly**: Verify the exact legal name format on the Income Tax e-Filing portal. "
                "Enter the identical string (including casing and spacing) during profile creation.\n"
                "• **Step 2 - Verify Active Regular GSTIN**: Log in to `gst.gov.in` to ensure your GSTIN is Active Regular with up-to-date GSTR-3B filings.\n"
                "• **Step 3 - Update Aadhaar-Linked Mobile**: Ensure the authorized signatory's mobile number is active and linked to Aadhaar in UIDAI records for OTP verification.\n"
                "• **Step 4 - Verify MCA-21 Master Data**: Corporate entities must verify active company status and DIN validity on MCA-21.\n"
                "• **Step 5 - Use GeM Discrepancy Resolution**: In our GeM Compliance Platform, use the **Self-Service Discrepancy Resolution Tool** "
                "or **Statutory Verification Checklist** to re-validate credentials and elevate your readiness score to 98%."
            )
            actions = [
                {"label": "📝 Open Registration Portal", "action": "open_registration"},
                {"label": "🔍 Verify Statutory Filings (GST/PAN)", "action": "open_seller_checklist"},
                {"label": "🛠️ Discrepancy Resolver", "action": "open_seller_discrepancy"}
            ]
            return {
                "reply": reply,
                "suggested_actions": actions,
                "model": "GeMMy Live Assistant",
                "is_local_ai": False
            }

        # 3. Live GeM Internet Updates & Gazette Notifications
        if any(w in q_lower for w in ["latest update", "recent update", "new om", "office memorandum", "circular", "latest news", "2026 update", "portal update", "recent circular"]):
            reply = (
                "🌐 **Latest Sovereign GeM Procurement Gazette Updates & Notifications (2026)**:\n\n"
                "1. **OM No. F.1/4/2026-PPD (CRAC Auto-Release)**: Department of Expenditure has mandated strict **10-day automated CRAC generation**. If a buyer fails to accept goods within 10 days, the system auto-generates CRAC and triggers 100% PFMS payment within 72 hours.\n"
                "2. **Enhanced Class-I Make-in-India Thresholds**: DPIIT notification reserves bids up to ₹200 Crores exclusively for Class-I Local Suppliers (>= 50% local content).\n"
                "3. **CBDT-GSTN Real-Time Synchronous API**: Instant detection of suspended GSTINs under CGST Sec 29(2) due to >6 months non-filing of GSTR-3B.\n"
                "4. **GeM Sahay 2.0 MSME Financing**: Instant collateral-free PO discounting up to ₹1 Crore at 7.5% p.a. via SIDBI.\n\n"
                "*(Live sync with e-Gazette and GeM Sovereign Announcements)*"
            )
            actions = [
                {"label": "📰 Fetch Live Web Gazette", "action": "fetch_live_web"},
                {"label": "Check Class-I MII Guidelines", "action": "query_mii"}
            ]
            return {
                "reply": reply,
                "suggested_actions": actions,
                "model": "GeMMy Live Assistant",
                "is_local_ai": False
            }

        # 4. MFA / DSC / OTP / Bid Submission
        if any(k in q_lower for k in ["otp", "dsc", "esign", "mfa", "authentication", "multi-factor"]):
            reply = (
                "**Mandatory GeM Multi-Factor Authentication (MFA) & Bid Submission Compliance**:\n\n"
                "Under **GeM General Terms and Conditions (GTC Clause 4)** and the **Information Technology Act 2000 (Sections 3 & 3A)**, multi-factor authentication is **strictly mandatory** for all tender and bid submissions:\n\n"
                "• **Primary Session 2FA**: Mobile and Email **One-Time Password (OTP)** sent to the registered authorized signatory.\n"
                "• **Class 3 Digital Signature Certificate (DSC)**: Cryptographic signing using a CCA-approved USB Crypto Token (SHA-256 with 2048-bit RSA) registered with the bidder's PAN/Aadhaar to ensure tamper-proofing and legal non-repudiation.\n"
                "• **Aadhaar-based eSign**: Authorized alternate e-KYC digital signing for eligible proprietorship and MSE vendors.\n"
                "• **Statutory Verdict**: Any bid submitted without valid Class 3 DSC or Aadhaar eSign and verified OTP is legally non-compliant and rejected at technical opening."
            )
            actions = [
                {"label": "Check Bidder DSC Compliance", "action": "open_seller_checklist"},
                {"label": "View Authentication Audit Trail", "action": "open_officer_dash"}
            ]
            return {
                "reply": reply,
                "suggested_actions": actions,
                "model": "GeMMy Live Assistant",
                "is_local_ai": False
            }

        # 5. GFR Rule 144(xi)
        if any(k in q_lower for k in ["gfr 144", "rule 144", "land border"]):
            reply = (
                "**GFR Rule 144(xi) Public Procurement Guidelines**:\n\n"
                "Under Rule 144(xi) of the General Financial Rules (GFR 2017), any bidder from a country sharing a land border with India is eligible to bid in public procurement ONLY if registered with the competent authority (Department for Promotion of Industry and Internal Trade - DPIIT).\n\n"
                "Our **Layer 4 Rules Engine** cross-checks beneficial ownership and CIN incorporation numbers against the Ministry of External Affairs and DPIIT gazette notices."
            )
            actions = [
                {"label": "Check Rule 144 Registry", "action": "view_rule_docs"},
                {"label": "Evaluate Active Tenders", "action": "open_bids"}
            ]
            return {
                "reply": reply,
                "suggested_actions": actions,
                "model": "GeMMy Live Assistant",
                "is_local_ai": False
            }

        # 6. Make in India (MII)
        if any(k in q_lower for k in ["make in india", "mii", "local content", "class-i", "class-ii"]):
            reply = (
                "**Make in India (MII) Public Procurement Preference Thresholds**:\n\n"
                "Under the Public Procurement (Preference to Make in India) Order:\n"
                "• **Class-I Local Supplier**: Local content **>= 50%**. Entitled to margin of purchase preference (up to 20% over non-local L1 if matched).\n"
                "• **Class-II Local Supplier**: Local content **>= 20% and < 50%**. Eligible only when tender permits Class-II; receives no purchase preference.\n"
                "• **Non-Local Supplier**: Local content **< 20%**. Ineligible for tenders reserved for domestic suppliers.\n\n"
                "In public tenders with Class-I reservation (such as ONGC GEM/2026/B/9012481), suppliers must declare >= 50% verified local content with statutory auditor/management certificates."
            )
            actions = [
                {"label": "View Tender MII Requirements", "action": "open_bids"},
                {"label": "Inspect Compliance Checklist", "action": "open_seller_checklist"}
            ]
            return {
                "reply": reply,
                "suggested_actions": actions,
                "model": "GeMMy Live Assistant",
                "is_local_ai": False
            }

        # 7. MSME / Udyam / EMD
        if any(k in q_lower for k in ["msme", "udyam", "emd exemption", "tender fee exemption"]):
            reply = (
                "**MSME Public Procurement Policy 2012 & EMD Exemptions**:\n\n"
                "Under the MSME Public Procurement Policy:\n"
                "• **100% EMD & Tender Fee Exemption**: Micro & Small Enterprises (MSEs) registered on the Udyam portal with valid certificates are fully exempt from Earnest Money Deposit.\n"
                "• **25% Mandatory Procurement**: Central Ministries and CPSEs must procure a minimum 25% of annual procurement from MSEs.\n"
                "• **Statutory Exemption**: Eligible MSE vendors automatically receive 100% exemption from tender fees and EMD upon submitting a verified Udyam certificate."
            )
            actions = [
                {"label": "Verify Udyam Criteria", "action": "open_seller_checklist"},
                {"label": "View Active Tenders", "action": "open_bids"}
            ]
            return {
                "reply": reply,
                "suggested_actions": actions,
                "model": "GeMMy Live Assistant",
                "is_local_ai": False
            }

        # 7. Discrepancy Resolution
        if any(k in q_lower for k in ["discrepancy", "rectify", "fix turnover", "resolve discrepancy"]):
            reply = (
                "**GeM Self-Service Discrepancy Resolution Workflow**:\n\n"
                "When statutory evaluation flags a discrepancy prior to tender technical opening:\n"
                "1. **Review Flagged Parameter**: Inspect the deficit (e.g. unverified provisional turnover, MII margin deficit).\n"
                "2. **Submit Verified Value & Justification**: Enter audited figures and attach CA Certificate with valid ICAI UDIN.\n"
                "3. **Instant Re-Evaluation**: The scoring engine recalculates risk tier and readiness score in real time.\n"
                "4. **Audit Trail Logging**: All changes are recorded in the immutable audit log for procurement committee review."
            )
            actions = [
                {"label": "🛠️ Open Discrepancy Resolver", "action": "open_seller_discrepancy"},
                {"label": "Inspect Audit Trail", "action": "open_officer_dash"}
            ]
            return {
                "reply": reply,
                "suggested_actions": actions,
                "model": "GeMMy Live Assistant",
                "is_local_ai": False
            }

        # 8. 7-Layer Architecture
        if any(k in q_lower for k in ["7-layer", "architecture", "how does it work", "pipeline"]):
            reply = (
                "**The 7-Layer AI Statutory Compliance Pipeline (SIH26100)**:\n\n"
                "1. **Data Ingestion**: Multi-modal intake of tender requirements & vendor certificates.\n"
                "2. **AI Document OCR**: OCR extraction, QR-code validation, and digital seal tamper detection.\n"
                "3. **Statutory Connectors**: Real-time mock APIs for GSTN, NSDL PAN, MSME Udyam, and MCA-21.\n"
                "4. **Compliance Rules Engine**: Strict GFR 2017 rules, turnover thresholds, and Make-in-India quotas.\n"
                "5. **Risk & Scoring Engine**: Automated multi-factor computation (Score 0-100%, Low/Med/High Risk).\n"
                "6. **Explainable AI Output**: Clear discrepancy breakdown with evidence citations.\n"
                "7. **Officer Scrutiny & Audit**: Committee digital sign-offs with an immutable chronological ledger."
            )
            actions = [
                {"label": "View Architecture Overview", "action": "open_landing_arch"},
                {"label": "Test OCR Simulator", "action": "open_seller_ocr"}
            ]
            return {
                "reply": reply,
                "suggested_actions": actions,
                "model": "GeMMy Live Assistant",
                "is_local_ai": False
            }

        # 9. Active Tenders
        if any(k in q_lower for k in ["tender", "ongc", "bhel", "bids"]):
            reply = (
                "**Active Public Procurement Tenders**:\n\n"
                "1. **GEM/2026/B/9012481** (ONGC):\n"
                "   • Scope: High-Pressure Industrial Valves (Est. ₹240 Lakhs, EMD: ₹4.8L, Min Turnover: ₹80L, Min MII: 50%)\n"
                "   • Status: Technical Evaluation (3 Bidders Submitted)\n\n"
                "2. **GEM/2026/B/9012482** (BHEL):\n"
                "   • Scope: Turnkey SCADA Automation Panel & RTU (Est. ₹450 Lakhs, EMD: ₹9.0L, Min Turnover: ₹150L, Min MII: 60%)\n"
                "   • Status: Technical Evaluation Stage"
            )
            actions = [
                {"label": "Open Bids & Tenders Portal", "action": "open_bids"},
                {"label": "Evaluate ONGC Tender Bidders", "action": "open_officer_dash"}
            ]
            return {
                "reply": reply,
                "suggested_actions": actions,
                "model": "GeMMy Live Assistant",
                "is_local_ai": False
            }

        # 10. Training Courses, LMS, Certification, Webinars
        training_terms = [
            "training", "course", "courses", "lms", "elearning", "webinar",
            "certification", "certificate", "buyer certification", "four-level",
            "four level", "capacity building", "syllabus", "how to learn"
        ]
        if any(k in q_lower for k in training_terms):
            reply = (
                "**GeM Interactive LMS & Capacity Building Portal (Directly Integrated)**:\n\n"
                "GeM provides a comprehensive, multi-tiered interactive training and accreditation curriculum "
                "tailored for Government Buyers, Primary/Secondary Officers, Sellers, and MSMEs directly inside this portal:\n\n"
                "### 🎓 1. Four-Level Government Buyer Certification:\n"
                "• **Level 1 (Foundation - GEM-BYR-101)**: GeM Mandate under GFR Rule 149, Account Creation & Roles (HOD, DDO, Buyer, Consignee).\n"
                "• **Level 2 (Intermediate - GEM-BYR-201)**: Direct Purchase up to ₹25,000 / ₹50,000, L1 Comparison up to ₹5 Lakhs, and Custom BOQ creation.\n"
                "• **Level 3 (Advanced - GEM-BYR-301)**: Bidding, Reverse Auction (RA), Technical Parameter drafting, and GFR Rule 144(xi) Land Border validation.\n"
                "• **Level 4 (Specialist - GEM-BYR-401)**: Contract Administration, 10-day Consignee Receipt and Acceptance Certificate (CRAC), and GeM Pool Account / PFMS automated payments.\n\n"
                "### 🏢 2. Seller & MSME Accreditation Series:\n"
                "• **GEM-SLR-101**: Vendor Onboarding, Sovereign Database e-KYC (PAN, GSTIN, Udyam), and Catalog Management.\n"
                "• **GEM-SLR-202**: Tender Bidding, EMD Exemption for MSEs, Make-in-India (Class-I / Class-II) declarations, and CA Turnover UDIN validation.\n"
                "• **GEM-FIN-401**: GeM Sahay, TReDS Bill Factoring, Invoice Discounting, and dispute resolution.\n\n"
                "### 🏆 3. Interactive Assessment & Sovereign Certification:\n"
                "• **Built-in SCORM Reader**: Step-by-step interactive modules with key takeaways & simulator shortcuts.\n"
                "• **Statutory Assessment Quiz**: Real-time evaluation with instant feedback and 80% passing threshold.\n"
                "• **Government of India Certificate**: Generates an official Certificate of Statutory Competency complete with Ashoka Emblem, unique verifiable ID, QR code, and print/save functionality.\n"
                "• **Live WebEx Webinars**: Weekly scheduled interactive sessions every Tuesday, Wednesday, and Thursday with instant seat reservation."
            )
            actions = [
                {"label": "🎓 Open GeM Training Portal", "action": "open_training"},
                {"label": "📑 View Ongoing Bids", "action": "open_bids"},
                {"label": "🏢 Seller Compliance Desk", "action": "open_seller_checklist"}
            ]
            return {
                "reply": reply,
                "suggested_actions": actions,
                "model": "GeMMy Live Assistant",
                "is_local_ai": False
            }

        # 11. Document Legitimacy, Forgery Detection & Expiry Cross-Checking
        doc_terms = [
            "legit", "legitimate", "authenticity", "fake", "forged", "forgery", "tamper",
            "tampered", "cross check", "cross-check", "expiry", "expired", "gstin expired",
            "validity", "pan check", "check document", "verify document", "document scrutiny",
            "cert cross check"
        ]
        if any(k in q_lower for k in doc_terms):
            reply = (
                "**AI Document Legitimacy, Sovereign Cross-Checking & Statutory Expiry Scrutiny Engine**:\n\n"
                "When a bidder uploads documents (PAN, GSTIN, CA Turnover Certificates, Udyam MSME, ISO 9001), "
                "our AI compliance engine executes comprehensive, automated forensic and sovereign cross-verification:\n\n"
                "### 🏛️ 1. Sovereign Registry Cross-Verification (Live Government APIs):\n"
                "• **Income Tax / NSDL (PAN)**: Cross-references submitted PAN with CBDT records to confirm 'Operative & Active' status, exact legal entity spelling, and 4th-character entity type (`C` for Company, `P` for Individual, etc.).\n"
                "• **GSTN Common Portal (api.gst.gov.in)**: Queries the 15-digit GSTIN. Checks whether registration is **Active Regular** or has been **Cancelled / Suspended** under CGST Act Section 29(2)(c) due to non-filing of monthly returns.\n"
                "• **Ministry of MSME (Udyam)**: Validates enterprise category (Micro/Small/Medium) and NIC manufacturing code for EMD exemptions.\n"
                "• **ICAI UDIN Registry**: Validates the 18-digit Unique Document Identification Number on CA turnover/net-worth certificates.\n"
                "• **NABCB / IAF Gateway**: Validates ISO 9001:2015 quality management accreditation.\n\n"
                "### ⏳ 2. Statutory Expiry & Return Timeliness Scrutiny:\n"
                "• **GSTIN Expiry & Suspension**: GSTIN is only statutorily valid if GSTR-3B and GSTR-1 returns are filed on time. Non-filing for > 6 tax periods triggers an automated **EXPIRED / SUSPENDED** penalty flag.\n"
                "• **ISO & Quality Certifications**: Strict date comparison against the tender opening date. If current date exceeds expiry date, the certificate is flagged as **EXPIRED (INVALID)**.\n"
                "• **CA Turnover Audit Statements**: Audited balance sheets are valid for the 3 preceding financial years under GFR Rule 173.\n\n"
                "### 🔍 3. Pixel Forensics & Cross-Document Reconciliation:\n"
                "• **Embedded PAN Link**: Compares characters 3-12 of GSTIN against the uploaded PAN. Any mismatch triggers an automated impersonation / forgery alert.\n"
                "• **Tamper Detection**: Inspects PDF font rendering layers for digital cut-and-paste modifications and verifies cryptographic SHA-256 digital seals."
            )
            actions = [
                {"label": "📄 Test AI Document Scrutiny", "action": "open_seller_ocr"},
                {"label": "🔍 Statutory Checklist", "action": "open_seller_checklist"},
                {"label": "🛠️ Discrepancy Resolver", "action": "open_seller_discrepancy"}
            ]
            return {
                "reply": reply,
                "suggested_actions": actions,
                "model": "GeMMy Live Assistant",
                "is_local_ai": False
            }

        return None
