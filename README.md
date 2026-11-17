# CCATrack
Track your CCA applications, never be left wondering.

## 1. Setup / Run Instructions 
**Requirements:** Node.js (v18 or above) and npm
 
```bash
git clone https://github.com/[your-username]/[repo-name].git
cd [repo-name]
npm install
npm start
```
 
The app opens at `http://localhost:3000`.
 
Use the **"View as Student / View as Exco"** dropdown in the top-right corner to switch between the two user views. (Login will be added in CA2.)
 
---

## 2. Problem Statement
After CCA Fiesta, RP students apply to CCAs through different channels, such as QR sign-up forms and SnApp. After applying, students often do not know the status of their application, when they will hear back, or whether they have been rejected. Replies also arrive through different channels (e.g. Outlook email or SnApp), so they are easy to miss.
 
Meanwhile, CCA excos manage applicants across scattered forms and apps, which makes it hard to follow up on time and keep applicants informed.
 
**CCATrack** gives students one place to track all their CCA applications, and gives excos one place to manage applicants and keep them updated.
 
---

## 3. Target Users & User Needs
| User | Goals | Pain points today |
|---|---|---|
| **Students** applying for CCAs | Find a suitable CCA, apply easily, know their application status and when to expect a reply | Status stuck at "Requested" with no timeline; replies come through different channels; no notification when rejected |
| **CCA excos** | Manage all applicants in one place, update status, inform applicants quickly | Applicants scattered across QR forms, SnApp and chats; hard to track who has been contacted |
 
**User stories**
- As a student, I want to browse and filter CCAs so that I can find one that suits me.
- As a student, I want to know what a CCA is like before applying so that I can decide if it fits me.
- As a student, I want to see the status of all my applications in one place so that I don't have to check different apps and emails.
- As a student, I want to know when to expect a reply so that I'm not left waiting with no information.
- As an exco, I want to see all applicants and update their status so that applicants are kept informed.

---

## 4. Features
**Student**
- CCA directory with search and category filter
- CCA detail page with description, activities, tags, commitment and expected reply time
- Application form with validation and a success page showing the expected reply date
- My Applications: status, next step and expected reply date for every application *(Person B)*
- Notification centre for status updates *(Person B)*

**Exco**
- Applicant list with status filter and "pending too long" alerts *(Person C)*
- Applicant detail with status update *(Person C)*
- Manage CCA information *(Person C)*

 
## 6. Pages & Navigation Flow
 
```
Student view
  ├─ Explore CCAs ──→ CCA Detail ──→ Apply Form ──→ Submitted (expected reply date)
  ├─ My Applications ──→ Application Detail (status timeline)
  └─ Notifications
 
Exco view
  ├─ Applicants ──→ Applicant Detail ──→ Update status
  └─ Manage CCA
```
 
React Router is optional for CA1, so page switching is handled in `App.js` using state (`page` and `params`). A `navigate(pageName, params)` function is passed to every page as a prop.
 
---
 
## 7. Component Tree
 
```
App
├── Navbar                      (role switch: student / exco)
│
├── CCADirectoryPage            [A]
│   ├── SearchBar
│   ├── FilterBar
│   └── CCACard (×n)
│       ├── CCABanner
│       └── TagList
├── CCADetailPage               [A]
│   ├── CCABanner
│   └── TagList
├── ApplyFormPage               [A]
│   └── FormField (×n)
│
├── MyApplicationsPage          [B]
│   ├── FilterBar
│   ├── ApplicationCard (×n)
│   │   └── StatusBadge
│   └── EmptyState
├── ApplicationDetailPage       [B]
│   └── StatusTimeline
├── NotificationsPage           [B]
│   ├── NotificationItem (×n)
│   └── EmptyState
│
├── ApplicantListPage           [C]
│   ├── FilterBar
│   ├── ApplicantRow (×n)
│   │   └── StatusBadge
│   └── EmptyState
├── ApplicantDetailPage         [C]
│   ├── StatusTimeline
│   └── ConfirmDialog
└── ManageCCAPage               [C]
    └── FormField (×n)
```

**Reusable components:** `SearchBar`, `FilterBar`, `FormField`, `TagList`, `CCABanner`, `StatusBadge`, `StatusTimeline`, `EmptyState`, `ConfirmDialog`
 
