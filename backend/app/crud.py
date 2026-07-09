"""
LMSGuard — Database CRUD helpers (SQLAlchemy).
"""
from typing import List, Optional

from sqlalchemy.orm import Session

from app import models, schemas
from app.auth import hash_password, verify_password


# ── Users ─────────────────────────────────────────────────────────────────────

def get_user_by_identifier(db: Session, identifier: str) -> Optional[models.User]:
    return db.query(models.User).filter(models.User.identifier == identifier).first()


def get_user_by_role_and_identifier(
    db: Session, role: str, identifier: str
) -> Optional[models.User]:
    return (
        db.query(models.User)
        .filter(models.User.role == role, models.User.identifier == identifier)
        .first()
    )


def authenticate_user(
    db: Session, role: str, identifier: str, password: str
) -> Optional[models.User]:
    user = get_user_by_role_and_identifier(db, role, identifier)
    if user is None or not user.is_active:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user


def create_user(db: Session, data: schemas.UserCreate) -> models.User:
    user = models.User(
        full_name       = data.full_name,
        identifier      = data.identifier,
        email           = data.email,
        hashed_password = hash_password(data.password),
        role            = data.role,
        department      = data.department,
        class_name      = data.class_name,
        roll_number     = data.roll_number,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def get_all_users(db: Session) -> List[models.User]:
    return db.query(models.User).order_by(models.User.id).all()


def get_users_by_role(db: Session, role: str) -> List[models.User]:
    return (
        db.query(models.User)
        .filter(models.User.role == role)
        .order_by(models.User.id)
        .all()
    )


# ── Students ──────────────────────────────────────────────────────────────────

def get_all_students(db: Session) -> List[models.Student]:
    return db.query(models.Student).order_by(models.Student.id).all()


# ── Departments ───────────────────────────────────────────────────────────────

def get_all_departments(db: Session) -> List[models.Department]:
    return db.query(models.Department).order_by(models.Department.id).all()


# ── Classes ───────────────────────────────────────────────────────────────────

def get_all_classes(db: Session) -> List[models.SchoolClass]:
    return db.query(models.SchoolClass).order_by(models.SchoolClass.id).all()


# ── Exams ─────────────────────────────────────────────────────────────────────

def get_all_exams(db: Session) -> List[models.Exam]:
    return db.query(models.Exam).order_by(models.Exam.id).all()


# ── Seed demo data ────────────────────────────────────────────────────────────

def seed_if_empty(db: Session) -> None:
    """Insert demo users and academic data only if the DB is empty."""
    if db.query(models.User).count() > 0:
        return

    # ── Admin ──
    create_user(db, schemas.UserCreate(
        full_name  = "Super Admin",
        identifier = "admin@lmsguard.edu",
        email      = "admin@lmsguard.edu",
        password   = "admin123",
        role       = "admin",
    ))

    # ── Invigilators ──
    invs = [
        ("John Martin",  "john.martin@college.edu",  "Computer Science"),
        ("Sarah Thomas", "sarah.thomas@college.edu", "Computer Science"),
        ("Ravi Sharma",  "ravi.sharma@college.edu",  "Electronics"),
        ("Priya Nair",   "priya.nair@college.edu",   "Information Tech"),
    ]
    for full_name, email, dept in invs:
        create_user(db, schemas.UserCreate(
            full_name  = full_name,
            identifier = email,
            email      = email,
            password   = "demo123",
            role       = "invigilator",
            department = dept,
        ))

    # ── Departments ──
    depts_data = [
        ("Computer Science", "CSE", "Dr. Kumar"),
        ("Electronics",      "ECE", "Dr. Rajan"),
        ("Information Tech", "IT",  "Dr. Priya"),
    ]
    depts: dict[str, models.Department] = {}
    for name, code, hod in depts_data:
        d = models.Department(name=name, code=code, hod=hod)
        db.add(d)
        db.flush()
        depts[code] = d

    # ── Classes ──
    classes_data = [
        ("CSE-3A", "CSE", "3rd Year", "A", 20),
        ("CSE-3B", "CSE", "3rd Year", "B", 8),
        ("ECE-3A", "ECE", "3rd Year", "A", 10),
        ("IT-2A",  "IT",  "2nd Year", "A", 10),
    ]
    for name, dept_code, year, section, strength in classes_data:
        dept = depts.get(dept_code)
        cls  = models.SchoolClass(
            name     = name,
            dept_id  = dept.id if dept else None,
            year     = year,
            section  = section,
            strength = strength,
        )
        db.add(cls)

    # ── Exams ──
    exams_data = [
        ("DBMS Final Exam",        "Database Management Systems", "CS501", "CSE-3A", "30-06-2026", "10:00 AM", "11:00 AM", 60),
        ("Java Programming Test",  "Object Oriented Programming", "CS401", "CSE-3A", "30-06-2026", "02:00 PM", "02:45 PM", 45),
        ("Data Structures Test",   "Data Structures & Algorithms","CS301", "CSE-3A", "01-07-2026", "09:00 AM", "10:00 AM", 60),
        ("Digital Circuits Exam",  "Digital Electronics",         "EC401", "ECE-3A", "30-06-2026", "11:00 AM", "12:00 PM", 60),
        ("Web Technologies Test",  "Web Development",             "IT301", "IT-2A",  "01-07-2026", "02:00 PM", "02:45 PM", 45),
    ]
    for title, subject, code, class_name, date, start, end, dur in exams_data:
        db.add(models.Exam(
            title=title, subject=subject, code=code, class_name=class_name,
            date=date, start_time=start, end_time=end, duration=dur, status="active",
        ))

    db.commit()
