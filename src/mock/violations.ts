import type { ViolationRecord, AIAlert, TimelineEvent } from "@/types";

export const MOCK_VIOLATIONS: ViolationRecord[] = [
  { id:"V001", studentId:"S102", studentName:"Arjun Mehta",    regno:"22CS102", type:"Application Switch", detail:"VS Code opened",        severity:"critical", time:"10:40", timestamp:Date.now()-420000,  assignedClass:"CSE-3A", exam:"DBMS Final", risk:88  },
  { id:"V002", studentId:"S101", studentName:"Rahul Kumar",    regno:"22CS101", type:"Browser Switch",     detail:"Chrome tab changed",    severity:"medium",   time:"10:30", timestamp:Date.now()-600000,  assignedClass:"CSE-3A", exam:"DBMS Final", risk:32  },
  { id:"V003", studentId:"S106", studentName:"Vikram Singh",   regno:"22CS106", type:"Unknown App",        detail:"Terminal opened",       severity:"critical", time:"10:35", timestamp:Date.now()-540000,  assignedClass:"CSE-3A", exam:"DBMS Final", risk:91  },
  { id:"V004", studentId:"S104", studentName:"Karthik Rajan",  regno:"22CS104", type:"Multiple Faces",     detail:"2nd person detected",   severity:"critical", time:"10:42", timestamp:Date.now()-360000,  assignedClass:"CSE-3A", exam:"DBMS Final", risk:62  },
  { id:"V005", studentId:"S103", studentName:"Priya Sharma",   regno:"22CS103", type:"Browser Switch",     detail:"New tab opened",        severity:"medium",   time:"10:45", timestamp:Date.now()-300000,  assignedClass:"CSE-3A", exam:"DBMS Final", risk:35  },
  { id:"V006", studentId:"S108", studentName:"Rohit Verma",    regno:"22CS108", type:"Copy/Paste",         detail:"Clipboard activity",    severity:"medium",   time:"10:47", timestamp:Date.now()-180000,  assignedClass:"CSE-3A", exam:"DBMS Final", risk:48  },
  { id:"V007", studentId:"S110", studentName:"Aditya Roy",     regno:"22CS110", type:"Screen Capture",     detail:"Screenshot attempt",    severity:"critical", time:"10:40", timestamp:Date.now()-360000,  assignedClass:"CSE-3A", exam:"DBMS Final", risk:74  },
  { id:"V008", studentId:"S116", studentName:"Harish Kumar",   regno:"22CS116", type:"App Switch",         detail:"Discord opened",        severity:"critical", time:"10:22", timestamp:Date.now()-720000,  assignedClass:"CSE-3A", exam:"DBMS Final", risk:80  },
  { id:"V009", studentId:"S112", studentName:"Nikhil Joshi",   regno:"22CS112", type:"Idle Detected",      detail:"Mouse inactive 3 min",  severity:"medium",   time:"10:50", timestamp:Date.now()-120000,  assignedClass:"CSE-3A", exam:"DBMS Final", risk:55  },
  { id:"V010", studentId:"S119", studentName:"Pooja Patel",    regno:"22CS119", type:"Multiple Faces",     detail:"Person in background",  severity:"medium",   time:"10:48", timestamp:Date.now()-180000,  assignedClass:"CSE-3A", exam:"DBMS Final", risk:65  },
  { id:"V201", studentId:"S202", studentName:"Rahul Verma",    regno:"22CS202", type:"Browser Switch",     detail:"Chrome tab changed",    severity:"medium",   time:"14:12", timestamp:Date.now()-480000,  assignedClass:"CSE-3B", exam:"Java Test",   risk:75  },
  { id:"V202", studentId:"S206", studentName:"Kiran Reddy",    regno:"22CS206", type:"App Switch",         detail:"VS Code opened",        severity:"critical", time:"14:15", timestamp:Date.now()-420000,  assignedClass:"CSE-3B", exam:"Java Test",   risk:85  },
  { id:"V203", studentId:"S204", studentName:"Arun Kumar",     regno:"22CS204", type:"Idle Detected",      detail:"No activity 3 min",     severity:"medium",   time:"14:20", timestamp:Date.now()-360000,  assignedClass:"CSE-3B", exam:"Java Test",   risk:55  },
  { id:"V301", studentId:"S302", studentName:"Sunil Babu",     regno:"22EC302", type:"Browser Switch",     detail:"YouTube opened",        severity:"critical", time:"11:10", timestamp:Date.now()-600000,  assignedClass:"ECE-3A", exam:"Digital Circuits", risk:70 },
  { id:"V302", studentId:"S306", studentName:"Pramod Kumar",   regno:"22EC306", type:"App Switch",         detail:"VS Code opened",        severity:"critical", time:"11:15", timestamp:Date.now()-540000,  assignedClass:"ECE-3A", exam:"Digital Circuits", risk:88 },
  { id:"V401", studentId:"S404", studentName:"Karan Mehta",    regno:"22IT404", type:"App Switch",         detail:"VS Code opened",        severity:"critical", time:"14:10", timestamp:Date.now()-540000,  assignedClass:"IT-2A",  exam:"Web Tech",    risk:82  },
  { id:"V402", studentId:"S408", studentName:"Saurav Das",     regno:"22IT408", type:"Screen Capture",     detail:"Screenshot attempt",    severity:"critical", time:"14:20", timestamp:Date.now()-360000,  assignedClass:"IT-2A",  exam:"Web Tech",    risk:72  },
];

