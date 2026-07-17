import type { AdminStudent, MonitoringStudent } from "@/types";

export const MOCK_STUDENTS: AdminStudent[] = [
  { id:"S101", name:"Rahul Kumar",    regno:"22CS101", email:"rahul@ssiet.ac.in",    dept:"Computer Science & Engineering", class:"CSE-3A", status:"active",   risk:10,  totalViolations:1 },
  { id:"S102", name:"Arjun Mehta",    regno:"22CS102", email:"arjun@ssiet.ac.in",    dept:"Computer Science & Engineering", class:"CSE-3A", status:"flagged",  risk:88,  totalViolations:5 },
  { id:"S103", name:"Priya Sharma",   regno:"22CS103", email:"priya.s@ssiet.ac.in",  dept:"Computer Science & Engineering", class:"CSE-3A", status:"active",   risk:35,  totalViolations:2 },
  { id:"S104", name:"Karthik Rajan",  regno:"22CS104", email:"karthik@ssiet.ac.in",  dept:"Computer Science & Engineering", class:"CSE-3A", status:"active",   risk:62,  totalViolations:3 },
  { id:"S105", name:"Deepa Nair",     regno:"22CS105", email:"deepa.n@ssiet.ac.in",  dept:"Computer Science & Engineering", class:"CSE-3A", status:"active",   risk:5,   totalViolations:0 },
  { id:"S106", name:"Vikram Singh",   regno:"22CS106", email:"vikram@ssiet.ac.in",   dept:"Computer Science & Engineering", class:"CSE-3A", status:"flagged",  risk:91,  totalViolations:6 },
  { id:"S107", name:"Anjali Gupta",   regno:"22CS107", email:"anjali@ssiet.ac.in",   dept:"Computer Science & Engineering", class:"CSE-3A", status:"active",   risk:22,  totalViolations:1 },
  { id:"S108", name:"Rohit Verma",    regno:"22CS108", email:"rohit@ssiet.ac.in",    dept:"Computer Science & Engineering", class:"CSE-3A", status:"active",   risk:48,  totalViolations:2 },
  { id:"S109", name:"Sneha Reddy",    regno:"22CS109", email:"sneha@ssiet.ac.in",    dept:"Computer Science & Engineering", class:"CSE-3A", status:"active",   risk:15,  totalViolations:0 },
  { id:"S110", name:"Aditya Roy",     regno:"22CS110", email:"aditya@ssiet.ac.in",   dept:"Computer Science & Engineering", class:"CSE-3A", status:"flagged",  risk:74,  totalViolations:4 },
];

export const MOCK_STUDENTS_EXTENDED: AdminStudent[] = [
  ...MOCK_STUDENTS,
  { id:"S111", name:"Meera Iyer",     regno:"22CS111", email:"meera@ssiet.ac.in",    dept:"Computer Science & Engineering", class:"CSE-3A", status:"active",   risk:28,  totalViolations:1 },
  { id:"S112", name:"Nikhil Joshi",   regno:"22CS112", email:"nikhil@ssiet.ac.in",   dept:"Computer Science & Engineering", class:"CSE-3A", status:"active",   risk:55,  totalViolations:2 },
  { id:"S201", name:"Ananya Sharma",  regno:"22CS201", email:"ananya@ssiet.ac.in",   dept:"Computer Science & Engineering", class:"CSE-3B", status:"active",   risk:20,  totalViolations:0 },
  { id:"S202", name:"Rahul Verma",    regno:"22CS202", email:"rverma@ssiet.ac.in",   dept:"Computer Science & Engineering", class:"CSE-3B", status:"flagged",  risk:75,  totalViolations:3 },
  { id:"S203", name:"Priyanka Das",   regno:"22CS203", email:"priyanka@ssiet.ac.in", dept:"Computer Science & Engineering", class:"CSE-3B", status:"active",   risk:30,  totalViolations:1 },
  { id:"S204", name:"Arun Kumar",     regno:"22CS204", email:"arun.k@ssiet.ac.in",   dept:"Computer Science & Engineering", class:"CSE-3B", status:"active",   risk:55,  totalViolations:2 },
  { id:"S301", name:"Nandini Pillai", regno:"22EC301", email:"nandini@ssiet.ac.in",  dept:"Electronics & Communication",    class:"ECE-3A", status:"active",   risk:12,  totalViolations:0 },
  { id:"S302", name:"Sunil Babu",     regno:"22EC302", email:"sunil@ssiet.ac.in",    dept:"Electronics & Communication",    class:"ECE-3A", status:"flagged",  risk:70,  totalViolations:3 },
  { id:"S401", name:"Amrita Singh",   regno:"22IT401", email:"amrita@ssiet.ac.in",   dept:"Information Technology",         class:"IT-2A",  status:"active",   risk:18,  totalViolations:0 },
  { id:"S402", name:"Rohan Kapoor",   regno:"22IT402", email:"rohan@ssiet.ac.in",    dept:"Information Technology",         class:"IT-2A",  status:"active",   risk:65,  totalViolations:2 },
  { id:"S403", name:"Tanvi Shah",     regno:"22IT403", email:"tanvi@ssiet.ac.in",    dept:"Information Technology",         class:"IT-2A",  status:"active",   risk:10,  totalViolations:0 },
];

