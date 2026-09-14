from typing import Dict, Any

class StatutoryVerificationEngine:
    """
    Modular Connector Layer for External Portals & Statutory Databases.
    Uses realistic simulated verification responses adhering to official
    APIs (GSTN, NSDL/Income Tax, Udyam MSME, MCA-21).
    """

    @staticmethod
    def verify_gst(gstin: str) -> Dict[str, Any]:
        gstin = gstin.strip().upper()
        if len(gstin) != 15:
            return {
                "portal": "GSTN Common Portal (api.gst.gov.in)",
                "identifier": gstin,
                "verified": False,
                "status_code": "INVALID_FORMAT",
                "is_expired": False,
                "details": {"error": "GSTIN must be exactly 15 alphanumeric characters."}
            }

        # Embedded PAN is characters 3 to 12
        embedded_pan = gstin[2:12]
        state_code = gstin[:2]

        # Specific test scenarios for cancelled / suspended GSTIN
        is_cancelled = gstin.endswith("9Z9") or gstin.endswith("1Z9") or "CANCEL" in gstin or "SUSP" in gstin or gstin in ["07AAACB0000A1Z9", "24AAACB1234F1Z9"]
        
        if is_cancelled:
            return {
                "portal": "GSTN Common Portal (api.gst.gov.in)",
                "identifier": gstin,
                "verified": False,
                "status_code": "GSTIN_CANCELLED_SUSPENDED",
                "is_expired": True,
                "details": {
                    "gstin": gstin,
                    "legal_name": "Bharat Precision Instruments" if "07AAACB" in gstin else "Suspended Enterprise",
                    "trade_name": "Suspended Entity",
                    "status": "Cancelled / Suspended by Tax Authority",
                    "taxpayer_type": "Regular",
                    "state_jurisdiction": f"State Code {state_code}",
                    "date_of_registration": "11-May-2019",
                    "cancellation_date": "15-May-2025",
                    "cancellation_reason": "Failure to furnish monthly GSTR-3B returns for > 6 consecutive tax periods (CGST Sec 29(2)(c))",
                    "embedded_pan": embedded_pan,
                    "last_gstr1_filed": "November 2024",
                    "last_gstr3b_filed": "October 2024 (18+ months overdue)",
                    "tax_compliance_rating": "Defaulted / Non-Compliant"
                }
            }

        return {
            "portal": "GSTN Common Portal (api.gst.gov.in)",
            "identifier": gstin,
            "verified": True,
            "status_code": "SUCCESS",
            "is_expired": False,
            "details": {
                "gstin": gstin,
                "legal_name": "ABC Industries Pvt. Ltd." if "AAACB" in gstin else "Verified Bidder Entity",
                "trade_name": "ABC Valves & Flow Controls",
                "status": "Active Regular",
                "taxpayer_type": "Regular",
                "state_jurisdiction": f"State Code {state_code} (Gujarat)",
                "constitution": "Private Limited Company",
                "date_of_registration": "14-Aug-2018",
                "cancellation_date": None,
                "embedded_pan": embedded_pan,
                "last_gstr1_filed": "August 2026",
                "last_gstr3b_filed": "August 2026 (Up to Date)",
                "tax_compliance_rating": "5 Star (No Default)"
            }
        }

    @staticmethod
    def verify_pan(pan: str) -> Dict[str, Any]:
        pan = pan.strip().upper()
        if len(pan) != 10:
            return {
                "portal": "Income Tax Department (Protean/NSDL)",
                "identifier": pan,
                "verified": False,
                "status_code": "INVALID_FORMAT",
                "details": {"error": "PAN must be exactly 10 alphanumeric characters."}
            }

        entity_char = pan[3]
        category_map = {
            'C': "Company",
            'P': "Individual / Proprietorship",
            'F': "Partnership Firm",
            'H': "HUF",
            'A': "AOP",
            'T': "Trust"
        }

        # Check if forged test PAN (e.g. invalid entity character or format)
        is_fake = not entity_char.isalpha() or entity_char not in category_map or "FAKE" in pan or "TEMP" in pan

        if is_fake:
            return {
                "portal": "Income Tax Department (Protean/NSDL)",
                "identifier": pan,
                "verified": False,
                "status_code": "PAN_NOT_FOUND_IN_CBDT",
                "details": {
                    "pan": pan,
                    "error": "PAN record does not exist in Central Board of Direct Taxes (CBDT) sovereign database. Possible forged or invalid instrument.",
                    "status": "Invalid / Non-Existent"
                }
            }

        return {
            "portal": "Income Tax Department (Protean/NSDL)",
            "identifier": pan,
            "verified": True,
            "status_code": "SUCCESS",
            "details": {
                "pan": pan,
                "holder_name": "ABC Industries Pvt. Ltd.",
                "category": category_map.get(entity_char, "Company"),
                "status": "Operative & Seeded",
                "date_of_allotment": "21-Jul-2016",
                "aadhaar_seeding_status": "Not Applicable (Corporate Entity)"
            }
        }

    @staticmethod
    def verify_udyam(udyam_no: str) -> Dict[str, Any]:
        udyam_no = udyam_no.strip().upper()
        return {
            "portal": "Ministry of Micro, Small & Medium Enterprises (Udyam Portal)",
            "identifier": udyam_no,
            "verified": True,
            "status_code": "SUCCESS",
            "details": {
                "udyam_no": udyam_no,
                "enterprise_name": "ABC Industries Pvt. Ltd.",
                "category": "Micro",
                "major_activity": "Manufacturing",
                "nic_5_digit_code": "28132 - Manufacture of other taps, cocks, valves and similar appliances",
                "social_category": "General",
                "date_of_incorporation": "12-Jun-2017",
                "dic_name": "Vadodara DIC, Gujarat",
                "validity": "Perpetual (Subject to annual return filing)"
            }
        }

    @staticmethod
    def verify_mca(cin_or_pan: str) -> Dict[str, Any]:
        return {
            "portal": "Ministry of Corporate Affairs (MCA-21)",
            "identifier": cin_or_pan,
            "verified": True,
            "status_code": "SUCCESS",
            "details": {
                "company_name": "ABC Industries Pvt. Ltd.",
                "cin": "U28132GJ2017PTC097812",
                "roc_code": "RoC-Ahmedabad",
                "registration_number": "097812",
                "company_status": "Active",
                "authorized_capital_inr": "50,00,000",
                "paid_up_capital_inr": "25,00,000",
                "directors_count": 2,
                "debarred_or_defaulter": False
            }
        }

    @staticmethod
    def verify_udin(udin: str, ca_membership_no: str = "") -> Dict[str, Any]:
        """Verify ICAI Unique Document Identification Number (UDIN) for CA Certificates."""
        udin_clean = udin.strip().upper().replace(" ", "")
        is_valid_format = len(udin_clean) == 18 and udin_clean[:2] in ["24", "25", "26"]
        
        if not is_valid_format:
            return {
                "portal": "Institute of Chartered Accountants of India (ICAI UDIN Portal)",
                "identifier": udin,
                "verified": False,
                "status_code": "INVALID_UDIN_FORMAT",
                "details": {
                    "error": "UDIN must be an 18-digit alphanumeric identifier conforming to ICAI guidelines."
                }
            }
            
        return {
            "portal": "Institute of Chartered Accountants of India (ICAI UDIN Portal)",
            "identifier": udin_clean,
            "verified": True,
            "status_code": "SUCCESS",
            "details": {
                "udin": udin_clean,
                "ca_name": "CA Rajesh Mehta & Associates",
                "membership_number": ca_membership_no or "094821",
                "firm_registration_number": "118290W",
                "status": "Active & Registered",
                "document_type": "Turnover & Net Worth Certificate (Form 3CA/3CD)",
                "financial_year": "2024-2025",
                "certified_amount_lakhs": 125.0,
                "date_of_generation": "28-May-2025",
                "validity": "Valid for Public Procurement Tenders (GFR Rule 173)"
            }
        }

    @staticmethod
    def verify_iso_cert(cert_no: str, expiry_date_str: str) -> Dict[str, Any]:
        """Verify ISO 9001 / Quality / BIS Certificate accreditation and validity dates."""
        cert_no_clean = cert_no.strip().upper()
        # Simulated date comparison (Current system year: 2026)
        is_past_2026 = "2024" in expiry_date_str or "2025" in expiry_date_str or ("2026" in expiry_date_str and any(m in expiry_date_str for m in ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"]))
        
        return {
            "portal": "National Accreditation Board for Certification Bodies (NABCB / IAF Gateway)",
            "identifier": cert_no_clean,
            "verified": not is_past_2026,
            "status_code": "CERTIFICATE_EXPIRED" if is_past_2026 else "CERTIFICATE_VALID",
            "is_expired": is_past_2026,
            "details": {
                "certificate_number": cert_no_clean,
                "standard": "ISO 9001:2015 (Quality Management System)",
                "scope": "Manufacture and Supply of Industrial Valves and Piping Accessories",
                "accredited_body": "TUV India Pvt. Ltd. (NABCB Accredited)",
                "expiry_date": expiry_date_str,
                "status": "EXPIRED" if is_past_2026 else "ACTIVE",
                "validity_comment": "Certificate expired on " + expiry_date_str + ". Tender rules mandate active certification at bid opening." if is_past_2026 else "Certificate is actively valid."
            }
        }

    @classmethod
    def cross_verify_credentials(cls, pan: str, gstin: str, legal_name: str) -> Dict[str, Any]:
        """Cross-check consistency across submitted tax instruments and entity names."""
        pan_clean = pan.strip().upper()
        gstin_clean = gstin.strip().upper()
        
        embedded_pan = gstin_clean[2:12] if len(gstin_clean) == 15 else ""
        pan_gstin_match = embedded_pan == pan_clean if embedded_pan and pan_clean else True
        
        return {
            "pan_gstin_match": pan_gstin_match,
            "embedded_pan_in_gstin": embedded_pan,
            "submitted_pan": pan_clean,
            "legal_name": legal_name,
            "verdict": "CONSISTENT" if pan_gstin_match else "DISCREPANCY_DETECTED",
            "discrepancy_explanation": None if pan_gstin_match else f"Embedded PAN '{embedded_pan}' in GSTIN '{gstin_clean}' does not match uploaded PAN '{pan_clean}'. Potential impersonation or forged document."
        }
