/**
 * LMSGuard AI — Network Issue Data
 * Mock network issue events and action logs for the invigilator portal.
 */

// ─── Network status levels ────────────────────────────────────────────────────
export const NETWORK_STATUS = {
  stable:       { label:"Stable",       icon:"🟢", color:"var(--success)", badge:"badge-success" },
  weak:         { label:"Weak Signal",  icon:"🟡", color:"var(--warning)", badge:"badge-warning" },
  disconnected: { label:"Disconnected", icon:"🔴", color:"var(--danger)",  badge:"badge-danger"  },
};

// ─── Seed network issues per class ───────────────────────────────────────────
export const INITIAL_NETWORK_ISSUES = {
  "CSE-3A": [
    {
      id:"NI001", studentId:"S101", studentName:"Rahul Kumar",   regno:"22CS101",
      classLabel:"CSE – 3rd Year A", examTitle:"DBMS Final Exam",
      issue:"Internet Connection Lost", disconnectedAt:"10:35:20",
      durationMin:5, networkStatus:"disconnected", resolved:false,
      timestamp: Date.now() - 300000,
    },
    {
      id:"NI002", studentId:"S103", studentName:"Priya Sharma",  regno:"22CS103",
      classLabel:"CSE – 3rd Year A", examTitle:"DBMS Final Exam",
      issue:"Weak Network Signal", disconnectedAt:"10:42:10",
      durationMin:2, networkStatus:"weak", resolved:false,
      timestamp: Date.now() - 120000,
    },
    {
      id:"NI003", studentId:"S107", studentName:"Anjali Gupta",  regno:"22CS107",
      classLabel:"CSE – 3rd Year A", examTitle:"DBMS Final Exam",
      issue:"Internet Connection Lost", disconnectedAt:"10:50:05",
      durationMin:3, networkStatus:"disconnected", resolved:true,
      resolution:"extra_time", extraMinutes:10,
      timestamp: Date.now() - 600000,
    },
  ],
  "CSE-3B": [
    {
      id:"NI201", studentId:"S201", studentName:"Ananya Sharma", regno:"22CS201",
      classLabel:"CSE – 3rd Year B", examTitle:"Java Programming Test",
      issue:"Internet Connection Lost", disconnectedAt:"14:20:15",
      durationMin:4, networkStatus:"disconnected", resolved:false,
      timestamp: Date.now() - 240000,
    },
  ],
  "ECE-3A": [],
  "IT-2A":  [],
};

// ─── Action types available to invigilator ───────────────────────────────────
export const NETWORK_ACTIONS = {
  extra_time:    { label:"Grant Extra Time",  icon:"⏱️",  color:"var(--success)" },
  allow_retest:  { label:"Allow Retest",      icon:"🔄",  color:"var(--primary)" },
  continue_exam: { label:"Continue Exam",     icon:"▶️",  color:"var(--warning)" },
  mark_issue:    { label:"Mark Issue",        icon:"📋",  color:"var(--text-secondary)" },
};

// ─── Extra time presets ───────────────────────────────────────────────────────
export const EXTRA_TIME_PRESETS = [5, 10, 15];

// ─── Retest duration options ─────────────────────────────────────────────────
export const RETEST_DURATION_OPTIONS = [
  { label:"Same Duration", value:"same" },
  { label:"30 Minutes",    value:30     },
  { label:"45 Minutes",    value:45     },
  { label:"60 Minutes",    value:60     },
];
