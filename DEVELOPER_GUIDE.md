# 👨‍💻 LMSGuard V2 — Developer Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Modern browser (Chrome 90+, Firefox 88+, Safari 14+)

### Installation & Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open browser
# Navigate to http://localhost:3000
```

### Build & Deploy
```bash
# Production build
npm run build

# Start production server
npm start

# Type check
npx tsc --noEmit

# Lint check
npm run lint
```

---

## 📁 Project Structure Explained

```
src/
├── app/                          # Next.js 15 App Router
│   ├── admin/                    # Admin portal pages
│   │   ├── login/page.tsx        # Admin login
│   │   ├── dashboard/page.tsx    # Admin dashboard
│   │   ├── monitoring/page.tsx   # Live monitoring
│   │   └── [other pages]/        # Other admin pages
│   ├── student/                  # Student portal pages
│   │   ├── login/page.tsx        # Student login
│   │   ├── dashboard/page.tsx    # Student dashboard
│   │   └── exam/page.tsx         # Exam interface
│   ├── (root level)/             # Invigilator portal pages
│   │   ├── login/page.tsx        # Invigilator login
│   │   ├── dashboard/page.tsx    # Invigilator dashboard
│   │   └── monitoring/page.tsx   # Invigilator monitoring
│   ├── layout.tsx                # Root layout with providers
│   └── globals.css               # Design system + Tailwind
│
├── components/
│   ├── layouts/                  # Layout components
│   │   ├── AppShell.tsx          # Main app wrapper
│   │   ├── Sidebar.tsx           # Collapsible sidebar
│   │   ├── Topbar.tsx            # Top navigation
│   │   └── PageHeader.tsx        # Page header with breadcrumb
│   │
│   ├── ui/                       # Reusable UI components
│   │   ├── Badge.tsx             # Status badges
│   │   ├── Button.tsx            # Button variants
│   │   ├── Input.tsx             # Form inputs
│   │   ├── Select.tsx            # Dropdown select
│   │   ├── Avatar.tsx            # User avatars
│   │   ├── RiskMeter.tsx         # Risk visualization
│   │   ├── Skeleton.tsx          # Loading skeletons
│   │   ├── Modal.tsx             # Dialog modals
│   │   ├── Pagination.tsx        # Table pagination
│   │   ├── DataTable.tsx         # Advanced table
│   │   └── StatCard.tsx          # Animated stat cards
│   │
│   └── features/                 # Feature-specific components
│       ├── charts/               # Chart components
│       │   ├── AreaChart.tsx     # Time-series chart
│       │   ├── BarChart.tsx      # Bar chart
│       │   └── DonutChart.tsx    # Donut chart
│       └── StudentCard.tsx       # Monitoring card
│
├── hooks/                        # Custom React hooks
│   ├── useRisk.ts                # Risk calculation hook
│   ├── useFilter.ts              # Table filter/sort/pagination
│   ├── useCountUp.ts             # Animated counters
│   └── useClock.ts               # Real-time clock
│
├── store/                        # Zustand state management
│   ├── authStore.ts              # Authentication state
│   ├── monitoringStore.ts        # Monitoring state
│   └── uiStore.ts                # UI state (sidebar, theme)
│
├── types/                        # TypeScript definitions
│   └── index.ts                  # All type definitions (50+)
│
├── constants/                    # App constants
│   └── index.ts                  # Routes, colors, animations
│
├── mock/                         # Mock data
│   ├── departments.ts            # Department data
│   ├── classes.ts                # Class data
│   ├── students.ts               # Student data + CLASS_STUDENTS
│   ├── invigilators.ts           # Invigilator data
│   ├── exams.ts                  # Exam data
│   ├── violations.ts             # Violation data + CLASS_VIOLATIONS
│   ├── notifications.ts          # Notification data
│   └── index.ts                  # Barrel export
│
├── services/                     # Service layer
│   └── websocket.ts              # WebSocket/Mock service
│
└── lib/                          # Utility functions
    └── utils.ts                  # cn(), clsx utilities
```

---

## 🎨 Adding a New Page

### 1. Create Page File
```typescript
// src/app/admin/my-page/page.tsx
"use client";

import { PageHeader } from "@/components/layouts/PageHeader";

