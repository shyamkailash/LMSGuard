"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AppShell, PageHeader } from "@/components/layouts";
import { Badge, Button } from "@/components/ui";
import { Users, BookOpen, MapPin, CheckCircle2, ChevronRight, Wifi, Clock } from "lucide-react";
import { CLASS_INFO } from "@/data/invigilatorData";
import { cn } from "@/lib/utils";

export default function InvigilatorClassesPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);

  const classes = Object.values(CLASS_INFO);

  const handleSelect = (classId: string) => {
    setSelected(classId);
    sessionStorage.setItem("invSelectedClass", JSON.stringify(CLASS_INFO[classId]));
  };

  const handleProceed = () => {
    if (!selected) return;
    router.push("/invigilator/waiting-room");
  };

  return (
    <AppShell variant="invigilator">
      <div className="p-6 space-y-6">
        <PageHeader
          title="Select Class"
          description="Choose the class you are invigilating today"
          actions={
            <Button
              variant="primary"
              disabled={!selected}
              iconRight={<ChevronRight className="w-3.5 h-3.5" />}
              onClick={handleProceed}
            >
              Proceed to Waiting Room
            </Button>
          }
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {classes.map((cls, idx) => {
            const isSelected = selected === cls.id;
            const onlinePct  = Math.round((cls.online / cls.strength) * 100);
            return (
              <motion.div
                key={cls.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.06 }}
                onClick={() => handleSelect(cls.id)}
                className={cn(
                  "card p-5 cursor-pointer transition-all duration-200 relative overflow-hidden",
                  isSelected
                    ? "border-primary/50 bg-primary/5 shadow-glow"
                    : "hover:border-white/14 hover:bg-surface/60"
                )}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3">
                    <CheckCircle2 className="w-4.5 h-4.5 text-primary" />
                  </div>
                )}

                {/* Class Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                    isSelected ? "bg-primary/15" : "bg-cyan/10"
                  )}>
                    <BookOpen className={cn("w-4 h-4", isSelected ? "text-primary" : "text-cyan")} />
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-text-primary">{cls.id}</p>
                    <p className="text-[11.5px] text-text-muted">{cls.year} · Section {cls.section}</p>
                  </div>
                </div>

                <p className="text-[12px] text-text-muted mb-4 truncate">{cls.dept}</p>

                {/* Stats */}
                <div className="space-y-2 mb-4">
                  {[
                    { icon: Users,   label: "Total Students",  value: cls.strength, color: "text-text-primary" },
                    { icon: Wifi,    label: "Online",          value: cls.online,   color: "text-success"      },
                    { icon: Clock,   label: "Waiting Approval",value: cls.waiting,  color: "text-warning"      },
                    { icon: CheckCircle2, label: "Approved",   value: cls.approved, color: "text-primary"      },
                  ].map((s) => {
                    const SI = s.icon;
                    return (
                      <div key={s.label} className="flex items-center justify-between text-[12px]">
                        <div className="flex items-center gap-1.5 text-text-muted">
                          <SI className="w-3 h-3" />{s.label}
                        </div>
                        <span className={cn("font-semibold font-feature", s.color)}>{s.value}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Online bar */}
                <div>
                  <div className="flex justify-between text-[11px] text-text-muted mb-1">
                    <span>Online</span>
                    <span className="text-success font-semibold">{onlinePct}%</span>
                  </div>
                  <div className="h-1.5 bg-surface-3 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-success rounded-full transition-all duration-700"
                      style={{ width: `${onlinePct}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-1.5 mt-3 text-[11.5px] text-text-muted">
                  <MapPin className="w-3 h-3" />
                  <span>Room {cls.roomNo}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between p-4 rounded-xl bg-primary/8 border border-primary/20"
          >
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <div>
                <p className="text-[13px] font-semibold text-text-primary">
                  {CLASS_INFO[selected].label} selected
                </p>
                <p className="text-[12px] text-text-muted">
                  {CLASS_INFO[selected].strength} students · Room {CLASS_INFO[selected].roomNo}
                </p>
              </div>
            </div>
            <Button
              variant="primary"
              iconRight={<ChevronRight className="w-3.5 h-3.5" />}
              onClick={handleProceed}
            >
              Open Waiting Room
            </Button>
          </motion.div>
        )}
      </div>
    </AppShell>
  );
}
