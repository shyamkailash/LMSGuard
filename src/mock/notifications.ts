import type { Notification } from "@/types";

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id:"N001", type:"violation", title:"Critical: Vikram Singh",   message:"Terminal application detected during DBMS Final. Risk: 91%",    timestamp:Date.now()-350000, read:false, studentId:"S106", examId:"EX001" },
  { id:"N002", type:"violation", title:"Critical: Arjun Mehta",    message:"VS Code opened during exam. Multiple app violations detected.",  timestamp:Date.now()-400000, read:false, studentId:"S102", examId:"EX001" },
  { id:"N003", type:"warning",   title:"Warning: Pooja Patel",     message:"Network disconnected during DBMS Final. Student offline.",       timestamp:Date.now()-180000, read:false, studentId:"S119", examId:"EX001" },
  { id:"N004", type:"info",      title:"Exam Session Started",     message:"DBMS Final — CSE-3A session started by John Martin.",           timestamp:Date.now()-3600000, read:true  },
  { id:"N005", type:"violation", title:"High Risk: Harish Kumar",  message:"Discord communication app detected. Exam integrity violated.",   timestamp:Date.now()-710000, read:true,  studentId:"S116", examId:"EX001" },
  { id:"N006", type:"success",   title:"Session Completed",        message:"Digital Circuits Exam — ECE-3A session ended successfully.",    timestamp:Date.now()-7200000, read:true  },
  { id:"N007", type:"warning",   title:"AI Alert: Karthik Rajan",  message:"Secondary face detected in camera. Potential external aid.",     timestamp:Date.now()-1080000, read:false, studentId:"S104", examId:"EX001" },
  { id:"N008", type:"info",      title:"New Exam Scheduled",       message:"Data Structures Test scheduled for 01-07-2026 by Admin.",        timestamp:Date.now()-86400000, read:true  },
];
