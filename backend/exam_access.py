import sqlite3
import os
import time
import secrets
from typing import List, Dict, Any, Optional

DB_PATH = os.path.join(os.path.dirname(__file__), "lmsguard.db")

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_exam_access_tables():
    conn = get_db()
    cursor = conn.cursor()
    
    # Table 1: exam_sessions
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS exam_sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            exam_id TEXT NOT NULL UNIQUE,
            exam_name TEXT NOT NULL,
            class_id TEXT,
            created_by TEXT,
            created_by_role TEXT,
            start_token_hash TEXT,
            quit_token_hash TEXT,
            start_status TEXT NOT NULL DEFAULT 'NOT_STARTED',
            quit_status TEXT NOT NULL DEFAULT 'NOT_RELEASED',
            started_at TEXT,
            quit_all_at TEXT,
            is_active INTEGER NOT NULL DEFAULT 1,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        )
    """)
    
    # Table 2: student_exam_sessions
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS student_exam_sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            exam_id TEXT NOT NULL,
            student_id TEXT NOT NULL,
            roll_number TEXT NOT NULL,
            student_name TEXT,
            class_id TEXT,
            status TEXT NOT NULL DEFAULT 'ABSENT',
            network_status TEXT NOT NULL DEFAULT 'UNKNOWN',
            joined_at TEXT,
            confirmed_start_at TEXT,
            last_seen_at TEXT,
            completed_at TEXT,
            quit_approved_at TEXT,
            quit_approved_by TEXT,
            start_confirmed INTEGER NOT NULL DEFAULT 0,
            quit_approved INTEGER NOT NULL DEFAULT 0,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            UNIQUE(exam_id, roll_number)
        )
    """)
    
    # Table 3: coding_submissions
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS coding_submissions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            exam_id TEXT,
            roll_number TEXT,
            question_id TEXT,
            language TEXT,
            code TEXT,
            result_status TEXT,
            score INTEGER,
            submitted_at TEXT
        )
    """)
    
    conn.commit()
    conn.close()

def get_current_time_iso():
    return time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())

def create_or_get_exam_session(exam_id: str, exam_name: str, class_id: str, created_by: str, created_by_role: str):
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM exam_sessions WHERE exam_id = ?", (exam_id,))
    existing = cursor.fetchone()
    if existing:
        conn.close()
        return dict(existing)
    
    now = get_current_time_iso()
    cursor.execute("""
        INSERT INTO exam_sessions (exam_id, exam_name, class_id, created_by, created_by_role, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (exam_id, exam_name, class_id, created_by, created_by_role, now, now))
    conn.commit()
    
    cursor.execute("SELECT * FROM exam_sessions WHERE exam_id = ?", (exam_id,))
    new_session = cursor.fetchone()
    conn.close()
    return dict(new_session)

def get_exam_session(exam_id: str):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM exam_sessions WHERE exam_id = ?", (exam_id,))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None

