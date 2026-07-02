# Admin Live Monitoring - Complete System Management

## Overview
The Admin Portal now has **complete monitoring capabilities** with full system-wide control over all departments, classes, exams, and students. The Admin is the **Super Administrator** of LMSGuard AI with access to ALL features available to Invigilators PLUS complete system management.

---

## Key Differences: Admin vs Invigilator

### Invigilator
- ❌ Can monitor **ONLY** the selected class and exam
- ❌ Limited to their assigned students
- ❌ Cannot see other invigilators' sessions

### Admin (Super Administrator)
- ✅ Can monitor **ALL** departments, classes, and exams simultaneously
- ✅ View every active examination across the entire system
- ✅ Full control over all monitoring sessions
- ✅ Complete student management capabilities
- ✅ System-wide analytics and reporting

---

## Admin Live Monitoring Features

### 1. Dashboard Statistics
Real-time overview of the entire system:
- **Total Students** - All students across all departments
- **Active Exams** - Number of currently running examinations
- **Departments** - Active departments with ongoing exams
- **Classes** - Total classes being monitored
- **Students Online** - Students currently connected
- **Violations** - Total violation count
- **Critical Alerts** - High-risk students (70%+ risk score)
- **Network Issues** - Students with connectivity problems

### 2. Comprehensive Filters
Admin can filter the live monitoring view by:

#### Department Filter
- View students from specific departments
- Options: All Departments, CS, EC, IT, ME

#### Class Filter
- Filter by specific class
- View multiple classes simultaneously
- Options: All Classes, CSE-3A, CSE-3B, ECE-3A, IT-2A, ME-2A

#### Exam Filter
- Filter students by exam
- View all exams or specific exams
- Options: All Exams, CS501, CS401, EC401, IT301

#### Risk Level Filter
- **All Risk Levels** - Show all students
- **Safe (0-34)** - Low-risk students
- **Warning (35-69)** - Medium-risk students
- **Critical (70+)** - High-risk students requiring immediate attention

#### Student Status Filter
- **All Status** - Show all students
- **Safe** - Students with no violations
- **Warning** - Students with minor violations
- **Violation** - Students with critical violations
- **Offline** - Disconnected students

#### Network Status Filter
- **All** - All network states
- **Stable** - Good connection
- **Weak** - Poor connection
- **Disconnected** - Offline students

---

## Live Student Grid

### Student Card Features
Each student card displays:

#### Live Screen Preview
- Real-time screen monitoring
- LIVE indicator badge
- Network status indicator
- Student avatar overlay
- Current window/application display

#### Student Information
- **Name** - Full student name
- **Register Number** - Student ID
- **Department** - Student's department code
- **Class** - Current class enrollment
- **Exam** - Currently taking exam
- **Assigned Invigilator** - Supervising invigilator
- **Status Badge** - Safe, Warning, or Violation

#### Risk Score Visualization
- Real-time risk percentage (0-100%)
- Color-coded progress bar:
  - Green (0-34%) - Safe
  - Yellow (35-69%) - Warning
  - Red (70%+) - Critical
- Animated risk score updates

#### Violation Count
- Number of violations detected
- Quick visual indicator for problematic students

#### Quick Actions
- **View Details** - Open detailed student modal
- **Send Warning** - Quick warning message button

---

## Student Detail Modal (Admin Version)

When Admin clicks "View Details" on any student:

### Left Column - Live Monitoring

#### Live Screen Feed
- Full-screen real-time view
- LIVE recording indicator
- Student avatar
- Current window/application name
- Network connection status

#### Student Information Grid
- Department
- Class
- Exam name
- Assigned Invigilator

#### Risk Score Display
- Large risk percentage
- Animated progress bar
- Risk level indicators (Safe, Warning, Critical)

#### Live Activity Monitoring
- **Keyboard Activity** - Active/Idle status
- **Mouse Activity** - Movement detection
- **Network Connection** - Connection quality
- **Screen Recording** - Recording status
- Real-time pulse indicators

#### Violation History
- Complete list of all violations
- Timestamp for each violation
- Violation type and details
- Severity badges (Critical, Warning, Medium)
- Scrollable list for multiple violations

### Right Column - Admin Controls

#### Admin Control Panel
- Shield badge indicating Admin privileges
- System management notification

#### Exam Timer
- Time remaining in exam
- Visual progress bar
- Countdown display

#### AI Monitoring Status
- AI system active/inactive status
- Real-time monitoring indicator