export const MOCK_MONITORING_STUDENTS: MonitoringStudent[] = [
  { id:"S101", name:"Rahul Kumar",    regno:"22CS101", dept:"CSE", avatar:"RK", risk:10, status:"safe",      networkStatus:"stable",       violations:[], isOnline:true, examDuration:32, permissionStatus:"approved", clipboardActive:false, tabCount:1 },
  { id:"S102", name:"Arjun Mehta",    regno:"22CS102", dept:"CSE", avatar:"AM", risk:88, status:"violation", networkStatus:"stable",       violations:[{ time:"10:40", type:"Application Switch", detail:"VS Code opened", severity:"critical" }], isOnline:true, examDuration:30, permissionStatus:"approved", clipboardActive:true, tabCount:3, currentWindow:"VS Code" },
  { id:"S103", name:"Priya Sharma",   regno:"22CS103", dept:"CSE", avatar:"PS", risk:35, status:"warning",   networkStatus:"weak",         violations:[{ time:"10:45", type:"Browser Switch", detail:"New tab opened", severity:"medium" }], isOnline:true, examDuration:31, permissionStatus:"approved", clipboardActive:false, tabCount:2 },
  { id:"S104", name:"Karthik Rajan",  regno:"22CS104", dept:"CSE", avatar:"KR", risk:62, status:"warning",   networkStatus:"stable",       violations:[{ time:"10:42", type:"Multiple Faces", detail:"2nd person detected", severity:"critical" }], isOnline:true, examDuration:31, permissionStatus:"approved", clipboardActive:false, tabCount:1 },
  { id:"S105", name:"Deepa Nair",     regno:"22CS105", dept:"CSE", avatar:"DN", risk:5,  status:"safe",      networkStatus:"stable",       violations:[], isOnline:true, examDuration:32, permissionStatus:"approved", clipboardActive:false, tabCount:1 },
  { id:"S106", name:"Vikram Singh",   regno:"22CS106", dept:"CSE", avatar:"VS", risk:91, status:"violation", networkStatus:"stable",       violations:[{ time:"10:35", type:"Unknown App", detail:"Terminal opened", severity:"critical" }], isOnline:true, examDuration:29, permissionStatus:"approved", clipboardActive:true, tabCount:4, currentWindow:"Terminal", runningApps:["Terminal", "VS Code"] },
  { id:"S107", name:"Anjali Gupta",   regno:"22CS107", dept:"CSE", avatar:"AG", risk:22, status:"safe",      networkStatus:"stable",       violations:[], isOnline:true, examDuration:32, permissionStatus:"approved", clipboardActive:false, tabCount:1 },
  { id:"S108", name:"Rohit Verma",    regno:"22CS108", dept:"CSE", avatar:"RV", risk:48, status:"warning",   networkStatus:"stable",       violations:[{ time:"10:47", type:"Copy/Paste", detail:"Clipboard activity", severity:"medium" }], isOnline:true, examDuration:30, permissionStatus:"approved", clipboardActive:true, tabCount:2 },
  { id:"S109", name:"Sneha Reddy",    regno:"22CS109", dept:"CSE", avatar:"SR", risk:15, status:"safe",      networkStatus:"stable",       violations:[], isOnline:true, examDuration:32, permissionStatus:"approved", clipboardActive:false, tabCount:1 },
  { id:"S110", name:"Aditya Roy",     regno:"22CS110", dept:"CSE", avatar:"AR", risk:74, status:"violation", networkStatus:"stable",       violations:[{ time:"10:40", type:"Screen Capture", detail:"Screenshot attempt", severity:"critical" }], isOnline:true, examDuration:29, permissionStatus:"approved", clipboardActive:false, tabCount:2 },
  { id:"S111", name:"Meera Iyer",     regno:"22CS111", dept:"CSE", avatar:"MI", risk:28, status:"safe",      networkStatus:"stable",       violations:[], isOnline:true, examDuration:31, permissionStatus:"approved", clipboardActive:false, tabCount:1 },
  { id:"S112", name:"Nikhil Joshi",   regno:"22CS112", dept:"CSE", avatar:"NJ", risk:55, status:"warning",   networkStatus:"weak",         violations:[{ time:"10:50", type:"Idle Detected", detail:"Mouse inactive 3 min", severity:"medium" }], isOnline:true, isIdle:true, examDuration:28, permissionStatus:"approved", clipboardActive:false, tabCount:1 },
  { id:"S113", name:"Kavya Menon",    regno:"22CS113", dept:"CSE", avatar:"KM", risk:8,  status:"safe",      networkStatus:"stable",       violations:[], isOnline:true, examDuration:32, permissionStatus:"approved", clipboardActive:false, tabCount:1 },
  { id:"S114", name:"Suresh Babu",    regno:"22CS114", dept:"CSE", avatar:"SB", risk:40, status:"warning",   networkStatus:"stable",       violations:[{ time:"10:55", type:"Browser Switch", detail:"New window opened", severity:"medium" }], isOnline:true, examDuration:30, permissionStatus:"approved", clipboardActive:false, tabCount:2 },
  { id:"S115", name:"Lakshmi Devi",   regno:"22CS115", dept:"CSE", avatar:"LD", risk:12, status:"safe",      networkStatus:"stable",       violations:[], isOnline:true, examDuration:32, permissionStatus:"approved", clipboardActive:false, tabCount:1 },
  { id:"S116", name:"Harish Kumar",   regno:"22CS116", dept:"CSE", avatar:"HK", risk:80, status:"violation", networkStatus:"stable",       violations:[{ time:"10:22", type:"App Switch", detail:"Discord opened", severity:"critical" }], isOnline:true, examDuration:25, permissionStatus:"approved", clipboardActive:false, tabCount:2, currentWindow:"Discord" },
  { id:"S117", name:"Divya Krishnan", regno:"22CS117", dept:"CSE", avatar:"DK", risk:18, status:"safe",      networkStatus:"stable",       violations:[], isOnline:true, examDuration:31, permissionStatus:"approved", clipboardActive:false, tabCount:1 },
  { id:"S118", name:"Ravi Shankar",   regno:"22CS118", dept:"CSE", avatar:"RS", risk:33, status:"safe",      networkStatus:"stable",       violations:[], isOnline:true, examDuration:32, permissionStatus:"approved", clipboardActive:false, tabCount:1 },
  { id:"S119", name:"Pooja Patel",    regno:"22CS119", dept:"CSE", avatar:"PP", risk:65, status:"warning",   networkStatus:"disconnected", violations:[{ time:"10:48", type:"Multiple Faces", detail:"Person in background", severity:"medium" }], isOnline:false, examDuration:28, permissionStatus:"approved", clipboardActive:false, tabCount:1 },
  { id:"S120", name:"Siddharth Das",  regno:"22CS120", dept:"CSE", avatar:"SD", risk:45, status:"warning",   networkStatus:"stable",       violations:[{ time:"10:52", type:"Copy/Paste", detail:"Clipboard activity", severity:"medium" }], isOnline:true, examDuration:30, permissionStatus:"approved", clipboardActive:true, tabCount:2 },
];
