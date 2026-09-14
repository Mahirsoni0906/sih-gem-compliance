import os
import asyncio
import httpx
from typing import Dict, Any, Optional, List

from app.services.rag_service import GeMRAGRetriever

OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://127.0.0.1:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "qwen2.5:1.5b")

GEM_SYSTEM_PROMPT = """You are GeMMy, the AI Statutory Compliance Assistant for the Government e-Marketplace (GeM).
Domain Mandate: Provide authoritative, concise advice on GeM public procurement law, GFR 2017, IT Act 2000, profile creation rejections, GSTIN/PAN validation rules, MSME exemptions, and Make-in-India compliance.
DPDP Act Confidentiality Mandate: Under the Digital Personal Data Protection Act 2023, you must NEVER disclose, hallucinate, or inspect private organization credentials, PANs, GSTINs, or confidential bidder audits in public chat. Direct users to the authenticated DocScrutiny AI Console for organization document evaluation.
Formatting: Use concise bullet points, bold statutory terms, and actionable guidance."""

class LocalAIService:
    """Service to communicate with sovereign LLM via Ollama with RAG retrieval and strict timeouts."""

    _cached_model: Optional[str] = None

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
        """Check if local Ollama daemon is reachable and has at least one model."""
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
        timeout_seconds: float = 10.0
    ) -> Optional[Dict[str, Any]]:
        """
        Query the sovereign LLM with RAG-retrieved statutory context.
        Enforces a strict timeout (default 10s) to prevent browser hangs.
        Returns a dict with reply and actions, or None if unavailable or slow.
        """
        try:
            active_model = await cls.get_active_model()

            # Dynamic RAG Retrieval: Extract top 1 concise domain knowledge chunk
            rag_context = GeMRAGRetriever.format_context_for_prompt(user_message, top_k=1)
            full_system_prompt = f"{GEM_SYSTEM_PROMPT}\n{rag_context}" if rag_context else GEM_SYSTEM_PROMPT

            async with httpx.AsyncClient(timeout=timeout_seconds) as client:
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
                        "num_predict": 180,
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
                            "model": "GeMMy Live Assistant",
                            "is_local_ai": False
                        }
        except (httpx.TimeoutException, asyncio.TimeoutError):
            print(f"[LocalAIService] Ollama query exceeded {timeout_seconds}s limit; gracefully falling back.")
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
        else:
            actions.append({"label": "🌐 Latest GeM Updates & OMs", "action": "query_latest_updates"})
            actions.append({"label": "❌ Profile Rejection Causes", "action": "query_profile_rejection"})
            actions.append({"label": "🏛️ Explain GFR Rule 144(xi)", "action": "query_rule144"})

        return actions
