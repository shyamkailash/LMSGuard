/**
 * LMSGuard AI — Student Portal Mock Data
 */

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  regno: string;
  department: string;
  deptCode: string;
  class: string;
  semester: string;
  phone: string;
  dob: string;
  gender: string;
  avatar: string;
  address: string;
  status: "active" | "flagged";
  joinedAt: string;
  cgpa: string;
  totalExams: number;
  passedExams: number;
  avgScore: number;
}

export interface StudentExam {
  id: string;
  title: string;
  subject: string;
  code: string;
  duration: number;
  totalQuestions: number;
  totalMarks: number;
  passingMarks: number;
  startTime: string;
  endTime: string;
  date: string;
  status: "available" | "upcoming" | "completed" | "missed";
  invigilator: string;
  invigilatorId: string;
  dept: string;
  class: string;
  passcode?: string;
  score?: number;
  grade?: string;
  submittedAt?: string;
  violations?: number;
  instructions: string[];
  rules: string[];
  allowedMaterials: string[];
  securityLevel: "standard" | "strict" | "lockdown";
}

export interface StudentViolationRecord {
  id: string;
  examId: string;
  examTitle: string;
  type: string;
  detail: string;
  severity: "low" | "medium" | "high" | "critical";
  time: string;
  date: string;
  risk: number;
  status: "recorded" | "reviewed" | "dismissed";
}

export interface StudentNotification {
  id: string;
  type: "exam" | "alert" | "info" | "warning";
  title: string;
  message: string;
  time: string;
  read: boolean;
  examId?: string;
}

/* ── Student Profile ─────────────────────────────────────── */
export const MOCK_STUDENT: StudentProfile = {
  id: "STU001",
  name: "Rahul Kumar",
  email: "rahul@ssiet.ac.in",
  regno: "22CS101",
  department: "Computer Science & Engineering",
  deptCode: "CSE",
  class: "CSE-3A",
  semester: "5th Semester",
  phone: "+91 98765 43210",
  dob: "15-08-2003",
  gender: "Male",
  avatar: "RK",
  address: "42, Anna Nagar, Coimbatore, Tamil Nadu - 641001",
  status: "active",
  joinedAt: "01-08-2022",
  cgpa: "8.4",
  totalExams: 12,
  passedExams: 11,
  avgScore: 84,
};

