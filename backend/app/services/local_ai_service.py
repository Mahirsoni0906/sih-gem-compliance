import os
import re
import asyncio
import httpx
from typing import Dict, Any, Optional, List, Tuple
from dotenv import load_dotenv

# Load environment variables from project root and backend directory
load_dotenv()
_backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
load_dotenv(os.path.join(_backend_dir, ".env"))
load_dotenv(os.path.abspath(os.path.join(_backend_dir, "..", ".env")))

from app.services.rag_service import GeMRAGRetriever
from app.services.web_search_service import LiveGeMWebSearchService

OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://127.0.0.1:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "qwen2.5:1.5b")

GEM_SYSTEM_PROMPT = """You are GeMMy, the official AI Statutory Compliance Assistant for the Government e-Marketplace (GeM), Ministry of Commerce & Industry, Government of India.

Mandate & Authority:
- Provide authoritative, accurate, and concise guidance on Indian Public Procurement Law, General Financial Rules (GFR 2017, including Rule 144, 149, 153, 161), Public Procurement Policy for MSEs Order 2012, Make in India (Class-I / Class-II local content requirements), Consignee Receipt and Acceptance Certificate (CRAC) 10-day auto-generation timelines, and seller onboarding.
- You have real-time live internet access to current GeM Office Memorandums (OMs), gazette notifications, and sovereign procurement circulars.
- Always provide clear, structured, and factual answers with statutory citations where applicable.

STRICT DOCUMENT AIR-GAP MANDATE (DPDP ACT 2023):
- Under the Digital Personal Data Protection Act 2023 and GeM Confidentiality Regulations, you are STRICTLY AIR-GAPPED from all user-uploaded vendor documents, private files, and organization dossiers.
- Under NO circumstances should you pretend to read, audit, summarize, OCR-extract, or verify uploaded files, PDFs, balance sheets, or private vendor dossiers.
- If a user asks you to inspect, read, verify, or audit their uploaded documents or certificates, you MUST politely refuse and instruct them to use the authenticated DocScrutiny AI Desk.
- You must NEVER disclose or hallucinate private organization credentials, PANs, GSTINs, or confidential bidder records in public chat.

Formatting:
- Use clean bullet points, bold statutory terms, and actionable recommendations."""

AIRGAP_DOCUMENT_PATTERNS = [
    r"\b(read|check|inspect|verify|audit|review|scrutinize|analyze|see|view|scan|extract|evaluate)\b.*?\b(my|this|the|our|uploaded|attached)?\s*(uploaded|attached|submitted)?\s*(document|doc|docs|file|files|pdf|cert|certificate|turnover|balance sheet|pan card|gst certificate|bid file)\b",
    r"\b(my|our|this)?\s*(uploaded|attached|submitted)\s+(document|doc|docs|file|files|pdf|cert|certificate|turnover|balance sheet|gst|pan|dossier)\b",
    r"\b(what\s+is\s+in|why\s+did)\s+(my|this|the)\s+(file|doc|document|pdf|upload|certificate)\b",
    r"\b(why\s+did\s+my\s+(file|doc|document|pdf|certificate)\s+(fail|get rejected|fail verification))\b",
    r"\b(doc-abc-\d+|gst_reg06|ca_turnover|pan_corp)\b",
    r"\b(whose pan|fake pan|who is debarred|which bidder|all uploaded documents|other documents|others document details)\b"
]


