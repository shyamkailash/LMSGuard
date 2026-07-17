import type { AdminInvigilator, InvigilatorProfile, MonitoringSession } from "@/types";

export const MOCK_INVIGILATORS: AdminInvigilator[] = [
  { id:"INV001", name:"John Martin",      email:"john.martin@ssiet.ac.in",    dept:"Computer Science & Engineering", status:"active",   permissions:["CSE-3A","CSE-3B"], exams:["EX001","EX002"], phone:"+91 98765 21001", joinedAt:"2021-06-15", totalExams:24, avatar:"JM" },
  { id:"INV002", name:"Sarah Thomas",     email:"sarah.thomas@ssiet.ac.in",   dept:"Computer Science & Engineering", status:"active",   permissions:["CSE-3B"],          exams:["EX002"],         phone:"+91 98765 21002", joinedAt:"2020-08-10", totalExams:18, avatar:"ST" },
  { id:"INV003", name:"Ravi Sharma",      email:"ravi.sharma@ssiet.ac.in",    dept:"Electronics & Communication",    status:"active",   permissions:["ECE-3A"],          exams:["EX004"],         phone:"+91 98765 21003", joinedAt:"2019-07-20", totalExams:31, avatar:"RS" },
  { id:"INV004", name:"Priya Nair",       email:"priya.nair@ssiet.ac.in",     dept:"Information Technology",         status:"inactive", permissions:["IT-2A"],           exams:["EX003","EX005"], phone:"+91 98765 21004", joinedAt:"2022-01-05", totalExams:12, avatar:"PN" },
  { id:"INV005", name:"Arun Kumar",       email:"arun.kumar@ssiet.ac.in",     dept:"Computer Science & Engineering", status:"active",   permissions:["CSE-3A"],          exams:["EX001"],         phone:"+91 98765 21005", joinedAt:"2020-03-12", totalExams:22, avatar:"AK" },
  { id:"INV006", name:"Deepa Menon",      email:"deepa.menon@ssiet.ac.in",    dept:"Electronics & Communication",    status:"active",   permissions:["ECE-3A"],          exams:["EX004"],         phone:"+91 98765 21006", joinedAt:"2021-11-28", totalExams:16, avatar:"DM" },
  { id:"INV007", name:"Vijay Anand",      email:"vijay.anand@ssiet.ac.in",    dept:"Mechanical Engineering",         status:"active",   permissions:["MECH-3A"],         exams:[],                phone:"+91 98765 21007", joinedAt:"2023-06-01", totalExams:8,  avatar:"VA" },
  { id:"INV008", name:"Kavitha Lakshmi",  email:"kavitha.l@ssiet.ac.in",      dept:"Civil Engineering",              status:"active",   permissions:["CIVIL-2A"],        exams:[],                phone:"+91 98765 21008", joinedAt:"2022-09-15", totalExams:10, avatar:"KL" },
];

export const INVIGILATOR_PROFILES: InvigilatorProfile[] = [
  { id:"INV001", name:"John Martin",  email:"john.martin@ssiet.ac.in",  avatar:"JM", department:"Computer Science & Engineering", status:"active" },
  { id:"INV002", name:"Sarah Thomas", email:"sarah.thomas@ssiet.ac.in", avatar:"ST", department:"Computer Science & Engineering", status:"active" },
  { id:"INV003", name:"Ravi Sharma",  email:"ravi.sharma@ssiet.ac.in",  avatar:"RS", department:"Electronics & Communication",    status:"active" },
  { id:"INV004", name:"Priya Nair",   email:"priya.nair@ssiet.ac.in",   avatar:"PN", department:"Information Technology",         status:"inactive" },
];

export const MOCK_SESSIONS: MonitoringSession[] = [
  { id:"SES001", invigilatorId:"INV001", invigilator:"John Martin",  class:"CSE-3A", exam:"DBMS Final Exam",        examId:"EX001", students:20, violations:10, status:"active",  startTime:"10:00 AM", dept:"CSE", avgRisk:42, room:"Lab 101" },
  { id:"SES002", invigilatorId:"INV002", invigilator:"Sarah Thomas", class:"CSE-3B", exam:"Java Programming Test",  examId:"EX002", students:8,  violations:4,  status:"active",  startTime:"02:00 PM", dept:"CSE", avgRisk:38, room:"Lab 102" },
  { id:"SES003", invigilatorId:"INV003", invigilator:"Ravi Sharma",  class:"ECE-3A", exam:"Digital Circuits Exam",  examId:"EX004", students:10, violations:4,  status:"active",  startTime:"11:00 AM", dept:"ECE", avgRisk:31, room:"Lab 201" },
  { id:"SES004", invigilatorId:"INV005", invigilator:"Arun Kumar",   class:"CSE-3A", exam:"DBMS Final Exam",        examId:"EX001", students:20, violations:3,  status:"paused",  startTime:"10:00 AM", dept:"CSE", avgRisk:28, room:"Lab 103" },
  { id:"SES005", invigilatorId:"INV004", invigilator:"Priya Nair",   class:"IT-2A",  exam:"Web Technologies Test",  examId:"EX005", students:10, violations:2,  status:"active",  startTime:"02:00 PM", dept:"IT",  avgRisk:22, room:"Lab 301" },
];

export const MOCK_ADMIN_ACCOUNTS = [
  { id:"ADM001", name:"Dr. Ramesh Kumar", email:"admin@ssiet.ac.in",        password:"admin123", avatar:"RK", role:"Super Admin" as const, department:"Computer Science & Engineering", phone:"+91 98765 10001", joinedAt:"2018-06-01", lastLogin:"Today, 09:12 AM" },
  { id:"ADM002", name:"Dr. Meena Rao",    email:"meena.rao@ssiet.ac.in",    password:"admin123", avatar:"MR", role:"Dept Admin"  as const, department:"Electronics & Communication",    phone:"+91 98765 10002", joinedAt:"2019-08-15", lastLogin:"Today, 08:45 AM" },
];

export const AVAILABLE_CLASSES_LIST = [
  { id:"CSE-3A",   label:"CSE – 3rd Year A", dept:"Computer Science & Engineering", year:"3rd Year", section:"A", strength:20, roomNo:"Lab 101" },
  { id:"CSE-3B",   label:"CSE – 3rd Year B", dept:"Computer Science & Engineering", year:"3rd Year", section:"B", strength:8,  roomNo:"Lab 102" },
  { id:"ECE-3A",   label:"ECE – 3rd Year A", dept:"Electronics & Communication",    year:"3rd Year", section:"A", strength:10, roomNo:"Lab 201" },
  { id:"IT-2A",    label:"IT  – 2nd Year A", dept:"Information Technology",         year:"2nd Year", section:"A", strength:10, roomNo:"Lab 301" },
  { id:"MECH-3A",  label:"MECH – 3rd Year A",dept:"Mechanical Engineering",         year:"3rd Year", section:"A", strength:15, roomNo:"Lab 401" },
  { id:"AIML-3A",  label:"AI&ML – 3rd Year A",dept:"Artificial Intelligence & ML",  year:"3rd Year", section:"A", strength:12, roomNo:"Lab 501" },
];

export const MOCK_SYSTEM_STATS = {
  totalStudents:    880,
  totalInvigilators: 25,
  activeExams:        4,
  totalViolations:   50,
  aiAccuracy:        "98.7%",
  serverUptime:      "99.9%",
  totalDepartments:   6,
  totalClasses:      14,
  onlineStudents:    48,
  criticalAlerts:     6,
};
