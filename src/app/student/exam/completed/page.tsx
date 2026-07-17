"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Redirect to the canonical completed page
export default function LegacyCompletedPage() {
  const router = useRouter();
  useEffect(() => { router.replace("/student/completed"); }, [router]);
  return null;
}
