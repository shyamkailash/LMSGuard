import type { Metadata } from "next";
import Script from "next/script";
import { ThemeProvider } from "@/Providers/ThemeProvider";
import { ToastProvider } from "@/Providers/ToastProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { GlobalBackButton } from "@/components/common/GlobalBackButton";
import "./globals.css";

export const metadata: Metadata = {
  title: "LMSGuard | Aurora Intelligence",
  description: "AI examination intelligence and online proctoring platform.",
};

const themeBootScript = `
  (function () {
    try {
      var stored = window.localStorage.getItem("lmsguard:theme");
      var mode = stored === "light" || stored === "dark" || stored === "system" ? stored : "system";
      var theme = mode === "system"
        ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
        : mode;

      document.documentElement.classList.toggle("dark", theme === "dark");
      document.documentElement.dataset.theme = theme;
    } catch (_) {
      document.documentElement.classList.remove("dark");
      document.documentElement.dataset.theme = "light";
    }
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="h-full antialiased"
    >
      <head>
        <Script id="theme-boot" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <ToastProvider>
            <AuthProvider>
              {children}
              <GlobalBackButton />
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
