# 🛡️ LMSGuard AI — Exam Monitoring Platform

A professional AI-powered exam proctoring and monitoring SaaS frontend built with **Next.js 15**, **Tailwind CSS**, **Framer Motion**, and **Recharts**.

---

## 🚀 Quick Start

### 1. Install Node.js (if not installed)

**Arch Linux (this system):**
```bash
sudo pacman -S nodejs npm
```

**Or use nvm (recommended):**
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.zshrc
nvm install --lts
```

### 2. Install dependencies
```bash
cd "/home/sathasivam/Desktop/frontend only"
npm install
```

### 3. Run development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
frontend only/
├── src/
│   ├── app/
│   │   ├── layout.jsx          # Root layout
│   │   ├── page.jsx            # Redirects to /login
│   │   ├── login/page.jsx      # Login page
│   │   ├── dashboard/page.jsx  # Main dashboard
│   │   ├── monitoring/page.jsx # Live student monitoring grid
│   │   ├── violations/page.jsx # Violations table
│   │   ├── reports/page.jsx    # Report generation
│   │   └── settings/page.jsx   # Settings
│   ├── components/
│   │   ├── Sidebar.jsx         # Collapsible sidebar nav
│   │   ├── DashboardLayout.jsx # Layout wrapper with nav + alert popup
│   │   ├── StudentCard.jsx     # Student monitoring card
│   │   ├── StudentDetailModal.jsx # Student detail modal
│   │   ├── AlertPopup.jsx      # Real-time violation popup
│   │   ├── StatsCard.jsx       # Stats display card
│   │   └── Charts.jsx          # Recharts components
│   ├── services/
│   │   └── websocket.js        # Socket.IO service + dummy data
│   └── lib/
│       └── utils.js            # cn() utility
├── tailwind.config.js
├── next.config.js
└── package.json
```

---

## 🎯 Features

| Feature | Route | Description |
|---------|-------|-------------|
| Login | `/login` | Animated login with role selector |
| Dashboard | `/dashboard` | Stats, charts, system status, recent alerts |
| Live Monitoring | `/monitoring` | 12-student grid with live risk scores |
| Student Detail | Modal | Live screen, activity, violation history |
| Real-time Alerts | Global popup | Auto-dismissed violation alerts (Framer Motion) |
| Violations Table | `/violations` | Filterable, sortable violations log |
| Reports | `/reports` | Exam report generation + download UI |
| Settings | `/settings` | Toggle modules, set thresholds |

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Background | `#0B1120` |
| Card | `#111827` |
| Primary Blue | `#2563EB` |
| Success Green | `#22C55E` |
| Warning Yellow | `#F59E0B` |
| Danger Red | `#EF4444` |

---

## ⚡ Tech Stack

- **Next.js 15** (App Router)
- **React 18** 
- **Tailwind CSS 3** — dark theme, glassmorphism
- **Framer Motion** — page transitions, card animations, alert popup
- **Socket.IO Client** — real-time events (falls back to dummy data)
- **Recharts** — area, bar, and pie charts
- **Lucide React** — icons

---

## 🔌 WebSocket / Real-time

The `services/websocket.js` attempts to connect to `http://localhost:4000`.

If no backend is running, it automatically switches to **demo mode** — generating realistic violation events every ~20 seconds so the UI stays fully interactive.

Events handled:
- `student_status` — initial student list
- `violation_detected` — triggers alert popup + updates student risk
- `screen_update` — updates individual student's screen state
- `violations_list` — populates violations table

---

## 🧪 Demo Login

Any email + password combination works — authentication is mocked.
Select role: **Invigilator** (default), Admin, or Student Agent.

After login, you'll land on `/dashboard`.
# frontend
