"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell, PageHeader } from "@/components/layouts";
import { Badge, Button, Modal, ModalFooter, StatCard } from "@/components/ui";
import { Avatar } from "@/components/ui/Avatar";
import { motion } from "framer-motion";
import { AVAILABLE_CLASSES_LIST, MOCK_SESSIONS } from "@/mock/invigilators";
import { AVAILABLE_EXAMS_LIST } from "@/mock/exams";
import { useAuthStore } from "@/store/authStore";
import { ANIMATION_VARIANTS, CHART_COLORS } from "@/constants";
import { AreaChart } from "@/components/features/charts";
import { VIOLATION_TREND_DATA } from "@/mock/exams";
import {
  Play, BookOpen, Users, ClipboardList, Activity,
  CheckCircle2, Clock, Calendar, ChevronRight,
  AlertTriangle, MonitorPlay, Key,
} from "lucide-react";

const RISK_TREND = [
  { name: "10:00", value: 12 }, { name: "10:15", value: 18 },
  { name: "10:30", value: 35 }, { name: "10:45", value: 42 },
  { name: "11:00", value: 38 }, { name: "11:15", value: 52 },
  { name: "11:30", value: 44 },
];

/* ── Session launcher modal ── */
function SessionLaunchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedExam,  setSelectedExam]  = useState("");
  const [passcode,      setPasscode]      = useState("");

  const eligibleExams = AVAILABLE_EXAMS_LIST.filter(
    (e) => !selectedClass || e.eligibleClasses.includes(selectedClass)
  );

  const handleStart = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("invSelectedClass", JSON.stringify(AVAILABLE_CLASSES_LIST.find((c) => c.id === selectedClass)));
      sessionStorage.setItem("invSelectedExam",  JSON.stringify(AVAILABLE_EXAMS_LIST.find((e) => e.id === selectedExam)));
    }
    onClose();
    router.push("/monitoring");
  };

  return (
    <Modal open={open} onClose={onClose} title="Start Monitoring Session" size="md">
      {/* Steps */}
      <div className="flex items-center gap-2 mb-6">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
              s <= step ? "bg-primary text-white" : "bg-surface-2 text-text-muted border border-white/8"
            }`}>
              {s < step ? "✓" : s}
            </div>
            {s < 3 && <div className="flex-1 h-px bg-white/8" />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-3">
          <p className="text-[13px] text-text-muted mb-3">Select the class you are invigilating</p>
          {AVAILABLE_CLASSES_LIST.map((cls) => (
            <button
              key={cls.id}
              onClick={() => setSelectedClass(cls.id)}
              className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all text-left ${
                selectedClass === cls.id
                  ? "border-primary/40 bg-primary/8"
                  : "border-white/6 bg-surface-2/40 hover:border-white/12"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyan/10 flex items-center justify-center">
                  <BookOpen className="w-3.5 h-3.5 text-cyan" />
                </div>
                <div>
                  <p className="text-[13px] font-medium text-text-primary">{cls.label}</p>
                  <p className="text-[11.5px] text-text-muted">{cls.dept} · Room {cls.roomNo}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11.5px] text-text-muted">{cls.strength} students</span>
                {selectedClass === cls.id && <CheckCircle2 className="w-4 h-4 text-primary" />}
              </div>
            </button>
          ))}
        </div>
      )}

      {step === 2 && (
        <div className="space-y-3">
          <p className="text-[13px] text-text-muted mb-3">Select the exam to monitor</p>
          {eligibleExams.map((exam) => (
            <button
              key={exam.id}
              onClick={() => setSelectedExam(exam.id)}
              className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all text-left ${
                selectedExam === exam.id
                  ? "border-primary/40 bg-primary/8"
                  : "border-white/6 bg-surface-2/40 hover:border-white/12"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <ClipboardList className="w-3.5 h-3.5 text-primary" />
                </div>
                <div>
                  <p className="text-[13px] font-medium text-text-primary">{exam.title}</p>
                  <p className="text-[11.5px] text-text-muted">{exam.code} · {exam.date} · {exam.startTime}</p>
                </div>
              </div>
              {selectedExam === exam.id && <CheckCircle2 className="w-4 h-4 text-primary" />}
            </button>
          ))}
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-surface-2/50 space-y-2">
            <p className="text-[12px] text-text-muted uppercase tracking-wide">Session Summary</p>
            <p className="text-[13.5px] font-medium text-text-primary">
              {AVAILABLE_CLASSES_LIST.find((c) => c.id === selectedClass)?.label}
            </p>
            <p className="text-[13px] text-text-secondary">
              {AVAILABLE_EXAMS_LIST.find((e) => e.id === selectedExam)?.title}
            </p>
          </div>
          <div className="space-y-1.5">
            <label className="text-[12.5px] font-medium text-text-secondary flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5" /> Exam Passcode
            </label>
            <input
              value={passcode} onChange={(e) => setPasscode(e.target.value.toUpperCase())}
              placeholder="Enter passcode (e.g. DB2026)"
              className="input-premium w-full font-mono tracking-widest"
            />
            <p className="text-[11.5px] text-text-muted">Students will use this code to access the exam</p>
          </div>
        </div>
      )}

      <ModalFooter>
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        {step > 1 && <Button variant="secondary" onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3)}>Back</Button>}
        {step < 3
          ? <Button variant="primary" disabled={step === 1 ? !selectedClass : !selectedExam} onClick={() => setStep((s) => (s + 1) as 2 | 3)}>
              Continue <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          : <Button variant="success" icon={<Play className="w-3.5 h-3.5" />} onClick={handleStart}>
              Start Session
            </Button>
        }
      </ModalFooter>
    </Modal>
  );
}

export default function InvigilatorDashboardPage() {
  const { userName, userDept } = useAuthStore();
  const [launchOpen, setLaunchOpen] = useState(false);

  const mySessions = MOCK_SESSIONS.slice(0, 3);
  const activeCount = mySessions.filter((s) => s.status === "active").length;

  return (
    <AppShell variant="invigilator">
      <div className="p-6 space-y-6">
        <PageHeader
          title={`Welcome back, ${userName?.split(" ")[0] ?? "Invigilator"}`}
          description={`${userDept ?? "—"} · ${new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}`}
          badge={activeCount > 0 ? <Badge variant="success" dot>{activeCount} Active</Badge> : undefined}
          actions={
            <Button variant="primary" icon={<Play className="w-3.5 h-3.5" />} onClick={() => setLaunchOpen(true)}>
              Start Session
            </Button>
          }
        />

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <StatCard index={0} label="Sessions Today"  value={mySessions.length}  icon={<Activity      className="w-4 h-4" />} color="primary"  />
          <StatCard index={1} label="Students Online" value={48}                 icon={<Users         className="w-4 h-4" />} color="success"  delta="Across all sessions" deltaType="up" />
          <StatCard index={2} label="Violations"      value={18}                 icon={<AlertTriangle className="w-4 h-4" />} color="danger"   />
          <StatCard index={3} label="Exams Assigned"  value={5}                  icon={<ClipboardList className="w-4 h-4" />} color="cyan"     />
        </div>

        <div className="grid grid-cols-3 gap-4">
          {/* Active sessions */}
          <div className="col-span-2 card p-5">
            <div className="section-header">
              <div>
                <p className="section-title">My Sessions</p>
                <p className="section-subtitle">{"Today's"} assigned exam sessions</p>
              </div>
              <Button variant="primary" size="sm" icon={<Play className="w-3.5 h-3.5" />} onClick={() => setLaunchOpen(true)}>
                New Session
              </Button>
            </div>
            <div className="space-y-3">
              {mySessions.map((session) => (
                <div key={session.id} className="flex items-center gap-4 p-4 rounded-xl bg-surface-2/50 border border-white/5 hover:border-primary/20 transition-all">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    session.status === "active" ? "bg-success/10" : session.status === "paused" ? "bg-warning/10" : "bg-surface-3"
                  }`}>
                    <MonitorPlay className={`w-4 h-4 ${session.status === "active" ? "text-success" : session.status === "paused" ? "text-warning" : "text-text-muted"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13.5px] font-medium text-text-primary truncate">{session.exam}</p>
                    <p className="text-[12px] text-text-muted">{session.class} · {session.students} students · {session.startTime}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <p className="text-[11.5px] text-danger font-medium">{session.violations} violations</p>
                      <p className="text-[11px] text-text-muted">avg risk {session.avgRisk}%</p>
                    </div>
                    <Badge variant={session.status === "active" ? "success" : session.status === "paused" ? "warning" : "muted"} dot>
                      {session.status}
                    </Badge>
                    <Button variant="secondary" size="sm" onClick={() => {}}>Monitor</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Risk chart */}
          <div className="card p-5">
            <p className="section-title mb-1">Risk Trend</p>
            <p className="section-subtitle mb-4">Average risk score over session</p>
            <AreaChart data={RISK_TREND} color={CHART_COLORS.warning} height={160} showGrid={false} />

            <div className="mt-4 pt-4 border-t border-white/5 space-y-2">
              <p className="text-[12px] text-text-muted uppercase tracking-wide font-medium">Upcoming Exams</p>
              {AVAILABLE_EXAMS_LIST.slice(0, 3).map((exam) => (
                <div key={exam.id} className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-[12px] font-medium text-text-primary truncate max-w-[140px]">{exam.title}</p>
                    <p className="text-[10.5px] text-text-muted">{exam.date} · {exam.startTime}</p>
                  </div>
                  <Badge variant={exam.status === "active" ? "success" : "primary"} size="sm">{exam.status}</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <SessionLaunchModal open={launchOpen} onClose={() => setLaunchOpen(false)} />
    </AppShell>
  );
}