**Folder structure**
```
src/
├── components/   reusable UI components
├── pages/        one file per page
├── data/         mock data
├── services/     data access layer (swap to fetch() in CA2)
└── utils/        validation, date formatting, category colours
```
 
---

## 8. Mock Data & Planned Backend Entities
 
Mock data is stored in `src/data/`. Pages never import mock data directly. They call functions in `src/services/` (e.g. `getAllCCAs()`), which currently return `Promise.resolve(mockData)`. In CA2, only the service files need to change to `fetch()` calls. The pages stay the same.
 
**About the mock data:** CCA names and categories are based on RP's actual CCA list. Descriptions, schedules, venues, tags, activities and reply times are made up for the prototype.
 
| Entity | Fields |
|---|---|
| **Student** | id, name, email, course, role |
| **CCA** | id, name, category, emoji, imageUrl, description, about, activities[], tags[], commitment, trainingSchedule, venue, responseDays |
| **Application** | id, studentId (FK), ccaId (FK), status, reason, phone, experience, appliedAt, updatedAt, nextStep, expectedReplyBy, history[] |
| **TrialSession** | id, ccaId (FK), date, time, venue |
| **Notification** | id, studentId (FK), applicationId (FK), message, read, createdAt |
 
**Application status flow:** Applied → Trial Scheduled → Trial Done → Accepted / Not Selected (or Withdrawn)
 
---

## 9. Planned API Endpoints (CA2)
 
| Method | Path | Purpose | Expected data |
|---|---|---|---|
| POST | `/api/auth/login` | Log in student or exco | Body: `{ email, password }` → `{ token, user, role }` |
| GET | `/api/ccas` | List CCAs (search/filter) | Query: `?category=Sports&search=ball` → `[CCA]` |
| GET | `/api/ccas/:id` | Get one CCA's details | → `CCA` (404 if not found) |
| PUT | `/api/ccas/:id` | Exco updates CCA info | Body: `{ description, trainingSchedule, responseDays }` |
| POST | `/api/applications` | Student applies to a CCA | Body: `{ ccaId, phone, experience, reason }` → new `Application` (400 if invalid or already applied) |
| GET | `/api/applications/me` | Student's own applications | → `[Application]` |
| GET | `/api/applications/:id` | One application with status history | → `Application` |
| DELETE | `/api/applications/:id` | Student withdraws an application | → `{ message }` |
| GET | `/api/ccas/:id/applications` | Exco views applicants | Query: `?status=Applied` → `[Application]` |
| PATCH | `/api/applications/:id/status` | Exco updates status | Body: `{ status, nextStep, expectedReplyBy }` → also creates a Notification |
| GET | `/api/ccas/:id/trials` | List trial sessions | → `[TrialSession]` |
| POST | `/api/ccas/:id/trials` | Exco creates a trial session | Body: `{ date, time, venue }` |
| GET | `/api/notifications/me` | Student's notifications | → `[Notification]` |
| PATCH | `/api/notifications/:id/read` | Mark a notification as read | → `{ read: true }` |
 
**CA2 plan:** Node.js + Express backend with a database, login with student/exco roles, and automatic notifications when an exco updates an application's status.
 
---

## 10. Team Contribution
 
| Member | Role | Pages / components / features |
|---|---|---|
| [Xinrui]  | A: Browse & Apply | CCADirectoryPage, CCADetailPage, ApplyFormPage, CCACard, SearchBar, FilterBar, FormField, CCABanner, TagList, ccaService, validation.js; App.js navigation, Navbar |
| [May] | B: My Applications | MyApplicationsPage, ApplicationDetailPage, NotificationsPage, StatusBadge, StatusTimeline, ApplicationCard, NotificationItem |
| [Su] | C: Exco Dashboard | ApplicantListPage, ApplicantDetailPage, ManageCCAPage, ApplicantRow, ConfirmDialog, EmptyState |
 
### [Xinrui]: Individual Contribution
  

### [May]: Individual Contribution
 

### [Su]: Individual Contribution
 
 
---
 
## 11. GitHub Repository & Commit Insights
 
**Repository:** [https://github.com/25040104-xr/cca-track]  
 
*(Insert screenshot of GitHub → Insights → Contributors)*
 
---
 
## 12. Screenshots
 
 
---
