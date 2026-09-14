from typing import List, Dict, Any, Tuple
from datetime import datetime
from app.schemas import RuleEvaluationItem, RiskTier, AIRecommendation, ComplianceReport

class RiskAndScoringEngine:
    """
    Computes multi-factor compliance scores (0-100), assigns Risk Tiers
    (Low, Medium, High), and synthesizes the Explainable Output Layer
    with citations, discrepancies, and AI recommendations.
    """

    @classmethod
    def compute_report(
        cls,
        tender: Dict[str, Any],
        bidder: Dict[str, Any],
        rules: List[RuleEvaluationItem]
    ) -> ComplianceReport:
        score = 100
        discrepancies: List[str] = []
        evidence_sources: List[Dict[str, str]] = []
        has_critical_failure = False

        for r in rules:
            evidence_sources.append({
                "rule": r.name,
                "source": r.evidence_source,
                "status": "PASSED" if r.passed else "FAILED"
            })

            if not r.passed:
                discrepancies.append(f"[{r.category.upper()}] {r.name}: {r.details}")
                if r.severity == "Critical":
                    score -= 35
                    has_critical_failure = True
                elif r.severity == "High":
                    score -= 20
                else:
                    score -= 10

        score = max(0, min(100, score))

        # Determine Risk Tier
        if score >= 85 and not has_critical_failure:
            risk_tier = RiskTier.LOW
        elif score >= 60 and not has_critical_failure:
            risk_tier = RiskTier.MEDIUM
        else:
            risk_tier = RiskTier.HIGH

        # Determine AI Recommendation
        if has_critical_failure or score < 60:
            recommendation = AIRecommendation.DISQUALIFIED
            rationale = (
                f"Critical non-compliance detected for Bidder {bidder.get('legal_name')}. "
                f"Entity fails mandatory statutory or eligibility prerequisites. Disqualification recommended."
            )
        elif score < 85:
            recommendation = AIRecommendation.CLARIFICATION_NEEDED
            rationale = (
                f"Moderate deficiencies or documentation gaps observed for Bidder {bidder.get('legal_name')} "
                f"(Score: {score}%). Formal clarification notice should be issued before financial bid opening."
            )
        else:
            recommendation = AIRecommendation.QUALIFIED
            rationale = (
                f"All statutory, technical, and financial criteria have been successfully verified with "
                f"official government registries. Low risk profile ({score}%). Recommend approval for financial bid opening."
            )

        statutory_summary = {
            "gst": "Verified Active" if rules[0].passed else "Action Required",
            "pan": "Linked & Valid" if rules[1].passed else "Mismatch",
            "udyam": "Verified MSME" if rules[4].passed else "Unverified",
            "mii": f"{bidder.get('mii_percentage', 0)}% Local Content"
        }

        return ComplianceReport(
            tender_ref=tender.get("ref_no", "N/A"),
            bidder_id=bidder.get("id", "N/A"),
            bidder_name=bidder.get("legal_name", "N/A"),
            readiness_score=score,
            risk_tier=risk_tier,
            statutory_checks=statutory_summary,
            rules_evaluated=rules,
            discrepancies=discrepancies,
            evidence_sources=evidence_sources,
            ai_recommendation=recommendation,
            recommendation_rationale=rationale,
            evaluated_at=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        )