#### Quick Action Buttons

**Exam Control:**
- 🟡 **Pause Exam** - Temporarily pause student's exam
- 🔴 **Terminate Exam** - Force-end exam for student
- ⏰ **Grant Extra Time** - Add additional exam time

**Student Management:**
- 🔴 **Block Student** - Block from system access
- 🟡 **Send Warning** - Send warning message
- 🔴 **Force Logout** - Immediately log student out

**Data & Reporting:**
- 📥 **Download Logs** - Export complete activity logs
- 📝 **Add Remark** - Add admin notes to student record

#### Screenshot History
- Grid of recent screenshots
- Timestamp on each screenshot
- Click to view full-size
- Automated capture history

---

## Admin Actions & Capabilities

### Real-Time Alerts
Admin receives **EVERY** alert generated in the system:
- Browser Switch Detection
- Multiple Faces Detected
- Mobile Phone in View
- Unknown Application Opened
- VS Code/IDE Detected
- Network Lost/Restored
- Idle Activity Detection
- Copy/Paste Activity
- Screen Capture Attempts

### System-Wide Controls

#### Exam Management
- Pause any exam across the system
- Resume paused exams
- Terminate exams for specific students
- Grant extra time to students

#### Student Management
- Block students from system
- Force logout problematic students
- Send warning messages
- Add administrative remarks
- View complete activity history

#### Data Export
- Download individual student logs
- Export system-wide activity reports
- Generate violation reports
- Activity timeline exports

#### Monitoring Sessions
- View all active invigilator sessions
- Monitor invigilator performance
- System-wide violation tracking
- Cross-class analytics

---

## UI/UX Features

### Responsive Design
- Mobile-friendly grid layout
- Adapts to screen size:
  - Mobile: 1 column
  - Tablet: 2 columns
  - Desktop: 3-4 columns
  - Large screens: 5 columns

### Real-Time Updates
- WebSocket integration for live data
- Instant violation notifications
- Live risk score updates
- Network status changes
- Automatic refresh capabilities

### Visual Indicators
- Color-coded risk levels
- Animated progress bars
- Live pulse dots
- Status badges
- Network icons

### Toast Notifications
- Action confirmations
- Success messages
- System notifications
- Auto-dismiss after 3 seconds

### Filter Persistence
- Active filter indicators
- One-click reset all filters
- Collapsible filter panel
- Visual filter badges

---

## Technical Implementation

### Components
- **AdminLayout** - Main layout wrapper
- **AdminStudentDetailModal** - Enhanced detail modal
- **StudentCardAdmin** - Admin-specific student card
- **AnimatePresence** - Smooth animations
- **Motion** - Framer Motion effects

### Data Sources
- **ALL_STUDENTS** - Complete student database
- **ALL_CLASSES** - All class information
- **ALL_EXAMS** - All exam data
- **ALL_DEPARTMENTS** - Department data
- **ALL_INVIGILATORS** - Invigilator list
- **CLASS_STUDENTS** - Student-class mapping

### Real-Time Events
- `screen_update` - Live screen changes
- `violation_detected` - New violations
- `network_update` - Network status changes
- Auto-updates student risk scores
- Dynamic violation history

---

## Access Control

### Admin Privileges
- ✅ Full system access
- ✅ All monitoring features
- ✅ Complete student control
- ✅ System-wide analytics
- ✅ Cross-class monitoring
- ✅ Invigilator oversight

### Security Features
- Admin authentication required
- Role-based access control
- Action logging and auditing
- Secure WebSocket connections

---

## Usage Guidelines

### Best Practices
1. **Use Filters** - Narrow focus to specific departments/classes
2. **Monitor Critical Students** - Check 70%+ risk students first
3. **Review Violations** - Address critical violations immediately
4. **Network Issues** - Grant extra time for connection problems
5. **Regular Monitoring** - Check dashboard stats frequently

### Recommended Workflow
1. Check dashboard statistics
2. Apply department/class filters
3. Review high-risk students (70%+)
4. Investigate violation alerts
5. Take appropriate admin actions
6. Download logs for record-keeping

---

## Future Enhancements
- Live video streaming
- AI-powered violation detection
- Automated warning systems
- Advanced analytics dashboard
- Machine learning risk prediction
- Mobile app for admin monitoring

---

## Support
For technical support or feature requests, contact the LMSGuard AI admin team.

**Version:** 1.0.0  
**Last Updated:** 2026-07-02
