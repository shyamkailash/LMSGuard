/**
 * LMSGuard V2 — Invigilator Portal Mock Data
 */
import type { MonitoringStudent, ViolationRecord } from "@/types";

export interface WaitingStudent {
  id: string;
  name: string;
  regno: string;
  dept: string;
  class: string;
  avatar: string;
  connectionStatus: "connected" | "weak" | "disconnected";
  permissionStatus: "waiting" | "approved" | "rejected";
  joinedAt: string;
  ipAddress: string;
  device: string;
  faceVerified: boolean;
  risk: number;
}

export interface SessionInfo {
  id: string;
  token: string;
  examId: string;
  examTitle: string;
  classId: string;
  classLabel: string;
  passcode: string;
  invigilator: string;
  startedAt: string;
  duration: number;
  totalStudents: number;
  approved: number;
  waiting: number;
  blocked: number;
  status: "waiting" | "active" | "paused" | "ended";
}

export interface SessionAlert {
  id: string;
  studentId: string;
  studentName: string;
  regno: string;
  type: "clipboard" | "network" | "idle" | "application" | "tab_switch" | "face" | "screen";
  detail: string;
  severity: "low" | "medium" | "high" | "critical";
  time: string;
  timestamp: number;
  acknowledged: boolean;
  risk: number;
}

