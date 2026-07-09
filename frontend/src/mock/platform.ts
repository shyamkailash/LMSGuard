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

export const trustedInstitutions = [
  "Northbridge University",
  "Aster Institute",
  "IITM Online",
  "Verdant College",
  "Kavya School of AI",
  "Metro Business School",
];

export const workflowNodes = [
  { title: "Student", detail: "Identity, device, and session baseline created." },
  { title: "Screen Agent", detail: "Secure stream captures focus, windows, and clipboard intent." },
  { title: "AI Detection", detail: "Vision and behavior models classify anomalies in real time." },
  { title: "Risk Engine", detail: "Signals are weighted against exam policy and historic context." },
  { title: "Alert", detail: "Invigilators receive severity, evidence, and suggested action." },
  { title: "Report", detail: "Review packets preserve a defensible audit trail." },
];

export const detectionSignals = [
  { label: "Face confidence", value: 98, tone: "cyan" },
  { label: "Window focus", value: 86, tone: "amber" },
  { label: "Audio anomaly", value: 14, tone: "emerald" },
  { label: "Network drift", value: 31, tone: "blue" },
];

export const pricingPlans = [
  {
    name: "Launch",
    price: "$399",
    detail: "For departments running high-stakes online tests.",
    features: ["1,000 monitored seats", "Live alerts", "Evidence reports", "Email support"],
  },
  {
    name: "Institution",
    price: "$1,499",
    detail: "For universities standardizing exam integrity.",
    features: ["10,000 monitored seats", "LMS integrations", "Advanced risk policy", "Priority support"],
  },
  {
    name: "Enterprise",
    price: "Custom",
    detail: "For multi-campus compliance and private deployments.",
    features: ["Dedicated inference lanes", "SAML and API keys", "Data residency", "Security reviews"],
  },
];

export const faqs = [
  ["Can LMSGuard integrate with our LMS?", "Yes. The product is designed around LMS connectors, roster sync, exam schedules, and export-ready gradebook workflows."],
  ["Does it interrupt students unnecessarily?", "Risk scoring is evidence-led. LMSGuard highlights sustained anomalies and gives invigilators context before escalation."],
  ["What evidence is captured?", "Screens, window focus changes, policy events, identity confidence, network quality, and invigilator notes can be bundled into reports."],
  ["Is the interface ready for mobile?", "Every core surface adapts to laptop, tablet, and mobile layouts with keyboard-accessible controls."],
];

export const notifications = [
  { id: "N-501", title: "Critical identity alert", body: "Nila Thomas has a secondary face confidence spike.", time: "Now", read: false, severity: 91 },
  { id: "N-497", title: "Network quality recovered", body: "ECE room stream returned to adaptive HD.", time: "6 min", read: false, severity: 34 },
  { id: "N-488", title: "Exam started", body: "Financial Analytics opened for 98 students.", time: "18 min", read: true, severity: 22 },
  { id: "N-472", title: "Review packet signed", body: "Cloud Security report approved by Prof. Menon.", time: "41 min", read: true, severity: 48 },
];

export const invigilators = [
  { name: "Dr. Kavya Raman", role: "Lead Invigilator", availability: "Live", exams: 4, accuracy: 97, load: 82 },
  { name: "Prof. Meera Shah", role: "Electronics Faculty", availability: "Live", exams: 3, accuracy: 95, load: 68 },
  { name: "Dr. Imran Ali", role: "Management Faculty", availability: "Scheduled", exams: 2, accuracy: 93, load: 44 },
  { name: "Prof. Sanjay Menon", role: "Review Specialist", availability: "Review", exams: 5, accuracy: 98, load: 76 },
];

export const reportRows = students.slice(0, 8).map((student, index) => ({
  id: `RP-${String(index + 28).padStart(3, "0")}`,
  student: student.name,
  exam: student.exam,
  department: student.department,
  risk: student.riskScore,
  packets: student.violations + 1,
  status: index % 3 === 0 ? "Escalated" : index % 3 === 1 ? "Ready" : "Reviewed",
}));

export const calendarBlocks = [
  { label: "09:00", title: "Distributed Systems", count: 186, tone: "cyan" },
  { label: "11:30", title: "Digital Signal Processing", count: 142, tone: "violet" },
  { label: "15:30", title: "Financial Analytics", count: 98, tone: "emerald" },
  { label: "17:00", title: "Machine Learning", count: 212, tone: "amber" },
];
