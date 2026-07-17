# 🗺️ LMSGuard V2 — Complete Routes Guide

## 🔐 Authentication Routes

### Admin Portal
```
URL: /admin/login
Email: admin@ssiet.ac.in
Password: admin123
```

### Invigilator Portal
```
URL: /login
Email: john.martin@ssiet.ac.in
Password: inv123
```

**Available Invigilator Accounts:**
- **John Martin** → CSE-3A, CSE-3B
- **Sarah Thomas** → CSE-3B
- **Ravi Sharma** → ECE-3A
- **Priya Nair** → IT-2A

### Student Portal
```
URL: /student/login
Email: rahul@ssiet.ac.in
Password: student123
```

---

## 🏛️ Admin Portal Routes (13 Pages)

| Route | Description | Key Features |
|-------|-------------|--------------|
| `/admin/login` | Admin authentication | Demo credentials, professional login UI |
| `/admin/dashboard` | Main admin dashboard | Stats cards, charts, active sessions, violations, AI alerts |
| `/admin/departments` | Department management | CRUD table, 3 charts, department stats |
| `/admin/classes` | Class management | Class list, filters, room assignments |
| `/admin/students` | Student management | DataTable, risk meters, detail modal, violation history |
| `/admin/invigilators` | Invigilator management | Permissions, assignments, status tracking |
| `/admin/exams` | Exam management | Multi-step exam creator, validation, scheduling |
| `/admin/monitoring` | Live monitoring | Student grid, risk filters, alerts panel, timeline |
| `/admin/violations` | Violation tracking | Severity filters, donut charts, detailed view |
| `/admin/reports` | Reports dashboard | Report cards, metrics, export functionality |
| `/admin/analytics` | Deep analytics | 6+ charts, trends, performance analysis |
| `/admin/settings` | Admin settings | Profile, institution, monitoring, notifications, security |

---

## 👨‍🏫 Invigilator Portal Routes (6 Pages)

| Route | Description | Key Features |
|-------|-------------|--------------|
| `/login` | Invigilator login | Quick-pick demo accounts |
| `/dashboard` | Invigilator dashboard | Session launcher (3-step), assigned exams, quick stats |
| `/monitoring` | Live exam monitoring | Student cards, session controls, alert panel, risk chart |
| `/violations` | Violation management | Filtered table, severity indicators |
| `/reports` | Report generation | Report cards with metrics |
| `/settings` | Invigilator settings | Profile, notifications, security |

---

## 🎓 Student Portal Routes (4 Pages)

| Route | Description | Key Features |
|-------|-------------|--------------|
| `/student/login` | Student authentication | Clean login form |
| `/student/dashboard` | Student dashboard | Exam cards (available, upcoming, completed) |
| `/student/exam` | Exam interface | MCQ interface, timer, question palette, flag/unflag |
| `/student/completed` | Exam results | Score ring, grade, performance metrics |

---

## 🚀 Quick Navigation

### Start Development Server
```bash
npm run dev
```

### Access Portals
- **Admin**: http://localhost:3000/admin/login
- **Invigilator**: http://localhost:3000/login
- **Student**: http://localhost:3000/student/login

---

## 📋 Page-by-Page Features

### **Admin Dashboard** (`/admin/dashboard`)
- 4 stat cards (students, invigilators, active exams, violations)
- Area chart (violations over time)
- Bar chart (department distribution)
- Donut chart (violation severity)
- Active sessions table
- Recent violations table
- AI alerts panel

### **Admin Monitoring** (`/admin/monitoring`)
- Live student grid (20 cards per class)
- Risk-based filters (All, Safe, Warning, Violation)
- Class selector
- Exam selector
- Alert panel with timeline
- Risk distribution chart
- Network status indicators

### **Admin Students** (`/admin/students`)
- DataTable with search and pagination
- Risk meter visualization
- Status badges (active/flagged)
- Detail modal with:
  - Student profile
  - Exam history
  - Violation log
  - Performance charts

### **Admin Exams** (`/admin/exams`)
- Multi-step exam creator:
  1. Basic details (title, subject, duration)
  2. Configuration (negative marking, randomization)
  3. Assignment (classes, invigilators)
- Validation on each step
- Exam list with status filters
- Quick actions (edit, delete, duplicate)

### **Invigilator Dashboard** (`/dashboard`)
- Session launcher modal:
  1. Select class
  2. Select exam
  3. Confirm and start
- Assigned exams grid
- Quick stats (students, violations)
- Recent activity