/* ── Waiting Students ─────────────────────────────── */
export const MOCK_WAITING_STUDENTS: WaitingStudent[] = [
  { id:"S101", name:"Rahul Kumar",    regno:"22CS101", dept:"CSE", class:"CSE-3A", avatar:"RK", connectionStatus:"connected",    permissionStatus:"approved",  joinedAt:"10:02 AM", ipAddress:"192.168.1.101", device:"Chrome 124 · Windows",  faceVerified:true,  risk:10 },
  { id:"S102", name:"Arjun Mehta",    regno:"22CS102", dept:"CSE", class:"CSE-3A", avatar:"AM", connectionStatus:"connected",    permissionStatus:"approved",  joinedAt:"10:01 AM", ipAddress:"192.168.1.102", device:"Chrome 124 · Windows",  faceVerified:true,  risk:88 },
  { id:"S103", name:"Priya Sharma",   regno:"22CS103", dept:"CSE", class:"CSE-3A", avatar:"PS", connectionStatus:"weak",         permissionStatus:"approved",  joinedAt:"10:03 AM", ipAddress:"192.168.1.103", device:"Edge 122 · Windows",    faceVerified:true,  risk:35 },
  { id:"S104", name:"Karthik Rajan",  regno:"22CS104", dept:"CSE", class:"CSE-3A", avatar:"KR", connectionStatus:"connected",    permissionStatus:"waiting",   joinedAt:"10:04 AM", ipAddress:"192.168.1.104", device:"Chrome 124 · macOS",    faceVerified:false, risk:12 },
  { id:"S105", name:"Deepa Nair",     regno:"22CS105", dept:"CSE", class:"CSE-3A", avatar:"DN", connectionStatus:"connected",    permissionStatus:"waiting",   joinedAt:"10:05 AM", ipAddress:"192.168.1.105", device:"Chrome 124 · Linux",    faceVerified:true,  risk:5  },
  { id:"S106", name:"Vikram Singh",   regno:"22CS106", dept:"CSE", class:"CSE-3A", avatar:"VS", connectionStatus:"connected",    permissionStatus:"approved",  joinedAt:"10:01 AM", ipAddress:"192.168.1.106", device:"Firefox 125 · Windows", faceVerified:true,  risk:91 },
  { id:"S107", name:"Anjali Gupta",   regno:"22CS107", dept:"CSE", class:"CSE-3A", avatar:"AG", connectionStatus:"connected",    permissionStatus:"waiting",   joinedAt:"10:06 AM", ipAddress:"192.168.1.107", device:"Chrome 124 · Windows",  faceVerified:true,  risk:22 },
  { id:"S108", name:"Rohit Verma",    regno:"22CS108", dept:"CSE", class:"CSE-3A", avatar:"RV", connectionStatus:"connected",    permissionStatus:"approved",  joinedAt:"10:02 AM", ipAddress:"192.168.1.108", device:"Chrome 124 · Windows",  faceVerified:true,  risk:48 },
  { id:"S109", name:"Sneha Reddy",    regno:"22CS109", dept:"CSE", class:"CSE-3A", avatar:"SR", connectionStatus:"disconnected", permissionStatus:"waiting",   joinedAt:"10:07 AM", ipAddress:"192.168.1.109", device:"Chrome 124 · Windows",  faceVerified:false, risk:0  },
  { id:"S110", name:"Aditya Roy",     regno:"22CS110", dept:"CSE", class:"CSE-3A", avatar:"AR", connectionStatus:"connected",    permissionStatus:"rejected",  joinedAt:"10:03 AM", ipAddress:"192.168.1.110", device:"Safari 17 · macOS",     faceVerified:false, risk:74 },
  { id:"S111", name:"Meera Iyer",     regno:"22CS111", dept:"CSE", class:"CSE-3A", avatar:"MI", connectionStatus:"connected",    permissionStatus:"waiting",   joinedAt:"10:08 AM", ipAddress:"192.168.1.111", device:"Chrome 124 · Windows",  faceVerified:true,  risk:28 },
  { id:"S112", name:"Nikhil Joshi",   regno:"22CS112", dept:"CSE", class:"CSE-3A", avatar:"NJ", connectionStatus:"weak",         permissionStatus:"approved",  joinedAt:"10:04 AM", ipAddress:"192.168.1.112", device:"Edge 122 · Windows",    faceVerified:true,  risk:55 },
  { id:"S113", name:"Kavya Menon",    regno:"22CS113", dept:"CSE", class:"CSE-3A", avatar:"KM", connectionStatus:"connected",    permissionStatus:"waiting",   joinedAt:"10:09 AM", ipAddress:"192.168.1.113", device:"Chrome 124 · macOS",    faceVerified:true,  risk:8  },
  { id:"S114", name:"Suresh Babu",    regno:"22CS114", dept:"CSE", class:"CSE-3A", avatar:"SB", connectionStatus:"connected",    permissionStatus:"waiting",   joinedAt:"10:05 AM", ipAddress:"192.168.1.114", device:"Chrome 124 · Windows",  faceVerified:true,  risk:40 },
  { id:"S115", name:"Lakshmi Devi",   regno:"22CS115", dept:"CSE", class:"CSE-3A", avatar:"LD", connectionStatus:"connected",    permissionStatus:"approved",  joinedAt:"10:01 AM", ipAddress:"192.168.1.115", device:"Firefox 125 · Windows", faceVerified:true,  risk:12 },
  { id:"S116", name:"Harish Kumar",   regno:"22CS116", dept:"CSE", class:"CSE-3A", avatar:"HK", connectionStatus:"connected",    permissionStatus:"approved",  joinedAt:"10:02 AM", ipAddress:"192.168.1.116", device:"Chrome 124 · Windows",  faceVerified:true,  risk:80 },
  { id:"S117", name:"Divya Krishnan", regno:"22CS117", dept:"CSE", class:"CSE-3A", avatar:"DK", connectionStatus:"connected",    permissionStatus:"waiting",   joinedAt:"10:10 AM", ipAddress:"192.168.1.117", device:"Chrome 124 · Linux",    faceVerified:true,  risk:18 },
  { id:"S118", name:"Ravi Shankar",   regno:"22CS118", dept:"CSE", class:"CSE-3A", avatar:"RS", connectionStatus:"connected",    permissionStatus:"waiting",   joinedAt:"10:06 AM", ipAddress:"192.168.1.118", device:"Chrome 124 · Windows",  faceVerified:true,  risk:33 },
  { id:"S119", name:"Pooja Patel",    regno:"22CS119", dept:"CSE", class:"CSE-3A", avatar:"PP", connectionStatus:"disconnected", permissionStatus:"waiting",   joinedAt:"10:11 AM", ipAddress:"192.168.1.119", device:"Chrome 124 · Windows",  faceVerified:false, risk:0  },
  { id:"S120", name:"Siddharth Das",  regno:"22CS120", dept:"CSE", class:"CSE-3A", avatar:"SD", connectionStatus:"connected",    permissionStatus:"approved",  joinedAt:"10:03 AM", ipAddress:"192.168.1.120", device:"Chrome 124 · Windows",  faceVerified:true,  risk:45 },
];

/* ── Session Info ──────────────────────────────────── */
export const MOCK_SESSION_INFO: SessionInfo = {
  id:           "SES001",
  token:        "LMSG-2026-CSE3A-TKN8X",
  examId:       "EX001",
  examTitle:    "Database Management Systems — Final",
  classId:      "CSE-3A",
  classLabel:   "CSE – 3rd Year A",
  passcode:     "DB2026",
  invigilator:  "John Martin",
  startedAt:    "10:00 AM",
  duration:     60,
  totalStudents: 20,
  approved:     10,
  waiting:      8,
  blocked:      2,
  status:       "active",
};

