"use client";

import { useEffect } from "react";
import { LandingPage } from "@/components/landing/LandingPage";
import { getHealth } from "@/lib/api";

export default function Home() {
  useEffect(() => {
    getHealth()
      .then((data) => console.log("Backend:", data))
      .catch((err) => console.error("Backend Error:", err));
  }, []);

  return <LandingPage />;
}