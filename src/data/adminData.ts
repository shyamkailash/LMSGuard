import type { InvigilatorProfile, AvailableClass, AvailableExam, AdminAccount, Department, SchoolClass, AdminStudent, AdminInvigilator, AdminExam, MonitoringSession, SystemStats } from "@/types";
/**
 * LMSGuard AI — Admin Portal Mock Data
 */

// ─── Admin Accounts ───────────────────────────────────────────────────────────
export const ADMIN_ACCOUNTS : AdminAccount[] = [
  { id:"ADM001", name:"Dr. Ramesh Kumar", email:"admin@college.edu",        avatar:"RK", role:"Super Admin" },
  { id:"ADM002", name:"Dr. Meena Rao",   email:"meena.rao@college.edu",     avatar:"MR", role:"Dept Admin"  },
];

export function getAdminByEmail(email) {
  return ADMIN_ACCOUNTS.find(a => a.email.toLowerCase() === email.toLowerCase()) ?? ADMIN_ACCOUNTS[0];
}

// ─── Departments ─────────────────────────────────────────────────────────────
export const DEPARTMENTS : Department[] = [
  { id:"DEPT01", name:"Computer Science",  code:"CS",  hod:"Dr. Ramesh Kumar", students:120, classes:2 },
  { id:"DEPT02", name:"Electronics",       code:"EC",  hod:"Dr. Priya Nair",   students:80,  classes:1 },
  { id:"DEPT03", name:"Information Tech",  code:"IT",  hod:"Dr. Suresh Babu",  students:60,  classes:1 },
  { id:"DEPT04", name:"Mechanical Engg",   code:"ME",  hod:"Dr. Arun Menon",   students:90,  classes:2 },
];

// ─── All Classes ─────────────────────────────────────────────────────────────
export const ALL_CLASSES : SchoolClass[] = [
  { id:"CSE-3A", name:"CSE 3rd Year A", dept:"Computer Science", deptCode:"CS", year:"3rd", section:"A", strength:20 },
  { id:"CSE-3B", name:"CSE 3rd Year B", dept:"Computer Science", deptCode:"CS", year:"3rd", section:"B", strength:8  },
  { id:"ECE-3A", name:"ECE 3rd Year A", dept:"Electronics",      deptCode:"EC", year:"3rd", section:"A", strength:10 },
  { id:"IT-2A",  name:"IT 2nd Year A",  dept:"Information Tech", deptCode:"IT", year:"2nd", section:"A", strength:10 },
  { id:"ME-2A",  name:"ME 2nd Year A",  dept:"Mechanical Engg",  deptCode:"ME", year:"2nd", section:"A", strength:15 },
];

// ─── All Invigilators ────────────────────────────────────────────────────────
export const ALL_INVIGILATORS : AdminInvigilator[] = [
  { id:"INV001", name:"John Martin",    email:"john.martin@college.edu",  dept:"Computer Science", status:"active",   permissions:["CSE-3A","CSE-3B"], exams:["EX001","EX002"] },
  { id:"INV002", name:"Sarah Thomas",   email:"sarah.thomas@college.edu", dept:"Computer Science", status:"active",   permissions:["CSE-3B"],          exams:["EX002"]         },
  { id:"INV003", name:"Ravi Sharma",    email:"ravi.sharma@college.edu",  dept:"Electronics",      status:"active",   permissions:["ECE-3A"],          exams:["EX004"]         },
  { id:"INV004", name:"Priya Nair",     email:"priya.nair@college.edu",   dept:"Information Tech", status:"inactive", permissions:["IT-2A"],           exams:["EX003","EX005"] },
  { id:"INV005", name:"Arun Kumar",     email:"arun.kumar@college.edu",   dept:"Computer Science", status:"active",   permissions:["CSE-3A"],          exams:["EX001"]         },
  { id:"INV006", name:"Deepa Menon",    email:"deepa.menon@college.edu",  dept:"Electronics",      status:"active",   permissions:["ECE-3A"],          exams:["EX004"]         },
];