/* ── Session Alerts ────────────────────────────────── */
export const MOCK_SESSION_ALERTS: SessionAlert[] = [
  { id:"AL001", studentId:"S106", studentName:"Vikram Singh",   regno:"22CS106", type:"application", detail:"VS Code detected running in background",       severity:"critical", time:"10:35 AM", timestamp:Date.now()-1500000, acknowledged:false, risk:91 },
  { id:"AL002", studentId:"S102", studentName:"Arjun Mehta",    regno:"22CS102", type:"application", detail:"Terminal opened alongside browser",             severity:"critical", time:"10:40 AM", timestamp:Date.now()-1200000, acknowledged:false, risk:88 },
  { id:"AL003", studentId:"S104", studentName:"Karthik Rajan",  regno:"22CS104", type:"face",        detail:"Secondary person detected in camera frame",     severity:"critical", time:"10:42 AM", timestamp:Date.now()-1080000, acknowledged:false, risk:62 },
  { id:"AL004", studentId:"S103", studentName:"Priya Sharma",   regno:"22CS103", type:"tab_switch",  detail:"Chrome tab changed 3 times in 5 minutes",       severity:"medium",   time:"10:45 AM", timestamp:Date.now()-900000,  acknowledged:false, risk:35 },
  { id:"AL005", studentId:"S108", studentName:"Rohit Verma",    regno:"22CS108", type:"clipboard",   detail:"Clipboard access detected, content copied",     severity:"medium",   time:"10:47 AM", timestamp:Date.now()-780000,  acknowledged:true,  risk:48 },
  { id:"AL006", studentId:"S116", studentName:"Harish Kumar",   regno:"22CS116", type:"application", detail:"Discord messaging app opened",                  severity:"critical", time:"10:22 AM", timestamp:Date.now()-2280000, acknowledged:true,  risk:80 },
  { id:"AL007", studentId:"S112", studentName:"Nikhil Joshi",   regno:"22CS112", type:"idle",        detail:"No mouse or keyboard activity for 3 minutes",   severity:"medium",   time:"10:50 AM", timestamp:Date.now()-600000,  acknowledged:false, risk:55 },
  { id:"AL008", studentId:"S110", studentName:"Aditya Roy",     regno:"22CS110", type:"screen",      detail:"Screenshot tool detected",                      severity:"critical", time:"10:40 AM", timestamp:Date.now()-1200000, acknowledged:true,  risk:74 },
  { id:"AL009", studentId:"S119", studentName:"Pooja Patel",    regno:"22CS119", type:"network",     detail:"Internet connection lost for 2 minutes",         severity:"high",     time:"10:48 AM", timestamp:Date.now()-720000,  acknowledged:false, risk:65 },
  { id:"AL010", studentId:"S120", studentName:"Siddharth Das",  regno:"22CS120", type:"clipboard",   detail:"Clipboard paste operation detected",             severity:"medium",   time:"10:52 AM", timestamp:Date.now()-480000,  acknowledged:false, risk:45 },
];

/* ── Re-export class/exam data for invigilator use ── */
export {
  CLASS_STUDENTS,
} from "@/mock/students";

export {
  CLASS_VIOLATIONS,
} from "@/mock/violations";

export const CLASS_INFO: Record<string, {
  id: string; label: string; dept: string; year: string;
  section: string; strength: number; roomNo: string;
  online: number; waiting: number; approved: number;
}> = {
  "CSE-3A": { id:"CSE-3A", label:"CSE – 3rd Year A", dept:"Computer Science & Engineering", year:"3rd Year", section:"A", strength:20, roomNo:"Lab 101", online:18, waiting:8,  approved:10 },
  "CSE-3B": { id:"CSE-3B", label:"CSE – 3rd Year B", dept:"Computer Science & Engineering", year:"3rd Year", section:"B", strength:8,  roomNo:"Lab 102", online:7,  waiting:2,  approved:5  },
  "ECE-3A": { id:"ECE-3A", label:"ECE – 3rd Year A", dept:"Electronics & Communication",    year:"3rd Year", section:"A", strength:10, roomNo:"Lab 201", online:10, waiting:4,  approved:6  },
  "IT-2A":  { id:"IT-2A",  label:"IT  – 2nd Year A", dept:"Information Technology",         year:"2nd Year", section:"A", strength:10, roomNo:"Lab 301", online:9,  waiting:3,  approved:6  },
};
