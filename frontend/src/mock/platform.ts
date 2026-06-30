export type StudentRisk = "low" | "medium" | "high" | "critical";

export type StudentMonitor = {
  id: string;
  name: string;
  registerNumber: string;
  department: string;
  exam: string;
  riskScore: number;
  currentApplication: string;
  violations: number;
  connection: number;
  timeRemaining: string;
  aiStatus: "Calibrated" | "Reviewing" | "Elevated";
};

export type Exam = {
  id: string;
  title: string;
  department: string;
  students: number;
  invigilator: string;
  startsAt: string;
  status: "Live" | "Scheduled" | "Review";
  risk: number;
};

export type Violation = {
  id: string;
  student: string;
  registerNumber: string;
  exam: string;
  event: string;
  time: string;
  severity: number;
  status: "Queued" | "Reviewed" | "Escalated";
};

export const stats = [
  { label: "Students monitored", value: "1,284", change: "18% above yesterday", tone: "violet" },
  { label: "Active exams", value: "14", change: "6 departments online", tone: "cyan" },
  { label: "AI health score", value: "98.2", change: "All inference lanes stable", tone: "emerald" },
  { label: "Open reviews", value: "27", change: "12 high priority cases", tone: "amber" },
] as const;

export const alerts: Violation[] = [
  {
    id: "V-1042",
    student: "Aarav Mehta",
    registerNumber: "CSE-22-041",
    exam: "Distributed Systems",
    event: "Repeated window focus changes detected",
    time: "2 min ago",
    severity: 72,
    status: "Queued",
  },
  {
    id: "V-1041",
    student: "Nila Thomas",
    registerNumber: "ECE-22-117",
    exam: "Digital Signal Processing",
    event: "Unregistered secondary face confidence",
    time: "8 min ago",
    severity: 91,
    status: "Escalated",
  },
  {
    id: "V-1038",
    student: "Rohan Iyer",
    registerNumber: "IT-21-088",
    exam: "Cloud Security",
    event: "Clipboard access blocked by policy",
    time: "19 min ago",
    severity: 54,
    status: "Reviewed",
  },
];

export const exams: Exam[] = [
  {
    id: "EX-221",
    title: "Distributed Systems",
    department: "Computer Science",
    students: 186,
    invigilator: "Dr. Kavya Raman",
    startsAt: "Live for 42 min",
    status: "Live",
    risk: 36,
  },
  {
    id: "EX-219",
    title: "Digital Signal Processing",
    department: "Electronics",
    students: 142,
    invigilator: "Prof. Meera Shah",
    startsAt: "Live for 25 min",
    status: "Live",
    risk: 62,
  },
  {
    id: "EX-224",
    title: "Financial Analytics",
    department: "Management",
    students: 98,
    invigilator: "Dr. Imran Ali",
    startsAt: "Starts 03:30 PM",
    status: "Scheduled",
    risk: 18,
  },
  {
    id: "EX-216",
    title: "Cloud Security",
    department: "Information Technology",
    students: 121,
    invigilator: "Prof. Sanjay Menon",
    startsAt: "Review window",
    status: "Review",
    risk: 48,
  },
];

const departments = ["CSE", "ECE", "IT", "MECH", "MBA", "AIML"];
const examsByIndex = [
  "Distributed Systems",
  "Digital Signal Processing",
  "Cloud Security",
  "Financial Analytics",
  "Machine Learning",
  "Applied Mathematics",
];
const apps = ["Secure Exam Browser", "PDF Viewer", "Compiler IDE", "Calculator", "Browser blocked"];
const firstNames = [
  "Aarav",
  "Nila",
  "Rohan",
  "Diya",
  "Kabir",
  "Isha",
  "Vihaan",
  "Anaya",
  "Arjun",
  "Mira",
];
const lastNames = ["Mehta", "Thomas", "Iyer", "Kapoor", "Nair", "Shah", "Rao", "Menon", "Ali", "Sen"];

export const students: StudentMonitor[] = Array.from({ length: 200 }, (_, index) => {
  const riskScore = (index * 17 + 23) % 100;
  const department = departments[index % departments.length];
  return {
    id: `ST-${String(index + 1).padStart(3, "0")}`,
    name: `${firstNames[index % firstNames.length]} ${lastNames[(index * 3) % lastNames.length]}`,
    registerNumber: `${department}-22-${String(index + 31).padStart(3, "0")}`,
    department,
    exam: examsByIndex[index % examsByIndex.length],
    riskScore,
    currentApplication: apps[index % apps.length],
    violations: riskScore > 80 ? 4 : riskScore > 60 ? 2 : riskScore > 35 ? 1 : 0,
    connection: 76 + ((index * 11) % 24),
    timeRemaining: `${54 - (index % 22)} min`,
    aiStatus: riskScore > 76 ? "Elevated" : riskScore > 42 ? "Reviewing" : "Calibrated",
  };
});

export const departmentRisk = [
  { label: "CSE", value: 42 },
  { label: "ECE", value: 35 },
  { label: "IT", value: 51 },
  { label: "MBA", value: 24 },
  { label: "AIML", value: 47 },
];

export const riskTrend = [21, 25, 31, 28, 44, 39, 52, 46, 57, 49, 62, 58];

export const settings = [
  { title: "Allowed applications", value: "12", detail: "Secure browser, IDE, calculator", progress: 82, tone: "emerald" },
  { title: "Blocked websites", value: "684", detail: "Policy list synced 4 min ago", progress: 91, tone: "violet" },
  { title: "AI sensitivity", value: "High", detail: "Balanced for university finals", progress: 74, tone: "cyan" },
  { title: "Risk threshold", value: "68", detail: "Escalates only sustained anomalies", progress: 68, tone: "amber" },
] as const;
