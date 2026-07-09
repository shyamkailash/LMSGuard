"use client";

import { useEffect, useMemo, useState } from "react";
import { ShieldCheck } from "lucide-react";

import { useToast } from "@/Providers/ToastProvider";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { platformApi, type SecurityPermissions } from "@/lib/api/platform";
import { updateSecuritySettings, type SecuritySettings } from "@/lib/proctoringSchema";

const permissionLabels: Record<string, string> = {
  camera: "Camera",
  microphone: "Microphone",
  screen_sharing: "Screen Sharing",
  full_screen: "Full Screen",
  multiple_monitor_detection: "Multiple Monitor Detection",
  screen_recording: "Screen Recording",
  screen_capture: "Screen Capture",
  clipboard_copy: "Clipboard Copy",
  clipboard_paste: "Clipboard Paste",
  keyboard_shortcuts: "Keyboard Shortcuts",
  tab_switching: "Tab Switching",
  browser_refresh: "Browser Refresh",
  developer_tools: "Developer Tools",
  print_screen_key: "Print Screen Key",
  right_click: "Right Click",
  task_manager_detection: "Task Manager Detection",
  unauthorized_applications: "Unauthorized Applications",
  virtual_machine_detection: "Virtual Machine Detection",
  vpn_detection: "VPN Detection",
  remote_desktop_detection: "Remote Desktop Detection",
  obs_detection: "OBS Detection",
  anydesk_detection: "AnyDesk Detection",
  teamviewer_detection: "TeamViewer Detection",
  zoom_detection: "Zoom Detection",
  discord_detection: "Discord Detection",
  external_display_detection: "External Display Detection",
  eye_tracking: "Eye Tracking",
  head_pose_detection: "Head Pose Detection",
  face_recognition: "Face Recognition",
  face_verification: "Face Verification",
  multiple_face_detection: "Multiple Face Detection",
  phone_detection: "Phone Detection",
  object_detection: "Object Detection",
  noise_detection: "Noise Detection",
  speech_detection: "Speech Detection",
  internet_disconnect_detection: "Internet Disconnect Detection",
};

const defaultPermissions = Object.fromEntries(Object.keys(permissionLabels).map((key) => [key, true])) as SecurityPermissions;

const realtimePermissionMap: Record<string, keyof SecuritySettings> = {
  camera: "enableCamera",
  microphone: "enableMicrophone",
  full_screen: "requireFullscreen",
  tab_switching: "preventTabSwitching",
  right_click: "disableRightClick",
  clipboard_copy: "disableCopy",
  clipboard_paste: "disablePaste",
  keyboard_shortcuts: "disableKeyboardShortcuts",
  print_screen_key: "disablePrint",
  developer_tools: "detectDeveloperTools",
  browser_refresh: "disableRefresh",
  multiple_monitor_detection: "detectMultipleMonitors",
  screen_recording: "detectScreenRecording",
  screen_capture: "autoScreenshotCapture",
  eye_tracking: "eyeTracking",
  head_pose_detection: "headPoseTracking",
  multiple_face_detection: "multipleFaceDetection",
  phone_detection: "phoneDetection",
  object_detection: "objectDetection",
  noise_detection: "backgroundNoiseDetection",
  internet_disconnect_detection: "internetConnectionMonitoring",
};

function toRealtimeSettings(permissions: SecurityPermissions) {
  return Object.fromEntries(
    Object.entries(realtimePermissionMap).map(([permissionKey, securityKey]) => [
      securityKey,
      Boolean(permissions[permissionKey]),
    ]),
  ) as Partial<SecuritySettings>;
}

async function syncRealtimeSecuritySettings(
  examId: number | undefined,
  permissions: SecurityPermissions,
  updatedBy?: string,
) {
  try {
    await updateSecuritySettings(examId ?? null, toRealtimeSettings(permissions), updatedBy);
    return "";
  } catch (error) {
    return error instanceof Error ? error.message : "Firestore real-time sync unavailable.";
  }
}

type ExaminationSecurityPanelProps = {
  examId?: number;
};