class LocalAIService:
    """Service to communicate with Google Gemini (Cloud) or sovereign local LLM (Ollama) with RAG retrieval, internet grounding, and strict Document Air-Gap."""

    _cached_model: Optional[str] = None

    @classmethod
    def get_gemini_api_key(cls) -> str:
        """Fetch Gemini API key from environment variables or .env."""
        return os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY") or ""

    @classmethod
    def is_gemini_available(cls) -> bool:
        """Check if Gemini API key is configured."""
        return bool(cls.get_gemini_api_key().strip())

    @classmethod
    def check_document_air_gap(cls, query: str) -> Optional[Dict[str, Any]]:
        """
        Enforce strict DPDP Act 2023 Document Air-Gap.
        Detects if a user is asking GeMMy to read, inspect, or audit private uploaded documents/files.
        """
        q_lower = query.lower()
        for pattern in AIRGAP_DOCUMENT_PATTERNS:
            if re.search(pattern, q_lower):
                return {
                    "reply": (
                        "🔒 **Statutory Document Air-Gap Mandate (DPDP Act 2023)**\n\n"
                        "Under the **Digital Personal Data Protection Act 2023** and Government e-Marketplace Data Confidentiality Protocols, "
                        "**GeMMy AI is strictly air-gapped from all user-uploaded documents, vendor dossiers, and private financial records**.\n\n"
                        "• **GeMMy Advisory Scope**: General public procurement policy, GFR 2017 statutory rules, Make-in-India thresholds, "
                        "seller onboarding procedures, and sovereign gazette notifications.\n"
                        "• **Authenticated Document Scrutiny**: To inspect, OCR-extract, verify, or audit your organization's uploaded certificates and financial statements, "
                        "please access the authenticated **DocScrutiny AI Desk**.\n\n"
                        "Your uploaded files remain private, encrypted, and isolated within the authenticated DocScrutiny AI environment."
                    ),
                    "suggested_actions": [
                        {"label": "📄 Open DocScrutiny AI Desk", "action": "open_ocr_desk"},
                        {"label": "📋 View Statutory Compliance Rules", "action": "open_seller_checklist"},
                        {"label": "🌐 Latest GeM Updates & OMs", "action": "query_latest_updates"}
                    ],
                    "model": "GeMMy Document Air-Gap Guard",
                    "is_local_ai": False,
                    "air_gap_enforced": True
                }
        return None

    @classmethod
    def sanitize_context_for_airgap(cls, context: Optional[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
        """
        Strictly purge any document payloads, file contents, OCR text, or bidder dossiers
        from the incoming context before sending to any LLM.
        """
        if not context:
            return None
        sanitized = {}
        forbidden_keys = {
            "documents", "dossier", "ocr_result", "file_content", "extracted_text",
            "document_id", "bidder_docs", "raw_text", "files", "certificate_data"
        }
        for k, v in context.items():
            if k.lower() not in forbidden_keys:
                sanitized[k] = v
        return sanitized if sanitized else None

    @classmethod
    async def get_active_model(cls) -> str:
        """Dynamically detect whatever model is installed and ready in Ollama (cached)."""
        if cls._cached_model:
            return cls._cached_model

        try:
            async with httpx.AsyncClient(timeout=1.5) as client:
                res = await client.get(f"{OLLAMA_BASE_URL}/api/tags")
                if res.status_code == 200:
                    installed = [m.get("name", "") for m in res.json().get("models", [])]
                    preferred = [
                        "qwen2.5:1.5b", "llama3.2:3b", "llama3.2:1b", 
                        "qwen2.5:3b", "qwen2.5:0.5b", "phi3:mini", "mistral:7b"
                    ]
                    for pref in preferred:
                        for m in installed:
                            if pref in m:
                                cls._cached_model = m
                                return m
                    if installed:
                        cls._cached_model = installed[0]
                        return installed[0]
        except Exception:
            pass

        cls._cached_model = os.getenv("OLLAMA_MODEL", "qwen2.5:1.5b")
        return cls._cached_model

    @classmethod
    async def is_available(cls) -> bool:
        """Check if either Gemini API key or local Ollama daemon is ready."""
        if cls.is_gemini_available():
            return True
        try:
            async with httpx.AsyncClient(timeout=1.5) as client:
                res = await client.get(f"{OLLAMA_BASE_URL}/api/tags")
                if res.status_code == 200:
                    models = res.json().get("models", [])
                    return len(models) > 0
                return False
        except Exception:
            return False

    @classmethod
    async def generate_response(
        cls,
        user_message: str,
        user_role: str = "general",
        context: Optional[Dict[str, Any]] = None,
        timeout_seconds: float = 12.0
    ) -> Optional[Dict[str, Any]]:
        """
        Query AI with RAG-retrieved statutory context, live internet knowledge, and strict Document Air-Gap.
        Supports:
        1. Google Gemini Flash with live Google Search grounding (Primary)
        2. Sovereign local LLM via Ollama (Secondary)
        """
        # Step 1: Enforce Document Air-Gap Check on the query
        air_gap_hit = cls.check_document_air_gap(user_message)
        if air_gap_hit:
            return air_gap_hit

        # Step 2: Strict Context Sanitization (zero documents to LLM)
        sanitized_context = cls.sanitize_context_for_airgap(context)

        # Step 3: Dynamic Domain RAG Retrieval
        rag_context = GeMRAGRetriever.format_context_for_prompt(user_message, top_k=2)

        # Step 4: Live GeM Web Search Grounding (Recent OMs and Circulars)
        live_search_data = await LiveGeMWebSearchService.fetch_live_updates(user_message)
        web_context_str = ""
        if live_search_data and live_search_data.get("articles"):
            articles = live_search_data["articles"][:2]
            art_summaries = [f"• {a.get('title')}: {a.get('summary')}" for a in articles]
            web_context_str = "\n\nLive Internet & GeM Gazette Notifications:\n" + "\n".join(art_summaries)

        full_system_prompt = GEM_SYSTEM_PROMPT
        if rag_context:
            full_system_prompt += f"\n\nStatutory Reference Database:\n{rag_context}"
        if web_context_str:
            full_system_prompt += web_context_str

        # Option A: Google Gemini API (Primary Engine with Live Internet Grounding)
        gemini_key = cls.get_gemini_api_key()
        if gemini_key:
            # Models to attempt: primary gemini-2.5-flash, then gemini-1.5-flash
            candidate_models = ["gemini-2.5-flash", "gemini-1.5-flash"]
            for model_name in candidate_models:
                try:
                    gemini_url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={gemini_key}"
                    
                    # First attempt with Google Search grounding tool
                    payload_with_search = {
                        "contents": [
                            {
                                "role": "user",
                                "parts": [
                                    {"text": f"{full_system_prompt}\n\nUser Question:\n{user_message}"}
                                ]
                            }
                        ],
                        "tools": [
                            {"googleSearch": {}}
                        ],
                        "generationConfig": {
                            "temperature": 0.2,
                            "maxOutputTokens": 900
                        }
                    }

                    async with httpx.AsyncClient(timeout=timeout_seconds) as client:
                        resp = await client.post(gemini_url, json=payload_with_search)
                        
                        # If 400 (e.g. googleSearch tool not supported on specific tier), retry without tool
                        if resp.status_code != 200:
                            payload_standard = {
                                "contents": [
                                    {
                                        "role": "user",
                                        "parts": [
                                            {"text": f"{full_system_prompt}\n\nUser Question:\n{user_message}"}
                                        ]
                                    }
                                ],
                                "generationConfig": {
                                    "temperature": 0.2,
                                    "maxOutputTokens": 900
                                }
                            }
                            resp = await client.post(gemini_url, json=payload_standard)

                        if resp.status_code == 200:
                            data = resp.json()
                            candidates = data.get("candidates", [])
                            if candidates:
                                parts = candidates[0].get("content", {}).get("parts", [])
                                if parts and "text" in parts[0]:
                                    reply_text = parts[0]["text"].strip()
                                    suggested_actions = cls._generate_suggested_actions(user_message, reply_text)
                                    return {
                                        "reply": reply_text,
                                        "suggested_actions": suggested_actions,
                                        "model": f"GeMMy AI ({model_name} Internet-Grounded)",
                                        "is_local_ai": False,
                                        "air_gap_enforced": True
                                    }
                        elif resp.status_code == 404:
                            # Try next model in candidate_models list
                            continue
                        else:
                            print(f"[LocalAIService] Gemini API error ({model_name}): HTTP {resp.status_code}")
                except Exception as e:
                    print(f"[LocalAIService] Gemini API query exception ({model_name}): {repr(e)}")
                    continue

        # Option B: Sovereign Local LLM via Ollama (Fallback)
        try:
            active_model = await cls.get_active_model()
            async with httpx.AsyncClient(timeout=min(timeout_seconds, 4.5)) as client:
                payload = {
                    "model": active_model,
                    "messages": [
                        {"role": "system", "content": full_system_prompt},
                        {"role": "user", "content": user_message}
                    ],
                    "stream": False,
                    "keep_alive": "60m",
                    "options": {
                        "temperature": 0.1,
                        "num_predict": 250,
                        "num_thread": 4
                    }
                }
                response = await client.post(f"{OLLAMA_BASE_URL}/api/chat", json=payload)
                if response.status_code == 200:
                    data = response.json()
                    reply_text = data.get("message", {}).get("content", "").strip()

                    if reply_text:
                        suggested_actions = cls._generate_suggested_actions(user_message, reply_text)
                        return {
                            "reply": reply_text,
                            "suggested_actions": suggested_actions,
                            "model": f"GeMMy Sovereign LLM ({active_model})",
                            "is_local_ai": True,
                            "air_gap_enforced": True
                        }
        except (httpx.TimeoutException, asyncio.TimeoutError):
            print("[LocalAIService] Ollama query timed out; falling back to Statutory Engine.")
        except Exception as e:
            print(f"[LocalAIService] Ollama query bypassed/failed: {repr(e)}")

        return None

    @staticmethod
    def _generate_suggested_actions(user_msg: str, reply_text: str) -> List[Dict[str, str]]:
        """Attach context-sensitive actions for the frontend UI."""
        msg_lower = (user_msg + " " + reply_text).lower()
        actions = []

        if any(k in msg_lower for k in ["rejection", "rejected", "profile", "onboarding", "registration", "resolve"]):
            actions.append({"label": "📝 Open Registration Portal", "action": "open_registration"})
            actions.append({"label": "🔍 Verify Statutory Filings", "action": "open_seller_checklist"})
            actions.append({"label": "🛠️ Discrepancy Resolver", "action": "open_seller_discrepancy"})
        elif any(k in msg_lower for k in ["otp", "dsc", "esign", "mfa", "authentication", "token", "cryptotoken"]):
            actions.append({"label": "Check Bidder DSC Compliance", "action": "open_seller_checklist"})
            actions.append({"label": "View Authentication Audit Trail", "action": "open_officer_dash"})
        elif "tender" in msg_lower or "ongc" in msg_lower or "bhel" in msg_lower:
            actions.append({"label": "Open Bids & Tenders Portal", "action": "open_bids"})
            actions.append({"label": "View Active Tenders", "action": "open_bids"})
        elif "document" in msg_lower or "ocr" in msg_lower or "tamper" in msg_lower or "audit" in msg_lower:
            actions.append({"label": "📄 Open DocScrutiny AI Desk", "action": "open_ocr_desk"})
            actions.append({"label": "📋 View Statutory Compliance Rules", "action": "open_seller_checklist"})
        else:
            actions.append({"label": "🌐 Latest GeM Updates & OMs", "action": "query_latest_updates"})
            actions.append({"label": "❌ Profile Rejection Causes", "action": "query_profile_rejection"})
            actions.append({"label": "🏛️ Explain GFR Rule 144(xi)", "action": "query_rule144"})

        return actions