def teacher_start_exam(exam_id: str, class_id: str, created_by: str, created_by_role: str):
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM exam_sessions WHERE exam_id = ?", (exam_id,))
    existing = cursor.fetchone()
    now = get_current_time_iso()
    
    if not existing:
        cursor.execute("""
            INSERT INTO exam_sessions (exam_id, exam_name, class_id, created_by, created_by_role, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (exam_id, "Default Exam", class_id, created_by, created_by_role, now, now))
        conn.commit()
    
    start_token = secrets.token_urlsafe(16)
    
    cursor.execute("""
        UPDATE exam_sessions 
        SET start_status = 'STARTED', started_at = ?, updated_at = ?, start_token_hash = ?
        WHERE exam_id = ?
    """, (now, now, start_token, exam_id))
    conn.commit()
    conn.close()
    return True

def student_join_exam_lobby(student_id: str, roll_number: str, student_name: str, exam_id: str, class_id: str):
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM student_exam_sessions WHERE exam_id = ? AND roll_number = ?", (exam_id, roll_number))
    existing = cursor.fetchone()
    now = get_current_time_iso()
    
    if existing:
        # If already joined, just update last seen and ensure status is not ABSENT
        new_status = existing["status"]
        if new_status == 'ABSENT':
            new_status = 'WAITING_START'
        
        cursor.execute("""
            UPDATE student_exam_sessions
            SET status = ?, last_seen_at = ?, network_status = 'ONLINE', updated_at = ?
            WHERE exam_id = ? AND roll_number = ?
        """, (new_status, now, now, exam_id, roll_number))
    else:
        cursor.execute("""
            INSERT INTO student_exam_sessions 
            (exam_id, student_id, roll_number, student_name, class_id, status, network_status, joined_at, last_seen_at, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (exam_id, student_id, roll_number, student_name, class_id, 'WAITING_START', 'ONLINE', now, now, now, now))
    
    conn.commit()
    conn.close()
    return True

def student_heartbeat(student_id: str, roll_number: str, exam_id: str):
    conn = get_db()
    cursor = conn.cursor()
    now = get_current_time_iso()
    cursor.execute("""
        UPDATE student_exam_sessions
        SET last_seen_at = ?, network_status = 'ONLINE', updated_at = ?
        WHERE exam_id = ? AND roll_number = ?
    """, (now, now, exam_id, roll_number))
    conn.commit()
    conn.close()
    return True

def student_confirm_start(student_id: str, roll_number: str, exam_id: str):
    conn = get_db()
    cursor = conn.cursor()
    now = get_current_time_iso()
    cursor.execute("""
        UPDATE student_exam_sessions
        SET status = 'IN_EXAM', start_confirmed = 1, confirmed_start_at = ?, updated_at = ?
        WHERE exam_id = ? AND roll_number = ?
    """, (now, now, exam_id, roll_number))
    conn.commit()
    conn.close()
    return True

def get_student_exam_status(student_id: str, roll_number: str, exam_id: str):
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM exam_sessions WHERE exam_id = ?", (exam_id,))
    exam = cursor.fetchone()
    
    cursor.execute("SELECT * FROM student_exam_sessions WHERE exam_id = ? AND roll_number = ?", (exam_id, roll_number))
    student_session = cursor.fetchone()
    conn.close()
    
    result = {
        "success": True,
        "exam_started": False,
        "student_status": "WAITING_START",
        "message": "Waiting for invigilator to start the exam",
        "show_start_popup": False,
        "redirect_to_completed": False
    }
    
    if student_session:
        result["student_status"] = student_session["status"]
        
    if exam and exam["start_status"] == "STARTED":
        result["exam_started"] = True
        
        if result["student_status"] in ["JOINED", "WAITING_START"]:
            result["show_start_popup"] = True
            result["message"] = "Invigilator has started the exam"
            
    if result["student_status"] in ["QUIT_APPROVED", "COMPLETED"]:
        result["redirect_to_completed"] = True
        
    return result

def teacher_quit_student(exam_id: str, roll_number: str, approved_by: str, approved_by_role: str):
    conn = get_db()
    cursor = conn.cursor()
    now = get_current_time_iso()
    
    cursor.execute("""
        UPDATE student_exam_sessions
        SET status = 'QUIT_APPROVED', quit_approved = 1, completed_at = ?, quit_approved_at = ?, quit_approved_by = ?, updated_at = ?
        WHERE exam_id = ? AND roll_number = ?
    """, (now, now, approved_by, now, exam_id, roll_number))
    
    conn.commit()
    conn.close()
    return True

def teacher_quit_all_students(exam_id: str, approved_by: str, approved_by_role: str):
    conn = get_db()
    cursor = conn.cursor()
    now = get_current_time_iso()
    
    cursor.execute("""
        UPDATE student_exam_sessions
        SET status = 'QUIT_APPROVED', quit_approved = 1, completed_at = ?, quit_approved_at = ?, quit_approved_by = ?, updated_at = ?
        WHERE exam_id = ? AND status IN ('WAITING_START', 'IN_EXAM', 'JOINED', 'NETWORK_ISSUE')
    """, (now, now, approved_by, now, exam_id))
    
    cursor.execute("""
        UPDATE exam_sessions
        SET quit_status = 'ALL_RELEASED', quit_all_at = ?, updated_at = ?
        WHERE exam_id = ?
    """, (now, now, exam_id))
    
    conn.commit()
    conn.close()
    return True

def update_network_statuses(exam_id: str):
    conn = get_db()
    cursor = conn.cursor()
    
    # Calculate 30 seconds ago
    thirty_seconds_ago = time.gmtime(time.time() - 30)
    thirty_seconds_ago_iso = time.strftime("%Y-%m-%dT%H:%M:%SZ", thirty_seconds_ago)
    
    # Update network status for students who are not completed/quit
    cursor.execute("""
        UPDATE student_exam_sessions
        SET network_status = 'NETWORK_ISSUE'
        WHERE exam_id = ? 
        AND last_seen_at < ? 
        AND status NOT IN ('ABSENT', 'COMPLETED', 'QUIT_APPROVED')
    """, (exam_id, thirty_seconds_ago_iso))
    
    conn.commit()
    conn.close()

def get_exam_dashboard_summary(exam_id: str):
    update_network_statuses(exam_id)
    
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM student_exam_sessions WHERE exam_id = ?", (exam_id,))
    students = cursor.fetchall()
    conn.close()
    
    total = len(students)
    joined = 0
    network_issue = 0
    absent = 0
    in_exam = 0
    completed = 0
    
    for s in students:
        status = s["status"]
        net_status = s["network_status"]
        
        if status == 'ABSENT':
            absent += 1
        else:
            joined += 1
            
        if net_status == 'NETWORK_ISSUE':
            network_issue += 1
            
        if status == 'IN_EXAM':
            in_exam += 1
            
        if status in ['COMPLETED', 'QUIT_APPROVED']:
            completed += 1
            
    # For now, hardcode total if it's 0 to demo
    if total == 0:
        total = 60
        absent = 60
        
    return {
        "exam_id": exam_id,
        "total_students": total,
        "joined_students": joined,
        "network_issue_students": network_issue,
        "absent_students": absent,
        "in_exam_students": in_exam,
        "completed_students": completed
    }

def get_exam_students(exam_id: str):
    update_network_statuses(exam_id)
    
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM student_exam_sessions WHERE exam_id = ?", (exam_id,))
    rows = cursor.fetchall()
    conn.close()
    
    return [dict(r) for r in rows]

def submit_code(exam_id: str, roll_number: str, question_id: str, language: str, code: str, result_status: str, score: int = 0):
    conn = get_db()
    cursor = conn.cursor()
    now = get_current_time_iso()
    cursor.execute("""
        INSERT INTO coding_submissions (exam_id, roll_number, question_id, language, code, result_status, score, submitted_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (exam_id, roll_number, question_id, language, code, result_status, score, now))
    conn.commit()
    conn.close()
    return True
