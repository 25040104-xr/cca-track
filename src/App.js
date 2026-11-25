import { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import CCADirectoryPage from "./pages/CCADirectoryPage";
import CCADetailPage from "./pages/CCADetailPage";
import ApplyFormPage from "./pages/ApplyFormPage";
import MyApplicationsPage from "./pages/MyApplicationsPage";
import ApplicationDetailPage from "./pages/ApplicationDetailPage";
import NotificationsPage from "./pages/NotificationsPage";
import ApplicantListPage from "./pages/ApplicantListPage";
import { applicationData } from "./data/applications";
import { notificationData } from "./data/notifications";
import { CURRENT_STUDENT_ID } from "./data/currentUser";
import {
  createNotification,
  getMyNotifications,
  countUnread,
} from "./services/notificationService";
import { formatDate } from "./utils/dates";
import { getCCAById } from "./services/ccaService";

function App() {
  const [role, setRole] = useState("student");
  const [page, setPage] = useState("directory");
  const [params, setParams] = useState({});

  // Shared data: kept here so every page sees the same, up-to-date list
  const [applications, setApplications] = useState(applicationData);
  const [notifications, setNotifications] = useState(notificationData);

  function navigate(newPage, newParams = {}) {
    setPage(newPage);
    setParams(newParams);
  }

  // Number shown on the Notifications link in the navbar
  const unreadCount = countUnread(getMyNotifications(notifications, CURRENT_STUDENT_ID));

  function handleRoleChange(newRole) {
    setRole(newRole);
    navigate(newRole === "student" ? "directory" : "applicants");
  }

  // Called by the apply form: puts the new application at the top of the list,
  // and adds a "received" notification so it shows in Notifications and the navbar badge
  function addApplication(newApplication) {
    const cca = getCCAById(newApplication.ccaId);
    const newNotification = createNotification(
      notifications,
      CURRENT_STUDENT_ID,
      newApplication.id,
      "Your application to " +
        cca.name +
        " has been received. Expect a reply by " +
        formatDate(newApplication.expectedReplyBy) +
        "."
    );
    setApplications([newApplication, ...applications]);
    setNotifications([newNotification, ...notifications]);
  }

  function renderPage() {
    switch (page) {
      // ----- Student pages -----
      case "directory":
        return <CCADirectoryPage navigate={navigate} />;
      case "ccaDetail":
        return (
          <CCADetailPage
            ccaId={params.ccaId}
            applications={applications}
            navigate={navigate}
          />
        );
      case "apply":
        return (
          <ApplyFormPage
            ccaId={params.ccaId}
            applications={applications}
            addApplication={addApplication}
            navigate={navigate}
          />
        );
      case "myApplications":
        return (
          <MyApplicationsPage applications={applications} navigate={navigate} />
        );
      case "applicationDetail":
        return (
          <ApplicationDetailPage
            applicationId={params.applicationId}
            applications={applications}
            setApplications={setApplications}
            navigate={navigate}
          />
        );
      case "notifications":
        return (
          <NotificationsPage
            notifications={notifications}
            setNotifications={setNotifications}
            applications={applications}
            navigate={navigate}
          />
        );
             // ----- Exco pages -----
      case "applicants":
        return <ApplicantListPage applications={applications} navigate={navigate} />;

      // ----- Pages not built yet -----
      default:
        return (
          <div className="page">
            <div className="coming-soon">
              <p className="no-results-icon">🚧</p>
              <h3>This page is coming soon</h3>
              <p>Our team is still building this part. Check back later!</p>
            </div>
          </div>
        );
    }
  }

  return (
    <div className="App">
      <Navbar
        role={role}
        onRoleChange={handleRoleChange}
        currentPage={page}
        navigate={navigate}
        unreadCount={unreadCount}
      />
      <main>{renderPage()}</main>
    </div>
  );
}

export default App;