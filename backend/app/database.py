import os
import json
from datetime import datetime
from typing import Dict, Any, List, Optional

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = "gem_compliance"

mongo_client = None
mongo_db = None
use_mongo = False

try:
    from pymongo import MongoClient
    mongo_client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=1000)
    mongo_client.admin.command('ping')
    mongo_db = mongo_client[DB_NAME]
    use_mongo = True
    print(f"Connected to MongoDB successfully at {MONGO_URI}")
except Exception as e:
    use_mongo = False
    print(f"MongoDB not connected ({e}). Using resilient in-memory & file-backed data store.")

DATA_FILE = os.path.join(os.path.dirname(__file__), "data_store.json")

# Default Initial Seed Data
DEFAULT_STORE: Dict[str, Any] = {
    "tenders": [
        {
            "id": "tnd-001",
            "ref_no": "GEM/2026/B/9012481",
            "title": "Supply and Commissioning of High-Pressure Industrial Valves",
            "department": "Oil and Natural Gas Corporation (ONGC)",
            "category": "Mechanical & Industrial Equipment",
            "estimated_value_lakhs": 240.0,
            "emd_amount_lakhs": 4.8,
            "min_turnover_lakhs": 80.0,
            "min_mii_percentage": 50.0,
            "closing_date": "28-Mar-2026",
            "status": "Technical Evaluation Stage"
        },
        {
            "id": "tnd-002",
            "ref_no": "GEM/2026/B/9012482",
            "title": "Turnkey SCADA Automation Panel and RTU Units",
            "department": "Bharat Heavy Electricals Limited (BHEL)",
            "category": "Electrical & Control Systems",
            "estimated_value_lakhs": 450.0,
            "emd_amount_lakhs": 9.0,
            "min_turnover_lakhs": 150.0,
            "min_mii_percentage": 60.0,
            "closing_date": "05-Apr-2026",
            "status": "Technical Evaluation Stage"
        }
    ],
    "bidders": [
        {
            "id": "bid-001",
            "legal_name": "ABC Industries Pvt. Ltd.",
            "trade_name": "ABC Valves",
            "gstin": "24AAACB1234F1Z5",
            "pan": "AAACB1234F",
            "udyam_no": "UDYAM-GJ-01-008291",
            "msme_category": "Micro",
            "mii_percentage": 78.5,
            "declared_turnover_lakhs": 125.0,
            "blacklisted": False,
            "status": "Submitted"
        },
        {
            "id": "bid-002",
            "legal_name": "Zenith Global Tech Infra Ltd.",
            "trade_name": "Zenith Infra",
            "gstin": "27AAACZ9876P1Z3",
            "pan": "AAACZ9876P",
            "udyam_no": "UDYAM-MH-02-004312",
            "msme_category": "Small",
            "mii_percentage": 42.0,  # Below 50% MII threshold!
            "declared_turnover_lakhs": 65.0,   # Below 80 Lakhs min threshold!
            "blacklisted": False,
            "status": "Under Scrutiny"
        },
        {
            "id": "bid-003",
            "legal_name": "Bharat Precision Instruments",
            "trade_name": "BPI Controls",
            "gstin": "07AAACB0000A1Z9",
            "pan": "AAACB0000A",
            "udyam_no": "UDYAM-DL-03-009988",
            "msme_category": "Medium",
            "mii_percentage": 92.0,
            "declared_turnover_lakhs": 310.0,
            "blacklisted": True,  # Blacklisted bidder!
            "status": "Flagged"
        }
    ],
    "audit_logs": [
        {
            "id": "log-001",
            "timestamp": "2026-09-11 10:14:02",
            "user": "ABC_INDUSTRIES_2026",
            "role": "seller",
            "action": "DOCUMENT_UPLOAD",
            "tender_ref": "GEM/2026/B/9012481",
            "bidder_name": "ABC Industries Pvt. Ltd.",
            "details": "Uploaded GST registration certificate pdf for AI OCR ingestion.",
            "severity": "INFO"
        },
        {
            "id": "log-002",
            "timestamp": "2026-09-11 10:14:05",
            "user": "SYSTEM_AI_ENGINE",
            "role": "system",
            "action": "AI_OCR_EXTRACTION",
            "tender_ref": "GEM/2026/B/9012481",
            "bidder_name": "ABC Industries Pvt. Ltd.",
            "details": "AI OCR extracted GSTIN: 24AAACB1234F1Z5 with 98.6% confidence score.",
            "severity": "SUCCESS"
        },
        {
            "id": "log-003",
            "timestamp": "2026-09-11 10:14:15",
            "user": "SYSTEM_AI_ENGINE",
            "role": "system",
            "action": "CROSS_VERIFICATION",
            "tender_ref": "GEM/2026/B/9012481",
            "bidder_name": "ABC Industries Pvt. Ltd.",
            "details": "Verified GSTIN with GSTN Portal. Status: Active Regular.",
            "severity": "SUCCESS"
        }
    ],
    "compliance_reports": {},
    "officer_decisions": {}
}

def load_store() -> Dict[str, Any]:
    if os.path.exists(DATA_FILE):
        try:
            with open(DATA_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return DEFAULT_STORE.copy()
    return DEFAULT_STORE.copy()

def save_store(store: Dict[str, Any]):
    try:
        with open(DATA_FILE, "w", encoding="utf-8") as f:
            json.dump(store, f, indent=2)
    except Exception as e:
        print(f"Error saving data store: {e}")

# Initialize file if not present
if not os.path.exists(DATA_FILE):
    save_store(DEFAULT_STORE)