/* ── Exam List ───────────────────────────────────────────── */
export const MOCK_ASSESSMENTS: StudentExam[] = [
  {
    id: "EXAM001",
    title: "Database Management Systems — Final",
    subject: "Database Management Systems",
    code: "CS501",
    duration: 60,
    totalQuestions: 50,
    totalMarks: 100,
    passingMarks: 40,
    startTime: "10:00 AM",
    endTime: "11:00 AM",
    date: "30 Jun 2026",
    status: "available",
    invigilator: "John Martin",
    invigilatorId: "INV001",
    dept: "Computer Science & Engineering",
    class: "CSE-3A",
    passcode: "DB2026",
    securityLevel: "strict",
    instructions: [
      "Read each question carefully before answering.",
      "Each question carries 2 marks. No negative marking.",
      "Do not switch browser tabs — this will be recorded as a violation.",
      "Ensure your camera and microphone are working before starting.",
      "Submit the exam before the timer expires.",
      "In case of network issues, your progress is auto-saved.",
    ],
    rules: [
      "No external resources or reference materials allowed.",
      "Screen sharing, screen recording, and screenshots are prohibited.",
      "Opening any other application during the exam is a violation.",
      "Multiple faces in camera frame will trigger an alert.",
      "Extended idle time (> 3 minutes) will be flagged.",
    ],
    allowedMaterials: ["None — this is a closed-book exam."],
  },
  {
    id: "EXAM002",
    title: "Object Oriented Programming — Test",
    subject: "Java Programming",
    code: "CS401",
    duration: 45,
    totalQuestions: 30,
    totalMarks: 60,
    passingMarks: 24,
    startTime: "02:00 PM",
    endTime: "02:45 PM",
    date: "30 Jun 2026",
    status: "available",
    invigilator: "Sarah Thomas",
    invigilatorId: "INV002",
    dept: "Computer Science & Engineering",
    class: "CSE-3A",
    passcode: "OOP2026",
    securityLevel: "standard",
    instructions: [
      "All questions are multiple choice.",
      "Each question carries 2 marks. No negative marking.",
      "You can navigate between questions freely.",
      "Ensure stable internet connection.",
      "Submit before the timer ends.",
    ],
    rules: [
      "No external help or communication tools allowed.",
      "Tab switching will be logged as a violation.",
      "Maintain a well-lit, quiet environment.",
    ],
    allowedMaterials: ["None — closed-book exam."],
  },
  {
    id: "EXAM003",
    title: "Computer Networks — Mid Term",
    subject: "Computer Networks",
    code: "CS502",
    duration: 30,
    totalQuestions: 20,
    totalMarks: 40,
    passingMarks: 16,
    startTime: "09:00 AM",
    endTime: "09:30 AM",
    date: "02 Jul 2026",
    status: "upcoming",
    invigilator: "Deepa Menon",
    invigilatorId: "INV006",
    dept: "Computer Science & Engineering",
    class: "CSE-3A",
    securityLevel: "standard",
    instructions: [
      "All questions are mandatory.",
      "Each correct answer carries 2 marks.",
      "Submit before time expires.",
    ],
    rules: ["No external resources allowed.", "Stable internet required."],
    allowedMaterials: ["None."],
  },
  {
    id: "EXAM004",
    title: "Data Structures & Algorithms — Test",
    subject: "Data Structures",
    code: "CS301",
    duration: 60,
    totalQuestions: 40,
    totalMarks: 80,
    passingMarks: 32,
    startTime: "09:00 AM",
    endTime: "10:00 AM",
    date: "01 Jul 2026",
    status: "upcoming",
    invigilator: "Arun Kumar",
    invigilatorId: "INV005",
    dept: "Computer Science & Engineering",
    class: "CSE-3A",
    securityLevel: "strict",
    instructions: [
      "Covers Arrays, Linked Lists, Trees, Graphs.",
      "Each question carries 2 marks.",
      "No negative marking.",
    ],
    rules: ["No reference material allowed.", "Browser lock enabled."],
    allowedMaterials: ["None — closed-book exam."],
  },
  {
    id: "EXAM005",
    title: "Software Engineering — Quiz",
    subject: "Software Engineering",
    code: "CS503",
    duration: 45,
    totalQuestions: 25,
    totalMarks: 50,
    passingMarks: 20,
    startTime: "11:00 AM",
    endTime: "11:45 AM",
    date: "25 Jun 2026",
    status: "completed",
    invigilator: "John Martin",
    invigilatorId: "INV001",
    dept: "Computer Science & Engineering",
    class: "CSE-3A",
    securityLevel: "standard",
    score: 42,
    grade: "A",
    submittedAt: "25 Jun 2026, 11:40 AM",
    violations: 1,
    instructions: ["All MCQ. 2 marks each. No negative marking."],
    rules: ["Standard exam rules apply."],
    allowedMaterials: ["None."],
  },
  {
    id: "EXAM006",
    title: "Compiler Design — Internal",
    subject: "Compiler Design",
    code: "CS504",
    duration: 30,
    totalQuestions: 20,
    totalMarks: 40,
    passingMarks: 16,
    startTime: "02:00 PM",
    endTime: "02:30 PM",
    date: "20 Jun 2026",
    status: "completed",
    invigilator: "Dr. Ramesh Kumar",
    invigilatorId: "INV001",
    dept: "Computer Science & Engineering",
    class: "CSE-3A",
    securityLevel: "standard",
    score: 34,
    grade: "A",
    submittedAt: "20 Jun 2026, 02:28 PM",
    violations: 0,
    instructions: ["MCQ only. 2 marks each."],
    rules: ["Standard rules apply."],
    allowedMaterials: ["None."],
  },
];