### **Invigilator Monitoring** (`/monitoring`)
- Student cards with:
  - Avatar
  - Risk meter
  - Network status
  - Violation count
  - Live indicators
- Session controls (pause/resume/end)
- Risk filters
- Alert panel
- Timeline events

### **Student Exam** (`/student/exam`)
- Question display area
- Question palette (grid view)
- Flag/unflag questions
- Timer with warnings
- Progress tracking
- Submit confirmation modal
- Navigation buttons (prev/next)

---

## 🎨 UI Components Available

### Layout Components
- `AppShell` — Main application wrapper
- `Sidebar` — Collapsible navigation
- `Topbar` — Top navigation bar
- `PageHeader` — Page title and breadcrumb

### UI Components
- `Badge` — Status badges
- `Button` — Primary, secondary, outline variants
- `Input` — Text, email, password inputs
- `Select` — Dropdown selection
- `Avatar` — User avatars with initials
- `RiskMeter` — Risk visualization
- `Skeleton` — Loading skeletons
- `Modal` — Dialog modals
- `Pagination` — Table pagination
- `DataTable` — Advanced data table
- `StatCard` — Animated stat cards

### Feature Components
- `StudentCard` — Monitoring card
- `AreaChart` — Time-series chart
- `BarChart` — Bar chart (horizontal/vertical)
- `DonutChart` — Donut chart with legend

---

## 🔄 Navigation Flow

### Admin Flow
```
/admin/login → /admin/dashboard → [Any admin route]
```

### Invigilator Flow
```
/login → /dashboard → Launch Session → /monitoring
```

### Student Flow
```
/student/login → /student/dashboard → /student/exam → /student/completed
```

---

## 🎯 Key Interactions

### Starting a Monitoring Session (Invigilator)
1. Login at `/login`
2. Navigate to `/dashboard`
3. Click "Start New Session"
4. Select class (e.g., CSE-3A)
5. Select exam (e.g., DBMS Final)
6. Confirm and start
7. Redirected to `/monitoring`

### Taking an Exam (Student)
1. Login at `/student/login`
2. View available exams at `/student/dashboard`
3. Click "Start Exam"
4. Answer questions at `/student/exam`
5. Submit when complete
6. View results at `/student/completed`

### Monitoring Students (Admin)
1. Login at `/admin/login`
2. Navigate to `/admin/monitoring`
3. Select class (CSE-3A, CSE-3B, ECE-3A, IT-2A)
4. View live student cards
5. Filter by risk level
6. Check alerts panel for violations

---

## 📱 Responsive Breakpoints

- **Desktop**: 1024px+ (Primary target)
- **Tablet**: 768px - 1023px (Supported)
- **Mobile**: < 768px (Future work)

---

## 🎨 Theme Colors

| Element | Color | Hex |
|---------|-------|-----|
| Background | Dark | `#030712` |
| Sidebar | Darker | `#0F172A` |
| Surface | Dark Gray | `#111827` |
| Primary | Blue | `#2563EB` |
| Success | Green | `#22C55E` |
| Warning | Amber | `#F59E0B` |
| Danger | Red | `#EF4444` |

---

## 🔐 Access Control

| Portal | Role | Permissions |
|--------|------|-------------|
| Admin | Super Admin | Full system access, all CRUD operations |
| Invigilator | Invigilator | Monitor assigned classes, manage violations |
| Student | Student | Take exams, view results |

---

## ⚡ Performance Tips

1. **Use risk filters** in monitoring to reduce rendered cards
2. **Pagination** is enabled on all tables (10 items per page)
3. **Skeleton loaders** provide visual feedback during data loading
4. **Memoized components** prevent unnecessary re-renders
5. **Code splitting** via Next.js App Router reduces initial bundle size

---

## 🐛 Troubleshooting

### Page not loading?
- Check if dev server is running (`npm run dev`)
- Verify URL matches routes above
- Clear browser cache

### Authentication not working?
- Use exact demo credentials
- Check browser console for errors
- Verify local storage is enabled

### Charts not rendering?
- Ensure window is wide enough (>768px)
- Check browser console for Recharts errors
- Try refreshing the page

---

## 📚 Additional Resources

- **Architecture**: See `docs/architecture.md`
- **Roadmap**: See `docs/roadmap.md`
- **Admin Features**: See `ADMIN_MONITORING_FEATURES.md`
- **Phase 1 Summary**: See `PHASE_1_COMPLETE.md`

---

**Last Updated**: 2026  
**Version**: 2.0.0  
**Status**: ✅ Production Ready