export default function MyPage() {
  return (
    <>
      <PageHeader
        title="My New Page"
        description="Page description here"
        breadcrumb={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "My Page", href: "/admin/my-page" }
        ]}
      />
      <div className="p-6">
        {/* Your content here */}
      </div>
    </>
  );
}
```

### 2. Add to Sidebar Navigation
```typescript
// src/constants/index.ts
export const ADMIN_ROUTES = [
  // ... existing routes
  {
    id: "my-page",
    label: "My Page",
    href: "/admin/my-page",
    icon: "FileText", // Lucide icon name
  }
];
```

### 3. Test the Route
```bash
# Navigate to http://localhost:3000/admin/my-page
```

---

## 🧩 Creating a New Component

### 1. Create Component File
```typescript
// src/components/ui/MyComponent.tsx
import { cn } from "@/lib/utils";

interface MyComponentProps {
  className?: string;
  title: string;
  // Add more props
}

export function MyComponent({ className, title }: MyComponentProps) {
  return (
    <div className={cn("p-4 rounded-lg bg-gray-800", className)}>
      <h3 className="text-lg font-semibold">{title}</h3>
    </div>
  );
}
```

### 2. Use the Component
```typescript
import { MyComponent } from "@/components/ui/MyComponent";

<MyComponent title="Hello World" />
```

---

## 🔄 Adding State with Zustand

### 1. Create Store
```typescript
// src/store/myStore.ts
import { create } from "zustand";

interface MyState {
  count: number;
  increment: () => void;
  decrement: () => void;
}

export const useMyStore = create<MyState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}));
```

### 2. Use in Component
```typescript
"use client";

import { useMyStore } from "@/store/myStore";

export function MyComponent() {
  const count = useMyStore((state) => state.count);
  const increment = useMyStore((state) => state.increment);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
    </div>
  );
}
```

---

## 📊 Adding a New Chart

### Example: Line Chart
```typescript
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface LineChartProps {
  data: Array<{ name: string; value: number }>;
}

export function MyLineChart({ data }: LineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis dataKey="name" stroke="#9CA3AF" />
        <YAxis stroke="#9CA3AF" />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1F2937",
            border: "1px solid #374151",
            borderRadius: "8px",
          }}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#2563EB"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
```

---

## 🎯 Working with Mock Data

### 1. Add Mock Data
```typescript
// src/mock/myData.ts
export const MOCK_MY_DATA = [
  { id: "1", name: "Item 1", value: 100 },
  { id: "2", name: "Item 2", value: 200 },
];
```

### 2. Export from Index
```typescript
// src/mock/index.ts
export * from "./myData";
```

### 3. Use in Component
```typescript
import { MOCK_MY_DATA } from "@/mock";

