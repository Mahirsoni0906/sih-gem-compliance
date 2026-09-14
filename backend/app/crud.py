from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid
from app.database import load_store, save_store, use_mongo, mongo_db

def get_tenders() -> List[Dict[str, Any]]:
    if use_mongo and mongo_db is not None:
        return list(mongo_db.tenders.find({}, {"_id": 0}))
    store = load_store()
    return store.get("tenders", [])

def get_tender_by_ref(ref_no: str) -> Optional[Dict[str, Any]]:
    tenders = get_tenders()
    for t in tenders:
        if t["ref_no"] == ref_no or t["id"] == ref_no:
            return t
    return None

def get_bidders() -> List[Dict[str, Any]]:
    if use_mongo and mongo_db is not None:
        return list(mongo_db.bidders.find({}, {"_id": 0}))
    store = load_store()
    return store.get("bidders", [])

def get_bidder_by_id(bidder_id: str) -> Optional[Dict[str, Any]]:
    bidders = get_bidders()
    for b in bidders:
        if b["id"] == bidder_id or b["gstin"] == bidder_id:
            return b
    return None

def update_bidder(bidder_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    if use_mongo and mongo_db is not None:
        mongo_db.bidders.update_one({"id": bidder_id}, {"$set": updates})
        return mongo_db.bidders.find_one({"id": bidder_id}, {"_id": 0})
    store = load_store()
    for b in store.get("bidders", []):
        if b["id"] == bidder_id:
            b.update(updates)
            save_store(store)
            return b
    return None

def save_compliance_report(tender_ref: str, bidder_id: str, report: Dict[str, Any]):
    key = f"{tender_ref}::{bidder_id}"
    if use_mongo and mongo_db is not None:
        mongo_db.compliance_reports.update_one({"key": key}, {"$set": report}, upsert=True)
        return
    store = load_store()
    if "compliance_reports" not in store:
        store["compliance_reports"] = {}
    store["compliance_reports"][key] = report
    save_store(store)

def get_compliance_report(tender_ref: str, bidder_id: str) -> Optional[Dict[str, Any]]:
    key = f"{tender_ref}::{bidder_id}"
    if use_mongo and mongo_db is not None:
        return mongo_db.compliance_reports.find_one({"key": key}, {"_id": 0})
    store = load_store()
    return store.get("compliance_reports", {}).get(key)

def save_officer_decision(tender_ref: str, bidder_id: str, decision_data: Dict[str, Any]):
    key = f"{tender_ref}::{bidder_id}"
    if use_mongo and mongo_db is not None:
        mongo_db.officer_decisions.update_one({"key": key}, {"$set": decision_data}, upsert=True)
    else:
        store = load_store()
        if "officer_decisions" not in store:
            store["officer_decisions"] = {}
        store["officer_decisions"][key] = decision_data
        save_store(store)
    
    # Also log to audit trail
    add_audit_log(
        user=decision_data.get("officer_name", "Procurement Officer"),
        role="officer",
        action=f"OFFICER_DECISION_{decision_data.get('decision')}",
        tender_ref=tender_ref,
        bidder_name=bidder_id,
        details=f"Officer recorded decision: {decision_data.get('decision')}. Remarks: {decision_data.get('remarks')}",
        severity="SUCCESS" if decision_data.get("decision") == "APPROVE" else "WARNING"
    )

def add_audit_log(user: str, role: str, action: str, details: str, tender_ref: Optional[str] = None, bidder_name: Optional[str] = None, severity: str = "INFO"):
    log_entry = {
        "id": f"log-{uuid.uuid4().hex[:8]}",
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "user": user,
        "role": role,
        "action": action,
        "tender_ref": tender_ref,
        "bidder_name": bidder_name,
        "details": details,
        "severity": severity
    }
    if use_mongo and mongo_db is not None:
        mongo_db.audit_logs.insert_one(log_entry.copy())
    else:
        store = load_store()
        if "audit_logs" not in store:
            store["audit_logs"] = []
        store["audit_logs"].insert(0, log_entry)  # Newest first
        save_store(store)
    return log_entry

def get_audit_logs(limit: int = 50) -> List[Dict[str, Any]]:
    if use_mongo and mongo_db is not None:
        return list(mongo_db.audit_logs.find({}, {"_id": 0}).sort("timestamp", -1).limit(limit))
    store = load_store()
    logs = store.get("audit_logs", [])
    return logs[:limit]
