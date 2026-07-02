import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function App() {
  const [status, setStatus]   = useState("loading"); // "loading" | "connected" | "error"
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setMessage(data.message);
        setStatus("connected");
      })
      .catch((err) => {
        setMessage(err.message || "Failed to reach backend");
        setStatus("error");
      });
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Logo row */}
        <div style={styles.logoRow}>
          <div style={styles.logoIcon}>🛡️</div>
          <span style={styles.logoText}>LMSGuard AI</span>
        </div>

        <h1 style={styles.heading}>Backend Connection Test</h1>
        <p style={styles.sub}>
          Calling <code style={styles.code}>{API_URL}/</code>
        </p>

        {/* Status badge */}
        <div style={{ ...styles.badge, ...badgeColors[status] }}>
          <span style={styles.dot(status)} />
          {status === "loading" && "Connecting to backend…"}
          {status === "connected" && "✓ Connected"}
          {status === "error" && "✗ Connection failed"}
        </div>

        {/* Message box */}
        {status !== "loading" && (
          <div style={{ ...styles.msgBox, borderColor: badgeColors[status].borderColor }}>
            <span style={styles.msgLabel}>Response</span>
            <p style={{ ...styles.msgText, color: badgeColors[status].color }}>
              {message}
            </p>
          </div>
        )}

        <p style={styles.hint}>
          Backend running at <code style={styles.code}>{API_URL}</code>
        </p>
      </div>
    </div>
  );
}

/* ── styles ── */
const badgeColors = {
  loading:   { background: "#1e293b", color: "#94a3b8", borderColor: "#334155" },
  connected: { background: "#052e16", color: "#22c55e", borderColor: "#166534" },
  error:     { background: "#2d0a0a", color: "#ef4444", borderColor: "#7f1d1d" },
};

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#0b1120",
    fontFamily: "'Inter', system-ui, sans-serif",
    padding: "1rem",
  },
  card: {
    background: "#111827",
    border: "1px solid #1f2937",
    borderRadius: "1.25rem",
    padding: "2.5rem",
    maxWidth: 460,
    width: "100%",
    boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
  },
  logoRow: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    marginBottom: "1.5rem",
  },
  logoIcon: { fontSize: "1.5rem" },
  logoText: {
    fontSize: "1.125rem",
    fontWeight: 700,
    color: "#2563eb",
    letterSpacing: "-0.01em",
  },
  heading: {
    fontSize: "1.375rem",
    fontWeight: 700,
    color: "#f9fafb",
    margin: "0 0 0.375rem",
  },
  sub: {
    fontSize: "0.8125rem",
    color: "#6b7280",
    margin: "0 0 1.5rem",
  },
  code: {
    background: "#1f2937",
    color: "#93c5fd",
    padding: "0.1em 0.35em",
    borderRadius: "0.25rem",
    fontSize: "0.8em",
    fontFamily: "monospace",
  },
  badge: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.625rem 1rem",
    borderRadius: "0.625rem",
    border: "1px solid",
    fontSize: "0.875rem",
    fontWeight: 600,
    marginBottom: "1.25rem",
  },
  dot: (status) => ({
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: badgeColors[status]?.color,
    flexShrink: 0,
    animation: status === "connected" ? "pulse 2s infinite" : "none",
  }),
  msgBox: {
    background: "#0d1117",
    border: "1px solid",
    borderRadius: "0.75rem",
    padding: "1rem 1.25rem",
    marginBottom: "1.25rem",
  },
  msgLabel: {
    display: "block",
    fontSize: "0.6875rem",
    fontWeight: 600,
    color: "#4b5563",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    marginBottom: "0.375rem",
  },
  msgText: {
    margin: 0,
    fontSize: "1rem",
    fontWeight: 600,
    fontFamily: "monospace",
  },
  hint: {
    fontSize: "0.75rem",
    color: "#374151",
    margin: 0,
    textAlign: "center",
  },
};