export function MyComponent() {
  return (
    <ul>
      {MOCK_MY_DATA.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}
```

---

## 🎨 Styling Guide

### Design System Colors
```typescript
// Primary colors
bg-gray-950      // #030712 - Background
bg-gray-900      // #0F172A - Sidebar
bg-gray-800      // #111827 - Surface
bg-blue-600      // #2563EB - Primary
bg-green-500     // #22C55E - Success
bg-amber-500     // #F59E0B - Warning
bg-red-500       // #EF4444 - Danger
```

### Common Patterns
```typescript
// Card
<div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">

// Button
<button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors">

// Input
<input className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500" />

// Badge
<span className="px-2 py-1 text-xs font-medium rounded-full bg-green-500/10 text-green-500">

// Glassmorphism
<div className="bg-white/5 backdrop-blur-lg border border-white/10">
```

---

## 🔧 Common Tasks

### Task 1: Add a New Admin Page
```bash
# 1. Create page file
touch src/app/admin/my-page/page.tsx

# 2. Add route to constants
# Edit src/constants/index.ts

# 3. Test
npm run dev
```

### Task 2: Add a New Type
```typescript
// src/types/index.ts
export interface MyType {
  id: string;
  name: string;
  createdAt: string;
}
```

### Task 3: Add Animation
```typescript
import { motion } from "framer-motion";
import { ANIMATION_VARIANTS } from "@/constants";

<motion.div
  variants={ANIMATION_VARIANTS.fadeUp}
  initial="initial"
  animate="animate"
>
  {/* Content */}
</motion.div>
```

---

## 🐛 Debugging Tips

### Check TypeScript Errors
```bash
npx tsc --noEmit
```

### Check ESLint Warnings
```bash
npm run lint
```

### View Build Output
```bash
npm run build
```

### Clear Cache
```bash
rm -rf .next
npm run dev
```

---

## 📦 Adding Dependencies

### UI Libraries
```bash
# Install a new library
npm install <package-name>

# Update package.json and lock file
npm install
```

### Common Dependencies
- **Icons**: `lucide-react` (already installed)
- **Forms**: `react-hook-form` (already installed)
- **Validation**: `zod`
- **Date handling**: `date-fns`
- **HTTP client**: `axios`

---

## 🔐 Authentication Flow

### Current Implementation (Mock)
```typescript
// src/store/authStore.ts
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (email, password) => {
    // Mock validation
    if (email === "admin@ssiet.ac.in" && password === "admin123") {
      set({ user: mockAdmin, isAuthenticated: true });
    }
  },
  logout: () => set({ user: null, isAuthenticated: false }),
}));
```

### Future: Real Backend
```typescript
// Phase 2 - Replace with real API calls
login: async (email, password) => {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  set({ user: data.user, isAuthenticated: true });
}
```

---

## 🎯 Best Practices

### 1. Component Structure
```typescript
// ✅ Good
export function MyComponent({ title, data }: MyComponentProps) {
  // Hooks at the top
  const [state, setState] = useState();
  
  // Event handlers
  const handleClick = () => {};
  
  // Render
  return <div>{/* JSX */}</div>;
}

// ❌ Avoid
export default function() { /* unnamed */ }
```

### 2. State Management
```typescript
// ✅ Good - Use selectors
const count = useMyStore((state) => state.count);

// ❌ Avoid - Don't destructure
const { count } = useMyStore(); // Causes unnecessary re-renders
```

### 3. Styling
```typescript
// ✅ Good - Use cn() for conditional classes
<div className={cn("base-class", isActive && "active-class")} />

// ❌ Avoid - String concatenation
<div className={`base-class ${isActive ? "active-class" : ""}`} />
```

### 4. Type Safety
```typescript
// ✅ Good - Use proper types
interface Props {
  title: string;
  count: number;
}

// ❌ Avoid - Using 'any'
function MyComponent(props: any) { }
```

---

## 📚 Resources

### Documentation
- **Next.js 15**: https://nextjs.org/docs
- **TypeScript**: https://www.typescriptlang.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Framer Motion**: https://www.framer.com/motion
- **Zustand**: https://docs.pmnd.rs/zustand
- **Recharts**: https://recharts.org

### Project Files
- **Architecture**: `docs/architecture.md`
- **Roadmap**: `docs/roadmap.md`
- **Routes Guide**: `ROUTES_GUIDE.md`
- **Phase 1 Summary**: `PHASE_1_COMPLETE.md`

---

## 🚀 Next Steps (Phase 2)

1. **Backend Integration**
   - Connect FastAPI backend
   - Replace mock data with API calls
   - Implement JWT authentication

2. **WebSocket Integration**
   - Real-time violation updates
   - Live student status
   - Network issue notifications

3. **Database Integration**
   - PostgreSQL schema
   - CRUD operations
   - Data persistence

4. **File Uploads**
   - Screenshot evidence
   - Video recordings
   - Report generation

---

## 💡 Tips & Tricks

### Hot Reload
Changes to files automatically reload the page. No need to restart the dev server.

### Environment Variables
Create `.env.local` for local environment variables:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Component Debugging
```typescript
// Add console logs in development
if (process.env.NODE_ENV === "development") {
  console.log("Debug data:", data);
}
```

### Performance Optimization
```typescript
// Use React.memo for expensive components
export const MyComponent = React.memo(function MyComponent(props) {
  // Component logic
});
```

---

## 🎉 You're Ready!

You now have everything you need to develop and extend LMSGuard V2.

**Happy coding!** 🚀

---

**Last Updated**: 2026  
**Version**: 2.0.0  
**Maintainers**: LMSGuard Team