export const MOCK_AI_ALERTS: AIAlert[] = [
  { id:"A001", studentId:"S106", studentName:"Vikram Singh",  regno:"22CS106", class:"CSE-3A", exam:"DBMS Final",    type:"Suspicious App",       severity:"critical", confidence:96, message:"Terminal application detected running in background. High risk of unauthorized resource access.", timestamp:Date.now()-350000, time:"10:35", acknowledged:false, riskBefore:45, riskAfter:91, suggestion:"Warn student and monitor closely. Consider ending exam if pattern persists." },
  { id:"A002", studentId:"S102", studentName:"Arjun Mehta",   regno:"22CS102", class:"CSE-3A", exam:"DBMS Final",    type:"Multi-Application",     severity:"critical", confidence:93, message:"VS Code and browser developer tools detected simultaneously. Pattern consistent with code assistance.", timestamp:Date.now()-400000, time:"10:40", acknowledged:false, riskBefore:38, riskAfter:88, suggestion:"Issue immediate warning. Cross-check with screen recording." },
  { id:"A003", studentId:"S104", studentName:"Karthik Rajan", regno:"22CS104", class:"CSE-3A", exam:"DBMS Final",    type:"Face Anomaly",          severity:"critical", confidence:88, message:"Secondary person detected in camera frame. Potential external assistance scenario.", timestamp:Date.now()-370000, time:"10:42", acknowledged:false, riskBefore:28, riskAfter:62, suggestion:"Take screenshot as evidence. Warn student verbally." },
  { id:"A004", studentId:"S302", studentName:"Sunil Babu",    regno:"22EC302", class:"ECE-3A", exam:"Digital Circuits", type:"Media Streaming",    severity:"high",     confidence:91, message:"YouTube browser tab detected. Student may be referencing video content during exam.", timestamp:Date.now()-580000, time:"11:10", acknowledged:true,  riskBefore:22, riskAfter:70, suggestion:"Mark as warned. Flag report for review post-exam." },
  { id:"A005", studentId:"S116", studentName:"Harish Kumar",  regno:"22CS116", class:"CSE-3A", exam:"DBMS Final",    type:"Communication App",     severity:"critical", confidence:97, message:"Discord messaging app opened. Real-time communication during exam is a severe integrity violation.", timestamp:Date.now()-710000, time:"10:22", acknowledged:true,  riskBefore:20, riskAfter:80, suggestion:"Immediate exam termination recommended." },
  { id:"A006", studentId:"S402", studentName:"Rohan Kapoor",  regno:"22IT402", class:"IT-2A",  exam:"Web Tech",      type:"Tab Navigation",        severity:"medium",   confidence:82, message:"Multiple browser tab switches detected. Pattern suggests reference material access.", timestamp:Date.now()-590000, time:"14:05", acknowledged:false, riskBefore:18, riskAfter:65, suggestion:"Issue warning and monitor tab count." },
];

export const MOCK_TIMELINE: TimelineEvent[] = [
  { id:"T001", time:"10:00 AM", timestamp:Date.now()-3600000, type:"success", title:"Exam Session Started",       description:"DBMS Final Exam started for CSE-3A. 20 students connected.",       severity:"low"      },
  { id:"T002", time:"10:05 AM", timestamp:Date.now()-3300000, type:"info",    title:"All Students Verified",      description:"Biometric and face verification completed for all 20 students.",   severity:"low"      },
  { id:"T003", time:"10:22 AM", timestamp:Date.now()-2280000, type:"warning", title:"Violation: Harish Kumar",    description:"Discord app detected. Risk escalated to 80%.",                      student:"Harish Kumar",  regno:"22CS116", severity:"critical" },
  { id:"T004", time:"10:30 AM", timestamp:Date.now()-1800000, type:"warning", title:"Violation: Rahul Kumar",     description:"Browser tab switch detected.",                                      student:"Rahul Kumar",   regno:"22CS101", severity:"medium"   },
  { id:"T005", time:"10:35 AM", timestamp:Date.now()-1500000, type:"warning", title:"AI Alert: Vikram Singh",     description:"Terminal application opened. Suspicious activity detected.",         student:"Vikram Singh",  regno:"22CS106", severity:"critical" },
  { id:"T006", time:"10:40 AM", timestamp:Date.now()-1200000, type:"warning", title:"Violation: Arjun Mehta",     description:"VS Code opened alongside browser. High-risk pattern.",               student:"Arjun Mehta",   regno:"22CS102", severity:"critical" },
  { id:"T007", time:"10:42 AM", timestamp:Date.now()-1080000, type:"warning", title:"AI Alert: Karthik Rajan",    description:"Secondary person detected in camera frame.",                        student:"Karthik Rajan", regno:"22CS104", severity:"critical" },
  { id:"T008", time:"10:45 AM", timestamp:Date.now()-900000,  type:"info",    title:"Session Paused",             description:"Exam session temporarily paused by invigilator John Martin.",       severity:"low"      },
  { id:"T009", time:"10:47 AM", timestamp:Date.now()-780000,  type:"info",    title:"Session Resumed",            description:"Exam sessions resumed. 5 minutes added to all students.",            severity:"low"      },
  { id:"T010", time:"10:55 AM", timestamp:Date.now()-300000,  type:"system",  title:"AI Analysis Complete",       description:"Risk analysis updated. 4 students marked high risk.",               severity:"low"      },
];

// Class-wise violation distribution for monitoring
export const CLASS_VIOLATIONS: Record<string, ViolationRecord[]> = {
  "CSE-3A": MOCK_VIOLATIONS.filter(v => v.assignedClass === "CSE-3A"),
  "CSE-3B": MOCK_VIOLATIONS.filter(v => v.assignedClass === "CSE-3B"),
  "ECE-3A": MOCK_VIOLATIONS.filter(v => v.assignedClass === "ECE-3A"),
  "IT-2A": MOCK_VIOLATIONS.filter(v => v.assignedClass === "IT-2A"),
};
