"use client";
import { useState } from "react";
import { AppShell, PageHeader } from "@/components/layouts";
import { Badge, Button } from "@/components/ui";
import { Avatar } from "@/components/ui/Avatar";
import { useAuthStore } from "@/store/authStore";
import { motion } from "framer-motion";
import { ANIMATION_VARIANTS } from "@/constants";
import {
  Settings, User, Bell, Shield, Building2,
  Save, Camera, Eye, EyeOff, Check,
} from "lucide-react";

type SettingsTab = "profile" | "institution" | "monitoring" | "notifications" | "security";

const TABS: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
  { id: "profile",      label: "Profile",      icon: <User      className="w-4 h-4" /> },
  { id: "institution",  label: "Institution",  icon: <Building2 className="w-4 h-4" /> },
  { id: "monitoring",   label: "Monitoring",   icon: <Settings  className="w-4 h-4" /> },
  { id: "notifications",label: "Notifications",icon: <Bell      className="w-4 h-4" /> },
  { id: "security",     label: "Security",     icon: <Shield    className="w-4 h-4" /> },
];

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative w-10 h-5 rounded-full transition-colors ${checked ? "bg-primary" : "bg-surface-3"}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${checked ? "translate-x-5" : "translate-x-0"}`} />
    </button>
  );
}

function SettingRow({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
      <div>
        <p className="text-[13.5px] font-medium text-text-primary">{label}</p>
        {description && <p className="text-[12px] text-text-muted mt-0.5">{description}</p>}
      </div>
      <div className="ml-6 shrink-0">{children}</div>
    </div>
  );
}

export default function AdminSettingsPage() {
  const [tab, setTab] = useState<SettingsTab>("profile");
  const { userName, userEmail, userAvatar, userDept } = useAuthStore();
  const [saved, setSaved] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const [notifs, setNotifs] = useState({
    violations: true, network: true, session: true, email: false,
  });
  const [monitoring, setMonitoring] = useState({
    aiDetection: true, faceVerification: true, autoTerminate: false, screenshotInterval: 30,
    riskThresholdWarn: 30, riskThresholdCrit: 65, maxTabSwitches: 2, idleTimeout: 5,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <AppShell variant="admin">
      <div className="p-6 space-y-6">
        <PageHeader
          title="Settings"
          description="Manage your account, institution and monitoring preferences"
          actions={
            <Button
              variant={saved ? "success" : "primary"}
              icon={saved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
              onClick={handleSave}
            >
              {saved ? "Saved!" : "Save Changes"}
            </Button>
          }
        />

        <div className="grid grid-cols-4 gap-6">
          {/* Sidebar tabs */}
          <div className="col-span-1 card p-2 h-fit">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`nav-link w-full mb-0.5 ${tab === t.id ? "active" : ""}`}
              >
                <span className="nav-icon">{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <motion.div
            key={tab}
            variants={ANIMATION_VARIANTS.fadeIn}
            initial="hidden" animate="visible"
            className="col-span-3 space-y-4"
          >
            {tab === "profile" && (
              <div className="card p-6">
                <p className="section-title mb-6">Profile Information</p>
                <div className="flex items-start gap-6 mb-6">
                  <div className="relative group">
                    <Avatar name={userName ?? "A"} size="xl" />
                    <div className="absolute inset-0 rounded-xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                      <Camera className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    {[
                      { label: "Full Name",     defaultValue: userName ?? "",     placeholder: "Dr. Ramesh Kumar" },
                      { label: "Email Address", defaultValue: userEmail ?? "",    placeholder: "admin@ssiet.ac.in", type: "email" },
                      { label: "Department",    defaultValue: userDept ?? "",     placeholder: "Computer Science" },
                      { label: "Phone",         defaultValue: "+91 98765 10001",  placeholder: "+91 XXXXX XXXXX" },
                    ].map((f) => (
                      <div key={f.label} className="space-y-1.5">
                        <label className="text-[12.5px] font-medium text-text-secondary">{f.label}</label>
                        <input type={f.type} defaultValue={f.defaultValue} placeholder={f.placeholder} className="input-premium w-full" />
                      </div>
                    ))}
                    <div className="col-span-2 space-y-1.5">
                      <label className="text-[12.5px] font-medium text-text-secondary">Bio</label>
                      <textarea rows={2} className="input-premium w-full resize-none" placeholder="Short bio…" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {tab === "institution" && (
              <div className="card p-6">
                <p className="section-title mb-6">Institution Details</p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Institution Name", defaultValue: "Sri Shakthi Institute of Engineering & Technology" },
                    { label: "Short Name",        defaultValue: "SSIET" },
                    { label: "City",              defaultValue: "Coimbatore, Tamil Nadu" },
                    { label: "Email",             defaultValue: "admin@ssiet.ac.in", type: "email" },
                    { label: "Phone",             defaultValue: "+91 98765 43210" },
                    { label: "Website",           defaultValue: "www.ssiet.ac.in" },
                  ].map((f) => (
                    <div key={f.label} className="space-y-1.5">
                      <label className="text-[12.5px] font-medium text-text-secondary">{f.label}</label>
                      <input type={f.type} defaultValue={f.defaultValue} className="input-premium w-full" />
                    </div>
                  ))}
                  <div className="col-span-2 space-y-1.5">
                    <label className="text-[12.5px] font-medium text-text-secondary">Address</label>
                    <textarea rows={2} className="input-premium w-full resize-none" defaultValue="Coimbatore – 641 062, Tamil Nadu, India." />
                  </div>
                </div>
              </div>
            )}

            {tab === "monitoring" && (
              <div className="card p-6">
                <p className="section-title mb-6">Monitoring Configuration</p>
                <SettingRow label="AI Violation Detection" description="Enable AI-powered real-time violation detection">
                  <ToggleSwitch checked={monitoring.aiDetection} onChange={(v) => setMonitoring((p) => ({ ...p, aiDetection: v }))} />
                </SettingRow>
                <SettingRow label="Face Verification" description="Verify student identity via webcam">
                  <ToggleSwitch checked={monitoring.faceVerification} onChange={(v) => setMonitoring((p) => ({ ...p, faceVerification: v }))} />
                </SettingRow>
                <SettingRow label="Auto-Terminate on Critical" description="End exam automatically when risk exceeds critical threshold">
                  <ToggleSwitch checked={monitoring.autoTerminate} onChange={(v) => setMonitoring((p) => ({ ...p, autoTerminate: v }))} />
                </SettingRow>
                <div className="grid grid-cols-2 gap-4 pt-4">
                  {[
                    { label: "Screenshot Interval (sec)", key: "screenshotInterval", min: 10, max: 120 },
                    { label: "Risk Warn Threshold (%)",   key: "riskThresholdWarn", min: 20, max: 60  },
                    { label: "Risk Critical Threshold (%)",key: "riskThresholdCrit",min: 50, max: 90  },
                    { label: "Max Tab Switches",          key: "maxTabSwitches",    min: 1,  max: 10  },
                    { label: "Idle Timeout (min)",        key: "idleTimeout",       min: 1,  max: 20  },
                  ].map((f) => (
                    <div key={f.key} className="space-y-1.5">
                      <label className="text-[12.5px] font-medium text-text-secondary">{f.label}</label>
                      <input
                        type="number" min={f.min} max={f.max}
                        value={monitoring[f.key as keyof typeof monitoring] as number}
                        onChange={(e) => setMonitoring((p) => ({ ...p, [f.key]: Number(e.target.value) }))}
                        className="input-premium w-full"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === "notifications" && (
              <div className="card p-6">
                <p className="section-title mb-6">Notification Preferences</p>
                <SettingRow label="Violation Alerts" description="Get notified on every new violation">
                  <ToggleSwitch checked={notifs.violations} onChange={(v) => setNotifs((p) => ({ ...p, violations: v }))} />
                </SettingRow>
                <SettingRow label="Network Issues" description="Alert when a student goes offline">
                  <ToggleSwitch checked={notifs.network} onChange={(v) => setNotifs((p) => ({ ...p, network: v }))} />
                </SettingRow>
                <SettingRow label="Session Events" description="Start, pause, and end session alerts">
                  <ToggleSwitch checked={notifs.session} onChange={(v) => setNotifs((p) => ({ ...p, session: v }))} />
                </SettingRow>
                <SettingRow label="Email Notifications" description="Receive daily summary emails">
                  <ToggleSwitch checked={notifs.email} onChange={(v) => setNotifs((p) => ({ ...p, email: v }))} />
                </SettingRow>
              </div>
            )}

            {tab === "security" && (
              <div className="card p-6 space-y-6">
                <div>
                  <p className="section-title mb-4">Change Password</p>
                  <div className="space-y-3 max-w-sm">
                    {["Current Password", "New Password", "Confirm Password"].map((l) => (
                      <div key={l} className="space-y-1.5">
                        <label className="text-[12.5px] font-medium text-text-secondary">{l}</label>
                        <div className="relative flex items-center">
                          <input
                            type={showPwd ? "text" : "password"}
                            className="input-premium w-full pr-9"
                            placeholder="••••••••"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPwd((v) => !v)}
                            className="absolute right-3 text-text-muted hover:text-text-secondary"
                          >
                            {showPwd ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    ))}
                    <Button variant="primary" size="sm">Update Password</Button>
                  </div>
                </div>
                <div className="border-t border-white/5 pt-6">
                  <p className="section-title mb-4">Session Security</p>
                  <SettingRow label="Two-Factor Authentication" description="Require OTP on every login">
                    <ToggleSwitch checked={false} onChange={() => {}} />
                  </SettingRow>
                  <SettingRow label="IP Restriction" description="Allow login only from allowed IPs">
                    <ToggleSwitch checked={false} onChange={() => {}} />
                  </SettingRow>
                  <div className="pt-4">
                    <label className="text-[12.5px] font-medium text-text-secondary">Session Timeout (minutes)</label>
                    <input type="number" defaultValue={60} className="input-premium w-32 mt-1.5" />
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AppShell>
  );
}