// ─── All Students ────────────────────────────────────────────────────────────
export const ALL_STUDENTS : AdminStudent[] = [
  { id:"S101", name:"Rahul Kumar",    regno:"22CS101", email:"rahul@college.edu",   dept:"Computer Science", class:"CSE-3A", status:"active",   risk:10  },
  { id:"S102", name:"Arjun Mehta",    regno:"22CS102", email:"arjun@college.edu",   dept:"Computer Science", class:"CSE-3A", status:"flagged",  risk:88  },
  { id:"S103", name:"Priya Sharma",   regno:"22CS103", email:"priya@college.edu",   dept:"Computer Science", class:"CSE-3A", status:"active",   risk:35  },
  { id:"S104", name:"Karthik Rajan",  regno:"22CS104", email:"karthik@college.edu", dept:"Computer Science", class:"CSE-3A", status:"active",   risk:62  },
  { id:"S105", name:"Deepa Nair",     regno:"22CS105", email:"deepa@college.edu",   dept:"Computer Science", class:"CSE-3A", status:"active",   risk:5   },
  { id:"S106", name:"Vikram Singh",   regno:"22CS106", email:"vikram@college.edu",  dept:"Computer Science", class:"CSE-3A", status:"flagged",  risk:91  },
  { id:"S107", name:"Anjali Gupta",   regno:"22CS107", email:"anjali@college.edu",  dept:"Computer Science", class:"CSE-3A", status:"active",   risk:22  },
  { id:"S108", name:"Rohit Verma",    regno:"22CS108", email:"rohit@college.edu",   dept:"Computer Science", class:"CSE-3A", status:"active",   risk:48  },
  { id:"S109", name:"Sneha Reddy",    regno:"22CS109", email:"sneha@college.edu",   dept:"Computer Science", class:"CSE-3A", status:"active",   risk:15  },
  { id:"S110", name:"Aditya Roy",     regno:"22CS110", email:"aditya@college.edu",  dept:"Computer Science", class:"CSE-3A", status:"flagged",  risk:74  },
  { id:"S201", name:"Ananya Sharma",  regno:"22CS201", email:"ananya@college.edu",  dept:"Computer Science", class:"CSE-3B", status:"active",   risk:20  },
  { id:"S202", name:"Rahul Verma",    regno:"22CS202", email:"rverma@college.edu",  dept:"Computer Science", class:"CSE-3B", status:"flagged",  risk:75  },
  { id:"S203", name:"Priyanka Das",   regno:"22CS203", email:"priyanka@college.edu",dept:"Computer Science", class:"CSE-3B", status:"active",   risk:30  },
  { id:"S301", name:"Nandini Pillai", regno:"22EC301", email:"nandini@college.edu", dept:"Electronics",      class:"ECE-3A", status:"active",   risk:12  },
  { id:"S302", name:"Sunil Babu",     regno:"22EC302", email:"sunil@college.edu",   dept:"Electronics",      class:"ECE-3A", status:"flagged",  risk:70  },
  { id:"S401", name:"Amrita Singh",   regno:"22IT401", email:"amrita@college.edu",  dept:"Information Tech", class:"IT-2A",  status:"active",   risk:18  },
  { id:"S402", name:"Rohan Kapoor",   regno:"22IT402", email:"rohan@college.edu",   dept:"Information Tech", class:"IT-2A",  status:"active",   risk:65  },
  { id:"S403", name:"Tanvi Shah",     regno:"22IT403", email:"tanvi@college.edu",   dept:"Information Tech", class:"IT-2A",  status:"active",   risk:10  },
];

// ─── All Exams ───────────────────────────────────────────────────────────────
export const ALL_EXAMS : AdminExam[] = [
  { id:"EX001", title:"DBMS Final Exam",        subject:"Database Management",    code:"CS501", date:"30-06-2026", dept:"Computer Science", classes:["CSE-3A","CSE-3B"], duration:60, questions:50, status:"active"   },
  { id:"EX002", title:"Java Programming Test",  subject:"Object Oriented Prog",   code:"CS401", date:"30-06-2026", dept:"Computer Science", classes:["CSE-3A","CSE-3B"], duration:45, questions:30, status:"active"   },
  { id:"EX003", title:"Data Structures Test",   subject:"DS & Algorithms",        code:"CS301", date:"01-07-2026", dept:"Computer Science", classes:["CSE-3A","IT-2A"],  duration:60, questions:40, status:"scheduled"},
  { id:"EX004", title:"Digital Circuits Exam",  subject:"Digital Electronics",    code:"EC401", date:"30-06-2026", dept:"Electronics",      classes:["ECE-3A"],          duration:60, questions:50, status:"active"   },
  { id:"EX005", title:"Web Technologies Test",  subject:"Web Development",        code:"IT301", date:"01-07-2026", dept:"Information Tech", classes:["IT-2A","CSE-3B"],  duration:45, questions:30, status:"scheduled"},
  { id:"EX006", name:"Networks Mid Term",       subject:"Computer Networks",      code:"CS502", date:"02-07-2026", dept:"Computer Science", classes:["CSE-3A"],          duration:30, questions:20, status:"scheduled"},
];

