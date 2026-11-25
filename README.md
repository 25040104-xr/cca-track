# ccaTrack
Find a CCA, apply, and always know where your application stands.

C304 Cloud App Development · CA1 Frontend Prototype

---

## 1. Setup / Run Instructions

**Requirements:** Node.js (v18 or above) and npm

```bash
git clone https://github.com/25040104-xr/cca-track.git
cd cca-track
npm install
npm start
```

The app opens at `http://localhost:3000`.

- Use the **"View as Student / Exco"** switch in the top-right corner to change between the two user views. (Login will be added in CA2.)
- The student view is logged in as `stu-01`.
- The 3D illustrations and the Lato font load from the internet. Without internet, the app still works and shows normal emojis instead.
- CA1 has no backend, so new applications, status changes and notifications are kept in React state. They reset when the page is refreshed.

---

## 2. Problem Statement

After CCA Fiesta, RP students apply to CCAs through different channels, such as QR sign-up forms and SnApp. After applying, students often do not know the status of their application, when they will hear back, or whether they have been rejected. Replies also arrive through different channels (e.g. Outlook email or SnApp), so they are easy to miss.

Meanwhile, CCA excos manage applicants across scattered forms and apps, which makes it hard to follow up on time and keep applicants informed.

**ccaTrack** gives students one place to find CCAs, apply, and track every application. It gives excos one place to manage applicants and keep them updated.

---

## 3. Target Users & User Needs

| User | Goals | Pain points today |
|---|---|---|
| **Students** applying for CCAs | Find a suitable CCA, apply easily, know their application status and when to expect a reply | Status stuck at "Requested" with no timeline; replies come through different channels; no notification when rejected |
| **CCA excos** | Manage all applicants in one place, update status, inform applicants quickly | Applicants scattered across QR forms, SnApp and chats; hard to track who has been contacted |

**User stories**
- As a student, I want to browse, search and filter CCAs so that I can find one that suits me.
- As a student, I want to know what a CCA is like before applying so that I can decide if it fits me.
- As a student, I want to see the status of all my applications in one place so that I don't have to check different apps and emails.
- As a student, I want to know when to expect a reply so that I'm not left waiting with no information.
- As a student, I want to be notified when my application status changes.
- As an exco, I want to see all applicants and update their status so that applicants are kept informed.

---

## 4. Evidence

- **First-hand experience:** A team member applied to Chinese Ensemble, which replied via Outlook email. Her applications to Student Council and Handball on SnApp have remained at "Requested", with no date, next step or expected reply time shown.
  *(Insert SnApp screenshot here, with personal details hidden.)*
- **[Add poll / interview results here, or delete this line.]**

---

## 5. Features

**Student: Browse & Apply** *(Person A)*
- CCA directory with all 54 RP CCAs
- Search by name, filter by category, "Beginner-friendly only" filter
- Sort by name or by fastest reply time
- CCA tiles with 3D illustrations, category colours and "vibe" tags
- CCA details page: About, What you'll do, training time, commitment, venue and reply time
- Application form with validation (Singapore phone number, experience level, 20–300 character reason, agreement checkbox); errors clear as the student fixes each field
- Submitting the form adds the application to My Applications straight away, with an expected reply date
- Applying twice to the same CCA is blocked: the details page shows "Already applied · View status" instead (withdrawn applications can apply again)

**Student: My Applications & Notifications** *(Person B)*
- My Applications: status, next step and expected reply date for every application, with summary counts, status filter and an overdue warning
- Application detail: status timeline, submitted answers and withdraw (with confirmation)
- Notification centre: unread / all filter, mark as read, mark all as read, open the related application
- Unread notification badge on the navbar
- A new application also creates a "received" notification

**Exco** *(Person C)*
- Applicant list with status filter and "pending too long" alerts
- Applicant detail with status update and confirmation dialog
- Updating a status notifies the student
- Manage CCA information

**General**
- Responsive layout for desktop, tablet and mobile (☰ menu on small screens)
- Empty, error and "not found" states

---

## 6. Pages & Navigation Flow

