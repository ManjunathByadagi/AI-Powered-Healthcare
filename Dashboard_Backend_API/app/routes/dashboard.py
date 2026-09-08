from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import SessionLocal
from app.models.user import User
from app.models.prescription import Prescription
from app.models.notification import Notification


router = APIRouter(
    prefix="/api/dashboard",
    tags=["Dashboard"],
)


# ============================================================
# DATABASE DEPENDENCY
# ============================================================

def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


# ============================================================
# USER
# ============================================================

@router.get("/user")
def get_user(db: Session = Depends(get_db)):

    user = db.query(User).first()

    if not user:
        return {
            "username": "User",
            "welcome_message": "Welcome Back",
            "subtitle": "Healthcare made simpler.",
        }

    return {
        "username": user.username,
        "welcome_message": user.welcome_message,
        "subtitle": user.subtitle,
    }


# ============================================================
# DASHBOARD STATS
# ============================================================

@router.get("/stats")
def get_dashboard_stats(db: Session = Depends(get_db)):

    prescriptions = (
        db.query(Prescription)
        .order_by(Prescription.id.desc())
        .all()
    )

    total_records = len(prescriptions)

    completed = sum(
        1
        for prescription in prescriptions
        if str(
            getattr(prescription, "status", "")
        ).lower()
        in ["completed", "complete", "done"]
    )

    medicines_count = sum(
        1
        for prescription in prescriptions
        if getattr(prescription, "medicine", None)
    )

    translations_count = sum(
        1
        for prescription in prescriptions
        if getattr(prescription, "translation", None)
    )

    return {
        "total_records": total_records,
        "completed": completed,
        "medicines_count": medicines_count,
        "translations_count": translations_count,
    }


# ============================================================
# CREATE DASHBOARD RECORD
# ============================================================

@router.post("/records")
def create_dashboard_record(
    record: dict,
    db: Session = Depends(get_db),
):
    """
    Create a prescription record after a successful
    medical document upload/OCR operation.
    """

    title = (
        record.get("title")
        or record.get("filename")
        or "Medical Document"
    )

    language = (
        record.get("language")
        or "English"
    )

    status = (
        record.get("status")
        or "Completed"
    )

    medicine = (
        record.get("medicine")
        or record.get("medication")
        or ""
    )

    translation = (
        record.get("translation")
        or record.get("translated_text")
        or ""
    )

    new_prescription = Prescription(
        title=title,
        language=language,
        status=status,
        date=datetime.utcnow().strftime("%Y-%m-%d"),
        medicine=medicine,
        translation=translation,
    )

    db.add(new_prescription)
    db.commit()
    db.refresh(new_prescription)

    return {
        "message": "Dashboard record created successfully",
        "record": {
            "id": new_prescription.id,
            "title": new_prescription.title,
            "language": new_prescription.language,
            "status": new_prescription.status,
            "date": new_prescription.date,
            "medicine": new_prescription.medicine,
            "translation": new_prescription.translation,
        },
    }


# ============================================================
# RECENT PRESCRIPTIONS
# ============================================================

@router.get("/recent-prescriptions")
def get_recent_prescriptions(
    db: Session = Depends(get_db),
):

    prescriptions = (
        db.query(Prescription)
        .order_by(Prescription.id.desc())
        .all()
    )

    results = []

    for prescription in prescriptions:

        results.append({
            "id": prescription.id,
            "title": prescription.title,
            "language": prescription.language,
            "status": prescription.status,
            "date": prescription.date,
            "medicine": prescription.medicine,
            "translation": prescription.translation,
            "created_at": (
                prescription.created_at.isoformat()
                if prescription.created_at
                else None
            ),
        })

    return results


# ============================================================
# HEALTH TIP
# ============================================================

@router.get("/health-tip")
def get_health_tip():

    return {
        "tip": "Complete your prescribed medicines."
    }


# ============================================================
# NOTIFICATIONS
# ============================================================

@router.get("/notifications")
def get_notifications(
    db: Session = Depends(get_db),
):

    notifications = (
        db.query(Notification)
        .order_by(Notification.id.desc())
        .all()
    )

    results = []

    for notification in notifications:

        record = {}

        for key, value in vars(notification).items():

            if not key.startswith("_"):
                record[key] = value

        results.append(record)

    return results