// ─── System-wide violations ───────────────────────────────────────────────────
export const ALL_VIOLATIONS = [
  { id:"V001", studentName:"Arjun Mehta",    regno:"22CS102", class:"CSE-3A", exam:"DBMS Final",     type:"App Switch",    severity:"critical", time:"10:40", timestamp:Date.now()-420000 },
  { id:"V002", studentName:"Rahul Kumar",    regno:"22CS101", class:"CSE-3A", exam:"DBMS Final",     type:"Browser Switch",severity:"medium",   time:"10:30", timestamp:Date.now()-600000 },
  { id:"V003", studentName:"Vikram Singh",   regno:"22CS106", class:"CSE-3A", exam:"DBMS Final",     type:"Unknown App",   severity:"critical", time:"10:35", timestamp:Date.now()-540000 },
  { id:"V004", studentName:"Karthik Rajan",  regno:"22CS104", class:"CSE-3A", exam:"DBMS Final",     type:"Multi-Face",    severity:"critical", time:"10:42", timestamp:Date.now()-360000 },
  { id:"V005", studentName:"Priya Sharma",   regno:"22CS103", class:"CSE-3A", exam:"DBMS Final",     type:"Browser Switch",severity:"medium",   time:"10:45", timestamp:Date.now()-300000 },
  { id:"V006", studentName:"Rahul Verma",    regno:"22CS202", class:"CSE-3B", exam:"Java Test",      type:"Browser Switch",severity:"medium",   time:"14:12", timestamp:Date.now()-480000 },
  { id:"V007", studentName:"Kiran Reddy",    regno:"22CS206", class:"CSE-3B", exam:"Java Test",      type:"App Switch",    severity:"critical", time:"14:15", timestamp:Date.now()-420000 },
  { id:"V008", studentName:"Sunil Babu",     regno:"22EC302", class:"ECE-3A", exam:"Digital Circuits",type:"Browser Switch",severity:"critical", time:"11:10", timestamp:Date.now()-600000 },
  { id:"V009", studentName:"Pramod Kumar",   regno:"22EC306", class:"ECE-3A", exam:"Digital Circuits",type:"App Switch",    severity:"critical", time:"11:15", timestamp:Date.now()-540000 },
  { id:"V010", studentName:"Karan Mehta",    regno:"22IT404", class:"IT-2A",  exam:"Web Tech",       type:"App Switch",    severity:"critical", time:"14:10", timestamp:Date.now()-540000 },
];

// ─── Active monitoring sessions ───────────────────────────────────────────────
export const ACTIVE_SESSIONS : MonitoringSession[] = [
  { id:"SES001", invigilator:"John Martin",  class:"CSE-3A", exam:"DBMS Final Exam",       students:20, violations:8,  status:"active",  startTime:"10:00 AM" },
  { id:"SES002", invigilator:"Sarah Thomas", class:"CSE-3B", exam:"Java Programming Test",  students:8,  violations:4,  status:"active",  startTime:"02:00 PM" },
  { id:"SES003", invigilator:"Ravi Sharma",  class:"ECE-3A", exam:"Digital Circuits Exam",  students:10, violations:4,  status:"active",  startTime:"11:00 AM" },
  { id:"SES004", invigilator:"Arun Kumar",   class:"CSE-3A", exam:"DBMS Final Exam",        students:20, violations:3,  status:"paused",  startTime:"10:00 AM" },
  { id:"SES005", invigilator:"Priya Nair",   class:"IT-2A",  exam:"Web Technologies Test",  students:10, violations:2,  status:"active",  startTime:"02:00 PM" },
];

// ─── System stats ─────────────────────────────────────────────────────────────
export const SYSTEM_STATS : SystemStats = {
  totalStudents:    500,
  totalInvigilators: 25,
  activeExams:       10,
  totalViolations:   50,
  aiAccuracy:        "98.5%",
  serverUptime:      "99.9%",
};
