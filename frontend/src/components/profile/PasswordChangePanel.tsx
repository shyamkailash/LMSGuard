"use client";

import { useState } from "react";
import { KeyRound } from "lucide-react";

import { useToast } from "@/Providers/ToastProvider";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { changeCurrentUserPassword } from "@/services/authService";

export function PasswordChangePanel() {
  const { notify } = useToast();
  const { userProfile } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [nextPassword, setNextPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);

  async function submitPasswordChange() {
    if (nextPassword.length < 6) {
      notify({ tone: "error", title: "Password too short", body: "Use at least 6 characters." });
      return;
    }

    if (nextPassword !== confirmPassword) {
      notify({ tone: "error", title: "Passwords do not match" });
      return;
    }

    setSaving(true);
    try {
      await changeCurrentUserPassword(currentPassword, nextPassword);
      notify({ tone: "success", title: "Password changed", body: "Use the new password next time you login." });
      setCurrentPassword("");
      setNextPassword("");
      setConfirmPassword("");
    } catch (error) {
      notify({
        tone: "error",
        title: "Password change failed",
        body: error instanceof Error ? error.message : "Check the current password and try again.",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="aurora-card p-6">
      <div className="flex items-start gap-4">
        <div className="grid size-11 place-items-center rounded-2xl bg-cyan-400/10 text-cyan-100 ring-1 ring-cyan-300/20">
          <KeyRound className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-semibold text-zinc-50">Change password</h2>
          <p className="mt-2 text-sm text-zinc-400">
            Your login ID stays fixed: <span className="font-medium text-zinc-100">{userProfile?.managedId || userProfile?.email}</span>
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <input
          className="aurora-input"
          type="password"
          value={currentPassword}
          onChange={(event) => setCurrentPassword(event.target.value)}
          placeholder="Current/default password"
        />
        <input
          className="aurora-input"
          type="password"
          value={nextPassword}
          onChange={(event) => setNextPassword(event.target.value)}
          placeholder="New password"
        />
        <input
          className="aurora-input"
          type="password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          placeholder="Confirm new password"
        />
      </div>

      <div className="mt-5 flex justify-end">
        <Button disabled={saving} onClick={submitPasswordChange} className="bg-blue-500 hover:bg-blue-400">
          {saving ? "Updating..." : "Update password"}
        </Button>
      </div>
    </section>
  );
}