```
Student view
  ├─ Explore CCAs ──→ CCA Detail ──→ Apply Form ──→ Submitted (expected reply date)
  │                       │                              │
  │                       └─ Already applied? ──┐        │
  │                                             ▼        ▼
  ├─ My Applications ──────────────→ Application Detail (status timeline)
  └─ Notifications ────────────────→ Application Detail

Exco view
  ├─ Applicants ──→ Applicant Detail ──→ Update status (student gets a notification)
  └─ Manage CCA
```

React Router is optional for CA1, so page switching is handled in `App.js` using state (`page` and `params`). A `navigate(pageName, params)` function is passed to every page as a prop, e.g. `navigate("ccaDetail", { ccaId: "cca-01" })`.

---

## 7. Component Tree

```
App                             (page, role, applications, notifications)
├── Navbar                      (role switch: student / exco, unread badge)
│
├── CCADirectoryPage            [A]
│   ├── SearchBar
│   ├── FilterBar
│   └── CCACard (×n)
│       ├── CCABanner
│       │   └── Emoji3D
│       ├── TagList
│       └── Emoji3D
├── CCADetailPage               [A]
│   ├── CCABanner
│   ├── TagList
│   └── Emoji3D
├── ApplyFormPage               [A]
│   └── FormField (×4)
│
├── MyApplicationsPage          [B]
│   ├── FilterBar
│   └── ApplicationCard (×n)
│       ├── Emoji3D
│       └── StatusBadge
├── ApplicationDetailPage       [B]
│   ├── StatusBadge
│   └── StatusTimeline
├── NotificationsPage           [B]
│   ├── FilterBar
│   └── NotificationItem (×n)
│       └── Emoji3D
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

**Reusable components:** `SearchBar`, `FilterBar`, `FormField`, `TagList`, `CCABanner`, `Emoji3D`, `StatusBadge`, `StatusTimeline`, `EmptyState`, `ConfirmDialog`

**Folder structure**
```
src/
├── components/   reusable UI components
├── pages/        one file per page
├── data/         mock data (ccas, applications, notifications, students, currentUser)
├── services/     functions pages use to get data (will call the backend in CA2)
├── utils/        validation, creating applications, statuses, dates, category colours
├── styles/       page-specific styles
├── App.js        page switching + shared state
└── App.css       shared design system (colours, buttons, status badges, layout)
```

**How data is shared**
- `applications` and `notifications` are stored as state in `App.js` and passed to pages as props, so every page always sees the same, up-to-date data (lifting state up).
- The apply form calls `addApplication()` (passed down from `App.js`), which adds the new application and a "received" notification.
- My Applications, Notifications and the exco pages update the data immutably with `setApplications()` and `setNotifications()` (using `map` and spread).

---

## 8. Mock Data & Planned Backend Entities

Mock data is stored in `src/data/` (`ccas.js`, `applications.js`, `notifications.js`, `students.js`). `stu-01` is the student we pretend is logged in (`data/currentUser.js`), and `TODAY` is fixed to 18 Nov 2026 in `utils/dates.js` so the overdue examples (`app-02`, `app-10`) always show the same way.

CCA data is read through `services/ccaService.js` (e.g. `getAllCCAs()`), and applications and notifications through `services/applicationService.js` and `services/notificationService.js`. These functions currently return the mock data. Applications and notifications start from the mock data and are then kept in `App.js` state, so changes made while using the app (applying, withdrawing, marking as read, updating status) show up on every page.

In CA2, the service functions will use `fetch()` to call our backend, pages will load the data with `useEffect`, and the mock data will become the starting (seed) data in the database.

**About the mock data:** the 54 CCA names and 6 categories are based on RP's actual CCA list. Descriptions, schedules, venues, tags, activities, reply times, students, applications and notifications are made up for the prototype.

| Entity | Fields |
|---|---|
| **Student** | id, name, email, course |
| **CCA** | id, name, category, emoji, imageUrl (optional), description, about, activities[], tags[], commitment, trainingSchedule, venue, responseDays |
| **Application** | id, studentId (FK), ccaId (FK), status, phone, experience, reason, appliedAt, updatedAt, nextStep, expectedReplyBy, history[] (status, date, note) |
| **Notification** | id, studentId (FK), applicationId (FK), message, read, createdAt |
| **TrialSession** | id, ccaId (FK), date, time, venue |

**Application status flow:**
`applied` → `trial-scheduled` → `trial-done` → `accepted` / `not-selected` (a student can also withdraw: `withdrawn`)

---

## 9. Planned API Endpoints (CA2)

| Method | Path | Purpose | Expected data |
|---|---|---|---|
| POST | `/api/auth/login` | Log in student or exco | Body: `{ email, password }` → `{ token, user, role }` |
| GET | `/api/ccas` | List CCAs (search/filter) | Query: `?category=Sports&search=ball` → `[CCA]` |
| GET | `/api/ccas/:id` | Get one CCA's details | → `CCA` (404 if not found) |
| PUT | `/api/ccas/:id` | Exco updates CCA info | Body: `{ description, trainingSchedule, responseDays }` |
| POST | `/api/applications` | Student applies to a CCA | Body: `{ ccaId, phone, experience, reason }` → new `Application`, also creates a "received" `Notification` (400 if invalid or already applied) |
| GET | `/api/applications/me` | Student's own applications | → `[Application]` |
| GET | `/api/applications/:id` | One application with status history | → `Application` |
| PATCH | `/api/applications/:id/withdraw` | Student withdraws an application | → updated `Application` (status `withdrawn`) |
| GET | `/api/ccas/:id/applications` | Exco views applicants | Query: `?status=applied` → `[Application]` |
| PATCH | `/api/applications/:id/status` | Exco updates status | Body: `{ status, nextStep, expectedReplyBy, note }` → updated `Application`, also creates a `Notification` |
| GET | `/api/ccas/:id/trials` | List trial sessions | → `[TrialSession]` |
| POST | `/api/ccas/:id/trials` | Exco creates a trial session | Body: `{ date, time, venue }` |
| GET | `/api/notifications/me` | Student's notifications | → `[Notification]` |
| PATCH | `/api/notifications/:id/read` | Mark a notification as read | → `{ read: true }` |
| PATCH | `/api/notifications/read-all` | Mark all notifications as read | → `{ updated: number }` |

**CA2 plan:** Node.js + Express backend with a database, login with student / exco roles, and automatic notifications when a student applies or an exco updates an application's status.

---

## 10. Team Contribution

| Member | GitHub | Role | Pages / components / features |
|---|---|---|---|
| Xinrui (Leader) | 25040104-xr | A: Browse & Apply | CCADirectoryPage, CCADetailPage, ApplyFormPage, CCACard, CCABanner, Emoji3D, TagList, SearchBar, FilterBar, FormField, ccaService, validation.js, createApplication.js; App.js navigation and shared state, Navbar, App.css design system |
| May | maypoe82 | B: My Applications | MyApplicationsPage, ApplicationDetailPage, NotificationsPage, ApplicationCard, StatusBadge, StatusTimeline, NotificationItem, applicationService, notificationService, statuses.js, dates.js, mock data (applications, notifications) |
| Su | [username] | C: Exco Dashboard | ApplicantListPage, ApplicantDetailPage, ManageCCAPage, ApplicantRow, ConfirmDialog, EmptyState, students.js, trialSessions.js |

### Xinrui: Individual Contribution

**Contribution summary:** I built Part A, the student's browse-and-apply side of the app, and set up the shared structure as team leader:
- **Pages:** `CCADirectoryPage`, `CCADetailPage`, `ApplyFormPage`
- **Components:** `CCACard`, `CCABanner`, `Emoji3D`, `TagList`, `SearchBar`, `FilterBar`, `FormField`
- **Logic and data:** `services/ccaService.js`, `utils/validation.js`, `utils/createApplication.js`, `utils/categoryColors.js`, `data/ccas.js` (all 54 RP CCAs), `data/currentUser.js`
- **Shared structure:** project setup, page navigation and shared state in `App.js` (`navigate`, `addApplication`), `Navbar` with the student / exco switch, and the design system in `App.css`
- **Integration:** connected the Apply form to the shared application list so new applications appear in My Applications, and blocked duplicate applications

**React concepts used:** controlled form inputs with one `handleChange` for every field; validation that returns an `errors` object; state for search, filters and sorting; deriving the filtered and sorted list from state with `filter` and `sort`; passing functions as props (`navigate`, `onSelect`, `addApplication`); state lifted to `App.js`; lists rendered with `map`; conditional rendering (no-results, not found, already applied, success page, mobile menu).

**Code explanation video:** *(link)*. Topic: how the Apply form validates input and adds a new application to My Applications through `addApplication`.

**Improvement notes**

*Main improvement: CCA cards and details page (based on user testing)*

I asked two classmates to try the CCA directory and details page, then made changes based on their feedback.

| Feedback from testers | What I changed | Why |
|---|---|---|
| "There's no picture, so I can't get a feel for what the CCA is like." | Added an illustration to every CCA card and the details page (`CCABanner` and `Emoji3D` components), with a colour for each category. Added "vibe" tags such as *Beginner-friendly*, *Competitive* and *Chill* (`TagList` component). | Students choose a CCA based on how it feels, not just its name. Pictures and tags help them scan and compare CCAs quickly. |
| "The details page doesn't explain what the CCA is about. The description is too short." | Added `about`, `activities` ("What you'll do") and `commitment` fields to the CCA data and showed them on the details page in separate sections. | Students need enough information to decide before applying. This reduces applications to CCAs that turn out not to suit them. |

*Other improvements*

| Issue found | What I changed | Why |
|---|---|---|
| Submitted applications did not appear in My Applications. | The form now calls `addApplication()` from `App.js` to add the new application to the shared list, in the same format as `applications.js`. The expected reply date is calculated from the CCA's `responseDays`. | Tracking applications is the main purpose of ccaTrack, so applying and tracking must be connected. |
| Students could apply to the same CCA more than once. | The details page shows "Already applied · View status", and the form shows a message instead of a second form. Withdrawn applications can apply again. | Prevents duplicate applications for excos and points students to their existing application. |
| **Bug found while testing:** the page crashed (`Cannot read properties of undefined (reading 'includes')`) when "Beginner-friendly only" was ticked and a CCA had no tags. | Added a fallback so missing tags are treated as an empty list: `const tags = cca.tags \|\| [];` | Data may have missing fields, both in mock data and in the real database in CA2, so the page should not crash. |
| While testing, I noticed the ↗ arrow on each CCA card looked like a button, but clicking it did nothing. I clicked it myself expecting it to open the CCA. | Removed the arrow. "View details" is now the only clear action on each card. | Elements that look clickable but aren't confuse users. |
| The mock data only had 21 CCAs and some made-up categories. | Updated the mock data to all 54 CCAs from RP's CCA page, using RP's real category names. | Makes the prototype realistic and gives the filters meaningful results. |
| On a phone, the navigation bar took up almost half the screen. | Added a ☰ menu for small screens. The CCA grid changes from 4 columns to 3, 2 and 1 depending on screen size. | Students usually browse CCAs on their phones, for example at CCA Fiesta. |
| Students could not quickly find CCAs that suit beginners or that reply quickly. | Added a "Beginner-friendly only" filter and a "Fastest reply first" sort option. | Many applicants are new students, and reply time is the main problem ccaTrack solves. |
| Team review: the first design looked generic, like a template. | Redesigned the UI based on reference designs, with a centred heading, bright category tiles and 3D illustrations. Chose orange for energy and determination and blue for focus and trust. | A distinctive design makes the app feel friendly and trustworthy to students. |
| Some code used React features we had not learned yet (`useEffect`, Promises). | Simplified the pages to read data directly from the service functions, keeping the service layer for CA2. | Every team member should be able to explain all the code. `useEffect` and `fetch()` will be added in CA2. |

**Commits / PRs:**
- [PR #9](https://github.com/25040104-xr/cca-track/pull/9): connect the Apply form to My Applications and block duplicate applications
- *(add your other PR links here, e.g. project setup, CCA directory, details page, apply form, UI redesign, ccaTrack rename)*

### May: Individual Contribution

**Contribution summary:** I built Part B, the student's tracking side of the app:
- **Pages:** `MyApplicationsPage`, `ApplicationDetailPage`, `NotificationsPage`
- **Components:** `ApplicationCard`, `StatusBadge`, `StatusTimeline`, `NotificationItem`
- **Logic and data:** `services/applicationService.js`, `services/notificationService.js`, `utils/statuses.js`, `utils/dates.js`, `data/applications.js`, `data/notifications.js`, `styles/myApplications.css`
- **Integration:** the "received" notification added in `addApplication` (`App.js`) when a student applies, and the unread badge in `Navbar`

**React concepts used:** state lifted to `App.js` (`applications`, `notifications`) and passed down as props; updating arrays immutably with `map` and spread (withdraw, mark as read); lists rendered with `map`; conditional rendering (empty states, overdue warning, withdraw confirmation, unread badge).

**Code explanation video:** *(link)*. Topic: `StatusTimeline`, which shows completed steps from `history` and works out the upcoming steps with `filter`.

**Improvement after testing:** When we tested the whole flow, the student got no notification after applying, and unread updates were only visible on the Notifications page itself. I added `createNotification` to `notificationService.js` and called it in `addApplication` (`App.js`), so every new application adds a "received" notification to state. I also added an unread-count badge to the navbar, calculated from the same state with `countUnread`. While testing I also made the Notifications page safe when an application is missing, and made notifications open with the Enter key. Xin Rui built the saving of new applications and the duplicate check, and I merged my changes with hers.

**Commits / PRs:**
- [PR #7](https://github.com/25040104-xr/cca-track/pull/7): Part B pages (My Applications, Application Detail, Notifications) and mock data
- [PR #10](https://github.com/25040104-xr/cca-track/pull/10): improvements after testing (received notification, unread badge, Notifications page fixes, README)

### Su: Individual Contribution

**Contribution summary:** I built Part C, the exco side of the app:
- **Pages:** `ApplicantListPage`, `ApplicantDetailPage`, `ManageCCAPage`
- **Components:** `ApplicantRow`, `ConfirmDialog`, `EmptyState`
- **Data and styles:** `data/students.js`, `data/trialSessions.js`, `styles/exco.css`
- **Integration:** added the three exco pages to `App.js`. When an exco updates a status, the application is updated in the shared `applications` state and a notification is added to `notifications`, so the student sees it in My Applications and Notifications straight away.

**React concepts used:** state for filters, form values, errors and the confirm dialog; controlled forms with one `handleChange` for every field; validation that returns an `errors` object; updating arrays immutably with `map`, `filter` and spread; passing functions as props (`onSelect`, `onConfirm`, `onCancel`, `navigate`); lists rendered with `map`; conditional rendering (overdue alerts, empty states, reply date field only for in-progress statuses, confirm dialog, success messages).

**Code explanation video:** *(link)*. Topic: how `ApplicantDetailPage` validates the status form, asks for confirmation with `ConfirmDialog`, then updates the application and notifies the student.

**Improvement notes**

| Issue found | What I changed | Why |
|---|---|---|
| While testing the Applicants page, overdue applicants were mixed in with everyone else, so I had to scroll to find the urgent ones. | Sorted the list so overdue applicants always appear at the top, using `sort` with `isOverdue()`. | "Pending too long" is the main thing excos need to act on, so it should be the first thing they see. |

**Commits / PRs:**
- *(add PR link here after merging)*

---

## 11. GitHub Repository & Commit Insights

**Repository:** https://github.com/25040104-xr/cca-track (lecturer added as collaborator)

*(Insert screenshot of GitHub → Insights → Contributors)*

---

## 12. Screenshots

*(Insert screenshots of: CCA directory, filtered results, no-results state, CCA details, form validation errors, submission success, "Already applied" button, My Applications, Application details, Notifications with unread badge, each exco page, and the mobile view)*

---

## 13. AI Use & Credits

We used Claude to help brainstorm and refine our problem statement, plan the page flow, data entities and API endpoints, explain React concepts and the Git workflow.

**Credits**
- 3D illustrations: [Microsoft Fluent Emoji 3D](https://github.com/microsoft/fluentui-emoji) (MIT licence), loaded via the jsDelivr CDN
- Font: [Lato](https://fonts.google.com/specimen/Lato) from Google Fonts
- CCA names and categories: Republic Polytechnic's CCA page
