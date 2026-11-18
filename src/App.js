import { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import CCADirectoryPage from "./pages/CCADirectoryPage";
import CCADetailPage from "./pages/CCADetailPage";
import ApplyFormPage from "./pages/ApplyFormPage";
import MyApplicationsPage from "./pages/MyApplicationsPage";
import ApplicationDetailPage from "./pages/ApplicationDetailPage";
import NotificationsPage from "./pages/NotificationsPage";
import { applicationData } from "./data/applications";
import { notificationData } from "./data/notifications";
import {
  CURRENT_STUDENT_ID,
  createApplication,
  getActiveApplication,
} from "./services/applicationService";
import {
  createNotification,
  getMyNotifications,
  countUnread,
} from "./services/notificationService";
import { formatDate } from "./utils/dates";

function App() {
  const [role, setRole] = useState("student");
  const [page, setPage] = useState("directory");
  const [params, setParams] = useState({});
  const [applications, setApplications] = useState(applicationData);
  const [notifications, setNotifications] = useState(notificationData);

  function navigate(newPage, newParams = {}) {
    setPage(newPage);
    setParams(newParams);
  }

  // Number shown on the Notifications link in the navbar
  const unreadCount = countUnread(getMyNotifications(notifications, CURRENT_STUDENT_ID));

  // Called by ApplyFormPage when the form is valid.
  // Adds the new application (so it shows in My Applications) and a
  // "received" notification. New items go first because the lists show newest first.
  function handleApply(cca, formValues) {
    const newApplication = createApplication(applications, cca, formValues, CURRENT_STUDENT_ID);
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
    return newApplication;
  }

  function handleRoleChange(newRole) {
    setRole(newRole);
    navigate(newRole === "student" ? "directory" : "applicants");
  }

  function renderPage() {
    switch (page) {
      // ----- Student pages -----
      case "directory":
        return <CCADirectoryPage navigate={navigate} />;
      case "ccaDetail":
        return <CCADetailPage ccaId={params.ccaId} navigate={navigate} />;
      case "apply":
        return (
          <ApplyFormPage
            ccaId={params.ccaId}
            navigate={navigate}
            onApply={handleApply}
            existingApplication={getActiveApplication(
              applications,
              CURRENT_STUDENT_ID,
              params.ccaId
            )}
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