/* ── Violations History ───────────────────────────────────── */
export const MOCK_STUDENT_VIOLATIONS: StudentViolationRecord[] = [
  {
    id: "SV001",
    examId: "EXAM005",
    examTitle: "Software Engineering — Quiz",
    type: "Browser Switch",
    detail: "Chrome tab changed to new window",
    severity: "medium",
    time: "11:22 AM",
    date: "25 Jun 2026",
    risk: 35,
    status: "reviewed",
  },
  {
    id: "SV002",
    examId: "EXAM006",
    examTitle: "Compiler Design — Internal",
    type: "Idle Detected",
    detail: "No mouse/keyboard activity for 3 minutes",
    severity: "low",
    time: "02:15 PM",
    date: "20 Jun 2026",
    risk: 18,
    status: "dismissed",
  },
];

/* ── Notifications ─────────────────────────────────────────── */
export const MOCK_NOTIFICATIONS: StudentNotification[] = [
  {
    id: "N001",
    type: "exam",
    title: "Exam Available Now",
    message: "DBMS Final Exam is now available. You have until 11:00 AM to complete it.",
    time: "10 min ago",
    read: false,
    examId: "EXAM001",
  },
  {
    id: "N002",
    type: "exam",
    title: "Exam Available Now",
    message: "Java OOP Test is now available. Report to Lab 102.",
    time: "12 min ago",
    read: false,
    examId: "EXAM002",
  },
  {
    id: "N003",
    type: "alert",
    title: "Violation Reviewed",
    message: "Your browser switch during Software Engineering Quiz has been reviewed by the invigilator.",
    time: "1 day ago",
    read: true,
  },
  {
    id: "N004",
    type: "info",
    title: "Upcoming: Networks Mid Term",
    message: "Computer Networks Mid Term is scheduled for 02 Jul 2026 at 09:00 AM.",
    time: "2 days ago",
    read: true,
    examId: "EXAM003",
  },
  {
    id: "N005",
    type: "info",
    title: "Exam Result Updated",
    message: "Your Software Engineering Quiz result: 42/50 (Grade A). View full report.",
    time: "3 days ago",
    read: true,
    examId: "EXAM005",
  },
];