export function ExaminationSecurityPanel({ examId }: ExaminationSecurityPanelProps) {
  const { notify } = useToast();
  const { firebaseUser } = useAuth();
  const [permissions, setPermissions] = useState<SecurityPermissions>(defaultPermissions);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState("");

  const enabledCount = useMemo(
    () => Object.values(permissions).filter(Boolean).length,
    [permissions],
  );

  useEffect(() => {
    let active = true;

    async function loadPolicy() {
      setLoading(true);
      try {
        const policy = await platformApi.securityPolicy(examId);
        if (active) {
          setPermissions({ ...defaultPermissions, ...policy.permissions });
        }
      } catch (error) {
        notify({
          tone: "warning",
          title: "Security policy unavailable",
          body: error instanceof Error ? error.message : "Using local defaults until the API is reachable.",
        });
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadPolicy();
    return () => {
      active = false;
    };
  }, [examId, notify]);

  async function togglePermission(key: string) {
    const next = { ...permissions, [key]: !permissions[key] };
    setPermissions(next);
    setSavingKey(key);

    try {
      await platformApi.updateSecurityPolicy({
        exam_id: examId ?? null,
        name: examId ? `Exam ${examId} security` : "Default examination security",
        permissions: next,
      });
      const realtimeError = await syncRealtimeSecuritySettings(examId, next, firebaseUser?.uid);
      notify({
        tone: realtimeError ? "warning" : "success",
        title: `${permissionLabels[key]} updated`,
        body: realtimeError || undefined,
      });
    } catch (error) {
      setPermissions(permissions);
      notify({
        tone: "error",
        title: "Could not save permission",
        body: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setSavingKey("");
    }
  }

  return (
    <section className="aurora-card p-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="size-5 text-cyan-200" />
            <h2 className="text-xl font-semibold text-zinc-50">Examination Security Panel</h2>
          </div>
          <p className="mt-2 text-sm text-zinc-500">
            {enabledCount} controls enabled. Changes are saved immediately.
          </p>
        </div>
        <Button
          variant="outline"
          disabled={loading}
          onClick={async () => {
            const allEnabled = enabledCount !== Object.keys(permissionLabels).length;
            const next = Object.fromEntries(Object.keys(permissionLabels).map((key) => [key, allEnabled])) as SecurityPermissions;
            setPermissions(next);
            try {
              await platformApi.updateSecurityPolicy({
                exam_id: examId ?? null,
                name: examId ? `Exam ${examId} security` : "Default examination security",
                permissions: next,
              });
              const realtimeError = await syncRealtimeSecuritySettings(examId, next, firebaseUser?.uid);
              notify({
                tone: realtimeError ? "warning" : "success",
                title: allEnabled ? "All controls enabled" : "All controls disabled",
                body: realtimeError || undefined,
              });
            } catch (error) {
              notify({ tone: "error", title: "Bulk update failed", body: error instanceof Error ? error.message : "Please try again." });
            }
          }}
        >
          {enabledCount === Object.keys(permissionLabels).length ? "Disable all" : "Enable all"}
        </Button>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {Object.entries(permissionLabels).map(([key, label]) => (
          <button
            key={key}
            type="button"
            disabled={loading || savingKey === key}
            onClick={() => togglePermission(key)}
            className="flex items-center justify-between gap-3 rounded-2xl border border-white/8 bg-white/[0.035] p-3 text-left transition hover:border-cyan-300/25 disabled:cursor-wait disabled:opacity-70"
          >
            <span>
              <span className="block text-sm font-medium text-zinc-100">{label}</span>
              <span className="mt-1 block text-xs text-zinc-500">{permissions[key] ? "Required / enforced" : "Blocked / not required"}</span>
            </span>
            <span className={`relative h-6 w-11 rounded-full transition ${permissions[key] ? "bg-cyan-400" : "bg-slate-700"}`}>
              <span className={`absolute top-1 size-4 rounded-full bg-white transition ${permissions[key] ? "left-6" : "left-1"}`} />
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
