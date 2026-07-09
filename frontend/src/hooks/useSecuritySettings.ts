"use client";

import { useEffect, useState } from "react";

import {
  defaultSecuritySettings,
  subscribeSecuritySettings,
  updateSecuritySettings,
  type SecuritySettings,
} from "@/lib/proctoringSchema";

type UseSecuritySettingsOptions = {
  examId?: string | number | null;
  updatedBy?: string;
};

export function useSecuritySettings({
  examId = null,
  updatedBy,
}: UseSecuritySettingsOptions = {}) {
  const [settings, setSettings] = useState<SecuritySettings>(defaultSecuritySettings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      return subscribeSecuritySettings(
        examId,
        (nextSettings) => {
          setSettings(nextSettings);
          setLoading(false);
        },
        (settingsError) => {
          setError(settingsError.message);
          setLoading(false);
        },
      );
    } catch (settingsError) {
      window.queueMicrotask(() => {
        setError(settingsError instanceof Error ? settingsError.message : "Unable to load security settings.");
        setLoading(false);
      });
    }
  }, [examId]);

  async function setSecuritySetting<K extends keyof SecuritySettings>(
    key: K,
    value: SecuritySettings[K],
  ) {
    const previousSettings = settings;
    setSettings({ ...settings, [key]: value });

    try {
      await updateSecuritySettings(examId, { [key]: value } as Partial<SecuritySettings>, updatedBy);
    } catch (settingsError) {
      setSettings(previousSettings);
      setError(settingsError instanceof Error ? settingsError.message : "Unable to update security settings.");
      throw settingsError;
    }
  }

  return {
    settings,
    loading,
    error,
    setSecuritySetting,
  };
}