/* ── Exam Questions ────────────────────────────────────────── */
export const EXAM_QUESTIONS: Record<string, Array<{ id: number; text: string; options: string[]; correct: number }>> = {
  EXAM001: [
    { id: 1,  text: "Which of the following is NOT a type of database model?",               options: ["Relational Model","Hierarchical Model","Sequential Model","Network Model"],               correct: 2 },
    { id: 2,  text: "SQL stands for:",                                                        options: ["Structured Query Language","Simple Query Language","Standard Query Logic","Sequential Query Language"], correct: 0 },
    { id: 3,  text: "Which normal form deals with partial dependencies?",                     options: ["1NF","2NF","3NF","BCNF"],                                                               correct: 1 },
    { id: 4,  text: "A PRIMARY KEY constraint ensures:",                                      options: ["Uniqueness only","Non-null only","Uniqueness and non-null","Foreign key reference"],    correct: 2 },
    { id: 5,  text: "Which SQL command removes a table from a database?",                     options: ["DELETE TABLE","REMOVE TABLE","DROP TABLE","ERASE TABLE"],                                correct: 2 },
    { id: 6,  text: "What does ACID stand for in database transactions?",                     options: ["Atomicity, Consistency, Isolation, Durability","Accuracy, Consistency, Integrity, Durability","Atomicity, Concurrency, Isolation, Data","Accuracy, Concurrency, Integrity, Data"], correct: 0 },
    { id: 7,  text: "Which JOIN returns all rows from both tables regardless of match?",      options: ["INNER JOIN","LEFT JOIN","RIGHT JOIN","FULL OUTER JOIN"],                                correct: 3 },
    { id: 8,  text: "An ER diagram is used to represent:",                                    options: ["Entity-Relationship model","Error-Recovery model","Event-Response model","Execution-Runtime model"], correct: 0 },
    { id: 9,  text: "Which of the following is a DDL command?",                               options: ["SELECT","INSERT","CREATE","UPDATE"],                                                    correct: 2 },
    { id: 10, text: "Normalization is the process of:",                                       options: ["Adding redundancy","Reducing redundancy and improving integrity","Encrypting tables","Creating backups"], correct: 1 },
    { id: 11, text: "A foreign key refers to the _____ of another table.",                    options: ["Foreign key","Unique key","Primary key","Composite key"],                               correct: 2 },
    { id: 12, text: "Which SQL clause filters groups?",                                       options: ["WHERE","HAVING","GROUP BY","ORDER BY"],                                                 correct: 1 },
    { id: 13, text: "Converting ER diagram to relational schema is called:",                  options: ["Normalization","Reduction","Mapping","Transformation"],                                 correct: 2 },
    { id: 14, text: "Which isolation level prevents dirty reads?",                            options: ["Read Uncommitted","Read Committed","Repeatable Read","Serializable"],                   correct: 1 },
    { id: 15, text: "B+ tree index differs from B-tree in that:",                             options: ["All data pointers are in leaf nodes","Data pointers only in internal nodes","No internal nodes","It uses hashing"], correct: 0 },
    { id: 16, text: "Which is NOT a valid aggregate function in SQL?",                        options: ["SUM()","MAX()","MEDIAN()","COUNT()"],                                                   correct: 2 },
    { id: 17, text: "Deadlock in DBMS refers to:",                                            options: ["Database crash","Circular wait among transactions","Slow query","Data loss"],           correct: 1 },
    { id: 18, text: "Which is a NoSQL database?",                                             options: ["MySQL","Oracle","MongoDB","PostgreSQL"],                                                correct: 2 },
    { id: 19, text: "A 'view' in SQL is used to:",                                            options: ["Store data permanently","Create a virtual table from a query","Index columns","Create stored procedures"], correct: 1 },
    { id: 20, text: "GRANT and REVOKE are part of which SQL sub-language?",                   options: ["DDL","DML","DCL","TCL"],                                                               correct: 2 },
    { id: 21, text: "Which normal form eliminates transitive dependencies?",                  options: ["1NF","2NF","3NF","4NF"],                                                               correct: 2 },
    { id: 22, text: "A relation is in BCNF if for every non-trivial FD X→Y:",                 options: ["Y is a superkey","X is a superkey","X is a primary key","Y is a primary key"],         correct: 1 },
    { id: 23, text: "Phantom reads are prevented by which isolation level?",                  options: ["Read Committed","Read Uncommitted","Repeatable Read","Serializable"],                   correct: 3 },
    { id: 24, text: "Which command undoes all transaction changes?",                          options: ["COMMIT","ROLLBACK","SAVEPOINT","UNDO"],                                                 correct: 1 },
    { id: 25, text: "In relational algebra, σ represents:",                                   options: ["Projection","Selection","Join","Union"],                                                correct: 1 },
    { id: 26, text: "Which data model is used in most modern DBMS?",                          options: ["Hierarchical","Network","Relational","Object-oriented"],                               correct: 2 },
    { id: 27, text: "The 'E' in ER diagram stands for:",                                      options: ["Execution","Entity","Event","Element"],                                                 correct: 1 },
    { id: 28, text: "A candidate key is:",                                                    options: ["Any foreign key","A minimal superkey","A composite key only","A non-prime attribute"],  correct: 1 },
    { id: 29, text: "Which SQL keyword removes duplicate rows?",                              options: ["UNIQUE","DISTINCT","DIFFERENT","NODUPLICATE"],                                          correct: 1 },
    { id: 30, text: "Data integrity in a database is maintained by:",                         options: ["Constraints","Indexes","Views","Stored procedures"],                                    correct: 0 },
    { id: 31, text: "Which allows multiple values for an attribute?",                         options: ["Single-valued","Derived","Multi-valued","Composite"],                                   correct: 2 },
    { id: 32, text: "The operation that combines tuples from two relations is:",              options: ["Selection","Projection","Join","Division"],                                             correct: 2 },
    { id: 33, text: "Best index structure for equality searches:",                            options: ["B+ tree","Hash index","Bitmap index","Dense index"],                                    correct: 1 },
    { id: 34, text: "In a star schema, the central table is called:",                         options: ["Dimension table","Fact table","Bridge table","Summary table"],                          correct: 1 },
    { id: 35, text: "Lossless join decomposition ensures:",                                   options: ["No data is lost","All joins produce empty results","Joins are faster","All attributes are keys"], correct: 0 },
    { id: 36, text: "SQL statement used to modify existing records:",                         options: ["ALTER","MODIFY","UPDATE","CHANGE"],                                                     correct: 2 },
    { id: 37, text: "A stored procedure is:",                                                 options: ["A temporary table","A precompiled collection of SQL statements","A type of join","An aggregate function"], correct: 1 },
    { id: 38, text: "Which of the following is a DML command?",                               options: ["CREATE","DROP","INSERT","GRANT"],                                                       correct: 2 },
    { id: 39, text: "Two-phase locking ensures:",                                             options: ["Atomicity","Serializability","Durability","Consistency"],                              correct: 1 },
    { id: 40, text: "Symbol π in relational algebra denotes:",                                options: ["Selection","Projection","Product","Division"],                                          correct: 1 },
    { id: 41, text: "Which constraint ensures a column cannot have NULL values?",             options: ["UNIQUE","CHECK","NOT NULL","DEFAULT"],                                                   correct: 2 },
    { id: 42, text: "A trigger fires:",                                                       options: ["Only on SELECT","Automatically on specified events","Only when called explicitly","Once per transaction"], correct: 1 },
    { id: 43, text: "A distributed database stores data:",                                    options: ["On one server","Across multiple locations/nodes","Without network access","For a single user"], correct: 1 },
    { id: 44, text: "The CHECK constraint:",                                                  options: ["Ensures referential integrity","Limits values based on a condition","Creates an index","Prevents NULL values"], correct: 1 },
    { id: 45, text: "Codd's 12 rules define requirements for:",                               options: ["Object-oriented databases","True relational database systems","NoSQL databases","Distributed systems"], correct: 1 },
    { id: 46, text: "Which is a characteristic of a transaction?",                            options: ["Atomicity","Availability","Accessibility","Aggregation"],                              correct: 0 },
    { id: 47, text: "Cardinality of a relation refers to:",                                   options: ["Number of attributes","Number of tuples","Number of keys","Number of joins"],           correct: 1 },
    { id: 48, text: "Which removes duplicates in SQL set operations?",                        options: ["UNION ALL","INTERSECT ALL","UNION","EXCEPT ALL"],                                       correct: 2 },
    { id: 49, text: "ORM stands for:",                                                        options: ["Object-Relational Mapping","Optimized Relation Model","Ordered Record Manager","Object-Recovery Mode"], correct: 0 },
    { id: 50, text: "Which SQL function returns the number of rows in a result?",             options: ["SUM()","TOTAL()","COUNT()","NUM()"],                                                    correct: 2 },
  ],
  EXAM002: [
    { id: 1,  text: "Keyword used to define a class in Java:",                                options: ["define","struct","class","object"],                                                     correct: 2 },
    { id: 2,  text: "Default value of an int variable in Java:",                              options: ["null","0","undefined","-1"],                                                           correct: 1 },
    { id: 3,  text: "Which is NOT an access modifier in Java?",                               options: ["public","protected","internal","private"],                                              correct: 2 },
    { id: 4,  text: "Method overloading in Java is resolved at:",                             options: ["Runtime","Compile time","Class loading","JVM startup"],                                correct: 1 },
    { id: 5,  text: "Interface needed for for-each loop:",                                    options: ["Iterable","Iterator","Collection","Comparable"],                                       correct: 0 },
    { id: 6,  text: "In Java, 'super' keyword refers to:",                                    options: ["Current class instance","Parent class instance","Static method","Interface"],          correct: 1 },
    { id: 7,  text: "Exception thrown when dividing by zero in Java:",                        options: ["NullPointerException","ArithmeticException","NumberFormatException","ArrayIndexOutOfBoundsException"], correct: 1 },
    { id: 8,  text: "Which collection allows duplicate elements?",                            options: ["Set","Map","List","TreeSet"],                                                           correct: 2 },
    { id: 9,  text: "What does JVM stand for?",                                               options: ["Java Virtual Method","Java Virtual Machine","Java Variable Manager","Java Version Module"], correct: 1 },
    { id: 10, text: "Which keyword prevents a class from being subclassed?",                  options: ["static","abstract","final","sealed"],                                                  correct: 2 },
    { id: 11, text: "Polymorphism allows:",                                                   options: ["One class to have multiple constructors","An object to take many forms","Multiple inheritance","Method overriding only"], correct: 1 },
    { id: 12, text: "Which is NOT a primitive type in Java?",                                 options: ["int","boolean","String","char"],                                                        correct: 2 },
    { id: 13, text: "The 'this' keyword refers to:",                                          options: ["The parent class","The current object instance","A static field","The interface"],     correct: 1 },
    { id: 14, text: "Which class creates immutable strings?",                                 options: ["StringBuffer","StringBuilder","String","CharSequence"],                                correct: 2 },
    { id: 15, text: "An abstract class in Java:",                                             options: ["Cannot have constructors","Can be instantiated directly","Cannot be instantiated directly","Must implement all interfaces"], correct: 2 },
    { id: 16, text: "Design pattern for creating objects without specifying exact class:",    options: ["Singleton","Factory","Observer","Decorator"],                                           correct: 1 },
    { id: 17, text: "Java keyword used to handle exceptions:",                                options: ["handle","catch","error","manage"],                                                      correct: 1 },
    { id: 18, text: "Encapsulation in OOP means:",                                            options: ["Hiding data and providing methods to access it","Inheriting from multiple classes","Defining multiple methods with same name","Creating objects"], correct: 0 },
    { id: 19, text: "Which supports multiple inheritance in Java?",                           options: ["Class","Abstract class","Interface","Enum"],                                            correct: 2 },
    { id: 20, text: "Output of: System.out.println(10 % 3):",                                 options: ["3","1","0","3.33"],                                                                    correct: 1 },
    { id: 21, text: "Which method is called when an object is garbage collected?",            options: ["destroy()","finalize()","close()","dispose()"],                                        correct: 1 },
    { id: 22, text: "HashMap in Java allows:",                                                options: ["Duplicate keys","Only unique keys","Sorted keys only","No null keys"],                  correct: 1 },
    { id: 23, text: "Treating subclass objects as parent class objects is:",                  options: ["Overloading","Encapsulation","Upcasting","Shadowing"],                                  correct: 2 },
    { id: 24, text: "What does 'static' mean on a method?",                                   options: ["Cannot be changed","Belongs to the class, not instances","Runs at startup","Is thread-safe"], correct: 1 },
    { id: 25, text: "Package containing ArrayList class:",                                    options: ["java.util","java.io","java.lang","java.net"],                                          correct: 0 },
    { id: 26, text: "Size of a boolean in Java:",                                             options: ["1 bit","8 bits","Not precisely defined","4 bytes"],                                    correct: 2 },
    { id: 27, text: "Which statement about constructors is TRUE?",                            options: ["Can have a return type","Must be public","Have same name as class","Are inherited"],    correct: 2 },
    { id: 28, text: "Singleton pattern ensures:",                                             options: ["Only one method per class","Only one instance of a class","All methods are static","All fields are final"], correct: 1 },
    { id: 29, text: "Java keyword used for inheritance:",                                     options: ["inherit","extends","implements","derives"],                                             correct: 1 },
    { id: 30, text: "Checked exceptions must be:",                                            options: ["Caught or declared with throws","Ignored","Only caught, never declared","Handled at runtime only"], correct: 0 },
  ],
  EXAM003: Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    text: `Computer Networks Q${i + 1}: Which of the following describes the ${["OSI","TCP/IP","Routing","DNS","HTTP","DHCP","NAT","IPv6","TCP","UDP","ARP","ICMP","BGP","OSPF","FTP","SMTP","TLS","MAC","CSMA","VLAN"][i % 20]} concept?`,
    options: ["Physical layer only", "Application layer concept", "The correct technical answer", "Network topology"],
    correct: 2,
  })),
  EXAM004: Array.from({ length: 40 }, (_, i) => ({
    id: i + 1,
    text: `Data Structures Q${i + 1}: In a ${["Stack","Queue","Binary Tree","Graph","Heap","Hash Table","Linked List","Array","BST","Trie"][i % 10]}, which operation has O(1) time complexity in the best case?`,
    options: ["Search", "Insertion at head/top", "Deletion from middle", "Traversal"],
    correct: 1,
  })),
};
