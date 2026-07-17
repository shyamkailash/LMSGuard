"use client";
import { useState } from "react";
import { AppShell, PageHeader } from "@/components/layouts";
import { Button } from "@/components/ui";
import { Avatar } from "@/components/ui/Avatar";
import { useAuthStore } from "@/store/authStore";
import { Save, Check, Eye, EyeOff, User, Bell, Shield } from "lucide-react";

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button role="switch" aria-checked={checked} onClick={() => onChange(!checked)}
      className={`relative w-10 h-5 rounded-full transition-colors ${checked ? "bg-primary" : "bg-surface-3"}`}>
      <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${checked ? "translate-x-5" : ""}`} />
    </button>
  );
}

export default function InvSettingsPage() {
  const { userName, userEmail, userAvatar, userDept } = useAuthStore();
  const [saved, setSaved]   = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [notifs, setNotifs] = useState({ violations: true, session: true, alerts: true });

  return (
    <AppShell variant="invigilator">
      <div className="p-6 max-w-2xl space-y-6">
        <PageHeader
          title="Settings"
          description="Manage your profile and preferences"
          actions={
            <Button variant={saved ? "success" : "primary"}
              icon={saved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
              onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2500); }}>
              {saved ? "Saved!" : "Save Changes"}
            </Button>
          }
        />

        {/* Profile */}
        <div className="card p-6 space-y-5">
          <div className="flex items-center gap-2 mb-2">
            <User className="w-4 h-4 text-text-muted" />
            <p className="section-title">Profile</p>
          </div>
          <div className="flex items-center gap-4">
            <Avatar name={userName ?? "U"} size="xl" />
            <div className="flex-1 grid grid-cols-2 gap-3">
              {[
                { label: "Full Name",   value: userName  ?? "" },
                { label: "Email",       value: userEmail ?? "" },
                { label: "Department",  value: userDept  ?? "" },
                { label: "Phone",       value: "+91 98765 21001" },
              ].map((f) => (
                <div key={f.label} className="space-y-1.5">
                  <label className="text-[12.5px] font-medium text-text-secondary">{f.label}</label>
                  <input defaultValue={f.value} className="input-premium w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="card p-6 space-y-1">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-4 h-4 text-text-muted" />
            <p className="section-title">Notifications</p>
          </div>
          {[
            { key: "violations", label: "Violation Alerts",  desc: "Alert on each new violation"  },
            { key: "session",    label: "Session Events",    desc: "Start/end session alerts"       },
            { key: "alerts",     label: "AI Alerts",         desc: "High-confidence AI detections" },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
              <div>
                <p className="text-[13px] font-medium text-text-primary">{item.label}</p>
                <p className="text-[12px] text-text-muted">{item.desc}</p>
              </div>
              <ToggleSwitch
                checked={notifs[item.key as keyof typeof notifs]}
                onChange={(v) => setNotifs((p) => ({ ...p, [item.key]: v }))}
              />
            </div>
          ))}
        </div>

        {/* Security */}
        <div className="card p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-text-muted" />
            <p className="section-title">Change Password</p>
          </div>
          {["Current Password", "New Password", "Confirm Password"].map((l) => (
            <div key={l} className="space-y-1.5">
              <label className="text-[12.5px] font-medium text-text-secondary">{l}</label>
              <div className="relative flex items-center">
                <input type={showPwd ? "text" : "password"} className="input-premium w-full pr-9" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPwd((v) => !v)} className="absolute right-3 text-text-muted">
                  {showPwd ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          ))}
          <Button variant="primary" size="sm">Update Password</Button>
        </div>
      </div>
    </AppShell>
  );
}
